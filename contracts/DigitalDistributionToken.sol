// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title DigitalDistributionToken (DDT)
 * @dev NFT representing distribution rights for films on Quiflix
 * Each DDT grants the holder the right to distribute a specific film
 * and earn 20% commission on sales made through their referral link
 * Deployed on Base Network
 */
contract DigitalDistributionToken is ERC721, ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    // Revenue splitter contract reference
    address public revenueSplitter;

    // Distribution token details
    struct DDTInfo {
        bytes32 filmId;           // Film this DDT is for
        string tokenCode;         // Unique referral code
        bool isActive;            // Can be used for distribution
        uint256 salesCount;       // Number of sales made
        uint256 totalCommission;  // Total commission earned
        uint256 mintedAt;         // Timestamp of minting
        uint256 expiresAt;        // Expiration timestamp (0 = never)
    }

    // Mappings
    mapping(uint256 => DDTInfo) public ddtInfo;
    mapping(string => uint256) public tokenCodeToId;
    mapping(bytes32 => uint256[]) public filmToTokens;
    mapping(address => uint256[]) public distributorTokens;

    // Events
    event DDTMinted(
        uint256 indexed tokenId,
        bytes32 indexed filmId,
        address indexed distributor,
        string tokenCode
    );
    event DDTActivated(uint256 indexed tokenId);
    event DDTDeactivated(uint256 indexed tokenId);
    event DDTSaleRecorded(
        uint256 indexed tokenId,
        uint256 saleAmount,
        uint256 commission
    );
    event RevenueSplitterUpdated(address indexed newSplitter);

    constructor() ERC721("Quiflix Distribution Token", "DDT") Ownable(msg.sender) {}

    /**
     * @dev Set the revenue splitter contract address
     * @param _revenueSplitter Address of the QuiflixRevenueSplitter contract
     */
    function setRevenueSplitter(address _revenueSplitter) external onlyOwner {
        require(_revenueSplitter != address(0), "Invalid address");
        revenueSplitter = _revenueSplitter;
        emit RevenueSplitterUpdated(_revenueSplitter);
    }

    /**
     * @dev Mint a new DDT for a distributor
     * @param distributor Address of the approved distributor
     * @param filmId The film this DDT grants distribution rights for
     * @param tokenCode Unique referral code for this DDT
     * @param metadataURI IPFS URI containing DDT metadata
     * @param expirationDays Days until DDT expires (0 = never)
     */
    function mintDDT(
        address distributor,
        bytes32 filmId,
        string calldata tokenCode,
        string calldata metadataURI,
        uint256 expirationDays
    ) external onlyOwner returns (uint256) {
        require(distributor != address(0), "Invalid distributor");
        require(bytes(tokenCode).length > 0, "Token code required");
        require(tokenCodeToId[tokenCode] == 0, "Token code already exists");

        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();

        // Mint the NFT
        _safeMint(distributor, newTokenId);
        _setTokenURI(newTokenId, metadataURI);

        // Calculate expiration
        uint256 expiresAt = expirationDays > 0 
            ? block.timestamp + (expirationDays * 1 days) 
            : 0;

        // Store DDT info
        ddtInfo[newTokenId] = DDTInfo({
            filmId: filmId,
            tokenCode: tokenCode,
            isActive: true,
            salesCount: 0,
            totalCommission: 0,
            mintedAt: block.timestamp,
            expiresAt: expiresAt
        });

        // Update mappings
        tokenCodeToId[tokenCode] = newTokenId;
        filmToTokens[filmId].push(newTokenId);
        distributorTokens[distributor].push(newTokenId);

        emit DDTMinted(newTokenId, filmId, distributor, tokenCode);

        return newTokenId;
    }

    /**
     * @dev Validate a DDT token code and return distributor address
     * @param tokenCode The referral code to validate
     * @param filmId The film being purchased
     */
    function validateTokenCode(
        string calldata tokenCode,
        bytes32 filmId
    ) external view returns (bool isValid, address distributor) {
        uint256 tokenId = tokenCodeToId[tokenCode];
        
        if (tokenId == 0) {
            return (false, address(0));
        }

        DDTInfo memory info = ddtInfo[tokenId];
        
        // Check if token is for the correct film
        if (info.filmId != filmId) {
            return (false, address(0));
        }

        // Check if token is active
        if (!info.isActive) {
            return (false, address(0));
        }

        // Check if token has expired
        if (info.expiresAt > 0 && block.timestamp > info.expiresAt) {
            return (false, address(0));
        }

        return (true, ownerOf(tokenId));
    }

    /**
     * @dev Record a sale made through a DDT (called by RevenueSplitter)
     * @param tokenCode The referral code used
     * @param saleAmount Total sale amount
     * @param commission Distributor's commission
     */
    function recordSale(
        string calldata tokenCode,
        uint256 saleAmount,
        uint256 commission
    ) external {
        require(msg.sender == revenueSplitter, "Only revenue splitter");
        
        uint256 tokenId = tokenCodeToId[tokenCode];
        require(tokenId > 0, "Invalid token code");

        ddtInfo[tokenId].salesCount += 1;
        ddtInfo[tokenId].totalCommission += commission;

        emit DDTSaleRecorded(tokenId, saleAmount, commission);
    }

    /**
     * @dev Deactivate a DDT (revoke distribution rights)
     * @param tokenId The DDT to deactivate
     */
    function deactivateDDT(uint256 tokenId) external onlyOwner {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        ddtInfo[tokenId].isActive = false;
        emit DDTDeactivated(tokenId);
    }

    /**
     * @dev Reactivate a DDT
     * @param tokenId The DDT to reactivate
     */
    function activateDDT(uint256 tokenId) external onlyOwner {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        ddtInfo[tokenId].isActive = true;
        emit DDTActivated(tokenId);
    }

    /**
     * @dev Get all DDTs for a film
     */
    function getFilmTokens(bytes32 filmId) external view returns (uint256[] memory) {
        return filmToTokens[filmId];
    }

    /**
     * @dev Get all DDTs owned by a distributor
     */
    function getDistributorTokens(address distributor) external view returns (uint256[] memory) {
        return distributorTokens[distributor];
    }

    /**
     * @dev Get DDT stats
     */
    function getDDTStats(uint256 tokenId) external view returns (
        bytes32 filmId,
        string memory tokenCode,
        bool isActive,
        uint256 salesCount,
        uint256 totalCommission,
        bool isExpired
    ) {
        DDTInfo memory info = ddtInfo[tokenId];
        bool expired = info.expiresAt > 0 && block.timestamp > info.expiresAt;
        
        return (
            info.filmId,
            info.tokenCode,
            info.isActive && !expired,
            info.salesCount,
            info.totalCommission,
            expired
        );
    }

    /**
     * @dev Check if a DDT is valid for distribution
     */
    function isValidForDistribution(uint256 tokenId) external view returns (bool) {
        if (_ownerOf(tokenId) == address(0)) return false;
        
        DDTInfo memory info = ddtInfo[tokenId];
        if (!info.isActive) return false;
        if (info.expiresAt > 0 && block.timestamp > info.expiresAt) return false;
        
        return true;
    }

    // Override required functions
    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
