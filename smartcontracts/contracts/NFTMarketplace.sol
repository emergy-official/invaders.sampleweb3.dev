// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

// Importing OpenZeppelin's implementation of the ERC721 standard and a Reentrancy guard for security
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

// NFTMarketplace contract allows users to list and sell NFTs
contract NFTMarketplace is ReentrancyGuard {
    // State variables
    uint256 private _itemIds; // Counter for the total numbers of items ever created
    uint256 private _itemsSold; // Counter for the total numbers of items sold

    address payable owner; // Owner of the contract
    uint256 listingFee = 0.00001 ether; // Listing fee for selling an item
    uint256 constant royaltyFeePercentage = 3; // Royalty fee percentage on sales

    // Struct for marketplace items
    struct MarketplaceItem {
        uint256 itemId;
        address nftContract;
        uint256 tokenId;
        address payable seller;
        address payable owner;
        uint256 price;
        bool sold;
        bool listed;
    }

    // Mapping from item ID to marketplace item
    mapping(uint256 => MarketplaceItem) public idToMarketplaceItem;

    // Events for indexing and searching listings/sales
    event MarketplaceItemCreated(
        uint256 indexed itemId,
        address indexed nftContract,
        uint256 indexed tokenId,
        address seller,
        address owner,
        uint256 price,
        bool sold,
        bool listed
    );

    event MarketplaceItemUnlisted(
        uint256 indexed itemId,
        address indexed seller
    );

    // Sets the contract deployer as the marketplace owner
    constructor() {
        owner = payable(msg.sender);
    }

    // Modifier to restrict functions to the owner
    modifier onlyOwner() {
        require(owner == msg.sender, "Only marketplace owner can call this");
        _;
    }

    // Allows the owner to update the listing fee
    function setListingFee(uint256 _listingFee) external onlyOwner {
        listingFee = _listingFee;
    }

    // Returns the listing fee
    function getListingFee() public view returns (uint256) {
        return listingFee;
    }

    // Create a marketplace item for sale
    function createMarketItem(
        address nftContract,
        uint256 tokenId,
        uint256 price
    ) public payable nonReentrant {
        require(price > 0, "Price must be at least 1 wei");
        require(msg.value == listingFee, "Price must be equal to listing fee");

        // Ensure the marketplace contract is approved to sell the NFT
        require(
            IERC721(nftContract).isApprovedForAll(msg.sender, address(this)) ||
                IERC721(nftContract).getApproved(tokenId) == address(this),
            "Marketplace not approved to transfer NFT"
        );

        _itemIds++;
        uint256 itemId = _itemIds;

        // Creating the item and adding it to the mapping
        idToMarketplaceItem[itemId] = MarketplaceItem(
            itemId,
            nftContract,
            tokenId,
            payable(msg.sender),
            payable(address(0)),
            price,
            false,
            true
        );

        emit MarketplaceItemCreated(
            itemId,
            nftContract,
            tokenId,
            msg.sender,
            address(0),
            price,
            false,
            true
        );
    }

    // Handles the purchase of a marketplace item
    function createMarketSale(
        address nftContract,
        uint256 itemId
    ) public payable nonReentrant {
        MarketplaceItem storage item = idToMarketplaceItem[itemId];
        uint256 price = item.price;
        require(item.listed, "Item is not currently listed for sale.");
        require(
            msg.value == price,
            "Please submit the asking price to complete the purchase"
        );

        // Calculating royalty fee and payment to seller
        uint256 royaltyFee = (price * royaltyFeePercentage) / 100;
        uint256 sellerAmount = price - royaltyFee;

        // Transferring funds
        item.seller.transfer(sellerAmount);
        owner.transfer(royaltyFee);

        // Transferring the NFT to the buyer
        IERC721(nftContract).safeTransferFrom(
            item.seller,
            msg.sender,
            item.tokenId
        );

        // Updating the item's status
        item.owner = payable(msg.sender);
        item.sold = true;
        _itemsSold++;

        // Refunding any excess amount paid
        if (msg.value > price) {
            payable(msg.sender).transfer(msg.value - price);
        }
    }

    // Allows a seller to unlist an item from the marketplace
    function unlistMarketItem(uint256 itemId) public nonReentrant {
        MarketplaceItem storage item = idToMarketplaceItem[itemId];
        require(
            msg.sender == item.seller,
            "Only the seller can unlist this item."
        );
        require(item.listed, "Item is already unlisted.");

        item.listed = false;
        emit MarketplaceItemUnlisted(itemId, msg.sender);
    }

    // Implements basic pagination to fetch all marketplace items
    function fetchAllMarketItems(
        uint256 page,
        uint256 limit
    ) public view returns (MarketplaceItem[] memory) {
        uint256 itemCount = _itemIds;
        uint256 listedItemCount = 0;

        // First, find out how many items are currently listed
        for (uint256 i = 0; i < itemCount; i++) {
            if (idToMarketplaceItem[i + 1].owner == address(0)) {
                listedItemCount++;
            }
        }

        // Create an array big enough to hold all the listed items
        MarketplaceItem[] memory items = new MarketplaceItem[](listedItemCount);
        uint256 currentIndex = 0;

        // Next, populate the array with listed items
        for (uint256 i = 0; i < itemCount; i++) {
            if (
                idToMarketplaceItem[i + 1].listed &&
                idToMarketplaceItem[i + 1].owner == address(0)
            ) {
                uint256 currentId = idToMarketplaceItem[i + 1].itemId;
                MarketplaceItem storage currentItem = idToMarketplaceItem[
                    currentId
                ];
                items[currentIndex] = currentItem;
                currentIndex++;
            }
        }

        // Implement pagination on the filtered listed items
        // Ensure that start and end indices for pagination are correct relative to listed items
        uint256 start = (page - 1) * limit;
        uint256 end = start + limit;
        end = (end > listedItemCount) ? listedItemCount : end;
        uint256 resultSize = end - start;
        MarketplaceItem[] memory paginatedItems = new MarketplaceItem[](
            resultSize
        );

        for (uint256 i = 0; i < resultSize; i++) {
            paginatedItems[i] = items[start + i];
        }
        return paginatedItems;
    }

    // Basic Pagination Example
    function fetchMarketItems(
        uint256 page,
        uint256 limit
    ) public view returns (MarketplaceItem[] memory) {
        uint256 itemCount = _itemIds;
        uint256 listedItemCount = 0;

        // First, find out how many items are currently listed
        for (uint256 i = 0; i < itemCount; i++) {
            if (
                idToMarketplaceItem[i + 1].listed &&
                idToMarketplaceItem[i + 1].owner == address(0)
            ) {
                listedItemCount++;
            }
        }

        // Create an array big enough to hold all the listed items
        MarketplaceItem[] memory items = new MarketplaceItem[](listedItemCount);
        uint256 currentIndex = 0;

        // Next, populate the array with listed items
        for (uint256 i = 0; i < itemCount; i++) {
            if (
                idToMarketplaceItem[i + 1].listed &&
                idToMarketplaceItem[i + 1].owner == address(0)
            ) {
                uint256 currentId = idToMarketplaceItem[i + 1].itemId;
                MarketplaceItem storage currentItem = idToMarketplaceItem[
                    currentId
                ];
                items[currentIndex] = currentItem;
                currentIndex++;
            }
        }

        // Implement pagination on the filtered listed items
        // Ensure that start and end indices for pagination are correct relative to listed items
        uint256 start = (page - 1) * limit;
        uint256 end = start + limit;
        end = (end > listedItemCount) ? listedItemCount : end;
        uint256 resultSize = end - start;
        MarketplaceItem[] memory paginatedItems = new MarketplaceItem[](
            resultSize
        );

        for (uint256 i = 0; i < resultSize; i++) {
            paginatedItems[i] = items[start + i];
        }
        return paginatedItems;
    }

    // Updated function to get the total number of items that are currently listed
    function getTotalListedItems() public view returns (uint256) {
        return _itemIds;
    }

    // Updated function to get the number of available (unsold and listed) items
    function getAvailableItems() public view returns (uint256) {
        uint256 availableItems = 0;
        for (uint256 i = 1; i <= _itemIds; i++) {
            if (
                idToMarketplaceItem[i].listed &&
                idToMarketplaceItem[i].owner == address(0)
            ) {
                availableItems++;
            }
        }
        return availableItems;
    }
}
