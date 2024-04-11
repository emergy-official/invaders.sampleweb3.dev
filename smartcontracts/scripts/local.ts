import { ethers } from "hardhat";
import { nfts } from "../nfts/nfts"
async function main() {

  const eth: any = ethers;
  const GameItemsContract = await ethers.getContractFactory("GameItems");
  const gameItemsAddress = "0xe63b5834DC319c1bA5f914D6aa9b073c01873369"; // Replace with the contract address you want to interact with  
  const gameItems: any = await GameItemsContract.attach(gameItemsAddress);

  console.log("Token 1 URI", await gameItems.owner())
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
