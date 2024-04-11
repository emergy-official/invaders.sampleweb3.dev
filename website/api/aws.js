import {
  S3Client,
  PutObjectCommand,
  HeadObjectCommand,
} from "@aws-sdk/client-s3";


// Set your AWS credentials and region
let s3Client = new S3Client({
  region: "us-east-1",
});

if (process.env.AWS_SESSION_TOKEN) {
  s3Client = new S3Client({
    region: "us-east-1",
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      sessionToken: process.env.AWS_SESSION_TOKEN,
    },
  });
}
export const checkFileExistence = async (bucketName, fileName) => {
  const headParams = {
    Bucket: bucketName,
    Key: fileName,
  };

  try {
    await s3Client.send(new HeadObjectCommand(headParams));
    console.log("File already exists.");
    return true;
  } catch (error) {
    if (
      error?.$metadata?.httpStatusCode === 404 ||
      error?.$metadata?.httpStatusCode === 403
    ) {
      console.log("File does not exist.");
      return false;
    } else {
      console.error("Error checking file existence:", error);
      return null;
    }
  }
};

export const uploadJSONToS3Bucket = async (fileName, jsonData) => {
  const bucketName = process.env.BUCKET_NAME;
  if (await checkFileExistence(bucketName, fileName)) {
    return false;
  }

  console.log("Uploading...");

  const params = {
    Bucket: bucketName,
    Key: fileName,
    Body: JSON.stringify(jsonData),
    ACL: "public-read", // Set the object's ACL to public-read
    ContentType: "application/json", // Set the correct content type
  };

  const command = new PutObjectCommand(params);

  try {
    const response = await s3Client.send(command);
    console.log("File uploaded successfully");
    return true;
  } catch (error) {
    console.error("Error uploading file:", error);
    return false;
  }
};

// Example usage
// const bucketName = "cdn-dev.invaders.sampleweb3.dev";
// const fileName = "nfts/1";
// import NFTs from "./nfts.js";

// checkFileExistence(bucketName, fileName);
// uploadJSONToS3Bucket(bucketName, fileName, NFTs.speedy);
