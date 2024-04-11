import { ethers } from "hardhat";
import { Contract } from "ethers";
import { config, passport } from '@imtbl/sdk';

describe("YourContract", function () {
    let contract: Contract;

    before(async () => {
        const passportInstance =
            new passport.Passport({
                baseConfig: {
                    environment: config.Environment.SANDBOX,
                    publishableKey: 'pk_imapik-test-EOzrOqR_BJDE95Btm@XU',
                },
                clientId: '2Oc8dUOjUvTIqhqApdGk7ofI84dh3etT',
                redirectUri: 'http://localhost:4321/',
                logoutRedirectUri: 'http://localhost:4321/logout',
                audience: 'platform_api',
                scope: 'openid offline_access email transact',
            });

        const provider = new ethers.BrowserProvider(
            passportInstance.connectEvm()
        );

        // Replace with the actual contract address  
        const contractAddress = "0x0f299112f604b5b2734fe9bdee404f59458100ae";

        // Replace with the actual contract ABI  
        const contractABI: any[] = [
            "function grantRole(bytes32 role, address account)",
            "function MINTER_ROLE() view returns (bytes32)",
            "function baseURI() view returns (string)",
            "function feeNumerator() view returns (uint96)",
            "function operatorAllowlist() view returns (address)",
            "function mint(address to, uint256 tokenId)",
            "function ownerOf(uint256 tokenId) view returns (address)",
            "function balanceOf(address to) view returns (uint)",
            "function hasRole(bytes32 role, address account) view returns (bool)",
            "function totalSupply() view returns (uint256)",];


        // // Retrieve the provider  
        // const provider = ethers.getDefaultProvider();

        // Create the contract instance  
        contract = new ethers.Contract(contractAddress, contractABI, provider);
    });

    it("Should mint NFT for a player", async function () {
        const [player1] = await ethers.getSigners();

        // Call _safeMint function on player1 address  
        const res = await contract.connect(player1).operatorAllowlist();
        console.log(res)
        // Assert the NFT is minted correctly  
        // const owner = await contract.ownerOf(1);
        // console.log(owner)
        // console.log("OWNER IS", owner)
        // expect(owner).to.equal(player1.address);
    });
});  