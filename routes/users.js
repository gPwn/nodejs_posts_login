const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { Users } = require("../models");
const { Op } = require("sequelize")
require("dotenv").config();
const authLoginUserMiddlewares = require("../middlewares/authLoginUserMiddlewares.js");

//회원가입
router.post("/signup", authLoginUserMiddlewares, async (req, res) => {
  try{
    // - 닉네임, 비밀번호, 비밀번호 확인을 request에서 전달받기
    const { nickname, password, confirm } = req.body;

    // 네임은 `최소 3자 이상, 알파벳 대소문자(a~z, A~Z), 숫자(0~9)`로 구성하기
    function checkNickname(nickname) {
      const condition = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{3,}$/;
      return condition.test(nickname);
    };
    if (checkNickname(nickname) === false) {
      res.status(412).send({errorMessage : "ID의 형식이 일치하지 않습니다."});
      return;
    };

    // 데이터베이스에 존재하는 닉네임을 입력한 채 회원가입 버튼을 누른 경우 "중복된 닉네임입니다." 라는 에러메세지를 response에 포함하기
    const existsNickName = await Users.findAll({
      where: {
        nickname
      },
    });
    if (existsNickName.length) {
      res.status(412).send({
        errorMessage: "중복된 닉네임입니다.",
      });
      return;
    };

    // 비밀번호는 `최소 4자 이상이며 
    if (password.length < 4) {
      res.status(412).send({errorMessage: "패스워드 형식이 일치하지 않습니다."});
      return;
    };

    //닉네임과 같은 값이 포함된 경우 회원가입에 실패`로 만들(다시 시도!)
    if (password.includes(nickname)) {
      res.status(412).send({errorMessage: "패스워드에 닉네임이 포함되어 있습니다."});
      return;
    };

    // 비밀번호 확인은 비밀번호와 정확하게 일치하기
    if (password !== confirm) {
      res.status(412).send({ errorMessage : "패스워드가 일치하지 않습니다."});
      return;
    };


    const result = await Users.create({ nickname, password });
    res.status(201).send({ /*data : result,*/ message : "회원 가입에 성공하였습니다." });
  } catch (error) {
    console.log(error);
    res.status(400).json({errorMessage : "요청한 데이터 형식이 올바르지 않습니다."});
  }
});

//회원가입 데이터 조회
router.get("/signup", async (req, res) => {
  const users = await Users.findAll({});

  res.json({data : [users]});
});


//로그인
router.post("/login",authLoginUserMiddlewares, async (req, res) => {
  try {
    const { nickname , password } = req.body;

    const user = await Users.findOne({ 
      where: { 
        [Op.and]: [{ nickname }, { password }],
       }
      });
      // console.log(user)

      // NOTE: 인증 메세지는 자세히 설명하지 않는것을 원칙으로 한다: https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html#authentication-responses
      if (!user || password !== user.password) {
        res.status(412).send({
          errorMessage: "닉네임 또는 패스워드를 확인해주세요.",
        });
        return;
      };

      const token = jwt.sign(
        { userId: user.userId },  
        process.env.SECRET_KEY, {
        expiresIn: "3d",
      });
  
      res.cookie(process.env.COOKIE_NAME, `Bearer ${token}`);
      return res.status(200).json({token});
  } catch (error) {
    console.log(error);
    res.status(400).send({ errorMessage : "로그인에 실패하였습니다."});
  }
  });

//로그인 정보 조회
const authMiddleWare = require("../middlewares/authMiddlewares.js");
router.get("/login/me", authMiddleWare, async(req, res) => {
  res.status(200).json({user : res.locals.user});
});


module.exports = router;

