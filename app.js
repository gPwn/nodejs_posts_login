const express = require('express');
const app = express();
const port = 3050;

const indexsRouter = require("./routes/index.js");
const connect = require("./schemas");
connect();

app.use(express.json());
app.use("/", indexsRouter);

app.get('/', (req, res) => {
  res.send('Hyeju_nodejs_post');
});

app.listen(port, () => {
  console.log(port, '포트로 서버가 열렸어요!');
});