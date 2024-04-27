const Router = require("express");
const checkAuth = require("../middlewares/checkAuth");
const { v1: uuidv1, v4: uuidv4 } = require("uuid");
const groupRepository = require("../repositories/groupRepository");
const getGroupRoutes = () => {
  const groupRouter = Router({});

  groupRouter.post("/", checkAuth, async (req, res) => {
    const { title } = req.body;
    const groupID = uuidv4();
    await groupRepository.createGroup(title, groupID);
    res.status(200).json({ message: groupID });
  });

  groupRouter.patch("/:id", checkAuth, async (req, res) => {
    const { title } = req.body;
    const groupID = req.params.id;
    await groupRepository.changeGroup(title, groupID);
    res.sendStatus(200);
  });

  groupRouter.delete("/:id", checkAuth, async (req, res) => {
    const groupID = req.params.id;
    await groupRepository.deleteGroup(groupID);
    res.sendStatus(200);
  });

  groupRouter.get("/:id", checkAuth, async (req, res) => {
    const groupID = req.params.id;
    const group = await groupRepository.getGroupByID(groupID);
    if (!group) {
      return res.sendStatus(404);
    }
    res.json(group);
  });

  return groupRouter;
};

module.exports = getGroupRoutes;
