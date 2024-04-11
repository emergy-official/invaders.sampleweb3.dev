import { ethers } from "hardhat";

async function main() {

  // Local
  // const owner = "0x5b5d17B6d2E3063cE8478C19011736654d7d0AcB";
  // const name = "Stackup Invader Collection";
  // const symbol = "SIMX";
  // const baseURI = "https://dev.invaders.sampleweb3.dev/nfts-local/";
  // const contractURI = "https://dev.invaders.sampleweb3.dev/nfts/contract.json";
  // const operatorAllowlist = "0x02Ada708Db37470F6707075Cbdc7bD295d30B25E";
  // const receiver = "0x5b5d17B6d2E3063cE8478C19011736654d7d0AcB";
  // const feeNumerator = 1;

  // DEV
  const owner = "0x5b5d17B6d2E3063cE8478C19011736654d7d0AcB";
  const name = "Stackup Invader Collection";
  const symbol = "SIMX";
  const baseURI = "https://dev.invaders.sampleweb3.dev/nfts/";
  const contractURI = "https://dev.invaders.sampleweb3.dev/nfts/contract.json";
  const operatorAllowlist = "0x02Ada708Db37470F6707075Cbdc7bD295d30B25E";
  const receiver = "0x5b5d17B6d2E3063cE8478C19011736654d7d0AcB";
  const feeNumerator = 1;

  // PROD
  // const owner = "0x5b5d17B6d2E3063cE8478C19011736654d7d0AcB";
  // const name = "Stackup Invader Collection";
  // const symbol = "SIMX";
  // const baseURI = "https://invaders.sampleweb3.dev/nfts/";
  // const contractURI = "https://invaders.sampleweb3.dev/nfts/contract.json";
  // const operatorAllowlist = "0x02Ada708Db37470F6707075Cbdc7bD295d30B25E";
  // const receiver = "0x5b5d17B6d2E3063cE8478C19011736654d7d0AcB";
  // const feeNumerator = 1;

  const contractFactory = await ethers.getContractFactory('StackupIMXCollection');

  const contract = await contractFactory.deploy(
    owner,
    name,
    symbol,
    baseURI,
    contractURI,
    operatorAllowlist,
    receiver,
    feeNumerator
  );
  // console.log("CONTRACT", contract)
  await contract.waitForDeployment();
  console.log(`deployed to ${contract.target}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

// npx hardhat run scripts/deploy.ts --network imx