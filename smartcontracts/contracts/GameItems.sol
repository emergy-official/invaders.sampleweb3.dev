// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

// Importing OpenZeppelin contracts for ERC721 functionality and security mechanisms
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

// Uncomment the line below to enable console logging for debugging purposes
// import "hardhat/console.sol";

/**
 * @title GameItems
 * @dev This contract allows for the minting of NFTs with unique attributes and a nonfungible token standard implementation.
 * It inherits ERC721Enumerable for enumerability, ERC721URIStorage for token URI storage, and ReentrancyGuard for protection against reentrancy attacks.
 */
contract GameItems is ERC721Enumerable, ERC721URIStorage, ReentrancyGuard {
    // Counter for tracking token IDs
    uint256 private _tokenIds;

    // Address of the contract owner
    address payable public owner;

    /**
     * @dev Struct to store NFT details including URI and price
     */
    struct NFTDetail {
        string uri;
        uint256 price;
    }

    // Mapping from NFT type to its corresponding details
    mapping(string => NFTDetail) private _nftDetails;

    /**
     * @dev Constructor function to initialize the contract with predefined NFT details and set the contract owner.
     */
    constructor() ERC721("GameItems", "GITMS") {
        owner = payable(msg.sender); // Setting the contract deployer as the owner

        // Predefined NFTs with their URIs and prices
        // Consider externalizing NFT detail initialization to reduce constructor size and gas costs during deployment
        _nftDetails["speedy"] = NFTDetail(
            "ipfs://QmVmP8fueMWwrK6iWks5usp4MNWrmNwzyvz3aZiqEVLBm4/speedy",
            0.0001 ether
        );
        _nftDetails["tank"] = NFTDetail(
            "ipfs://QmVmP8fueMWwrK6iWks5usp4MNWrmNwzyvz3aZiqEVLBm4/tank",
            0.00015 ether
        );
        _nftDetails["gme"] = NFTDetail(
            "ipfs://QmVmP8fueMWwrK6iWks5usp4MNWrmNwzyvz3aZiqEVLBm4/gme",
            0.0002 ether
        );
        _nftDetails["laserx3"] = NFTDetail(
            "ipfs://QmVmP8fueMWwrK6iWks5usp4MNWrmNwzyvz3aZiqEVLBm4/laserx3",
            0.0003 ether
        );
        _nftDetails["drs"] = NFTDetail(
            "ipfs://QmVmP8fueMWwrK6iWks5usp4MNWrmNwzyvz3aZiqEVLBm4/drs",
            0.0004 ether
        );
        _nftDetails["drsx5"] = NFTDetail(
            "ipfs://QmVmP8fueMWwrK6iWks5usp4MNWrmNwzyvz3aZiqEVLBm4/drsx5",
            0.0005 ether
        );
    }

    /**
     * @dev Modifier to restrict certain functions to only be callable by the contract owner.
     */
    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can perform this action");
        _;
    }

    /**
     * @dev Public function allowing users to purchase NFTs designated by type.
     * @param _type A string representing the NFT type to purchase.
     */
    function buyItem(string memory _type) external payable nonReentrant {
        require(
            bytes(_nftDetails[_type].uri).length > 0,
            "Non-existent token type"
        );
        uint256 itemPrice = _nftDetails[_type].price;
        require(msg.value == itemPrice, "Incorrect value sent");

        _tokenIds++;
        uint256 newItemId = _tokenIds;
        _mint(msg.sender, newItemId);
        // Assigns the URI to the newly minted token
        _setTokenURI(newItemId, _nftDetails[_type].uri);
    }

    /**
     * @dev Allows the owner to withdraw the balance accumulated in the contract.
     */
    function withdraw() external onlyOwner {
        owner.transfer(address(this).balance);
    }

    // Overridden functions to comply with multiple inheritance requirements and ensure compatibility
    function _increaseBalance(
        address account,
        uint128 amount
    ) internal virtual override(ERC721Enumerable, ERC721) {
        return super._increaseBalance(account, amount);
    }

    function supportsInterface(
        bytes4 interfaceId
    )
        public
        view
        virtual
        override(ERC721Enumerable, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function _update(
        address to,
        uint256 tokenId,
        address auth
    ) internal virtual override(ERC721Enumerable, ERC721) returns (address) {
        return super._update(to, tokenId, auth);
    }

    function tokenURI(
        uint256 tokenId
    )
        public
        view
        virtual
        override(ERC721URIStorage, ERC721)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }
}
