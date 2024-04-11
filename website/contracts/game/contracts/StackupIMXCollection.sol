pragma solidity ^0.8.19;

import "@imtbl/contracts/contracts/token/erc721/preset/ImmutableERC721.sol";

contract StackupIMXCollection is ImmutableERC721 {
    constructor(
        address owner,
        string memory name,
        string memory symbol,
        string memory baseURI,
        string memory contractURI,
        address operatorAllowlist,
        address receiver,
        uint96 feeNumerator
    )
        ImmutableERC721(
            owner,
            name,
            symbol,
            baseURI,
            contractURI,
            operatorAllowlist,
            receiver,
            feeNumerator
        )
    {}

    function buySpeedy(uint256 tokenId) external payable {
        require(msg.value >= 0.001 ether, "Insufficient imx sent");

        
        // Mint the token and perform other actions
        _safeMintByID(msg.sender, tokenId);
    }

    function buyTank(uint256 tokenId) external payable {
        require(msg.value >= 0.002 ether, "Insufficient imx sent");

        // Mint the token and perform other actions
        _safeMintByID(msg.sender, tokenId);
    }

    function buyGME(uint256 tokenId) external payable {
        require(msg.value >= 0.003 ether, "Insufficient imx sent");

        // Mint the token and perform other actions
        _safeMintByID(msg.sender, tokenId);
    }

    function buyLaserThree(uint256 tokenId) external payable {
        require(msg.value >= 0.001 ether, "Insufficient imx sent");

        // Mint the token and perform other actions
        _safeMintByID(msg.sender, tokenId);
    }

    function buyDRS(uint256 tokenId) external payable {
        require(msg.value >= 0.002 ether, "Insufficient imx sent");

        // Mint the token and perform other actions
        _safeMintByID(msg.sender, tokenId);
    }

    function buyDRSFive(uint256 tokenId) external payable {
        require(msg.value >= 0.003 ether, "Insufficient imx sent");

        // Mint the token and perform other actions
        _safeMintByID(msg.sender, tokenId);
    }
}
