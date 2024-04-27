const bcrypt = require("bcrypt");
const tokenService = require("./tokenService");
const { 
  v1: uuidv1,
  v4: uuidv4,
} = require('uuid');
const authRepostitory = require("../repositories/userRepository");
const userService = {
  async registration(password, login) {
    try {
      const usersWithLogin = await authRepostitory.getUserByLogin(login);
      if (usersWithLogin.length) {
        return { status: 401 };
      }
      const hashPass = await bcrypt.hash(password, 3);
      const userID = uuidv4();
      await authRepostitory.createUser(login, hashPass, userID);
      const newUsersWithLogin = await authRepostitory.getUserByLogin(login);

      const createdUser = newUsersWithLogin[0];
      console.log("Новосозданный user: ", createdUser);
      const token = tokenService.generateToken(createdUser.id);
      console.log("token: ", token);
      return { status: 201, token, userID };
    } catch (error) {
      console.log("Ошибка!");
      console.log(error);
    }
  },

  async login(password, login) {
    const usersWithLogin = await authRepostitory.getUserByLogin(login);

    if (!usersWithLogin.length) {
      return { status: 401 };
    }
    const userInfo = usersWithLogin[0];
    const isValidPass = await bcrypt.compare(password, userInfo.password);
    console.log("isValidPass: ", isValidPass);
    if (!isValidPass) {
      return { status: 401 };
    }
    const token = tokenService.generateToken(userInfo.id);
    const userID = userInfo.id;
    return { status: 200, token, userID };
  },

  async updateGroupOrPassword(userID, group_id, newPassword) {
    const hashPass = await bcrypt.hash(newPassword, 3);
    await authRepostitory.changeUser(userID, hashPass, group_id);
  },
};

module.exports = userService;
