const fs = require("fs").promises;
const path = require("path");

async function addrepo(filepath) {
  const repoPath = path.resolve(process.cwd(), ".utkGit");
  const stagingPath = path.join(repoPath, "staging");

  try {
    await fs.mkdir(stagingPath, { recursive: true });
    const file = path.basename(filepath);
    await fs.copyFile(filepath, path.join(stagingPath, file));
    console.log(`file ${file} added to the staging area `);
  } catch (err) {
    console.error("Error adding file : ", err);
  }
}
module.exports = { addrepo };
