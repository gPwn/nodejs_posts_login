const jwt = require("jsonwebtoken");
const { Users } = require("../models");
require("dotenv").config();

module.exports = async (req, res, next) => {
  const authorization = req.headers.cookie;

  if (!authorization) {
    return res.status(401).send({
      errorMessage: "로그인 후 이용 가능한 기능입니다.",
    });
  }

  const accessToken = (authorization.split("=")[1]);

  try {
    const { UserId }  = jwt.verify(accessToken, process.env.SECRET_KEY );
    // console.log(UserId);
    await Users.findOne({
      where: { UserId },
      attributes: { exclude: ["password"] }})
      .then((user) => {
      res.locals.user = user;
      next();
    });
  } catch (error) {
    // console.log(error);
    res.status(401).send({
      errorMessage: "로그인 후 이용 가능한 기능입니다.",
    });
  }
};