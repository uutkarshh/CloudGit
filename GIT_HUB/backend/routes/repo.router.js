const express = require("express");
const repoController = require("../controllers/repoController");

const repoRouter = express.Router();

repoRouter.post("/repo/create", repoController.createRepositorites);

repoRouter.get("/repo/all", repoController.getallRepositorites);

repoRouter.get("/repo/:id", repoController.fetchRepositoritesBybId);

repoRouter.get("/repo/name/:name", repoController.fetchRepositoritesBybName);
repoRouter.get(
  "/repo/user/:userID",
  repoController.fetchRepositoritesForCurrentUser
);

repoRouter.put("/repo/update/:id", repoController.updateRepositorityById);

// Your route (should be like this)
repoRouter.delete("/repo/delete/:id", repoController.deleteRepositorityById);

repoRouter.patch("/repo/toggle/:id", repoController.updateRepositorityById);

module.exports = repoRouter;
