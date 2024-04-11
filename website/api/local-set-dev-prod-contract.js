import { uploadJSONToS3Bucket } from "./aws.js";
import dotenv from "dotenv";
dotenv.config();
/*

# How to run locally

# Get the details of the aws org
source ../../../setup.env

# Assume the role of the lambda from the INFRA ACCOUNT to the DEV ACCOUNT
eval $(aws sts assume-role --profile $AWS_INFRA_ACCOUNT_ID --role-arn "arn:aws:iam::${AWS_DEV_ACCOUNT_ID}:role/lambda_exec_stackup_imx" --role-session-name AWSCLI-Session | jq -r '.Credentials | "export AWS_ACCESS_KEY_ID=\(.AccessKeyId)\nexport AWS_SECRET_ACCESS_KEY=\(.SecretAccessKey)\nexport AWS_SESSION_TOKEN=\(.SessionToken)\n"') 

# Assume the role of the lambda from the INFRA ACCOUNT to the PROD ACCOUNT
eval $(aws sts assume-role --profile $AWS_INFRA_ACCOUNT_ID --role-arn "arn:aws:iam::${AWS_PROD_ACCOUNT_ID}:role/lambda_exec_stackup_imx" --role-session-name AWSCLI-Session | jq -r '.Credentials | "export AWS_ACCESS_KEY_ID=\(.AccessKeyId)\nexport AWS_SECRET_ACCESS_KEY=\(.SecretAccessKey)\nexport AWS_SESSION_TOKEN=\(.SessionToken)\n"') 

node local-set-dev-prod-contract.js
*/

const main = async () => {
  const contractDev = {
    name: "StackUp IMX",
    description: "NFT Collection for the StackUp IMX game",
    image: "https://dev.invaders.sampleweb3.dev/images/bg.png",
    external_link: "https://dev.invaders.sampleweb3.dev/",
  };

  const contractProd = {
    name: "StackUp IMX",
    description: "NFT Collection for the StackUp IMX game",
    image: "https://invaders.sampleweb3.dev/images/bg.png",
    external_link: "https://invaders.sampleweb3.dev/",
  };

  // await uploadJSONToS3Bucket("nfts/contract.json", contractDev);
  await uploadJSONToS3Bucket(
    "nfts/contract.json",
    contractProd
  );
};

main();
