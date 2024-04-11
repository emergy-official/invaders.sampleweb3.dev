import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import dotenv from "dotenv"

dotenv.config()
const config: HardhatUserConfig = {
  solidity: "0.8.24",
  defaultNetwork: "ganache",
  networks: {
    hardhat: {
      accounts: {
        count: 6,
      },
    },
    ganache: {
      url: "http://127.0.0.1:7545", // Change the port if your Ganache runs on a different one.  
      accounts: [
        process.env.OWNER_WALLET_PRIVATE_KEY || "",
        process.env.ACCOUNT1_WALLET_PRIVATE_KEY || "",
        process.env.ACCOUNT2_WALLET_PRIVATE_KEY || "",
      ]
    },
    sepolia: {
      url: process.env.ALCHEMY_API_URL,
      accounts: [
        process.env.OWNER_WALLET_PRIVATE_KEY || "",
        process.env.ACCOUNT1_WALLET_PRIVATE_KEY || "",
        process.env.ACCOUNT2_WALLET_PRIVATE_KEY || "",
      ]
    },
    polygon: { // Adding Mumbai testnet configuration  
      url: process.env.ALCHEMY_API_URL_POLYGON, // Make sure you have the Mumbai RPC URL in your .env  
      accounts: [
        process.env.OWNER_WALLET_PRIVATE_KEY || "", // Use your private keys from the .env file  
        process.env.ACCOUNT1_WALLET_PRIVATE_KEY || "",
        process.env.ACCOUNT2_WALLET_PRIVATE_KEY || "",
      ],
    },
  },
};

export default config;
