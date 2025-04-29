const fs = require("fs").promises;
const path = require("path");

async function revertrepo(commitID) {
  console.log(`🔄 Reverting commit: ${commitID}...`);

  const repoPath = path.resolve(process.cwd(), ".utkGit"); // ✅ Hidden folder
  const commitsPath = path.join(repoPath, "commits");
  const commitDir = path.join(commitsPath, commitID);
  const parentDir = path.resolve(repoPath, "..");

  try {
    // 🔍 Check if commit exists
    await fs.access(commitDir);

    // 📂 Read files from commit
    const files = await fs.readdir(commitDir);

    for (const file of files) {
      const src = path.join(commitDir, file);
      const dest = path.join(parentDir, file);

      // 🔄 Restore file to original location
      await fs.copyFile(src, dest);
      console.log(`✅ Restored: ${file}`);
    }

    console.log(`🎉 Commit ${commitID} reverted successfully!`);
  } catch (err) {
    console.error("❌ Unable to revert:", err);
  }
}

module.exports = { revertrepo };
