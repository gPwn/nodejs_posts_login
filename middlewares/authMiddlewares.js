const jwt = require("jsonwebtoken");
const { Users } = require("../models");
require("dotenv").config();

module.exports = async (req, res, next) => {
  const authorization = req.headers.cookie;
  // console.log(authorization);
  const [authType, authToken] = (authorization || "").split(" ");
  const accessToken = (authType.split("=")[1]).slice(0,-1);
  const refreshToken = (authToken.split("=")[1]);
  console.log(accessToken);

  if (!accessToken || !refreshToken) {
    res.status(401).send({
      errorMessage: "로그인 후 이용 가능한 기능입니다1.",
    });
    return;
  }

  try {
    const { UserId }  = jwt.verify(accessToken, process.env.SECRET_KEY );
    console.log(UserId);
    await Users.findOne({
      where: { UserId },
      attributes: { exclude: ["password"] }})
      .then((user) => {
      res.locals.user = user;
      next();
    });
  } catch (error) {
    console.log(error);
    res.status(401).send({
      errorMessage: "로그인 후 이용 가능한 기능입니다.",
    });
  }
};