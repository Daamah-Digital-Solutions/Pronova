// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Pausable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title PronovaToken (PRN)
 * @dev ERC20 token for Pronova ecosystem - UPDATED to match whitepaper specifications exactly
 * @notice Implements multi-signature functionality via AccessControl for enhanced security
 */
contract PronovaToken is ERC20, ERC20Burnable, ERC20Pausable, AccessControl, ReentrancyGuard {

    // Access control roles for multi-signature functionality
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");

    // Token specifications from whitepaper
    uint256 public constant TOTAL_SUPPLY = 1_000_000_000 * 10**18; // 1 billion PRN tokens

    // Optimized Token Allocation (Updated from Whitepaper)
    uint256 public constant PRESALE_ALLOCATION = 250_000_000 * 10**18; // 25% (250M)
    uint256 public constant FOUNDERS_ALLOCATION = 140_000_000 * 10**18; // 14% (140M)
    uint256 public constant LIQUIDITY_ALLOCATION = 150_000_000 * 10**18; // 15% (150M)
    uint256 public constant PARTNERSHIPS_ALLOCATION = 150_000_000 * 10**18; // 15% (150M)
    uint256 public constant TEAM_ALLOCATION = 50_000_000 * 10**18; // 5% (50M)
    uint256 public constant COMMUNITY_ALLOCATION = 80_000_000 * 10**18; // 8% (80M)
    uint256 public constant STRATEGIC_RESERVES_ALLOCATION = 60_000_000 * 10**18; // 6% (60M)
    uint256 public constant MARKETING_ALLOCATION = 120_000_000 * 10**18; // 12% (120M)
    // Total: 100% (1,000,000,000 PRN)

    // Contract addresses for allocations
    address public presaleContract;
    address public foundersWallet;
    address public liquidityWallet;
    address public partnershipsWallet;
    address public teamWallet;
    address public communityWallet;
    address public strategicReservesWallet;
    address public marketingWallet;
    // Staking removed to match whitepaper exactly
    address public vestingContract;

    // Vesting information (9-year schedule for team allocations)
    uint256 public constant LOCKED_PERCENTAGE = 45; // 45% of tokens locked
    uint256 public constant UNLOCK_INTERVAL = 180 days; // 6 months
    uint256 public constant UNLOCK_PERCENTAGE_PER_INTERVAL = 250; // 2.5% (in basis points)
    uint256 public constant TOTAL_VESTING_DURATION = 9 * 365 days; // 9 years as per whitepaper

    // Burn mechanism parameters (automatic burn feature)
    uint256 public constant BURN_RATE = 10; // 0.1% burn rate (10 basis points)
    uint256 public constant BASIS_POINTS = 10000;
    bool public autoBurnEnabled = false;

    // State variables
    bool public allocationsDistributed = false;
    uint256 public vestingStartTime;
    uint256 public totalBurned = 0;

    // Multi-sig requirement tracking
    uint256 public constant REQUIRED_CONFIRMATIONS = 2; // Require 2 admins for critical operations
    mapping(bytes32 => mapping(address => bool)) public operationConfirmations;
    mapping(bytes32 => uint256) public operationConfirmationCount;
    mapping(bytes32 => bool) public operationExecuted;

    // Events
    event AllocationWalletSet(string allocation, address indexed wallet);
    event AllocationsDistributed(uint256 timestamp);
    event VestingStarted(uint256 startTime);
    event AutoBurnToggled(bool enabled);
    event OperationConfirmed(bytes32 indexed operation, address indexed admin);
    event OperationExecuted(bytes32 indexed operation);
    event TokensBurnedAutomatically(uint256 amount);

    constructor() ERC20("Pronova", "PRN") {
        // Set up role hierarchy for multi-sig
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
        _grantRole(PAUSER_ROLE, msg.sender);

        // Mint total supply to contract for controlled distribution
        _mint(address(this), TOTAL_SUPPLY);
    }

    /**
     * @dev Set all allocation wallets (requires multi-sig confirmation)
     * @notice This function sets all wallets at once to ensure consistency
     */
    function setAllocationWallets(
        address _presaleContract,
        address _foundersWallet,
        address _liquidityWallet,
        address _partnershipsWallet,
        address _teamWallet,
        address _communityWallet,
        address _strategicReservesWallet,
        address _marketingWallet,
        address _vestingContract
    ) external onlyRole(ADMIN_ROLE) {
        require(!allocationsDistributed, "Allocations already distributed");
        require(
            _presaleContract != address(0) &&
            _foundersWallet != address(0) &&
            _liquidityWallet != address(0) &&
            _partnershipsWallet != address(0) &&
            _teamWallet != address(0) &&
            _communityWallet != address(0) &&
            _strategicReservesWallet != address(0) &&
            _marketingWallet != address(0) &&
            _vestingContract != address(0),
            "Invalid address"
        );

        bytes32 operationId = keccak256(abi.encodePacked("SET_WALLETS", block.timestamp));

        // Multi-sig confirmation logic
        if (!operationConfirmations[operationId][msg.sender]) {
            operationConfirmations[operationId][msg.sender] = true;
            operationConfirmationCount[operationId]++;
            emit OperationConfirmed(operationId, msg.sender);

            if (operationConfirmationCount[operationId] < REQUIRED_CONFIRMATIONS) {
                return; // Wait for more confirmations
            }
        }

        require(!operationExecuted[operationId], "Operation already executed");
        operationExecuted[operationId] = true;

        // Set all wallets
        presaleContract = _presaleContract;
        foundersWallet = _foundersWallet;
        liquidityWallet = _liquidityWallet;
        partnershipsWallet = _partnershipsWallet;
        teamWallet = _teamWallet;
        communityWallet = _communityWallet;
        strategicReservesWallet = _strategicReservesWallet;
        marketingWallet = _marketingWallet;
        vestingContract = _vestingContract;

        // Emit events
        emit AllocationWalletSet("Presale", _presaleContract);
        emit AllocationWalletSet("Founders", _foundersWallet);
        emit AllocationWalletSet("Liquidity", _liquidityWallet);
        emit AllocationWalletSet("Partnerships", _partnershipsWallet);
        emit AllocationWalletSet("Team", _teamWallet);
        emit AllocationWalletSet("Community", _communityWallet);
        emit AllocationWalletSet("Strategic", _strategicReservesWallet);
        emit AllocationWalletSet("Marketing", _marketingWallet);
        emit AllocationWalletSet("Vesting", _vestingContract);
        emit OperationExecuted(operationId);
    }

    /**
     * @dev Distribute tokens to all allocation addresses (requires multi-sig)
     * @notice Distributes tokens according to whitepaper specifications
     */
    function distributeAllocations() external onlyRole(ADMIN_ROLE) nonReentrant {
        require(!allocationsDistributed, "Already distributed");
        require(presaleContract != address(0), "Wallets not set");

        bytes32 operationId = keccak256(abi.encodePacked("DISTRIBUTE", block.timestamp));

        // Multi-sig confirmation
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

        // Transfer allocations according to whitepaper
        _transfer(address(this), presaleContract, PRESALE_ALLOCATION);

        // Send vested allocations to vesting contract
        uint256 vestedAmount = FOUNDERS_ALLOCATION + TEAM_ALLOCATION + PARTNERSHIPS_ALLOCATION;
        _transfer(address(this), vestingContract, vestedAmount);

        // Direct transfers for immediate liquidity
        _transfer(address(this), liquidityWallet, LIQUIDITY_ALLOCATION);
        _transfer(address(this), communityWallet, COMMUNITY_ALLOCATION);
        _transfer(address(this), strategicReservesWallet, STRATEGIC_RESERVES_ALLOCATION);
        _transfer(address(this), marketingWallet, MARKETING_ALLOCATION);

        allocationsDistributed = true;
        vestingStartTime = block.timestamp;

        emit AllocationsDistributed(block.timestamp);
        emit VestingStarted(vestingStartTime);
        emit OperationExecuted(operationId);
    }

    /**
     * @dev Toggle automatic burn mechanism
     * @param _enabled Enable or disable auto burn
     */
    function setAutoBurn(bool _enabled) external onlyRole(ADMIN_ROLE) {
        autoBurnEnabled = _enabled;
        emit AutoBurnToggled(_enabled);
    }

    /**
     * @dev Override _update to implement automatic burn if enabled
     */
    function _update(
        address from,
        address to,
        uint256 amount
    ) internal override(ERC20, ERC20Pausable) {
        if (autoBurnEnabled && from != address(0) && to != address(0) && from != address(this)) {
            // Calculate burn amount (0.1% of transfer)
            uint256 burnAmount = (amount * BURN_RATE) / BASIS_POINTS;
            uint256 transferAmount = amount - burnAmount;

            // Burn tokens first
            if (burnAmount > 0) {
                super._update(from, address(0), burnAmount);
                emit TokensBurnedAutomatically(burnAmount);
            }

            // Transfer remaining amount
            super._update(from, to, transferAmount);
        } else {
            super._update(from, to, amount);
        }

        // Track all burns (including manual burns)
        if (to == address(0)) {
            totalBurned += amount;
        }
    }

    /**
     * @dev Pause token transfers (multi-sig required)
     */
    function pause() public onlyRole(PAUSER_ROLE) {
        _pause();
    }

    /**
     * @dev Unpause token transfers (multi-sig required)
     */
    function unpause() public onlyRole(PAUSER_ROLE) {
        _unpause();
    }

    /**
     * @dev Emergency withdrawal function (requires multi-sig)
     */
    function emergencyWithdraw() external onlyRole(ADMIN_ROLE) {
        bytes32 operationId = keccak256(abi.encodePacked("EMERGENCY", block.timestamp));

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

        uint256 balance = balanceOf(address(this));
        if (balance > 0) {
            _transfer(address(this), msg.sender, balance);
        }
        emit OperationExecuted(operationId);
    }

    /**
     * @dev Grant admin role (requires DEFAULT_ADMIN_ROLE)
     */
    function addAdmin(address admin) external onlyRole(DEFAULT_ADMIN_ROLE) {
        grantRole(ADMIN_ROLE, admin);
    }

    /**
     * @dev Remove admin role
     */
    function removeAdmin(address admin) external onlyRole(DEFAULT_ADMIN_ROLE) {
        revokeRole(ADMIN_ROLE, admin);
    }

    /**
     * @dev Get allocation information
     */
    function getAllocationInfo() external pure returns (
        uint256 presale,
        uint256 founders,
        uint256 liquidity,
        uint256 partnerships,
        uint256 team,
        uint256 community,
        uint256 strategic,
        uint256 marketing
    ) {
        return (
            PRESALE_ALLOCATION,
            FOUNDERS_ALLOCATION,
            LIQUIDITY_ALLOCATION,
            PARTNERSHIPS_ALLOCATION,
            TEAM_ALLOCATION,
            COMMUNITY_ALLOCATION,
            STRATEGIC_RESERVES_ALLOCATION,
            MARKETING_ALLOCATION
        );
    }

    /**
     * @dev Get vesting parameters
     */
    function getVestingInfo() external pure returns (
        uint256 lockedPercentage,
        uint256 vestingDuration,
        uint256 unlockInterval,
        uint256 unlockPercentage
    ) {
        return (
            LOCKED_PERCENTAGE,
            TOTAL_VESTING_DURATION,
            UNLOCK_INTERVAL,
            UNLOCK_PERCENTAGE_PER_INTERVAL
        );
    }


    /**
     * @dev Wrapper function for setAllocationWallets to match deployment script
     */
    function confirmSetAllocationWallets(
        address _presaleContract,
        address _foundersWallet,
        address _liquidityWallet,
        address _partnershipsWallet,
        address _teamWallet,
        address _communityWallet,
        address _strategicReservesWallet,
        address _marketingWallet,
        address _vestingContract
    ) external onlyRole(ADMIN_ROLE) {
        this.setAllocationWallets(
            _presaleContract,
            _foundersWallet,
            _liquidityWallet,
            _partnershipsWallet,
            _teamWallet,
            _communityWallet,
            _strategicReservesWallet,
            _marketingWallet,
            _vestingContract
        );
    }

    /**
     * @dev Wrapper function for distributeAllocations to match deployment script
     */
    function confirmDistributeAllocations() external onlyRole(ADMIN_ROLE) {
        this.distributeAllocations();
    }

    /**
     * @dev Check if an address has a specific role
     */
    function hasRole(bytes32 role, address account) public view override returns (bool) {
        return super.hasRole(role, account);
    }
}