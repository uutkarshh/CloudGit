const { S3Client } = require("@aws-sdk/client-s3");
const s3 = new S3Client({
  region: "ap-southeast-2",
  credentials: {
    accessKeyId: "use your acces key", // .env में रखें
    secretAccessKey: ".used your secret key", // .env में रखें
  },
});

const s3_bucket = "mybuckesdfs"; // अपने S3 बकेट का सही नाम डालें

module.exports = { s3, s3_bucket };
