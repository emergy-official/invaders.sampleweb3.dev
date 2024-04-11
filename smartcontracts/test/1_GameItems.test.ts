const { expect } = require('chai');
const { ethers } = require('hardhat');
const { nfts } = require("../nfts/nfts")

describe("Spaceship Game Contracts", function () {

  let GameItems: any;
  let gameItems: any;
  let GameMechanics: any;
  let game: any;
  let owner: any;
  let addr1: any;
  let addr2: any;
  let addrs: any;

  beforeEach(async function () {
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

    GameItems = await ethers.getContractFactory("GameItems");
    // Polygon contract
    // const gameItemsAddress = "0x1f113dDb4a86656856fEE82b892dd0d7eE02E0BD";
    // gameItems = await GameItems.attach(gameItemsAddress);
    gameItems = await GameItems.deploy();
    console.log("Deployed at", await gameItems.getAddress())
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      // The owner of the contract should be the deployer  
      expect(await gameItems.owner()).to.equal(owner.address);
    });
  });

  describe("Transactions", function () {
    it("Should be able to mint and buy an NFT", async function () {
      await gameItems.connect(addr1).buyItem("speedy", { value: ethers.parseEther(`${nfts.speedy.price}`) });
      expect(await gameItems.ownerOf(1)).to.equal(addr1.address);
      // Check if `addr2` can buy the same NFT type "speedy"  
      await gameItems.connect(addr2).buyItem("speedy", { value: ethers.parseEther(`${nfts.speedy.price}`) });
      // Check new owner of the second NFT  
      expect(await gameItems.ownerOf(2)).to.equal(addr2.address);
    });

    it("Should be able to mint and buy all NFTs one by one", async function () {
      let idx = 1;
      for (const nftName in nfts) {
        const NFT = nfts[nftName]
        await gameItems.connect(addr1).buyItem(nftName, { value: ethers.parseEther(`${NFT.price}`) });
        expect(await gameItems.ownerOf(idx)).to.equal(addr1.address);
        idx++;
      }

      console.log("TEST")
      const balance = await gameItems.connect(addr1).balanceOf(addr1);
      console.log("balance", balance)
      const ownedNFTs = [];
      for (let i = 0; i < balance; i++) {
        const tokenId = await gameItems.tokenOfOwnerByIndex(addr1, i);
        const tokenURI = await gameItems.tokenURI(tokenId);
        ownedNFTs.push({ tokenId: tokenId.toString(), tokenURI });
      }
      console.log("ownedNFTs", ownedNFTs)
    });

  });

  describe("Withdrawal", function () {
    it("Should allow the owner to withdraw contract balance", async function () {
      // addr1 buys an NFT, increasing the contract balance  
      await gameItems.connect(addr1).buyItem("speedy", { value: ethers.parseEther(`${nfts.speedy.price}`) });

      console.log("TEST")
      const balance = await gameItems.connect(addr1).balanceOf(addr1);
      console.log("balance", balance)

      // Initial balance of owner  
      const initialOwnerBalance = await ethers.provider.getBalance(owner.address);

      // Owner withdraws  
      const tx = await gameItems.connect(owner).withdraw();
      // Wait for the transaction to be mined  
      const receipt = await tx.wait();
      // Calculate the gas cost  
      const gasUsed = receipt.gasUsed;
      const txDetails = await ethers.provider.getTransaction(tx.hash);
      const gasPrice = txDetails.gasPrice;
      const gasCost = gasUsed * gasPrice;
      // Final balance of owner after withdrawal, adjusting for the gas cost of the withdrawal transaction  
      const finalOwnerBalance = await ethers.provider.getBalance(owner.address);
      const newAmount = finalOwnerBalance + gasCost - initialOwnerBalance
      // Because the owner spent gas to call withdraw(), we adjust for gas cost  
      expect(newAmount >= ethers.parseEther("0.0001")).to.be.true;
    });

    it("Should fail if non-owner tries to withdraw", async function () {
      // Expect the withdraw function to fail if called by someone other than the owner
      let errorMessage = "";
      try {
        await gameItems.connect(addr1).withdraw()
      } catch (e: any) {
        errorMessage = e.message;
      }
      // Doesn't work with ganache network
      // await expect().to.be.revertedWith("Only the owner can perform this action");
      expect(errorMessage).to.contain("Only the owner can perform this action")
    });
  });
});  