const express = require("express");
const mainRouter = express.Router();
const userRouter = require("./user.router");
const repoRouter = require("./repo.router");
const ssueRouter = require("./issue.router");

mainRouter.use(userRouter);
mainRouter.use(repoRouter);
mainRouter.use(ssueRouter);
mainRouter.get("/", (req, res) => {
  res.send("welcome");
});
module.exports = mainRouter;
