import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "hardhat-deploy"

const config: HardhatUserConfig = {
  defaultNetwork: "hardhat",
  solidity: {
    version: "0.8.19",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
      evmVersion: "paris",
      metadata: {
        bytecodeHash: "none",
      }
    },
  },
  networks: {
    hardhat: {
      chainId: 31337,
    },
    imx: {
      url: "https://rpc.testnet.immutable.com",
      accounts: [""],
    },
  }
};

export default config;
