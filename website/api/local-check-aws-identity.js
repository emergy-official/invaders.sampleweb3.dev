// Manual check of which role I am using

import { STSClient, GetCallerIdentityCommand } from "@aws-sdk/client-sts";

// Set your AWS credentials and region
const stsClient = new STSClient({
  region: "us-west-2",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    sessionToken: process.env.AWS_SESSION_TOKEN
  },
});

async function getCallerIdentity() {
  const command = new GetCallerIdentityCommand({});

  try {
    const response = await stsClient.send(command);
    console.log("Caller Identity:", response);
  } catch (error) {
    console.error("Error getting Caller Identity:", error);
  }
}

getCallerIdentity();
