const express = require('express');
const app = express();
const port = 3050;

app.use(express.json());

const cookieParser = require('cookie-parser');
app.use(cookieParser());

const indexsRouter = require("./routes/index.js");
app.use("/api", indexsRouter);

app.get('/', (req, res) => {
  res.send('Hyeju_Main_Api_nodejs_post');
});

app.listen(port, () => {
  console.log(port, '포트로 서버가 열렸어요!');
});