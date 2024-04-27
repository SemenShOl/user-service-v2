const Router = require("express");
const userService = require("../bll/userService");
const checkAuth = require("../middlewares/checkAuth");
const userRepository = require("../repositories/userRepository");
const Response = require("../response");


function generateResponse(status, data, errors) {

}
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
          new Response(null, { code: 401, message: "Пароь или логин неверный" })
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
    const { password, group_id } = req.body;
    const userID = req.userID;
    await userService.updateGroupOrPassword(userID, group_id, password);
    res
      .status(200)
      .json(
        new Response({
          object: {
            password: password,
            group_id: group_id
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
  });
  userRouter.get("/all", checkAuth, async (req, res) => {
    // const userID = req.userID;
    const users = await userRepository.getAllUsers();
    res.json(users);
  });
  userRouter.get("/", checkAuth, async (req, res) => {
    // const { userID } = req.params.id;
    const userID = req.userID;
    const user = await userRepository.getUserByID(userID);
    res.json(user);
  });

  return userRouter;
};

module.exports = getUserRoutes;
