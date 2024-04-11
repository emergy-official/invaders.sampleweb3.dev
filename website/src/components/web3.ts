import { ethers } from "ethers";

import GameItem from "./GameItems.json"
import Marketplace from "./NFTMarketplace.json"

const CONTRACT_GAME_ITEMS = "0xb9CFEdFFa8b5160DeCde23D891d8cB6968134448"
const CONTRACT_MARKETPLACE = "0x1f113dDb4a86656856fEE82b892dd0d7eE02E0BD"

// Local
// const CONTRACT_GAME_ITEMS = "0xeB18116397867caf7Ad6539aE1e584F4C9DAfb3F"
// const CONTRACT_MARKETPLACE = "0x5776f7433F181CaEb88070d06AF4a9a58C25FD61"

const listingFee = ethers.parseEther("0.00001");

export const setMetamask = async () => {
    if (!window.gameInfo.provider) {
        window.gameInfo.provider = new ethers.BrowserProvider(window.ethereum);
    }

    const accs = await window.gameInfo.provider.send("eth_requestAccounts", []);
    const signer = await window.gameInfo.provider.getSigner();
    const accountAddress = await signer.getAddress();

    window.gameInfo.userInfo = {
        signer: signer,
        walletAddress: accountAddress,
        username: shortenAddress(accountAddress)
    };
    return accs
}

export const getUserBalance = async (addr: string) => {
    return ethers.formatEther(await window.gameInfo.provider.getBalance(addr));
}

export const updateInvAndMarketplace = async (marketPlaceItems: any, userInventory: any, userBalance: any) => {
    let mktplaceItems = await getMarketplaceItems()
    const nfts = await getUserNFTs(window.gameInfo.userInfo.walletAddress)

    const [uInventory, updatedMktplaceItems] = await getUserNFTsInventory(nfts, mktplaceItems);
    console.log("mktplaceItems", updatedMktplaceItems)
    console.log("nfts", nfts)
    console.log("userInventory", uInventory)

    userBalance.set(await getUserBalance(window.gameInfo.userInfo.walletAddress))
    window.gameInfo.inventory = uInventory;
    marketPlaceItems.set(updatedMktplaceItems)
    userInventory.set(uInventory);
}

export const getMarketplaceItems = async (page: number = 1) => {
    const marketContract = new ethers.Contract(CONTRACT_MARKETPLACE, Marketplace.abi, window.gameInfo.userInfo.signer)
    const gameContract = new ethers.Contract(CONTRACT_GAME_ITEMS, GameItem.abi, window.gameInfo.userInfo.signer)
    const listedItems = await marketContract.fetchMarketItems(page, 1000)

    const items = []
    for (let item of listedItems) {

        const tokenURI = await gameContract.tokenURI(parseInt(item[2]))
        const name = tokenURI.split("/").pop()
        items.push({
            itemId: parseInt(item[0]),
            nftContract: item[1],
            tokenId: parseInt(item[2]),
            name,
            seller: item[3],
            owner: item[4],
            price: item[5],
            sold: item[6],
            listedForSale: item[7],
        })
    }
    return items;
}

export const getMarketplaceItemsNumber = async () => {
    const marketContract = new ethers.Contract(CONTRACT_MARKETPLACE, Marketplace.abi, window.gameInfo.userInfo.signer)
    return parseInt(await marketContract.getAvailableItems()) || 0
}

export const unlistItem = async (tokenId: number) => {
    const marketContract = new ethers.Contract(CONTRACT_MARKETPLACE, Marketplace.abi, window.gameInfo.userInfo.signer)
    const tx = await marketContract.unlistMarketItem(tokenId)
    await tx.wait()
    return true
}

export const getUserNFTs = async (addr: string) => {
    const gameContract = new ethers.Contract(CONTRACT_GAME_ITEMS, GameItem.abi, window.gameInfo.userInfo.signer)

    const nftBalance = await gameContract.balanceOf(addr);
    const ownedNFTs = [];
    for (let i = 0; i < nftBalance; i++) {
        const tokenId = await gameContract.tokenOfOwnerByIndex(addr, i);
        const tokenURI = await gameContract.tokenURI(tokenId);
        ownedNFTs.push({ tokenId: tokenId.toString(), tokenURI });
    }
    return ownedNFTs
}

export const getUserNFTsInventory = async (ownedNFTs: any, mktplaceItems: any) => {
    const userInventory = { ...window.gameInfo.inventory };
    const tokenUris = ownedNFTs.map((e: any) => e.tokenURI);
    const tokenIdsForSale = mktplaceItems.map((e: any) => e.tokenId)

    userInventory.spaceships = userInventory.spaceships.map((e: any) => {
        if (!e.isNFT) {
            e.owned = true
        } else {
            const idxTokenURI = tokenUris.indexOf(e.tokenURI)
            if (idxTokenURI >= 0) {
                e.owned = true
                const tokenId = parseInt(ownedNFTs[idxTokenURI].tokenId)
                e.tokenId = tokenId
                const idxMarketplace = tokenIdsForSale.indexOf(tokenId)
                if (idxMarketplace >= 0) {
                    e.listedForSale = true;
                    e.marketplaceItemId = mktplaceItems[idxMarketplace].itemId
                }
            }
        }
        return e
    })

    const userInvItemName = [
        ...userInventory.spaceships.filter((e: any) => e.owned).map((e: any) => e.claimName),
        ...userInventory.projectiles.filter((e: any) => e.owned).map((e: any) => e.claimName)
    ]

    mktplaceItems = mktplaceItems.map((e: any) => {
        return {
            ...e,
            alreadyOwned: userInvItemName.includes(e.name)
        }
    })

    userInventory.projectiles = userInventory.projectiles.map((e: any) => {
        if (!e.isNFT) {
            e.owned = true
        } else {
            const idxTokenURI = tokenUris.indexOf(e.tokenURI)
            if (idxTokenURI >= 0) {
                e.owned = true
                const tokenId = parseInt(ownedNFTs[idxTokenURI].tokenId)
                e.tokenId = tokenId
                const idxMarketplace = tokenIdsForSale.indexOf(tokenId)
                if (idxMarketplace >= 0) {
                    e.listedForSale = true;
                    e.marketplaceItemId = mktplaceItems[idxMarketplace].itemId
                }
            }
        }
        return e
    })

    return [userInventory, mktplaceItems]
}

export const shortenAddress = (address: string, chars = 4) => {
    return `${address.substring(0, chars + 2)}...${address.substring(address.length - chars)}`;
}

export const newBuyNFT = async (itemName: string, ethAmount: number) => {
    const gameContract = new ethers.Contract(CONTRACT_GAME_ITEMS, GameItem.abi, window.gameInfo.userInfo.signer)

    console.log("newBuyNFT", itemName, ethAmount)
    const transactionResponse = await gameContract.buyItem(itemName, {
        value: ethers.parseEther(ethAmount.toString())
    });

    await transactionResponse.wait()
    return transactionResponse;
}
export const buyMarketplaceNFT = async (marketplaceData: any) => {
    const marketContract = new ethers.Contract(CONTRACT_MARKETPLACE, Marketplace.abi, window.gameInfo.userInfo.signer)
    const tx = await marketContract.createMarketSale(CONTRACT_GAME_ITEMS, marketplaceData.itemId, { value: marketplaceData.price })
    await tx.wait()
}
export const listenToEvents = async (marketPlaceItems: any, userInventory: any, userBalance: any) => {
    const marketContract = new ethers.Contract(CONTRACT_MARKETPLACE, Marketplace.abi, window.gameInfo.userInfo.signer)
    // Listen for MarketplaceItemCreated  
    marketContract.on('MarketplaceItemCreated', async (itemId, nftContract, tokenId, seller, price, time, event) => {
        console.log(`MarketplaceItemCreated: itemId=${itemId}, nftContract=${nftContract}, tokenId=${tokenId}, seller=${seller}, price=${price}, time=${time}`);
        await updateInvAndMarketplace(marketPlaceItems, userInventory, userBalance)
    });

    // Listen for MarketplaceItemUnlisted  
    marketContract.on('MarketplaceItemUnlisted', async (itemId, event) => {
        console.log(`MarketplaceItemUnlisted: itemId=${itemId}`);
        await updateInvAndMarketplace(marketPlaceItems, userInventory, userBalance)
    });
}
export const listNFTForSale = async (item: any, value: string) => {
    const gameContract = new ethers.Contract(CONTRACT_GAME_ITEMS, GameItem.abi, window.gameInfo.userInfo.signer)
    const marketContract = new ethers.Contract(CONTRACT_MARKETPLACE, Marketplace.abi, window.gameInfo.userInfo.signer)

    // Approve marketplace contract  
    const tx1 = await gameContract.approve(CONTRACT_MARKETPLACE, item.tokenId);
    await tx1.wait()

    // Create a market item  
    const tx = await marketContract.createMarketItem(await CONTRACT_GAME_ITEMS, item.tokenId, ethers.parseEther(`${value}`), { value: listingFee })
    await tx.wait()
    return true;
}  
