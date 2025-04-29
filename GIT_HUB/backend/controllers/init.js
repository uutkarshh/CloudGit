const fs = require("fs").promises;
const path = require("path");

async function initrepo() {
  const repoPath = path.resolve(process.cwd(), ".utkGit");
  const commintPath = path.join(repoPath, "commits");

  try {
    await fs.mkdir(repoPath, { recursive: true });
    await fs.mkdir(commintPath, { recursive: true });
    await fs.writeFile(
      path.join(repoPath, "config.json"),
      JSON.stringify({ bucket: process.env.S3_BUCKET })
    );
    console.log("Repository initilaised");
  } catch (err) {
    console.error("Error initilaising repository", err);
  }
}
module.exports = { initrepo };
