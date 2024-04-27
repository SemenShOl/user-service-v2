const db = require("../db");

const groupRepository = {
  
  async createGroup(title, groupID) {
    try {
      await db.query("INSERT INTO user_group (title, id) VALUES ($1, $2)", [
        title,
        groupID,
      ]);
    } catch (error) {
      console.log("Ошибка!");
      console.log(error);
    }
  },

  async changeGroup(newTitle, groupID) {
    try {
      console.log("groupID: ", groupID);
      console.log("newTitle: ", newTitle);

      await db.query(
        "update user_group set title=$1 where id = $2",
        [newTitle, groupID]
      );
    } catch (error) {
      console.log("Ошибка!");
      console.log(error);
    }
  },
  async deleteGroup(groupID) {
    try {
      console.log("groupID: ", groupID);

      await db.query("delete from user_group where id = $1", [groupID]);
    } catch (error) {
      console.log("Ошибка!");
      console.log(error);
    }
  },

  async getGroupByID(groupID) {
    try {
      const result = await db.query("SELECT * FROM user_group where id = $1", [
        groupID,
      ]);
      console.log(`Группы с ${groupID} : `, result.rows[0]);
      return result.rows[0];
    } catch (error) {
      console.log("Ошибка!");
      console.log(error);
    }
  },
};
module.exports = groupRepository;
