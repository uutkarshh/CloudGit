const fs = require("fs").promises;
const path = require("path");
const { v4: uuidv4 } = require("uuid");

async function commitrepo(message) {
  const repoPath = path.resolve(process.cwd(), ".utkGit");
  const stagePath = path.join(repoPath, "staging");
  const commitPath = path.join(repoPath, "commits");
  try {
    const id = uuidv4();
    const commitDir = path.join(commitPath, id);
    await fs.mkdir(commitDir, { recursive: true });

    const files = await fs.readdir(stagePath);
    for (const file of files) {
      await fs.copyFile(path.join(stagePath, file), path.join(commitDir, file));
    }
    await fs.writeFile(
      path.join(commitDir, "commit.json"),
      JSON.stringify({ message, date: new Date().toISOString() })
    );
    console.log(`Commiting ${id} created with message : ${message}`);
  } catch (err) {
    console.error("Error comitting files : ", err);
  }
}
module.exports = { commitrepo };
