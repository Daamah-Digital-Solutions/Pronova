// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

/**
 * @title PronovaPresale
 * @dev Presale contract based on whitepaper specifications
 * Supports ETH, BNB, USD, USDT as per whitepaper
 * 4 phases with prices: $0.05, $0.07, $0.09, $0.10
 */
contract PronovaPresale is Ownable, ReentrancyGuard, Pausable {
    using SafeERC20 for IERC20;
    using Address for address payable;

    IERC20 public pronovaToken;
    IERC20 public usdtToken;

    struct Phase {
        uint256 pricePerToken; // Price in USD (6 decimals to match USDT)
        uint256 tokensAllocated;
        uint256 tokensSold;
        uint256 minPurchase; // Minimum purchase in USD
        uint256 maxPurchase; // Maximum purchase in USD
        uint256 startTime;
        uint256 endTime;
        bool isActive;
    }

    struct UserPurchase {
        uint128 totalTokensPurchased;  // Optimized: reduced from uint256
        uint128 totalAmountPaid;       // Optimized: reduced from uint256 (in USD)
        uint64 lastPurchaseTime;       // Optimized: reduced from uint256
        bool hasClaimedTokens;         // Packed with timestamp
    }

    // Enhanced referral tracking
    struct ReferralData {
        uint256 totalReferred;
        uint256 totalRewards;
        address[] referredUsers;
    }

    mapping(uint256 => Phase) public phases;
    mapping(address => UserPurchase) public userPurchases;
    mapping(address => bool) public whitelist;
    mapping(address => uint256) public referralRewards;
    mapping(address => ReferralData) public referralData;
    mapping(address => uint256) public userTotalPurchased; // Individual purchase tracking
    mapping(address => uint256) public lastPurchaseBlock; // MEV protection

    uint256 public currentPhase = 1;
    uint256 public totalPhases = 4;
    uint256 public referralPercentage = 5; // 5% referral bonus as per whitepaper
    bool public claimEnabled = false;
    bool public whitelistEnabled = true;
    address public treasuryWallet;

    // Price feeds for supported currencies with Chainlink oracles
    AggregatorV3Interface public ethUsdPriceFeed;
    AggregatorV3Interface public bnbUsdPriceFeed;
    uint256 public ethToUsdPrice = 3000 * 10**6; // Fallback: $3000 per ETH (6 decimals)
    uint256 public bnbToUsdPrice = 300 * 10**6; // Fallback: $300 per BNB (6 decimals)

    // Total funds raised tracking
    uint256 public totalRaisedUSD;
    uint256 public presaleHardCap = 31_000_000 * 10**6; // $31M total hard cap (from whitepaper calculation)
    uint256 public maxPurchasePerUser = 100_000 * 10**6; // $100K lifetime limit per user

    event TokensPurchased(
        address indexed buyer,
        uint256 amount,
        uint256 tokens,
        uint256 phase,
        string paymentMethod
    );
    event PhaseUpdated(uint256 phase, bool isActive);
    event ReferralRewardEarned(address indexed referrer, address indexed buyer, uint256 reward);
    event TokensClaimed(address indexed user, uint256 amount);
    event WhitelistUpdated(address indexed user, bool status);
    event PriceUpdated(string token, uint256 price);
    event HardCapReached(uint256 totalRaised);
    event UserPurchaseLimitUpdated(uint256 newLimit);
    event ChainlinkPriceFeedUpdated(string currency, address priceFeed);

    constructor(
        address _pronovaToken,
        address _usdtToken,
        address _treasuryWallet,
        address _ethUsdPriceFeed,
        address _bnbUsdPriceFeed
    ) Ownable(msg.sender) {
        require(_pronovaToken != address(0), "Invalid pronova token");
        require(_usdtToken != address(0), "Invalid USDT token");
        require(_treasuryWallet != address(0), "Invalid treasury wallet");
        
        pronovaToken = IERC20(_pronovaToken);
        usdtToken = IERC20(_usdtToken);
        treasuryWallet = _treasuryWallet;

        // Set Chainlink price feeds if provided
        if (_ethUsdPriceFeed != address(0)) {
            ethUsdPriceFeed = AggregatorV3Interface(_ethUsdPriceFeed);
        }
        if (_bnbUsdPriceFeed != address(0)) {
            bnbUsdPriceFeed = AggregatorV3Interface(_bnbUsdPriceFeed);
        }

        // Initialize phases according to whitepaper
        _initializePhases();
    }

    /**
     * @dev Initialize presale phases as per whitepaper specifications
     */
    function _initializePhases() internal {
        // Phase 1: $0.05 per token, 100M tokens (Early Bird)
        phases[1] = Phase({
            pricePerToken: 0.05 * 10**6, // $0.05 (6 decimals)
            tokensAllocated: 100_000_000 * 10**18, // 100M tokens
            tokensSold: 0,
            minPurchase: 100 * 10**6, // $100 minimum
            maxPurchase: 50_000 * 10**6, // $50,000 maximum
            startTime: block.timestamp,
            endTime: block.timestamp + 30 days,
            isActive: true
        });

        // Phase 2: $0.07 per token, 75M tokens
        phases[2] = Phase({
            pricePerToken: 0.07 * 10**6, // $0.07
            tokensAllocated: 75_000_000 * 10**18, // 75M tokens
            tokensSold: 0,
            minPurchase: 100 * 10**6,
            maxPurchase: 50_000 * 10**6,
            startTime: block.timestamp + 30 days,
            endTime: block.timestamp + 60 days,
            isActive: false
        });

        // Phase 3: $0.09 per token, 75M tokens
        phases[3] = Phase({
            pricePerToken: 0.09 * 10**6, // $0.09
            tokensAllocated: 75_000_000 * 10**18, // 75M tokens
            tokensSold: 0,
            minPurchase: 100 * 10**6,
            maxPurchase: 50_000 * 10**6,
            startTime: block.timestamp + 60 days,
            endTime: block.timestamp + 90 days,
            isActive: false
        });

        // Phase 4: $0.10 per token, 150M tokens (Final Round)
        phases[4] = Phase({
            pricePerToken: 0.10 * 10**6, // $0.10
            tokensAllocated: 150_000_000 * 10**18, // 150M tokens
            tokensSold: 0,
            minPurchase: 100 * 10**6,
            maxPurchase: 50_000 * 10**6,
            startTime: block.timestamp + 90 days,
            endTime: block.timestamp + 120 days,
            isActive: false
        });
    }

    modifier onlyWhitelisted() {
        if (whitelistEnabled) {
            require(whitelist[msg.sender], "Not whitelisted");
        }
        _;
    }

    modifier antiMEV() {
        require(lastPurchaseBlock[msg.sender] < block.number, "Same block purchase");
        lastPurchaseBlock[msg.sender] = block.number;
        _;
    }

    modifier hardCapNotReached() {
        require(totalRaisedUSD < presaleHardCap, "Hard cap reached");
        _;
    }

    /**
     * @dev Get ETH price from Chainlink with fallback
     */
    function _getETHPriceInUSD() internal view returns (uint256) {
        if (address(ethUsdPriceFeed) != address(0)) {
            try ethUsdPriceFeed.latestRoundData() returns (
                uint80, int256 price, uint256, uint256, uint80
            ) {
                if (price > 0) {
                    return uint256(price) / 100; // Convert from 8 to 6 decimals
                }
            } catch {
                // Fall back to manual price
            }
        }
        return ethToUsdPrice;
    }

    /**
     * @dev Get BNB price from Chainlink with fallback
     */
    function _getBNBPriceInUSD() internal view returns (uint256) {
        if (address(bnbUsdPriceFeed) != address(0)) {
            try bnbUsdPriceFeed.latestRoundData() returns (
                uint80, int256 price, uint256, uint256, uint80
            ) {
                if (price > 0) {
                    return uint256(price) / 100; // Convert from 8 to 6 decimals
                }
            } catch {
                // Fall back to manual price
            }
        }
        return bnbToUsdPrice;
    }

    /**
     * @dev Purchase tokens with ETH (as supported in whitepaper)
     */
    function buyWithETH(address referrer) 
        external 
        payable 
        nonReentrant 
        whenNotPaused 
        onlyWhitelisted 
        hardCapNotReached 
        antiMEV
    {
        require(msg.value > 0, "Invalid amount");
        
        uint256 ethPriceUSD = _getETHPriceInUSD();
        uint256 usdAmount = (msg.value * ethPriceUSD) / 10**18;
        _processPurchase(msg.sender, usdAmount, "ETH", referrer);
        
        // Transfer ETH to treasury
        payable(treasuryWallet).sendValue(msg.value);
    }

    /**
     * @dev Purchase tokens with BNB (as supported in whitepaper)
     */
    function buyWithBNB(address referrer) 
        external 
        payable 
        nonReentrant 
        whenNotPaused 
        onlyWhitelisted 
        hardCapNotReached 
        antiMEV
    {
        require(msg.value > 0, "Invalid amount");
        
        uint256 bnbPriceUSD = _getBNBPriceInUSD();
        uint256 usdAmount = (msg.value * bnbPriceUSD) / 10**18;
        _processPurchase(msg.sender, usdAmount, "BNB", referrer);
        
        // Transfer BNB to treasury
        payable(treasuryWallet).sendValue(msg.value);
    }

    /**
     * @dev Purchase tokens with USDT (as supported in whitepaper)
     */
    function buyWithUSDT(uint256 amount, address referrer) 
        external 
        nonReentrant 
        whenNotPaused 
        onlyWhitelisted 
        hardCapNotReached 
        antiMEV
    {
        require(amount > 0, "Invalid amount");
        
        _processPurchase(msg.sender, amount, "USDT", referrer);
        
        // Transfer USDT to treasury
        usdtToken.safeTransferFrom(msg.sender, treasuryWallet, amount);
    }

    /**
     * @dev Process purchase logic
     */
    function _processPurchase(
        address buyer,
        uint256 usdAmount,
        string memory paymentMethod,
        address referrer
    ) internal {
        Phase storage phase = phases[currentPhase];
        require(phase.isActive, "Phase not active");
        require(block.timestamp >= phase.startTime && block.timestamp <= phase.endTime, "Phase not in time range");
        require(usdAmount >= phase.minPurchase, "Below minimum purchase");
        require(usdAmount <= phase.maxPurchase, "Above maximum purchase");

        // Check individual purchase limit
        require(userTotalPurchased[buyer] + usdAmount <= maxPurchasePerUser, "Exceeds user limit");

        // Check if purchase would exceed hard cap
        require(totalRaisedUSD + usdAmount <= presaleHardCap, "Would exceed hard cap");

        uint256 tokensToReceive = (usdAmount * 10**18) / phase.pricePerToken;
        require(phase.tokensSold + tokensToReceive <= phase.tokensAllocated, "Exceeds phase allocation");

        // Update phase data
        phase.tokensSold += tokensToReceive;

        // Update global tracking
        totalRaisedUSD += usdAmount;
        userTotalPurchased[buyer] += usdAmount;

        // Update user data
        UserPurchase storage userPurchase = userPurchases[buyer];
        userPurchase.totalTokensPurchased += uint128(tokensToReceive);
        userPurchase.totalAmountPaid += uint128(usdAmount);
        userPurchase.lastPurchaseTime = uint64(block.timestamp);

        // Handle referral if valid (5% as per whitepaper)
        if (referrer != address(0) && referrer != buyer && whitelist[referrer]) {
            uint256 referralReward = (tokensToReceive * referralPercentage) / 100;
            referralRewards[referrer] += referralReward;
            
            // Update referral data
            ReferralData storage refData = referralData[referrer];
            refData.totalReferred += usdAmount;
            refData.totalRewards += referralReward;
            refData.referredUsers.push(buyer);
            
            emit ReferralRewardEarned(referrer, buyer, referralReward);
        }

        // Check if hard cap reached
        if (totalRaisedUSD >= presaleHardCap) {
            emit HardCapReached(totalRaisedUSD);
        }

        emit TokensPurchased(buyer, usdAmount, tokensToReceive, currentPhase, paymentMethod);
    }

    /**
     * @dev Claim purchased tokens
     */
    function claimTokens() external nonReentrant {
        require(claimEnabled, "Claiming not enabled");
        UserPurchase storage userPurchase = userPurchases[msg.sender];
        require(userPurchase.totalTokensPurchased > 0, "No tokens to claim");
        require(!userPurchase.hasClaimedTokens, "Already claimed");

        uint256 totalTokens = userPurchase.totalTokensPurchased + referralRewards[msg.sender];
        userPurchase.hasClaimedTokens = true;
        referralRewards[msg.sender] = 0;

        pronovaToken.safeTransfer(msg.sender, totalTokens);
        emit TokensClaimed(msg.sender, totalTokens);
    }

    // Admin functions
    function updatePhase(uint256 phaseId, bool _isActive) external onlyOwner {
        require(phaseId >= 1 && phaseId <= totalPhases, "Invalid phase");
        phases[phaseId].isActive = _isActive;
        
        // Deactivate other phases if activating a new one
        if (_isActive) {
            for (uint256 i = 1; i <= totalPhases; i++) {
                if (i != phaseId) {
                    phases[i].isActive = false;
                }
            }
            currentPhase = phaseId;
        }
        
        emit PhaseUpdated(phaseId, _isActive);
    }

    function updateWhitelist(address[] calldata users, bool status) external onlyOwner {
        for (uint256 i = 0; i < users.length; i++) {
            whitelist[users[i]] = status;
            emit WhitelistUpdated(users[i], status);
        }
    }

    function setWhitelistEnabled(bool _enabled) external onlyOwner {
        whitelistEnabled = _enabled;
    }

    function setClaimEnabled(bool _enabled) external onlyOwner {
        claimEnabled = _enabled;
    }

    function updatePrices(uint256 _ethPrice, uint256 _bnbPrice) external onlyOwner {
        ethToUsdPrice = _ethPrice;
        bnbToUsdPrice = _bnbPrice;
        emit PriceUpdated("ETH", _ethPrice);
        emit PriceUpdated("BNB", _bnbPrice);
    }

    function updateHardCap(uint256 _newHardCap) external onlyOwner {
        require(_newHardCap > totalRaisedUSD, "Hard cap must be greater than raised amount");
        presaleHardCap = _newHardCap;
    }

    function updateUserPurchaseLimit(uint256 _newLimit) external onlyOwner {
        maxPurchasePerUser = _newLimit;
        emit UserPurchaseLimitUpdated(_newLimit);
    }

    function setChainlinkPriceFeed(string calldata currency, address priceFeed) external onlyOwner {
        bytes32 currencyHash = keccak256(abi.encodePacked(currency));
        
        if (currencyHash == keccak256(abi.encodePacked("ETH"))) {
            ethUsdPriceFeed = AggregatorV3Interface(priceFeed);
        } else if (currencyHash == keccak256(abi.encodePacked("BNB"))) {
            bnbUsdPriceFeed = AggregatorV3Interface(priceFeed);
        } else {
            revert("Unsupported currency");
        }
        
        emit ChainlinkPriceFeedUpdated(currency, priceFeed);
    }

    function batchUpdateWhitelist(
        address[] calldata users,
        bool[] calldata statuses
    ) external onlyOwner {
        require(users.length == statuses.length, "Length mismatch");
        for (uint256 i = 0; i < users.length; i++) {
            whitelist[users[i]] = statuses[i];
            emit WhitelistUpdated(users[i], statuses[i]);
        }
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    function emergencyWithdraw() external onlyOwner {
        uint256 balance = pronovaToken.balanceOf(address(this));
        pronovaToken.safeTransfer(owner(), balance);
    }

    // View functions
    function getUserPurchaseInfo(address user) external view returns (
        uint256 totalTokens,
        uint256 totalPaid,
        uint256 referralTokens,
        bool claimed
    ) {
        UserPurchase memory purchase = userPurchases[user];
        return (
            purchase.totalTokensPurchased,
            purchase.totalAmountPaid,
            referralRewards[user],
            purchase.hasClaimedTokens
        );
    }

    function getPhaseInfo(uint256 phaseId) external view returns (
        uint256 pricePerToken,
        uint256 tokensAllocated,
        uint256 tokensSold,
        uint256 tokensRemaining,
        bool isActive,
        uint256 startTime,
        uint256 endTime
    ) {
        Phase memory phase = phases[phaseId];
        return (
            phase.pricePerToken,
            phase.tokensAllocated,
            phase.tokensSold,
            phase.tokensAllocated - phase.tokensSold,
            phase.isActive,
            phase.startTime,
            phase.endTime
        );
    }

    function getPresaleProgress() external view returns (
        uint256 totalRaised,
        uint256 hardCap,
        uint256 progressPercentage,
        uint256 currentPhaseId
    ) {
        uint256 progress = (totalRaisedUSD * 100) / presaleHardCap;
        return (
            totalRaisedUSD,
            presaleHardCap,
            progress,
            currentPhase
        );
    }

    /**
     * @dev Calculate expected listing price ($1.7-$2.5 as per whitepaper)
     */
    function getExpectedListingPrice() external pure returns (uint256 minPrice, uint256 maxPrice) {
        return (1.7 * 10**6, 2.5 * 10**6); // $1.7 - $2.5 (6 decimals)
    }

    function getReferralInfo(address referrer) external view returns (
        uint256 totalReferred,
        uint256 totalRewards,
        uint256 referredCount,
        address[] memory referredUsers
    ) {
        ReferralData memory refData = referralData[referrer];
        return (
            refData.totalReferred,
            refData.totalRewards,
            refData.referredUsers.length,
            refData.referredUsers
        );
    }

    function getCurrentPrices() external view returns (
        uint256 ethPrice,
        uint256 bnbPrice,
        bool ethChainlinkActive,
        bool bnbChainlinkActive
    ) {
        ethPrice = _getETHPriceInUSD();
        bnbPrice = _getBNBPriceInUSD();
        ethChainlinkActive = address(ethUsdPriceFeed) != address(0);
        bnbChainlinkActive = address(bnbUsdPriceFeed) != address(0);
    }

    function getUserRemainingLimit(address user) external view returns (uint256) {
        return maxPurchasePerUser - userTotalPurchased[user];
    }
}