
import * as ethers from "ethers";
import dotenv from "dotenv";
dotenv.config();

const provider = new ethers.JsonRpcProvider(process.env.PROVIDER_URL);
const adminWallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

const CONTRACT_ABI = [
  "function grantRole(bytes32 role, address account)",
  "function MINTER_ROLE() view returns (bytes32)",
  "function mint(address to, uint256 tokenId)",
  "function ownerOf(uint256 tokenId) view returns (address)",
  "function hasRole(bytes32 role, address account) view returns (bool)",
  "function totalSupply() view returns (uint256)",
];

const contract = new ethers.Contract(
  "0xf2086a0a19078b39fef5309674bf874e85fba8a6" || process.env.CONTRACT_ADDRESS,
  CONTRACT_ABI,
  adminWallet
);

// To run locally
const grantMinterRole = async (recipientAddress) => {
  const minterRole = await contract.MINTER_ROLE();
  const hasMinterRole = await contract.hasRole(minterRole, recipientAddress);

  if (hasMinterRole) {
    console.log("The user already has the permission.");
    return;
    //   await grantMinterRole(userAddress);
  }

  const tx = await contract.grantRole(minterRole, recipientAddress, {
    gasLimit: 210000,
  });

  await tx.wait();
  console.log("Minter Role Granted to", recipientAddress);
};

// 0xf2086a0a19078B39FEf5309674bF874e85FBa8A6
// 0x4372f1f8f63363C0021e5859c45C946744c25284
grantMinterRole("0x5b5d17B6d2E3063cE8478C19011736654d7d0AcB")