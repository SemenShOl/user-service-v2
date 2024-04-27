const Router = require("express");
const checkAuth = require("../middlewares/checkAuth");
const { v1: uuidv1, v4: uuidv4 } = require("uuid");
const groupRepository = require("../repositories/groupRepository");
const Response = require("../response");

const getGroupRoutes = () => {
  const groupRouter = Router({});
  groupRouter.post("/", checkAuth, async (req, res) => {
    const { title } = req.body;
    const groupID = uuidv4();
    await groupRepository.createGroup(title, groupID);
    return res.status(200).json(
      new Response(
        {
          object: {
            id: groupID,
            title,
          },
        },
        null
      )
    );
  });

  groupRouter.patch("/:id", checkAuth, async (req, res) => {
    const { title } = req.body;
    const groupID = req.params.id;
    const group = await groupRepository.getGroupByID(groupID);
    if (!group) {
      return res
        .status(404)
        .json(new Response(null, { code: 404, message: "Группа не найдена" }));
    }
    await groupRepository.changeGroup(title, groupID);
    res.status(200).json(
      new Response(
        {
          object: {
            title,
          },
        },
        null
      )
    );
  });

  groupRouter.delete("/:id", checkAuth, async (req, res) => {
    const groupID = req.params.id;
    const group = await groupRepository.getGroupByID(groupID);
    if (!group) {
      return res
        .status(404)
        .json(new Response(null, { code: 404, message: "Группа не найдена" }));
    }
    await groupRepository.deleteGroup(groupID);
    res.status(200).json(new Response(null, null));
  });

  groupRouter.get("/:id", checkAuth, async (req, res) => {
    const groupID = req.params.id;
    const group = await groupRepository.getGroupByID(groupID);
    if (!group) {
      return res
        .status(404)
        .json(
          new Response(null, { code: 404, message: "Пользователь не найдены" })
        );
    }
    res.status(200).json(new Response({ object: group }, null));
  });

  return groupRouter;
};

module.exports = getGroupRoutes;
