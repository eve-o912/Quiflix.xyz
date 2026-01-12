# Quiflix Smart Contracts

Smart contracts for the Quiflix film distribution platform on Base Network.

## Contracts

### 1. QuiflixRevenueSplitter.sol
Handles automatic revenue splitting for film purchases:
- **70%** → Filmmaker
- **20%** → Distributor (if applicable)
- **10%** → Quiflix Platform

Features:
- Supports USDC/USDT stablecoin payments
- Automatic revenue distribution on each purchase
- Filmmaker and distributor earnings tracking
- Withdrawal function for accumulated earnings
- Film registration and management

### 2. DigitalDistributionToken.sol (DDT)
ERC-721 NFT representing distribution rights:
- Each DDT grants rights to distribute a specific film
- Contains unique referral code for tracking sales
- Tracks sales count and commission earned
- Can be time-limited or permanent
- Transferable between wallets

## Deployment

### Prerequisites
```bash
npm install -g hardhat
npm install @openzeppelin/contracts
```

### Network Configuration (Base Mainnet)
```javascript
// hardhat.config.js
module.exports = {
  networks: {
    base: {
      url: "https://mainnet.base.org",
      chainId: 8453,
      accounts: [DEPLOYER_PRIVATE_KEY]
    },
    baseSepolia: {
      url: "https://sepolia.base.org",
      chainId: 84532,
      accounts: [DEPLOYER_PRIVATE_KEY]
    }
  }
};
```

### Deployment Steps

1. **Deploy QuiflixRevenueSplitter**
```javascript
const RevenueSplitter = await ethers.getContractFactory("QuiflixRevenueSplitter");
const splitter = await RevenueSplitter.deploy(
  USDC_ADDRESS,           // Payment token (USDC on Base)
  PLATFORM_TREASURY       // Quiflix treasury address
);
```

2. **Deploy DigitalDistributionToken**
```javascript
const DDT = await ethers.getContractFactory("DigitalDistributionToken");
const ddt = await DDT.deploy();
await ddt.setRevenueSplitter(splitter.address);
```

## Contract Addresses (Base)

| Contract | Address |
|----------|---------|
| USDC (Base) | `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913` |
| QuiflixRevenueSplitter | `TBD after deployment` |
| DigitalDistributionToken | `TBD after deployment` |

## Usage Examples

### Register a Film
```javascript
const filmId = ethers.keccak256(ethers.toUtf8Bytes("film-uuid-from-db"));
await splitter.registerFilm(filmId, filmmakerAddress);
```

### Mint a DDT for Approved Distributor
```javascript
await ddt.mintDDT(
  distributorAddress,
  filmId,
  "DIST-ABC123",           // Unique referral code
  "ipfs://metadata-uri",   // DDT metadata
  365                      // Expires in 365 days (0 = never)
);
```

### Process a Purchase
```javascript
// Buyer approves USDC spend first
await usdc.approve(splitter.address, purchaseAmount);

// Validate distributor token (if provided)
const [isValid, distributor] = await ddt.validateTokenCode("DIST-ABC123", filmId);

// Process purchase with automatic revenue split
await splitter.purchaseFilm(filmId, distributor, purchaseAmount);
```

### Withdraw Earnings
```javascript
// Filmmaker or distributor withdraws accumulated earnings
await splitter.withdrawEarnings();
```

## Security Considerations

1. **Access Control**: Only owner can register films and mint DDTs
2. **Reentrancy Protection**: All state changes before external calls
3. **Safe Token Transfers**: Uses OpenZeppelin's SafeERC20
4. **Input Validation**: All inputs validated before processing

## Integration with Quiflix Platform

1. Film submission approved → Register film on-chain
2. Distributor approved → Mint DDT with unique code
3. User purchases via Pretium → Trigger on-chain purchase
4. Revenue automatically split and recorded
5. Filmmakers/distributors withdraw earnings anytime

## License

MIT
