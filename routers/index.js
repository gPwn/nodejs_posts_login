const express = require("express");
const router = express.Router();

// const commentsRouter = require("./comments.js");
// const postsRouter = require("./posts.js");
// const loginRouter = require("./login.js");
const signupRouter = require("./signup.js");

// router.use("/posts", [postsRouter]);
// router.use("/comments", [commentsRouter]);
// router.use("/login", [loginRouter]);
router.use("/signup", [signupRouter]);

router.get('/', (req, res) => {
    res.send('Hyeju_Api_nodejs_post');
  });

module.exports = router;