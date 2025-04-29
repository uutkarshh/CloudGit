const mongoose = require("mongoose");
const Repository = require("../models/repoModel");

async function createRepositorites(req, res) {
  const { name, owner, description, content, issues } = req.body;

  try {
    if (!name) {
      return res.status(400).json({ error: "Repository name is required" });
    }

    if (!owner || !mongoose.Types.ObjectId.isValid(owner)) {
      return res.status(400).json({ error: "Invalid User ID: " + owner });
    }

    const newRepository = new Repository({
      name,
      description,
      owner,
      content,
      issues,
    });

    const result = await newRepository.save();

    res.status(201).json({
      message: "Repository created successfully",
      repositoryID: result._id,
    });
  } catch (err) {
    console.error("Unable to create repository:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
async function getallRepositorites(req, res) {
  try {
    const repositories = await Repository.find({})
      .populate("owner")
      .populate("issues");
    res.json(repositories);
  } catch (err) {
    console.error("Error during frcthing repositories: ", err);
    res.status(500).json("Server error");
  }
}
async function fetchRepositoritesBybId(req, res) {
  const id = req.params;
  try {
    const repository = await Repository.find({ _id: id })
      .populate("owner")
      .populate("issues");
    res.json(repository);
  } catch (err) {
    console.error("Error during frcthing repositories: ", err);
    res.status(500).json("Server error");
  }
}
async function fetchRepositoritesBybName(req, res) {
  const { name } = req.params;
  try {
    const repository = Repository.find({ name })
      .populate("owner")
      .populate("issues");
    res.json(repository);
  } catch (err) {
    console.error("Error during fecthing repositories: ", err);
    res.status(500).json("Server error");
  }
}
async function fetchRepositoritesForCurrentUser(req, res) {
  const { userID } = req.params;

  if (!mongoose.Types.ObjectId.isValid(userID)) {
    return res.status(400).json({ error: "Invalid user ID format" });
  }

  try {
    const repositories = await Repository.find({
      owner: new mongoose.Types.ObjectId(userID),
    });

    if (!repositories || repositories.length === 0) {
      return res.status(404).json({ error: "User repositories not found" });
    }

    res.json({ message: "Repositories found", repositories });
  } catch (err) {
    console.error("Error fetching repositories: ", err);
    res.status(500).json({ error: "Server error" });
  }
}
const updateRepositorityById = async (req, res) => {
  try {
    // Get the repository ID from the URL params
    const repoId = req.params.id;

    // Get the updated content and description from the request body
    const { description, content } = req.body;

    // Check if the required fields are provided
    if (!description || !content) {
      return res
        .status(400)
        .json({ message: "Description and Content cannot be empty" });
    }

    // Find the repository by its ID
    const repo = await Repository.findById(repoId);
    if (!repo) {
      return res.status(404).json({ message: "Repository not found" });
    }

    // Update the repository with new data
    repo.description = description;
    repo.content = content; // Assuming content is already an array

    // Save the updated repository
    await repo.save();

    // Return the updated repository in the response
    return res
      .status(200)
      .json({ message: "Repository updated successfully", repository: repo });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Something went wrong while updating the repository" });
  }
};
async function toggledvisiblityById(req, res) {
  const { id } = req.params;
  try {
    const repository = await Repository.findById(id);
    if (!repository) {
      return res.status(404).json({ error: "Repository not found" });
    }
    repository.visibility = !repository.visibility;
    const updatedRepositority = await repository.save();
    res.json({
      message: "Repository visiblity toggled successfully",
      repository: updatedRepositority,
    });
  } catch (err) {
    console.error("Error during fecthing repositories: ", err);
    res.status(500).json("Server error");
  }
}
async function deleteRepositorityById(req, res) {
  const { id } = req.params;
  console.log("Trying to delete repository with ID:", id); // 👈 ADD THIS

  try {
    const repository = await Repository.findByIdAndDelete(id);
    if (!repository) {
      console.log("Repository not found for ID:", id); // 👈 ADD THIS
      return res.status(404).json({ error: "Repo not found" });
    }
    res.json({ message: "Repository deleted successfully" });
  } catch (err) {
    console.log("Error during deleting repo:", err.message);
    res.status(500).json("Server error");
  }
}

module.exports = {
  fetchRepositoritesBybId,
  fetchRepositoritesBybName,
  fetchRepositoritesForCurrentUser,
  getallRepositorites,
  updateRepositorityById,
  toggledvisiblityById,
  deleteRepositorityById,
  createRepositorites,
};
