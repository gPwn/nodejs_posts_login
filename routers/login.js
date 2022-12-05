// const { Op } = require("sequelize");
const { User } = require("../models");
const jwt = require("jsonwebtoken");

// 로그인 구현 mysql
router.post("/auth", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({
    where: {
      email,
    },
  });

  // NOTE: 인증 메세지는 자세히 설명하지 않는것을 원칙으로 한다: https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html#authentication-responses
  if (!user || password !== user.password) {
    res.status(400).send({
      errorMessage: "이메일 또는 패스워드가 틀렸습니다.",
    });
    return;
  }

  res.send({
    token: jwt.sign({ userId: user.userId }, "customized-secret-key"),
  });
});

const authMiddleWare = require("./middlewares/authMiddlewares.js");
router.get("/users/me", authMiddleWare, async(req, res) => {
  res.status(200).json({user : res.locals.user});
});

module.exports = router;