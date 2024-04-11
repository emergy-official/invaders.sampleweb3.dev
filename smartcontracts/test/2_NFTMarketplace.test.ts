import { ethers } from "hardhat";
import { expect } from "chai";
import { Signer } from "ethers";
import { GameItems } from "../typechain-types/contracts/GameItems";
import { NFTMarketplace } from "../typechain-types/contracts/NFTMarketplace";
const { nfts } = require("../nfts/nfts")

describe("NFTMarketplace", function () {
  let gameItems: GameItems;
  let nftMarketplace: NFTMarketplace;
  let owner: Signer, addr1: Signer, addr2: Signer;
  const listingFee = ethers.parseEther("0.00001");

  before(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
  });

  beforeEach(async function () {
    const GameItemsFactory = await ethers.getContractFactory("GameItems");
    gameItems = await GameItemsFactory.deploy();

    const MarketplaceFactory = await ethers.getContractFactory("NFTMarketplace");
    nftMarketplace = await MarketplaceFactory.deploy();

    console.log("Marketplace", await nftMarketplace.getAddress())
  });

  it("Should allow an NFT to be listed on the marketplace", async function () {
    // Owner mints an NFT to addr1 
    // process.exit(0)
    const tokenId = 1
    await gameItems.connect(addr1).buyItem("speedy", { value: ethers.parseEther(`${nfts.speedy.price}`) });
    // Approve marketplace contract  
    await gameItems.connect(addr1).approve(await nftMarketplace.getAddress(), tokenId);

    // Create a market item  
    await expect(nftMarketplace.connect(addr1).createMarketItem(await gameItems.getAddress(), tokenId, ethers.parseEther("0.02"), { value: listingFee }))
      .to.emit(nftMarketplace, "MarketplaceItemCreated");
  });

  it("Should handle market item sales correctly", async function () {
    // Set up: List an NFT  
    await gameItems.connect(addr1).buyItem("speedy", { value: ethers.parseEther(`${nfts.speedy.price}`) });
    const tokenId = 1;
    expect(await gameItems.ownerOf(tokenId)).to.equal(await addr1.getAddress());
    let balanceAddr1 = await gameItems.connect(addr1).balanceOf(addr1);
    let balanceAddr2 = await gameItems.connect(addr2).balanceOf(addr2);
    expect(balanceAddr1).to.equal(1);
    expect(balanceAddr2).to.equal(0);

    await gameItems.connect(addr1).approve(await nftMarketplace.getAddress(), tokenId);

    await nftMarketplace.connect(addr1).createMarketItem(await gameItems.getAddress(), tokenId, ethers.parseEther("0.02"), { value: listingFee });
    balanceAddr1 = await gameItems.connect(addr1).balanceOf(addr1);
    expect(balanceAddr1).to.equal(1);

    // Execute sale  
    await expect(nftMarketplace.connect(addr2).createMarketSale(await gameItems.getAddress(), 1, { value: ethers.parseEther("0.02") }))
      .to.changeEtherBalances([addr2, addr1], [ethers.parseEther("-0.02"), ethers.parseEther("0.0194")]); // Considering royalty fee  

    expect(await gameItems.ownerOf(tokenId)).to.equal(await addr2.getAddress());
    balanceAddr1 = await gameItems.connect(addr1).balanceOf(addr1);
    balanceAddr2 = await gameItems.connect(addr2).balanceOf(addr2);
    expect(balanceAddr1).to.equal(0);
    expect(balanceAddr2).to.equal(1);



  });

  it("Should allow fetching market items", async function () {
    // Add items to the market  
    await gameItems.connect(addr1).buyItem("speedy", { value: ethers.parseEther(`${nfts.speedy.price}`) });
    let tokenId = 1
    await gameItems.connect(addr1).approve(await nftMarketplace.getAddress(), tokenId);

    expect(await nftMarketplace.connect(addr1).getTotalListedItems()).to.equal(0)
    await nftMarketplace.connect(addr1).createMarketItem(await gameItems.getAddress(), tokenId, ethers.parseEther("0.02"), { value: listingFee });

    await gameItems.connect(addr1).buyItem("gme", { value: ethers.parseEther(`${nfts.gme.price}`) });
    tokenId = 2
    await gameItems.connect(addr1).approve(await nftMarketplace.getAddress(), tokenId);

    await nftMarketplace.connect(addr1).createMarketItem(await gameItems.getAddress(), tokenId, ethers.parseEther("0.03"), { value: listingFee });

    const listedItems = await nftMarketplace.fetchMarketItems(1, 10);
    console.log(listedItems)
    expect(listedItems.length).to.equal(2);

    const availableItems = await nftMarketplace.connect(addr1).getAvailableItems();
    console.log("AVAILABLE ITEMS", availableItems)

    expect(await nftMarketplace.connect(addr1).getTotalListedItems()).to.equal(2)
    expect(availableItems).to.equal(2)

  });

  it("Should allow an NFT to be unlisted from the marketplace", async function () {
    // Setting up: Addr1 mints and lists an NFT  
    await gameItems.connect(addr1).buyItem("speedy", { value: ethers.parseEther(`${nfts.speedy.price}`) });
    const tokenId = 1;
    await gameItems.connect(addr1).approve(await nftMarketplace.getAddress(), tokenId);

    await nftMarketplace.connect(addr1).createMarketItem(await gameItems.getAddress(), tokenId, ethers.parseEther("0.02"), { value: listingFee });
    expect(await nftMarketplace.getTotalListedItems()).to.equal(1);

    // Action: Addr1 unlists the NFT from the marketplace  
    await nftMarketplace.connect(addr1).unlistMarketItem(tokenId);

    // Verification: The NFT should no longer be listed as available for sale  
    // Note: To properly check the unlisted item, we might need to adapt the smart contract  
    // to expose more information about listed items or their count, depending on the implementation.  
    // For this example, we'll check if the NFT is not listed by attempting to fetch its details  
    // and expecting a default or cleared structure, assuming such a method is implemented.  
    const item = await nftMarketplace.idToMarketplaceItem(tokenId);
    expect(item.listed).to.equal(false);

    // Alternatively, if your contract doesn't directly expose items (common for security),  
    // you would track changes through emitted events or other indirect means.  
  });
});  