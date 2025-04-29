const express = require("express");
const userController = require("../controllers/userController");

const userRouter = express.Router();
userRouter.get("/allUsers", userController.getAllUsers);
userRouter.get("/User/:id", userController.getUserProfile);
userRouter.post("/login", userController.login);
userRouter.post("/signup", userController.signup);
userRouter.delete("/delete/:id", userController.deleteUserProfile);
userRouter.put("/update", userController.updateUserProfile);
module.exports = userRouter;
