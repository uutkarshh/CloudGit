const fs = require("fs").promises;
const path = require("path");
const { PutObjectCommand } = require("@aws-sdk/client-s3");
const { s3, s3_bucket } = require("../config/aws-config");

async function pushrepo() {
  console.log("🔹 Checking for commits...");

  const repoPath = path.resolve(process.cwd(), ".utkGit");
  const commitsPath = path.join(repoPath, "commits");

  try {
    try {
      await fs.access(commitsPath);
    } catch {
      console.error(" No commits found to push.");
      return;
    }

    const commitDirs = await fs.readdir(commitsPath);

    if (commitDirs.length === 0) {
      console.log("No new commits to push.");
      return;
    }

    for (const commitDir of commitDirs) {
      console.log(`Processing commit: ${commitDir}`);

      const commitPath = path.join(commitsPath, commitDir);
      const files = await fs.readdir(commitPath);

      for (const file of files) {
        const filePath = path.join(commitPath, file);
        const fileContent = await fs.readFile(filePath);

        const params = {
          Bucket: s3_bucket,
          Key: `commits/${commitDir}/${file}`,
          Body: fileContent,
        };

        try {
          await s3.send(new PutObjectCommand(params));
          console.log(` Uploaded: ${file} to S3!`);
        } catch (uploadError) {
          console.error(` Error uploading ${file}:`, uploadError);
        }
      }
    }
  } catch (error) {
    console.error(" Error pushing to S3:", error);
  }
}

module.exports = { pushrepo };
