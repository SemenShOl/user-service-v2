const userService = require("../bll/userService");
const db = require("../db");

const userRepostitory = {
  async getUserByLogin(login) {
    try {
      const resWithLogin = await db.query(
        "SELECT * FROM userr WHERE login = $1",
        [login]
      );
      console.log(`Пользователи с ${login} : `, resWithLogin.rows);
      return resWithLogin.rows;
    } catch (error) {
      console.log("Ошибка!");
      console.log(error);
    }
  },

  async createUser(login, hashPass, userID) {
    try {
      await db.query(
        "INSERT INTO userr (login, password, id) VALUES ($1, $2, $3)",
        [login, hashPass, userID]
      );
    } catch (error) {
      console.log("Ошибка!");
      console.log(error);
    }
  },

  async changeUser(userID, newPassword, group_id) {
    try {
      console.log("userID: ", userID);
      console.log("newGroupID: ", group_id);
      console.log("newPassword: ", newPassword);

      await db.query(
        "update userr set group_id=$1, password=$2 where id = $3",
        [group_id, newPassword, userID]
      );
    } catch (error) {
      console.log("Ошибка!");
      console.log(error);
    }
  },
  async deleteUser(userID) {
    try {
      console.log("userID: ", userID);

      await db.query(
        "delete from userr where id = $1",
        [userID]
      );
    } catch (error) {
      console.log("Ошибка!");
      console.log(error);
    }
  },

  async getAllUsers() {
    try {
      const allUsers = await db.query(
        "SELECT * FROM userr"
      );
      console.log(`Пользователи : `, allUsers.rows);
      return allUsers.rows;
    } catch (error) {
      console.log("Ошибка!");
      console.log(error);
    }
  },

  async getUserByID(userID) {
    try {
      const result = await db.query(
        "SELECT * FROM userr where id = $1", [userID]
      );
      console.log(`Пользователи с ${userID} : `, result.rows[0]);
      return result.rows[0];
    } catch (error) {
      console.log("Ошибка!");
      console.log(error);
    }
  }
};
module.exports = userRepostitory;
