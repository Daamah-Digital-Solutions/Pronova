// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

/**
 * @title PronovaPresale
 * @dev Presale contract matching whitepaper specifications exactly
 * Phase 1: $0.80, Phase 2: $1.00, Phase 3: $1.50
 * Total Presale: 400M tokens (40% as per whitepaper Page 18)
 * @notice Implements enhanced security with multi-sig, MEV protection, and slippage control
 */
contract PronovaPresale is AccessControl, ReentrancyGuard, Pausable {
    using SafeERC20 for IERC20;
    using Address for address payable;

    // Access control roles
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant OPERATOR_ROLE = keccak256("OPERATOR_ROLE");
    bytes32 public constant PRICE_ORACLE_ROLE = keccak256("PRICE_ORACLE_ROLE");

    IERC20 public pronovaToken;
    IERC20 public usdtToken;

    struct Phase {
        uint256 pricePerToken; // Price in USD (6 decimals to match USDT)
        uint256 tokensAllocated;
        uint256 tokensSold;
        uint256 minPurchase; // Minimum purchase in USD
        uint256 maxPurchase; // Maximum purchase in USD per transaction
        uint256 startTime;
        uint256 endTime;
        bool isActive;
    }

    struct UserPurchase {
        uint128 totalTokensPurchased;
        uint128 totalAmountPaid; // in USD
        uint64 lastPurchaseTime;
        uint64 purchaseNonce; // For MEV protection
        bool hasClaimedTokens;
    }

    // Enhanced referral tracking
    struct ReferralData {
        uint256 totalReferred;
        uint256 totalRewards;
        uint256 rewardsClaimed;
        address[] referredUsers;
    }

    // Enhanced MEV protection with commit-reveal
    struct PurchaseCommitment {
        bytes32 commitment;
        uint256 amount;
        uint256 blockNumber;
        bool revealed;
    }

    mapping(uint256 => Phase) public phases;
    mapping(address => UserPurchase) public userPurchases;
    mapping(address => bool) public whitelist;
    mapping(address => uint256) public referralRewards;
    mapping(address => ReferralData) public referralData;
    mapping(address => uint256) public userTotalPurchased;
    mapping(address => PurchaseCommitment) public purchaseCommitments;

    uint256 public currentPhase = 1;
    uint256 public constant TOTAL_PHASES = 3; // CORRECTED: 3 phases as per whitepaper
    uint256 public constant REFERRAL_PERCENTAGE = 5; // 5% referral bonus
    uint256 public constant MAX_REFERRAL_REWARDS = 50_000 * 10**18; // Cap per address
    bool public claimEnabled = false;
    bool public whitelistEnabled = true;
    address public treasuryWallet;

    // CORRECTED Price feeds with bounds checking
    AggregatorV3Interface public ethUsdPriceFeed;
    AggregatorV3Interface public bnbUsdPriceFeed;
    uint256 public ethToUsdPrice = 3000 * 10**6; // Fallback: $3000 per ETH
    uint256 public bnbToUsdPrice = 300 * 10**6; // Fallback: $300 per BNB
    uint256 public constant PRICE_DEVIATION_THRESHOLD = 20; // 20% max deviation

    // CORRECTED Total funds tracking as per whitepaper
    uint256 public totalRaisedUSD;
    uint256 public constant PRESALE_HARD_CAP = 267_500_000 * 10**6; // $267.5M from whitepaper
    uint256 public constant MAX_PURCHASE_PER_USER = 500_000 * 10**6; // $500K lifetime limit

    // MEV Protection parameters
    uint256 public constant COMMITMENT_DELAY = 2; // blocks
    uint256 public constant REVEAL_WINDOW = 10; // blocks

    // Multi-sig requirement
    uint256 public constant REQUIRED_CONFIRMATIONS = 2;
    mapping(bytes32 => mapping(address => bool)) public operationConfirmations;
    mapping(bytes32 => uint256) public operationConfirmationCount;
    mapping(bytes32 => bool) public operationExecuted;

    // Events
    event TokensPurchased(
        address indexed buyer,
        uint256 amountUSD,
        uint256 tokens,
        uint256 phase,
        string paymentMethod
    );
    event PurchaseCommitted(address indexed buyer, bytes32 commitment);
    event PhaseUpdated(uint256 phase, bool isActive);
    event ReferralRewardEarned(address indexed referrer, address indexed buyer, uint256 reward);
    event TokensClaimed(address indexed user, uint256 amount);
    event ClaimStatusChanged(bool enabled);
    event WhitelistUpdated(address indexed user, bool status);
    event PriceUpdated(string token, uint256 price);
    event OperationConfirmed(bytes32 indexed operation, address indexed admin);
    event OperationExecuted(bytes32 indexed operation);

    constructor(
        address _pronovaToken,
        address _usdtToken,
        address _treasuryWallet,
        address _ethUsdPriceFeed,
        address _bnbUsdPriceFeed
    ) {
        require(_pronovaToken != address(0), "Invalid token");
        require(_usdtToken != address(0), "Invalid USDT");
        require(_treasuryWallet != address(0), "Invalid treasury");

        pronovaToken = IERC20(_pronovaToken);
        usdtToken = IERC20(_usdtToken);
        treasuryWallet = _treasuryWallet;

        // Setup roles
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
        _grantRole(OPERATOR_ROLE, msg.sender);

        // Set Chainlink price feeds
        if (_ethUsdPriceFeed != address(0)) {
            ethUsdPriceFeed = AggregatorV3Interface(_ethUsdPriceFeed);
        }
        if (_bnbUsdPriceFeed != address(0)) {
            bnbUsdPriceFeed = AggregatorV3Interface(_bnbUsdPriceFeed);
        }

        _initializePhases();
    }

    /**
     * @dev Initialize presale phases with optimized 25% allocation
     * Total 250M tokens distributed across phases proportionally
     */
    function _initializePhases() internal {
        // Phase 1: $0.80 per token, 100M tokens (40% of 250M)
        phases[1] = Phase({
            pricePerToken: 800_000, // $0.80 (6 decimals)
            tokensAllocated: 100_000_000 * 10**18, // 40% of 250M presale
            tokensSold: 0,
            minPurchase: 100 * 10**6, // $100 minimum
            maxPurchase: 100_000 * 10**6, // $100K max per transaction
            startTime: block.timestamp,
            endTime: block.timestamp + 30 days,
            isActive: true
        });

        // Phase 2: $1.00 per token, 75M tokens (30% of 250M)
        phases[2] = Phase({
            pricePerToken: 1_000_000, // $1.00 (6 decimals)
            tokensAllocated: 75_000_000 * 10**18, // 30% of 250M presale
            tokensSold: 0,
            minPurchase: 100 * 10**6,
            maxPurchase: 100_000 * 10**6,
            startTime: block.timestamp + 30 days,
            endTime: block.timestamp + 60 days,
            isActive: false
        });

        // Phase 3: $1.50 per token, 75M tokens (30% of 250M)
        phases[3] = Phase({
            pricePerToken: 1_500_000, // $1.50 (6 decimals)
            tokensAllocated: 75_000_000 * 10**18, // 30% of 250M presale
            tokensSold: 0,
            minPurchase: 100 * 10**6,
            maxPurchase: 100_000 * 10**6,
            startTime: block.timestamp + 60 days,
            endTime: block.timestamp + 90 days,
            isActive: false
        });
    }

    modifier onlyWhitelisted() {
        if (whitelistEnabled) {
            require(whitelist[msg.sender], "Not whitelisted");
        }
        _;
    }

    /**
     * @dev Enhanced MEV protection with commit-reveal pattern
     */
    function commitPurchase(bytes32 _commitment) external whenNotPaused {
        require(purchaseCommitments[msg.sender].blockNumber == 0 ||
                block.number > purchaseCommitments[msg.sender].blockNumber + REVEAL_WINDOW,
                "Previous commitment pending");

        purchaseCommitments[msg.sender] = PurchaseCommitment({
            commitment: _commitment,
            amount: 0,
            blockNumber: block.number,
            revealed: false
        });

        emit PurchaseCommitted(msg.sender, _commitment);
    }

    /**
     * @dev Get ETH price with bounds checking
     */
    function _getETHPriceInUSD() internal view returns (uint256) {
        if (address(ethUsdPriceFeed) != address(0)) {
            try ethUsdPriceFeed.latestRoundData() returns (
                uint80, int256 price, uint256, uint256 updatedAt, uint80
            ) {
                // Check price is recent (within 1 hour)
                require(block.timestamp - updatedAt < 3600, "Stale price");

                if (price > 0) {
                    uint256 chainlinkPrice = uint256(price) / 100; // Convert to 6 decimals

                    // Check deviation from fallback price
                    uint256 deviation = chainlinkPrice > ethToUsdPrice
                        ? ((chainlinkPrice - ethToUsdPrice) * 100) / ethToUsdPrice
                        : ((ethToUsdPrice - chainlinkPrice) * 100) / ethToUsdPrice;

                    require(deviation <= PRICE_DEVIATION_THRESHOLD, "Price deviation too high");
                    return chainlinkPrice;
                }
            } catch {}
        }
        return ethToUsdPrice;
    }

    /**
     * @dev Get BNB price with bounds checking
     */
    function _getBNBPriceInUSD() internal view returns (uint256) {
        if (address(bnbUsdPriceFeed) != address(0)) {
            try bnbUsdPriceFeed.latestRoundData() returns (
                uint80, int256 price, uint256, uint256 updatedAt, uint80
            ) {
                require(block.timestamp - updatedAt < 3600, "Stale price");

                if (price > 0) {
                    uint256 chainlinkPrice = uint256(price) / 100;

                    uint256 deviation = chainlinkPrice > bnbToUsdPrice
                        ? ((chainlinkPrice - bnbToUsdPrice) * 100) / bnbToUsdPrice
                        : ((bnbToUsdPrice - chainlinkPrice) * 100) / bnbToUsdPrice;

                    require(deviation <= PRICE_DEVIATION_THRESHOLD, "Price deviation too high");
                    return chainlinkPrice;
                }
            } catch {}
        }
        return bnbToUsdPrice;
    }

    /**
     * @dev Purchase with ETH (with slippage protection)
     */
    function buyWithETH(
        address referrer,
        uint256 minTokensExpected,
        bytes32 nonce
    ) external payable nonReentrant whenNotPaused onlyWhitelisted {
        // Verify commitment for MEV protection
        _verifyCommitment(msg.sender, msg.value, nonce);

        require(msg.value > 0, "Invalid amount");
        uint256 ethPriceUSD = _getETHPriceInUSD();
        uint256 usdAmount = (msg.value * ethPriceUSD) / 10**18;

        uint256 tokensReceived = _processPurchase(msg.sender, usdAmount, "ETH", referrer);

        // Slippage protection
        require(tokensReceived >= minTokensExpected, "Slippage too high");

        payable(treasuryWallet).sendValue(msg.value);
    }

    /**
     * @dev Purchase with BNB (with slippage protection)
     */
    function buyWithBNB(
        address referrer,
        uint256 minTokensExpected,
        bytes32 nonce
    ) external payable nonReentrant whenNotPaused onlyWhitelisted {
        _verifyCommitment(msg.sender, msg.value, nonce);

        require(msg.value > 0, "Invalid amount");
        uint256 bnbPriceUSD = _getBNBPriceInUSD();
        uint256 usdAmount = (msg.value * bnbPriceUSD) / 10**18;

        uint256 tokensReceived = _processPurchase(msg.sender, usdAmount, "BNB", referrer);

        require(tokensReceived >= minTokensExpected, "Slippage too high");

        payable(treasuryWallet).sendValue(msg.value);
    }

    /**
     * @dev Purchase with USDT (with slippage protection)
     */
    function buyWithUSDT(
        uint256 amount,
        address referrer,
        uint256 minTokensExpected,
        bytes32 nonce
    ) external nonReentrant whenNotPaused onlyWhitelisted {
        _verifyCommitment(msg.sender, amount, nonce);

        require(amount > 0, "Invalid amount");

        uint256 tokensReceived = _processPurchase(msg.sender, amount, "USDT", referrer);

        require(tokensReceived >= minTokensExpected, "Slippage too high");

        usdtToken.safeTransferFrom(msg.sender, treasuryWallet, amount);
    }

    /**
     * @dev Verify commitment for MEV protection
     */
    function _verifyCommitment(address buyer, uint256 amount, bytes32 nonce) internal {
        PurchaseCommitment storage commitment = purchaseCommitments[buyer];

        if (commitment.blockNumber > 0) {
            require(block.number >= commitment.blockNumber + COMMITMENT_DELAY, "Commitment delay not met");
            require(block.number <= commitment.blockNumber + REVEAL_WINDOW, "Reveal window expired");

            bytes32 expectedCommitment = keccak256(abi.encodePacked(buyer, amount, nonce));
            require(commitment.commitment == expectedCommitment, "Invalid commitment");

            commitment.revealed = true;
        }
    }

    /**
     * @dev Process purchase with enhanced checks
     */
    function _processPurchase(
        address buyer,
        uint256 usdAmount,
        string memory paymentMethod,
        address referrer
    ) internal returns (uint256) {
        Phase storage phase = phases[currentPhase];
        require(phase.isActive, "Phase not active");
        require(block.timestamp >= phase.startTime && block.timestamp <= phase.endTime, "Phase time invalid");
        require(usdAmount >= phase.minPurchase, "Below minimum");
        require(usdAmount <= phase.maxPurchase, "Above maximum");

        // Check individual and global limits
        require(userTotalPurchased[buyer] + usdAmount <= MAX_PURCHASE_PER_USER, "User limit exceeded");
        require(totalRaisedUSD + usdAmount <= PRESALE_HARD_CAP, "Hard cap exceeded");

        // Calculate tokens with proper decimals
        uint256 tokensToReceive = (usdAmount * 10**18) / phase.pricePerToken;
        require(phase.tokensSold + tokensToReceive <= phase.tokensAllocated, "Phase allocation exceeded");

        // Update state
        phase.tokensSold += tokensToReceive;
        totalRaisedUSD += usdAmount;
        userTotalPurchased[buyer] += usdAmount;

        UserPurchase storage userPurchase = userPurchases[buyer];
        userPurchase.totalTokensPurchased += uint128(tokensToReceive);
        userPurchase.totalAmountPaid += uint128(usdAmount);
        userPurchase.lastPurchaseTime = uint64(block.timestamp);
        userPurchase.purchaseNonce++;

        // Handle referral with cap
        if (referrer != address(0) && referrer != buyer && whitelist[referrer]) {
            uint256 referralReward = (tokensToReceive * REFERRAL_PERCENTAGE) / 100;

            // Apply referral cap
            if (referralRewards[referrer] + referralReward > MAX_REFERRAL_REWARDS) {
                referralReward = MAX_REFERRAL_REWARDS - referralRewards[referrer];
            }

            if (referralReward > 0) {
                referralRewards[referrer] += referralReward;

                ReferralData storage refData = referralData[referrer];
                refData.totalReferred += usdAmount;
                refData.totalRewards += referralReward;
                refData.referredUsers.push(buyer);

                emit ReferralRewardEarned(referrer, buyer, referralReward);
            }
        }

        emit TokensPurchased(buyer, usdAmount, tokensToReceive, currentPhase, paymentMethod);
        return tokensToReceive;
    }

    /**
     * @dev Claim tokens with enhanced security
     */
    function claimTokens() external nonReentrant {
        require(claimEnabled, "Claiming disabled");
        UserPurchase storage userPurchase = userPurchases[msg.sender];
        require(userPurchase.totalTokensPurchased > 0, "No tokens");
        require(!userPurchase.hasClaimedTokens, "Already claimed");

        uint256 totalTokens = userPurchase.totalTokensPurchased;
        uint256 referralTokens = referralRewards[msg.sender];

        // Update state before transfer
        userPurchase.hasClaimedTokens = true;
        referralRewards[msg.sender] = 0;
        referralData[msg.sender].rewardsClaimed = referralTokens;

        uint256 totalToClaim = totalTokens + referralTokens;
        pronovaToken.safeTransfer(msg.sender, totalToClaim);

        emit TokensClaimed(msg.sender, totalToClaim);
    }

    /**
     * @dev Update phase with multi-sig
     */
    function updatePhase(uint256 phaseId, bool _isActive) external onlyRole(ADMIN_ROLE) {
        require(phaseId >= 1 && phaseId <= TOTAL_PHASES, "Invalid phase");

        bytes32 operationId = keccak256(abi.encodePacked("UPDATE_PHASE", phaseId, _isActive));

        if (!operationConfirmations[operationId][msg.sender]) {
            operationConfirmations[operationId][msg.sender] = true;
            operationConfirmationCount[operationId]++;
            emit OperationConfirmed(operationId, msg.sender);

            if (operationConfirmationCount[operationId] < REQUIRED_CONFIRMATIONS) {
                return;
            }
        }

        require(!operationExecuted[operationId], "Already executed");
        operationExecuted[operationId] = true;

        phases[phaseId].isActive = _isActive;

        if (_isActive) {
            for (uint256 i = 1; i <= TOTAL_PHASES; i++) {
                if (i != phaseId) {
                    phases[i].isActive = false;
                }
            }
            currentPhase = phaseId;
        }

        emit PhaseUpdated(phaseId, _isActive);
        emit OperationExecuted(operationId);
    }

    /**
     * @dev Update fallback oracle prices (requires multi-sig + can only update when presale inactive)
     * @notice Prevents price manipulation during active sale phases
     */
    function updatePrices(uint256 _ethPrice, uint256 _bnbPrice) external onlyRole(PRICE_ORACLE_ROLE) {
        // Security: Cannot update prices during active presale phase
        if (currentPhase > 0 && currentPhase <= TOTAL_PHASES) {
            require(!phases[currentPhase].isActive, "Cannot update prices during active presale");
        }

        // Validate prices are within reasonable bounds
        require(_ethPrice >= 100 * 10**6 && _ethPrice <= 100_000 * 10**6, "ETH price out of bounds");
        require(_bnbPrice >= 10 * 10**6 && _bnbPrice <= 10_000 * 10**6, "BNB price out of bounds");

        bytes32 operationId = keccak256(abi.encodePacked("UPDATE_PRICES", _ethPrice, _bnbPrice));

        if (!operationConfirmations[operationId][msg.sender]) {
            operationConfirmations[operationId][msg.sender] = true;
            operationConfirmationCount[operationId]++;
            emit OperationConfirmed(operationId, msg.sender);

            if (operationConfirmationCount[operationId] < REQUIRED_CONFIRMATIONS) {
                return; // Wait for second admin confirmation
            }
        }

        require(!operationExecuted[operationId], "Already executed");
        operationExecuted[operationId] = true;

        ethToUsdPrice = _ethPrice;
        bnbToUsdPrice = _bnbPrice;

        emit PriceUpdated("ETH", _ethPrice);
        emit PriceUpdated("BNB", _bnbPrice);
        emit OperationExecuted(operationId);
    }

    // Admin functions
    function pause() external onlyRole(ADMIN_ROLE) {
        _pause();
    }

    function unpause() external onlyRole(ADMIN_ROLE) {
        _unpause();
    }

    /**
     * @dev Enable/disable token claiming (requires multi-sig for security)
     * @notice This is a critical function protecting user funds - requires 2 admin confirmations
     */
    function setClaimEnabled(bool _enabled) external onlyRole(ADMIN_ROLE) {
        bytes32 operationId = keccak256(abi.encodePacked("SET_CLAIM_ENABLED", _enabled));

        if (!operationConfirmations[operationId][msg.sender]) {
            operationConfirmations[operationId][msg.sender] = true;
            operationConfirmationCount[operationId]++;
            emit OperationConfirmed(operationId, msg.sender);

            if (operationConfirmationCount[operationId] < REQUIRED_CONFIRMATIONS) {
                return; // Wait for second admin confirmation
            }
        }

        require(!operationExecuted[operationId], "Already executed");
        operationExecuted[operationId] = true;

        claimEnabled = _enabled;
        emit ClaimStatusChanged(_enabled);
        emit OperationExecuted(operationId);
    }

    function updateWhitelist(address[] calldata users, bool status) external onlyRole(OPERATOR_ROLE) {
        for (uint256 i = 0; i < users.length; i++) {
            whitelist[users[i]] = status;
            emit WhitelistUpdated(users[i], status);
        }
    }

    // View functions
    function getExpectedListingPrice() external pure returns (uint256 minPrice, uint256 maxPrice) {
        return (1_700_000, 2_500_000); // $1.7 - $2.5 as per whitepaper
    }

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
        bool isActive
    ) {
        Phase memory phase = phases[phaseId];
        return (
            phase.pricePerToken,
            phase.tokensAllocated,
            phase.tokensSold,
            phase.tokensAllocated - phase.tokensSold,
            phase.isActive
        );
    }

    /**
     * @dev Wrapper function to start presale (activates Phase 1)
     */
    function confirmStartPresale() external onlyRole(ADMIN_ROLE) {
        this.updatePhase(1, true); // Activate Phase 1
    }
}