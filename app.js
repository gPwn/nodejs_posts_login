const express = require('express');
const app = express();
const port = 3050;

const indexsRouter = require("./routers/index.js");
// const connect = require("./schemas");
// connect();

// const { User } = require("./models");

app.use(express.json());
app.use(express.static("assets"));
app.use("/api", indexsRouter);

app.get('/', (req, res) => {
  res.send('Hyeju_nodejs_post');
});

app.listen(port, () => {
  console.log(port, '포트로 서버가 열렸어요!');
});