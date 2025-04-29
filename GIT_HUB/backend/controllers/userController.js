const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { MongoClient, ObjectId } = require("mongodb");
require("dotenv").config();

const url = process.env.mongo;
let client;

async function connectClient() {
  if (!client) {
    client = new MongoClient(url);
    await client.connect();
  }
}

async function signup(req, res) {
  const { username, password, email } = req.body;
  try {
    await connectClient();
    const db = client.db("github");
    const userCollection = db.collection("users");

    const user = await userCollection.findOne({ username });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPas = await bcrypt.hash(password, salt);

    const newUser = {
      username,
      password: hashedPas,
      email,
      repositories: [],
      followedUsers: [],
      starRepos: [],
    };

    const result = await userCollection.insertOne(newUser);
    const token = jwt.sign({ id: result.insertedId }, process.env.SECRET, {
      expiresIn: "2h",
    });

    res.json({ token, userId: result.insertedId });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: err.message });
  }
}

async function login(req, res) {
  const { email, password } = req.body;
  try {
    await connectClient();
    const db = client.db("github");
    const userCollection = db.collection("users");

    const user = await userCollection.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Credential error" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credential" });
    }

    const token = jwt.sign({ id: user._id }, process.env.SECRET, {
      expiresIn: "2h",
    });

    res.json({ token, userId: user._id });
  } catch (err) {
    console.log("User not logged in:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
}

async function getAllUsers(req, res) {
  try {
    await connectClient();
    const db = client.db("github");
    const userCollection = db.collection("users");

    const users = await userCollection.find({}).toArray();
    res.json(users);
  } catch (err) {
    console.error("Error fetching users:", err.message);
    res.status(500).send("Server error");
  }
}

async function getUserProfile(req, res) {
  const currentId = req.params.id;
  try {
    await connectClient();
    const db = client.db("github");
    const userCollection = db.collection("users");

    const user = await userCollection.findOne({ _id: new ObjectId(currentId) });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (err) {
    console.error("Error fetching user:", err.message);
    res.status(500).send("Server error");
  }
}

async function updateUserProfile(req, res) {
  const currentId = req.params.id;
  const { email, password } = req.body;

  try {
    await connectClient();
    const db = client.db("github");
    const userCollection = db.collection("users");

    let updateFields = { email };
    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      updateFields.password = hashedPassword;
    }

    const result = await userCollection.findOneAndUpdate(
      { _id: new ObjectId(currentId) },
      { $set: updateFields },
      { returnDocument: "after" }
    );

    if (!result.value) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(result.value);
  } catch (err) {
    console.log("Server error:", err);
    res.status(500).send("Server error");
  }
}

async function deleteUserProfile(req, res) {
  const currentId = req.params.id;
  try {
    await connectClient();
    const db = client.db("github");
    const userCollection = db.collection("users");

    const result = await userCollection.deleteOne({
      _id: new ObjectId(currentId),
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "User not found!" });
    }

    res.json({ message: "User profile deleted" });
  } catch (err) {
    console.error("Error deleting user:", err.message);
    res.status(500).send("Server error");
  }
}

module.exports = {
  getAllUsers,
  login,
  signup,
  getUserProfile,
  deleteUserProfile,
  updateUserProfile,
};
