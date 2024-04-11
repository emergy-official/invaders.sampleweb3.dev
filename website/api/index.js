import * as ethers from "ethers";
import dotenv from "dotenv";
dotenv.config();

import NFTs from "./nfts.js";
import {
  userAlreadyHasNFT,
  mintNftToAddress,
  refreshNFTMetadata,
  getNFTFromUsers,
} from "./wallet.js";
import { uploadJSONToS3Bucket, checkFileExistence } from "./aws.js";

const CONTRACT_ABI = [
  "function grantRole(bytes32 role, address account)",
  "function MINTER_ROLE() view returns (bytes32)",
  "function mint(address to, uint256 tokenId)",
  "function ownerOf(uint256 tokenId) view returns (address)",
  "function hasRole(bytes32 role, address account) view returns (bool)",
  "function totalSupply() view returns (uint256)",
];

const provider = new ethers.JsonRpcProvider(process.env.PROVIDER_URL);
const adminWallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

const claimNFT = async (userAddress, nftName, isLocal = false) => {
  console.log("IS LOCAL", isLocal);
  const contract = new ethers.Contract(
    isLocal ? process.env.CONTRACT_ADDRESS_LOCAL : process.env.CONTRACT_ADDRESS,
    CONTRACT_ABI,
    adminWallet
  );

  try {
    nftName = nftName.toLowerCase();
    if (!NFTs[nftName]) {
      return {
        success: false,
        message: "NFT doesn't exist",
      };
    }

    // Verify that the user doesn't have the NFT
    if (await userAlreadyHasNFT(userAddress, nftName, isLocal)) {
      return {
        success: false,
        message: "User already has the NFT",
      };
    }

    // Get next token ID based on total supply
    const tokenID = parseInt(await contract.totalSupply()) + 1;
    console.log("TOKEN ID", tokenID);
    // Create the JSON object
    const nft = NFTs[nftName];
    nft.token_id = tokenID;
    nft.id = tokenID;

    // Contract mint from owner wallet to destination
    await mintNftToAddress(userAddress, tokenID, contract);

    // Upload the JSON object to S3 Bucket
    if (isLocal) {
      await uploadJSONToS3Bucket(`nfts-local/${tokenID}`, nft);
    } else {
      await uploadJSONToS3Bucket(`nfts/${tokenID}`, nft);
    }

    // Refresh nft metadata because the token ID is not uploaded before it is minted
    await refreshNFTMetadata(tokenID, nft, isLocal);

    // Return true
    return { success: true };
  } catch (e) {
    return {
      success: false,
      message: e.message,
    };
  }
};

// Waiting on the fix to continue
const buyNFT = async (data, isLocal = false) => {
  // 0xc5d60f0cb7a08733ee0e200ecde25e8837aacc95c6f84d8d237c7467e59e4cc5
  const nfts = await getNFTFromUsers(data.address, isLocal);
  const tokenIds = nfts.map((e) => parseInt(e.token_id));

  // Verify that the user has the token ID requested
  if (!tokenIds.includes(data.tokenID)) {
    return "You don't have this token";
  }

  // Upload the JSON object to S3 Bucket
  if (isLocal) {
    if (
      await checkFileExistence(
        process.env.BUCKET_NAME,
        `nfts-local/${data.tokenID}`
      )
    ) {
      return "NFT already defined";
    }
  } else {
    if (
      await checkFileExistence(process.env.BUCKET_NAME, `nfts/${data.tokenID}`)
    ) {
      return "NFT already defined";
    }
  }

  // SECURITY BREACH
  // IN FUTURE UPDATE, VERIFY BLOCK DATA THAT THE TRANSACTION REFLECT THE NFT TO GET

  // Create the JSON object to upload the NFT
  const nft = NFTs[data.nftName];
  nft.token_id = data.tokenID;
  nft.id = data.tokenID;

  // Upload the JSON object to S3 Bucket
  if (isLocal) {
    await uploadJSONToS3Bucket(`nfts-local/${data.tokenID}`, nft);
  } else {
    await uploadJSONToS3Bucket(`nfts/${data.tokenID}`, nft);
  }

  await wait(1500);
  // Refresh nft metadata because the token ID is not uploaded before it is minted
  await refreshNFTMetadata(data.tokenID, nft, isLocal);

  return true;
};

const wait = (ms) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};

export const handler = async (event, context) => {
  try {
    const eventBody = JSON.parse(event.body);
    console.log(eventBody);

    if (!eventBody.address) {
      context.fail("Address not set");
      return;
    }
    let res = null;
    if (eventBody.task === "claimNFT") {
      res = await claimNFT(
        eventBody.address,
        eventBody.nftName,
        eventBody.isLocal
      );
      console.log("RES", res);
    } else if (eventBody.task == "buyNFT") {
      console.log("BUY");
      res = await buyNFT(eventBody, eventBody.isLocal);
    }

    const response = {
      statusCode: 200,
      body: JSON.stringify(res),
    };
    return response;
  } catch (error) {
    console.log("ERROR", error);
    // context.fail(error);
  }
};

// The owner should have the right to mint
// grantMinterRole("0x2b14ed9ad6b1a7f1a77c069da97e43cccbf70fed")

/*
Test event
{
 "body": "{\"address\":\"0x5b5d17B6d2E3063cE8478C19011736654d7d0AcB\",\"nftName\":\"speedy\", \"task\":\"claimNFT\"}"
}

*/

// const main = async () => {
//   // await getNFTFromUsers("0x2b14ed9ad6b1a7f1a77c069da97e43cccbf70fed");
//   const res = await handler({
//     body: JSON.stringify({
//       task: "buyNFT",
//       address: "0xa7ccb204bf77128ff9407c9411402859def9de00",
//       tokenID: 9,
//       name: "laserx3",
//       isLocal: true,
//     }),
//   });

//   // const res = await buyNFT(
//   //   "0xa7ccb204bf77128ff9407c9411402859def9de00",
//   //   "speedy"
//   // );
//   console.log("RES", res);
//   // await refreshNFTMetadata(3, NFTs["tank"]);
// };

// main();
