const express = require("express");
require("dotenv").config();
const cors = require("cors");
const mongoose = require("mongoose");
const http = require("http");
const bodyParser = require("body-parser");
const { Server } = require("socket.io");
const mainRouter = require("./routes/main.router");

const yargs = require("yargs");
const { hideBin } = require("yargs/helpers");

const { initrepo } = require("./controllers/init");
const { addrepo } = require("./controllers/add");
const { commitrepo } = require("./controllers/commit");
const { pullrepo } = require("./controllers/pull");
const { pushrepo } = require("./controllers/push");
const { revertrepo } = require("./controllers/revert");

yargs(hideBin(process.argv))
  .command("start", "Start a new server", {}, Startsever)
  .command("init", "Initializing a new repository", {}, initrepo)
  .command(
    "add <file>",
    "Add a file to the repository",
    (yargs) => {
      yargs.positional("file", {
        describe: "File to add to the staging area",
        type: "string",
      });
    },
    (argv) => {
      addrepo(argv.file);
    }
  )
  .command("pull", "Pull commits from S3", {}, pullrepo)
  .command("push", "Push commits to S3", {}, pushrepo)
  .command(
    "revert <commit-ID>",
    "Revert to a specific commit",
    (yargs) => {
      yargs.positional("commitID", {
        describe: "Commit ID to revert to",
        type: "string",
      });
    },
    (argv) => {
      revertrepo(argv.commitID);
    }
  )
  .command(
    "commit <message>",
    "Commit the staged files",
    (yargs) => {
      yargs.positional("message", {
        describe: "Commit message",
        type: "string",
      });
    },
    (argv) => {
      commitrepo(argv.message);
    }
  )
  .demandCommand(1, "You need at least one command")
  .help().argv;

function Startsever() {
  const app = express();
  const port = process.env.PORT || 3000;
  app.use(bodyParser.json());
  app.use(express.json());

  // db connection
  main().catch((err) => console.log(err));
  async function main() {
    await mongoose.connect(process.env.mongo);
    console.log("connect");
  }
  app.use(cors({ origin: "*" }));
  app.use("/", mainRouter);

  let use = "test";
  const httpServer = http.createServer(app);
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methos: ["GET", "POST"],
    },
  });
  io.on("connetion", (socket) => {
    socket.on("joinRoom", (userID) => {
      user = userID;
      console.log("===");
      console.log(user);
      console.log("===");
      socket.join(userID);
    });
  });

  const db = mongoose.connection;
  db.once("open", async () => {
    console.log("CRUD opration called");
    //CRUD opration
  });

  httpServer.listen(port, () => {
    console.log(`Server is running on PORT ${port}`);
  });
}
