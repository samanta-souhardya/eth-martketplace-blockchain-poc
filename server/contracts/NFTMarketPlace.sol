// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

struct NFTListing {
    uint256 tokenId;
    address seller;
    address currentOwner;
    uint256 price;
}

contract NFTMarket is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    using SafeMath for uint256;
    Counters.Counter private _tokenIds;
    mapping(uint256 => NFTListing) private _listings;
    mapping(uint256 => address[]) ownerListing;

    // if tokenURI is not an empty string => an NFT was created
    // if price is not 0 => an NFT was listed
    // if price is 0 && tokenURI is an empty string => NFT was transferred (either bought, or the listing was canceled)
    event NFTTransfer(uint256 tokenId, address from, address to, uint256 price);

    constructor() ERC721("NFTs", "NFT") {}

    function createNFT(string memory tokenURI) public {
        _tokenIds.increment();
        uint256 currentID = _tokenIds.current();
        _listings[currentID] = NFTListing(
            currentID,
            payable(address(0)),
            payable(msg.sender),
            0
        );
        _safeMint(msg.sender, currentID);
        _setTokenURI(currentID, tokenURI);
        ownerListing[currentID].push(msg.sender);
        emit NFTTransfer(currentID, address(0), msg.sender, 0);
    }

    function listNFT(uint256 tokenId, uint256 price) public {
        require(price > 0, "NFTMarket: price must be greater than 0");
        transferFrom(msg.sender, address(this), tokenId);
        _listings[tokenId].price = price;
        _listings[tokenId].seller = address(this);
        emit NFTTransfer(tokenId, msg.sender, address(this), price);
    }

    function buyNFT(uint256 tokenId) public payable {
        NFTListing memory listing = _listings[tokenId];
        require(listing.price > 0, "NFTMarket: nft not listed for sale");
        ERC721(address(this)).transferFrom(address(this), msg.sender, tokenId);
        listing.price = 0;
        listing.currentOwner = payable(msg.sender);
        listing.seller = address(0);
        _listings[tokenId] = listing;
        ownerListing[tokenId].push(msg.sender);
        clearListing(tokenId);
        emit NFTTransfer(tokenId, address(this), msg.sender, 0);
    }

    function cancelListing(uint256 tokenId) public {
        NFTListing memory listing = _listings[tokenId];
        require(listing.price > 0, "NFTMarket: nft not listed for sale");
        require(
            listing.currentOwner == msg.sender,
            "NFTMarket: you're not the seller"
        );
        ERC721(address(this)).transferFrom(address(this), msg.sender, tokenId);
        clearListing(tokenId);
        emit NFTTransfer(tokenId, address(this), msg.sender, 0);
    }

    function withdrawFunds() public onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "NFTMarket: balance is zero");
        payable(msg.sender).transfer(balance);
    }

    function clearListing(uint256 tokenId) private {
        _listings[tokenId].price = 0;
        _listings[tokenId].seller = address(0);
    }

    function getOwners(uint256 tokenId) public view returns (address[] memory) {
        //check if item with this token id exists or not
        return ownerListing[tokenId];
    }

    function getNFT(uint256 tokenId) public view returns (NFTListing memory) {
        return _listings[tokenId];
    }

    function getLatestTokenId() public view returns (uint256) {
        return _tokenIds.current();
    }
}
