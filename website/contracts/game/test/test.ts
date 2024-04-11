import {
    time,
    loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";
import { config, passport } from '@imtbl/sdk';

describe("StackupIMXCollection", function () {
    // We define a fixture to reuse the same setup in every test.
    // We use loadFixture to run this setup once, snapshot that state,
    // and reset Hardhat Network to that snapshot in every test.
    async function deployOneYearLockFixture() {
        const ContractFactory = await ethers.getContractFactory("StackupIMXCollection");
        const contract = await ContractFactory.deploy("DEF");

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

        const [player1, player2] = await ethers.getSigners();
        // const signer = await ethers.getSigners()[0];
        return { contract, player1, player2};
    }

    describe("Deployment", function () {
        it("Should set the right unlockTime", async function () {
            const { contract, player1, player2 } = await loadFixture(deployOneYearLockFixture);
            console.log(player1)
            // const baseURI = await contract.getBaseURI()
            // console.log("baseURI = ", baseURI)

            await contract.connect(player2).mint(1)
            await contract.connect(player1).mint(1)
        });

    });

});
