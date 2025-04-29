const fs = require("fs"); // ✅ Stream writing के लिए
const fsp = require("fs").promises; // ✅ Promises-based fs
const path = require("path");
const {
  ListObjectsV2Command,
  GetObjectCommand,
} = require("@aws-sdk/client-s3");
const { s3, s3_bucket } = require("../config/aws-config");

async function pullrepo() {
  console.log("📥 Fetching commit list from S3...");

  const repoPath = path.resolve(process.cwd(), ".utkGit");
  const commitsPath = path.join(repoPath, "commits");

  try {
    // ✅ Check if local commit directory exists, else create it
    await fsp.mkdir(commitsPath, { recursive: true });

    // ✅ Fetch commit list from S3
    const data = await s3.send(
      new ListObjectsV2Command({ Bucket: s3_bucket, Prefix: "commits/" })
    );

    if (!data.Contents || data.Contents.length === 0) {
      console.log("📂 No commits found in S3.");
      return;
    }

    for (const file of data.Contents) {
      const fileKey = file.Key;
      const localFilePath = path.join(repoPath, fileKey);

      console.log(`📥 Downloading: ${fileKey}...`);

      // ✅ Ensure directories exist
      await fsp.mkdir(path.dirname(localFilePath), { recursive: true });

      // ✅ Download file from S3
      const { Body } = await s3.send(
        new GetObjectCommand({ Bucket: s3_bucket, Key: fileKey })
      );

      const writeStream = fs.createWriteStream(localFilePath);

      Body.pipe(writeStream);

      await new Promise((resolve, reject) => {
        writeStream.on("finish", resolve);
        writeStream.on("error", reject);
      });

      console.log(`✅ Downloaded: ${fileKey}`);
    }
  } catch (err) {
    console.error("❌ Unable to pull:", err);
  }
}

module.exports = { pullrepo };
