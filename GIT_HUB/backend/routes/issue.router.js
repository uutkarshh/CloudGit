const express = require("express");
const IssueController = require("../controllers/IssueController");

const issueRouter = express.Router();
issueRouter.post("/Issue/create", IssueController.createIssue);
issueRouter.put("/Issue/update/:id", IssueController.updateIssue);
issueRouter.delete("/Issue/delete/id", IssueController.deleteIssue);
issueRouter.get("/Issue/all", IssueController.getAllIssue);
issueRouter.get("/Issue/:id", IssueController.getIssueById);

module.exports = issueRouter;
