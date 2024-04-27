const express = require("express");
const cors = require("cors");
const getUserRoutes = require('./routes/userRouter');
const getGroupRoutes = require('./routes/groupRouter');
const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());


const userRouter = getUserRoutes();
const groupRouter = getGroupRoutes();
app.use('/groups', groupRouter);
app.use('/users', userRouter);

app.listen(port, () => {
  console.log(`Сервер запущен на порту ${port}`);
});
