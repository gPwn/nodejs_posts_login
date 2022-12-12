const jwt = require("jsonwebtoken");
const { Users } = require("../models");
require("dotenv").config();

module.exports = async (req, res, next) => {
  const authorization = req.cookies[process.env.COOKIE_NAME];
  // console.log(authorization);
  if (authorization === undefined) {
    return res.status(401).send({
      errorMessage: "로그인 후 이용 가능한 기능입니다1.",
    });
  }

  const accessToken = authorization.split(" ")[1];
  // console.log(accessToken);

  try {
    const { userId }  = jwt.verify(accessToken, process.env.SECRET_KEY);
    // console.log(userId);
    await Users.findOne({
      where: { userId },
      attributes: { exclude: ["password"] }})
      .then((user) => {
      res.locals.user = user;
      next();
    });
  } catch (error) {
    console.log(error);
    res.status(401).send({
      errorMessage: "로그인 후 이용 가능한 기능입니다2.",
    });
  }
};