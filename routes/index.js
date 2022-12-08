const express = require("express");
const router = express.Router();

const UserRouter = require("./users.js");
const postsRouter = require("./posts.js");
const commentsRouter = require("./comments.js");

router.use("/", UserRouter);
router.use("/posts", postsRouter);
router.use("/comments", commentsRouter);

router.get('/', (req, res) => {
    res.send('Hyeju_Api_nodejs_post');
  });

module.exports = router;