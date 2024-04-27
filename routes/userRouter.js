const Router = require("express");
const userService = require("../bll/userService");
const checkAuth = require("../middlewares/checkAuth");
const userRepository = require("../repositories/userRepository");
const Response = require("../response");
const { default: axios } = require("axios");


const getUserRoutes = () => {
  const userRouter = Router({});
  userRouter.post("/registration", async (req, res) => {
    const { password, login } = req.body;
    if (!password || !login) {
      return res
        .status(userData.status)
        .json(
          new Response(null, { code: 400, message: "Некорректные данные" })
        );
    }

    const userData = await userService.registration(password, login);
    if (userData.status === 401) {
      return res
        .status(userData.status)
        .json(
          new Response(null, {
            code: 401,
            message: "Пользователь уже существует",
          })
        );
    }

    res
      .status(userData.status)
      .json(
        new Response({
          object: {
            id: userData.userID,
            token: userData.token
          }
        }, null)
      );
  });

  userRouter.post("/login", async (req, res) => {
    const { password, login } = req.body;
    const userData = await userService.login(password, login);
    if (userData.status == 401) {
      return res
        .status(userData.status)
        .json(
          new Response(null, { code: 401, message: "Пароль или логин неверный" })
        );
    }
    res
      .status(userData.status)
      .json(
        new Response({
          object: {
            id: userData.userID,
            token: userData.token
          }
        }, null)
      );
  });

  userRouter.patch("/", checkAuth, async (req, res) => {
    const { password, groupID } = req.body;
    const userID = req.userID;
    const data = await userService.updateGroupOrPassword(userID, groupID, password);
    if(data.status == 400) {
      return res
        .status(data.status)
        .json(
          new Response(null, { code: 400, message: data.message })
        );
    }
    res
      .status(200)
      .json(
        new Response({
          object: {
            password: password,
            group_id: groupID
          }
        }, null)
      );
  });

  userRouter.delete("/", checkAuth, async (req, res) => {
    const userID = req.userID;
    await userRepository.deleteUser(userID);
    res
      .status(200)
      .json(
        new Response(null, null)
      );
    await axios.delete('http://tasks.local/user-tasks/', { params: { id: userID } });
  });
  userRouter.get("/all", checkAuth, async (req, res) => {
    // const userID = req.userID;
    const users = await userRepository.getAllUsers();
    if(!users.length) {
     return res
        .status(404)
        .json(
          new Response(null, { code: 404, message: "Пользователи не найдены" })
        );
    }
    res
      .status(200)
      .json(
        new Response({
          array: users
        }, null)
      );
  });
  userRouter.get("/", checkAuth, async (req, res) => {
    // const { userID } = req.params.id;
    const userID = req.userID;
    const user = await userRepository.getUserByID(userID);
    if(!user) {
      return res
        .status(404)
        .json(
          new Response(null, { code: 404, message: "Пользователи не найдены" })
        );
    }
    res
      .status(200)
      .json(
        new Response({
          object: {
            id: user.id,
            login: user.login
          }
        }, null)
      );
    res.json(user);
  });

  return userRouter;
};

module.exports = getUserRoutes;
