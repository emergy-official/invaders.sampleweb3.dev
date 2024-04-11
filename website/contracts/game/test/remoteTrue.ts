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
        const contractAddress = "0xa08462a8bfc685cfc4fa63f6584cb88ea16345c5";

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
            "function totalSupply() view returns (uint256)",
            "function buySpeedy(uint256 tokenId) external payable",
            "function buyTank(uint256 tokenId) external payable",
            "function buyGME(uint256 tokenId) external payable",
            "function buyLaserThree(uint256 tokenId) external payable",
            "function buyDRSFive(uint256 tokenId) external payable"
        ];


        // // Retrieve the provider  
        // const provider = ethers.getDefaultProvider();

        // Create the contract instance  
        contract = new ethers.Contract(contractAddress, contractABI, provider);
    });

    it("Should mint NFT for a player", async function () {
        const [player1] = await ethers.getSigners();

        // Call _safeMint function on player1 address  
        // await contract.connect(player1).mintSpaceshipTwo(1);
        // console.log(res)

        await contract.connect(player1).mint("0x2b14ed9ad6b1a7f1a77c069da97e43cccbf70fed", 1);  
    });
    // it("Should mint NFT for a player", async function () {
    //     const [player1] = await ethers.getSigners();

    //     // Call _safeMint function on player1 address  
    //     // await contract.connect(player1).mintSpaceshipTwo(1);
    //     // console.log(res)

    //     await contract.connect(player1).buySpeedy(1, { value: ethers.parseEther("0.001") });  
    //     await contract.connect(player1).buyTank(2, { value: ethers.parseEther("0.002") });  
    //     await contract.connect(player1).buyGME(3, { value: ethers.parseEther("0.003") });  
    //     await contract.connect(player1).buyLaserThree(4, { value: ethers.parseEther("0.001") });  
    //     const rs = await contract.connect(player1).buyDRSFive(5, { value: ethers.parseEther("0.003") });  
    //     console.log(rs)
    // });

    // it("Decode a transaction", async function () {


    //     // Transaction details  
    //     const transaction = {
    //         action: {
    //             callType: "call",
    //             from: "0x5b5d17b6d2e3063ce8478c19011736654d7d0acb",
    //             gas: "0xCAAF",
    //             input: "0x0bb4c8bf0000000000000000000000000000000000000000000000000000000000000003",
    //             to: "0x3ceb4379c8e15ed46353e051c3c82be5d318a88a",
    //             value: "0xAA87BEE538000"
    //         },
    //         result: {
    //             gasUsed: "0xCAAF",
    //             output: "0x"
    //         },
    //         subtraces: 0,
    //         traceAddress: [],
    //         type: "call"
    //     };

    //     // Contract ABI  
    //     const contractABI = [
    //         "function grantRole(bytes32 role, address account)",
    //         "function MINTER_ROLE() view returns (bytes32)",
    //         "function baseURI() view returns (string)",
    //         "function feeNumerator() view returns (uint96)",
    //         "function operatorAllowlist() view returns (address)",
    //         "function mint(address to, uint256 tokenId)",
    //         "function ownerOf(uint256 tokenId) view returns (address)",
    //         "function balanceOf(address to) view returns (uint)",
    //         "function hasRole(bytes32 role, address account) view returns (bool)",
    //         "function totalSupply() view returns (uint256)",
    //         "function mintSpaceshipTwo(uint256 tokenId) external payable"
    //     ];
    //     // Decode method call  
    //     const iface:any = new ethers.Interface(contractABI);
    //     const parsedTransaction:any = iface.parseTransaction({ data: transaction.action.input });

    //     console.log('Method called:', parsedTransaction?.name);
    //     console.log('Parameters:', parsedTransaction?.args);
    // });
});

/*
hh run scripts/deploy.ts --network imx

*/
