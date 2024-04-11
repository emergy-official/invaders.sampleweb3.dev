import { useStore } from "@nanostores/preact";
import { ethers } from "ethers";
import { userBalance } from "../store/imxStore";
import { newBuyNFT } from "./web3";

const CONTRACT_ABI = [
    "function grantRole(bytes32 role, address account)",
    "function MINTER_ROLE() view returns (bytes32)",
    "function mint(address to, uint256 tokenId)",
    "function ownerOf(uint256 tokenId) view returns (address)",
    "function hasRole(bytes32 role, address account) view returns (bool)",
    "function totalSupply() view returns (uint256)",
    "function mintSpaceshipTwo(uint256 tokenId) external payable",
    "function buySpeedy(uint256 tokenId) external payable",
    "function buyTank(uint256 tokenId) external payable",
    "function buyGME(uint256 tokenId) external payable",
    "function buyLaserThree(uint256 tokenId) external payable",
    "function buyDRS(uint256 tokenId) external payable",
    "function buyDRSFive(uint256 tokenId) external payable",
];

export const getRandomElement = (array: any) => {
    return array[Math.floor(Math.random() * array.length)];
}

export const playerInventoryToGame = async (inventory: any) => {
    const response: any =
        await window.gameInfo.client.listNFTsByAccountAddress({
            chainName: "imtbl-zkevm-testnet",
            accountAddress: window.gameInfo.userInfo.walletAddress,
            contractAddress:
                window.gameInfo.config.collectionContractAddress,
        });

    const localStorageInventory = localStorage.getItem(`inventory-${window.gameInfo.userInfo.walletAddress}`)
    const uInv = localStorageInventory ? JSON.parse(localStorageInventory) : { ...window.gameInfo.inventory };

    uInv.spaceships = uInv.spaceships.map((e: any) => {
        e.owned = !e.isNFT ? true : false
        return e
    })

    uInv.projectiles = uInv.projectiles.map((e: any) => {
        e.owned = !e.isNFT ? true : false
        return e
    })

    for (let nft of response?.result) {

        console.log("NFT", nft)
        const spaceship = uInv.spaceships.find((e: any) => e.name.toLowerCase() === nft.name?.toLowerCase())
        const projectile = uInv.projectiles.find((e: any) => e.name.toLowerCase() === nft.name?.toLowerCase())

        const item = spaceship || projectile

        if (item) {
            item.owned = true;
        }
    }

    window.gameInfo.inventory = uInv;
    inventory.set(uInv);
}

export const claimNFT = async function (name: string): Promise<any> {
    if (window?.gameInfo?.userInfo?.walletAddress) {
        const userAddress = window.gameInfo.userInfo.walletAddress
        try {
            const response = await fetch(window.gameInfo.config.lambdaURL, {
                method: 'POST',
                body: JSON.stringify({ "address": userAddress, nftName: `${name}`, task: "claimNFT", isLocal: window.gameInfo.config.env == "local" }),
                headers: {
                    'Content-Type': 'application/json'
                },
            });
            const res = await response.json()
            console.log("RES", res)
        } catch (error) {
            console.error("Error minting the NFT:", error);
        }
    } else {
        console.log("No user wallet address found");
    }
};
export const claimNFTAfterBuy = async function (name: string, tokenID: number): Promise<any> {
    if (window?.gameInfo?.userInfo?.walletAddress) {
        const userAddress = window.gameInfo.userInfo.walletAddress
        try {
            const response = await fetch(window.gameInfo.config.lambdaURL, {
                method: 'POST',
                body: JSON.stringify({ "address": userAddress, nftName: `${name}`, task: "buyNFT", tokenID, isLocal: window.gameInfo.config.env == "local" }),
                headers: {
                    'Content-Type': 'application/json'
                },
            });
            const res = await response.json()
            console.log("RES", res)
        } catch (error) {
            console.error("Error minting the NFT:", error);
        }
    } else {
        console.log("No user wallet address found");
    }
};

export const getBalance = async function (): Promise<any> {
    const balance = await window.gameInfo.provider.send(
        "eth_getBalance",
        [window.gameInfo.userInfo.walletAddress, "latest"]
    );
    return ethers.formatEther(balance) || 0;
}

export const buyNFT = async function (claimName: string, price: number, retry: number = 0): Promise<any> {
    if (window.gameInfo.provider) {
        try {
            const transaction = await newBuyNFT(claimName, price)
            if (transaction.nonce) {
                return true
            }
        } catch (error) {
            console.error("Error minting the NFT:", error);
            return false
        }
    } else {
        console.log("No provider found.");
    }
};

export const grantMinterRole = async (userAddress: string) => {
    try {
        if (!userAddress) {
            throw new Error('No wallet address');
        }
        console.log(`Granting Minter Role for ${userAddress}`)
        const response = await fetch(window.gameInfo.config.lambdaURL, {
            method: 'POST',
            body: JSON.stringify({ "address": userAddress }),
            headers: {
                'Content-Type': 'application/json'
            },
        });

        const res = await response.json()
        console.log("Grant minter role:", res.message)
        if (!res.message) {
            throw new Error('Failed to claim NFT');
        }

    } catch (error: any) {
        // Handle any errors that occur during the request  
        throw new Error(error.message);
    }
}