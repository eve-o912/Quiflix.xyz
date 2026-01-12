// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title QuiflixRevenueSplitter
 * @dev Handles automatic revenue splitting for film purchases on Quiflix
 * Revenue Split: 70% Filmmaker, 20% Distributor, 10% Quiflix
 * Deployed on Base Network
 */
contract QuiflixRevenueSplitter is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    // Revenue split percentages (in basis points, 10000 = 100%)
    uint256 public constant FILMMAKER_SHARE = 7000;  // 70%
    uint256 public constant DISTRIBUTOR_SHARE = 2000; // 20%
    uint256 public constant PLATFORM_SHARE = 1000;    // 10%
    uint256 public constant BASIS_POINTS = 10000;

    // Supported stablecoins (USDC/USDT on Base)
    IERC20 public immutable paymentToken;
    
    // Platform treasury address
    address public platformTreasury;

    // Film registry
    struct Film {
        address filmmaker;
        bool isActive;
        uint256 totalRevenue;
        uint256 totalPurchases;
    }

    // Purchase record
    struct Purchase {
        bytes32 filmId;
        address buyer;
        address distributor;
        uint256 amount;
        uint256 timestamp;
    }

    // Mappings
    mapping(bytes32 => Film) public films;
    mapping(bytes32 => Purchase) public purchases;
    mapping(address => uint256) public filmmakerEarnings;
    mapping(address => uint256) public distributorEarnings;

    // Events
    event FilmRegistered(bytes32 indexed filmId, address indexed filmmaker);
    event FilmDeactivated(bytes32 indexed filmId);
    event PurchaseCompleted(
        bytes32 indexed purchaseId,
        bytes32 indexed filmId,
        address indexed buyer,
        address distributor,
        uint256 amount,
        uint256 filmmakerAmount,
        uint256 distributorAmount,
        uint256 platformAmount
    );
    event EarningsWithdrawn(address indexed recipient, uint256 amount);
    event PlatformTreasuryUpdated(address indexed newTreasury);

    constructor(
        address _paymentToken,
        address _platformTreasury
    ) Ownable(msg.sender) {
        require(_paymentToken != address(0), "Invalid payment token");
        require(_platformTreasury != address(0), "Invalid treasury");
        
        paymentToken = IERC20(_paymentToken);
        platformTreasury = _platformTreasury;
    }

    /**
     * @dev Register a new film on the platform
     * @param filmId Unique identifier for the film (from database)
     * @param filmmaker Address of the filmmaker to receive payments
     */
    function registerFilm(bytes32 filmId, address filmmaker) external onlyOwner {
        require(filmmaker != address(0), "Invalid filmmaker address");
        require(!films[filmId].isActive, "Film already registered");

        films[filmId] = Film({
            filmmaker: filmmaker,
            isActive: true,
            totalRevenue: 0,
            totalPurchases: 0
        });

        emit FilmRegistered(filmId, filmmaker);
    }

    /**
     * @dev Deactivate a film (stop accepting purchases)
     * @param filmId The film to deactivate
     */
    function deactivateFilm(bytes32 filmId) external onlyOwner {
        require(films[filmId].isActive, "Film not active");
        films[filmId].isActive = false;
        emit FilmDeactivated(filmId);
    }

    /**
     * @dev Process a film purchase with automatic revenue split
     * @param filmId The film being purchased
     * @param distributor Address of the distributor (or zero address if direct purchase)
     * @param amount Purchase amount in payment token
     * @return purchaseId Unique identifier for this purchase
     */
    function purchaseFilm(
        bytes32 filmId,
        address distributor,
        uint256 amount
    ) external nonReentrant returns (bytes32 purchaseId) {
        require(films[filmId].isActive, "Film not available");
        require(amount > 0, "Amount must be greater than 0");

        // Transfer payment from buyer
        paymentToken.safeTransferFrom(msg.sender, address(this), amount);

        // Calculate splits
        uint256 filmmakerAmount = (amount * FILMMAKER_SHARE) / BASIS_POINTS;
        uint256 platformAmount = (amount * PLATFORM_SHARE) / BASIS_POINTS;
        uint256 distributorAmount;

        if (distributor != address(0)) {
            // With distributor: 70/20/10 split
            distributorAmount = (amount * DISTRIBUTOR_SHARE) / BASIS_POINTS;
        } else {
            // No distributor: filmmaker gets 90%, platform gets 10%
            filmmakerAmount = amount - platformAmount;
            distributorAmount = 0;
        }

        // Update earnings
        address filmmaker = films[filmId].filmmaker;
        filmmakerEarnings[filmmaker] += filmmakerAmount;
        
        if (distributorAmount > 0) {
            distributorEarnings[distributor] += distributorAmount;
        }

        // Transfer platform share immediately
        paymentToken.safeTransfer(platformTreasury, platformAmount);

        // Update film stats
        films[filmId].totalRevenue += amount;
        films[filmId].totalPurchases += 1;

        // Generate purchase ID
        purchaseId = keccak256(abi.encodePacked(
            filmId,
            msg.sender,
            block.timestamp,
            films[filmId].totalPurchases
        ));

        // Record purchase
        purchases[purchaseId] = Purchase({
            filmId: filmId,
            buyer: msg.sender,
            distributor: distributor,
            amount: amount,
            timestamp: block.timestamp
        });

        emit PurchaseCompleted(
            purchaseId,
            filmId,
            msg.sender,
            distributor,
            amount,
            filmmakerAmount,
            distributorAmount,
            platformAmount
        );

        return purchaseId;
    }

    /**
     * @dev Withdraw accumulated earnings (for filmmakers and distributors)
     */
    function withdrawEarnings() external nonReentrant {
        uint256 filmmakerBalance = filmmakerEarnings[msg.sender];
        uint256 distributorBalance = distributorEarnings[msg.sender];
        uint256 totalBalance = filmmakerBalance + distributorBalance;

        require(totalBalance > 0, "No earnings to withdraw");

        // Reset balances before transfer
        filmmakerEarnings[msg.sender] = 0;
        distributorEarnings[msg.sender] = 0;

        // Transfer earnings
        paymentToken.safeTransfer(msg.sender, totalBalance);

        emit EarningsWithdrawn(msg.sender, totalBalance);
    }

    /**
     * @dev Update platform treasury address
     * @param newTreasury New treasury address
     */
    function updatePlatformTreasury(address newTreasury) external onlyOwner {
        require(newTreasury != address(0), "Invalid treasury");
        platformTreasury = newTreasury;
        emit PlatformTreasuryUpdated(newTreasury);
    }

    /**
     * @dev Get film details
     */
    function getFilm(bytes32 filmId) external view returns (
        address filmmaker,
        bool isActive,
        uint256 totalRevenue,
        uint256 totalPurchases
    ) {
        Film memory film = films[filmId];
        return (film.filmmaker, film.isActive, film.totalRevenue, film.totalPurchases);
    }

    /**
     * @dev Get total earnings for an address
     */
    function getTotalEarnings(address account) external view returns (
        uint256 asFilmmaker,
        uint256 asDistributor,
        uint256 total
    ) {
        asFilmmaker = filmmakerEarnings[account];
        asDistributor = distributorEarnings[account];
        total = asFilmmaker + asDistributor;
    }
}
