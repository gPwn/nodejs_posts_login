const { Op } = require("sequelize");
const { Users } = require("../models");
const jwt = require("jsonwebtoken");

// 로그인 구현 mysql
router.post("/auth", async (req, res) => {
  const { nickname , password } = req.body;

  const user = await Users.findOne({
    where: {
        nickname,
    },
  });

  // NOTE: 인증 메세지는 자세히 설명하지 않는것을 원칙으로 한다: https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html#authentication-responses
  if (!user || password !== user.password) {
    res.status(412).send({
      errorMessage: "닉네임 또는 패스워드를 확인해주세요.",
    });
    return;
  }

  res.send({
    token: jwt.sign({ userId: user.userId }, "hyeju-secret-key"),
  });
});

const authMiddleWare = require("../middlewares/authMiddlewares.js");
router.get("/users/me", authMiddleWare, async(req, res) => {
  res.status(200).json({user : res.locals.user});
});

const login = (req, res, next) => {
  const { authorization } = req.headers;
  const [authType, authToken] = (authorization || "").split(" ");

  if (!authToken || authType !== "Bearer") {
    res.status(401).send({
      errorMessage: "로그인 후 이용 가능한 기능입니다.",
    });
    return;
  }

  try {
    const { userId } = jwt.verify(authToken, "customized-secret-key");
    User.findByPk(userId).then((user) => {
      res.locals.user = user;
      next();
    });
  } catch (err) {
    res.status(401).send({
      errorMessage: "로그인 후 이용 가능한 기능입니다.",
    });
  }
};

module.exports = [router, login];