import { ethers } from "hardhat";
async function main() {
  // const GameItemsContract = await ethers.getContractFactory("GameItems");
  // const gameItems = await GameItemsContract.deploy();
  const NFTMarketplaceContract = await ethers.getContractFactory("NFTMarketplace");
  const nftMarketplace = await NFTMarketplaceContract.deploy();

  // console.log("GameItems deployed to:", await gameItems.getAddress());
  console.log("NFTMarketplace deployed to:", await nftMarketplace.getAddress());
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
