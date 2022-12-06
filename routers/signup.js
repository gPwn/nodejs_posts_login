const express = require("express");
const router = express.Router();

// const jwt = require("jsonwebtoken");
// const { Op } = require("sequelize");
const { Users } = require("../models");

// router.get('/', (req, res) => {
//   res.send('Hyeju_Api_signup_nodejs_post');
// });


router.post("/", async (req, res) => {
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
    if (password === nickname) {
      res.status(412).send({"errorMessage": "패스워드에 닉네임이 포함되어 있습니다."});
      return;
    };

    // 비밀번호 확인은 비밀번호와 정확하게 일치하기
    if (password !== confirm) {
      res.status(412).send({ errorMessage : "패스워드가 일치하지 않습니다."});
      return;
    };


    await Users.create({ nickname, password });
    res.status(201).send({ message : "회원 가입에 성공하였습니다." });
  } catch (error) {
    // console.log(error);
    res.status(400).json({errorMessage : "요청한 데이터 형식이 올바르지 않습니다."});
  }
});

module.exports = router;