const mongoose = require("mongoose");
const Repository = require("../models/repoModel");
const User = require("../models/userModel");
const Issue = require("../models/issuesModel");

async function createIssue(req, res) {
  const { title, description } = req.body;
  const { id } = req.params;
  try {
    const issue = new Issue({
      title,
      description,
      repository: id,
    });
    await issue.save(201);
    res.status(201).json(issue);
  } catch (err) {
    console.error("Error during issue creation : ", err);
    res.status(500).send("Server error");
  }
}
async function updateIssue(req, res) {
  const { id } = req.params;
  const { title, description, status } = req.body;
  try {
    const issue = await Issue.findById(id);
    if (!issue) {
      return res.status(404).json({ error: "Issue not found" });
    }
    issue.title = title;
    issue.status = status;
    issue.description = description;
    await issue.save();
    res.json(issue);
  } catch (err) {
    console.error("Error during upaation : ", err);
    res.status(500).send("Server error");
  }
}
async function getAllIssue(req, res) {
  const { id } = req.params;
  try {
    const issue = Issue.findByIdAndDelete(id);
    if (!issue) {
      return res.status(404).json({ error: "Issue not found" });
    }
    res.json({ message: "Issue deleted" });
  } catch (err) {
    console.error("Error during deletation : ", err);
    res.status(500).send("Server error");
  }
}
async function deleteIssue(req, res) {
  const { id } = req.params;
  try {
    const issue = await Issue.find({ repository: id });
    if (!issue) {
      return res.status(404).json({ error: "Issues not found " });
    }

    res.status(200).json(issue);
  } catch (err) {
    console.error("Error during issue creation : ", err);
    res.status(500).send("Server error");
  }
}
async function getIssueById(req, res) {
  const { id } = req.params;
  try {
    const issue = await Issue.findById(id);
    if (!issue) {
      return res.status(404).json({ error: "Issue not found" });
    }
    res.json(issue);
  } catch (err) {
    console.error("Error during upaation : ", err);
    res.status(500).send("Server error");
  }
}
module.exports = {
  getAllIssue,
  deleteIssue,
  getIssueById,
  updateIssue,
  createIssue,
};
