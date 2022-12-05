const express = require("express");
const router = express.Router();

const commentsRouter = require("./comments.js");
const postsRouter = require("./posts.js");

router.use("/posts", [postsRouter]);
router.use("/comments", [commentsRouter]);

module.exports = router;