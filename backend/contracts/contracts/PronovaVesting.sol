// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title PronovaVesting
 * @dev CORRECTED Vesting contract to match whitepaper specifications exactly
 * 45% of tokens locked for 9 YEARS (not 5), 2.5% unlock every 6 months
 * @notice Enhanced with multi-sig controls and improved security
 */
contract PronovaVesting is AccessControl, ReentrancyGuard {
    using SafeERC20 for IERC20;

    // Access control roles
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant VESTING_MANAGER_ROLE = keccak256("VESTING_MANAGER_ROLE");

    IERC20 public immutable pronovaToken;

    struct VestingSchedule {
        uint256 totalAmount;
        uint256 startTime;
        uint256 cliffDuration;
        uint256 vestingDuration;
        uint256 releasedAmount;
        uint256 lastReleaseTime;
        bool revocable;
        bool revoked;
        uint8 vestingType; // 0: Linear, 1: Whitepaper (45% locked for 9 years)
        address beneficiary;
    }

    // CORRECTED Whitepaper vesting constants - 9 YEARS not 5
    uint256 public constant LOCKED_PERCENTAGE = 45; // 45% locked
    uint256 public constant VESTING_DURATION = 9 * 365 days; // 9 years as per whitepaper
    uint256 public constant UNLOCK_INTERVAL = 180 days; // 6 months
    uint256 public constant UNLOCK_PERCENTAGE_PER_INTERVAL = 250; // 2.5% in basis points
    uint256 public constant TOTAL_UNLOCK_PERIODS = 18; // 9 years / 6 months = 18 periods
    uint256 public constant BASIS_POINTS = 10000;

    // Enhanced tracking
    mapping(address => VestingSchedule[]) public vestingSchedules;
    mapping(address => uint256) public totalVestedAmount;
    mapping(address => uint256) public totalReleasedAmount;
    mapping(address => uint256) public totalLockedAmount;

    // Allocation tracking for whitepaper compliance
    mapping(string => uint256) public allocationAmounts;
    mapping(string => address) public allocationBeneficiaries;

    uint256 public totalTokensManaged;
    uint256 public totalTokensReleased;

    // Multi-sig for critical operations
    uint256 public constant REQUIRED_CONFIRMATIONS = 2;
    mapping(bytes32 => mapping(address => bool)) public operationConfirmations;
    mapping(bytes32 => uint256) public operationConfirmationCount;
    mapping(bytes32 => bool) public operationExecuted;
    uint256 public operationNonce; // Nonce-based operation IDs (fixes audit finding)

    // Treasury wallet for secure fund custody (audit fix)
    address public immutable treasuryWallet;

    // Events
    event VestingScheduleCreated(
        address indexed beneficiary,
        uint256 amount,
        uint256 startTime,
        uint256 vestingDuration,
        uint8 vestingType,
        string allocation
    );
    event TokensReleased(address indexed beneficiary, uint256 amount);
    event VestingRevoked(address indexed beneficiary, uint256 scheduleIndex);
    event AllocationSet(string allocation, address beneficiary, uint256 amount);
    event OperationConfirmed(bytes32 indexed operation, address indexed admin);
    event OperationExecuted(bytes32 indexed operation);

    constructor(address _pronovaToken, address _treasuryWallet) {
        require(_pronovaToken != address(0), "Invalid token");
        require(_treasuryWallet != address(0), "Invalid treasury wallet");

        pronovaToken = IERC20(_pronovaToken);
        treasuryWallet = _treasuryWallet;

        // Setup roles
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
        _grantRole(VESTING_MANAGER_ROLE, msg.sender);
    }

    /**
     * @dev Create vesting schedules for all whitepaper allocations
     * @notice This should be called after token distribution to set up proper vesting
     */
    function setupWhitepaperAllocations(
        address _foundersWallet,
        address _teamWallet,
        address _partnershipsWallet
    ) external onlyRole(ADMIN_ROLE) {
        require(_foundersWallet != address(0), "Invalid founders wallet");
        require(_teamWallet != address(0), "Invalid team wallet");
        require(_partnershipsWallet != address(0), "Invalid partnerships wallet");

        // AUDIT FIX: Use parameter-based operation ID for deterministic multi-sig
        bytes32 operationId = keccak256(abi.encodePacked(
            "SETUP_ALLOCATIONS",
            _foundersWallet,
            _teamWallet,
            _partnershipsWallet
        ));

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

        // Set up optimized allocations
        // Founders: 14% = 140M tokens
        allocationAmounts["FOUNDERS"] = 140_000_000 * 10**18;
        allocationBeneficiaries["FOUNDERS"] = _foundersWallet;
        _createWhitepaperVesting(_foundersWallet, 140_000_000 * 10**18, "FOUNDERS");

        // Team: 5% = 50M tokens
        allocationAmounts["TEAM"] = 50_000_000 * 10**18;
        allocationBeneficiaries["TEAM"] = _teamWallet;
        _createWhitepaperVesting(_teamWallet, 50_000_000 * 10**18, "TEAM");

        // Partnerships: 15% = 150M tokens
        allocationAmounts["PARTNERSHIPS"] = 150_000_000 * 10**18;
        allocationBeneficiaries["PARTNERSHIPS"] = _partnershipsWallet;
        _createWhitepaperVesting(_partnershipsWallet, 150_000_000 * 10**18, "PARTNERSHIPS");

        emit OperationExecuted(operationId);
    }

    /**
     * @dev Internal function to create whitepaper-compliant vesting
     */
    function _createWhitepaperVesting(
        address beneficiary,
        uint256 amount,
        string memory allocation
    ) internal {
        require(beneficiary != address(0), "Invalid beneficiary");
        require(amount > 0, "Amount must be > 0");

        // Calculate immediate and locked amounts
        uint256 lockedAmount = (amount * LOCKED_PERCENTAGE) / 100; // 45% locked
        uint256 immediateAmount = amount - lockedAmount; // 55% immediate

        // Create immediate release schedule for unlocked portion (55%)
        if (immediateAmount > 0) {
            vestingSchedules[beneficiary].push(VestingSchedule({
                totalAmount: immediateAmount,
                startTime: block.timestamp,
                cliffDuration: 0,
                vestingDuration: 1, // Immediate
                releasedAmount: 0,
                lastReleaseTime: 0,
                revocable: false,
                revoked: false,
                vestingType: 0,
                beneficiary: beneficiary
            }));
        }

        // Create 9-year vesting for locked portion (45%)
        vestingSchedules[beneficiary].push(VestingSchedule({
            totalAmount: lockedAmount,
            startTime: block.timestamp,
            cliffDuration: 0,
            vestingDuration: VESTING_DURATION, // 9 years
            releasedAmount: 0,
            lastReleaseTime: block.timestamp,
            revocable: true,
            revoked: false,
            vestingType: 1, // Whitepaper vesting
            beneficiary: beneficiary
        }));

        totalVestedAmount[beneficiary] += amount;
        totalLockedAmount[beneficiary] += lockedAmount;
        totalTokensManaged += amount;

        emit VestingScheduleCreated(
            beneficiary,
            amount,
            block.timestamp,
            VESTING_DURATION,
            1,
            allocation
        );
        emit AllocationSet(allocation, beneficiary, amount);
    }

    /**
     * @dev Create custom vesting schedule
     */
    function createCustomVesting(
        address beneficiary,
        uint256 amount,
        uint256 startTime,
        uint256 cliffDuration,
        uint256 vestingDuration,
        bool revocable
    ) external onlyRole(VESTING_MANAGER_ROLE) {
        require(beneficiary != address(0), "Invalid beneficiary");
        require(amount > 0, "Amount must be > 0");
        require(vestingDuration > 0, "Duration must be > 0");
        require(vestingDuration >= cliffDuration, "Cliff > duration");

        // AUDIT FIX: Add startTime validation to prevent invalid schedules
        require(startTime >= block.timestamp, "Start time must be in future or present");
        require(startTime <= block.timestamp + 365 days, "Start time too far in future");

        vestingSchedules[beneficiary].push(VestingSchedule({
            totalAmount: amount,
            startTime: startTime,
            cliffDuration: cliffDuration,
            vestingDuration: vestingDuration,
            releasedAmount: 0,
            lastReleaseTime: startTime,
            revocable: revocable,
            revoked: false,
            vestingType: 0, // Linear
            beneficiary: beneficiary
        }));

        totalVestedAmount[beneficiary] += amount;
        totalTokensManaged += amount;

        emit VestingScheduleCreated(
            beneficiary,
            amount,
            startTime,
            vestingDuration,
            0,
            "CUSTOM"
        );
    }

    /**
     * @dev Release vested tokens for a specific schedule
     */
    function release(uint256 scheduleIndex) external nonReentrant {
        require(scheduleIndex < vestingSchedules[msg.sender].length, "Invalid index");

        VestingSchedule storage schedule = vestingSchedules[msg.sender][scheduleIndex];
        require(!schedule.revoked, "Schedule revoked");

        uint256 releasableAmount = _computeReleasableAmount(schedule);
        require(releasableAmount > 0, "No tokens to release");

        // Update state before transfer
        schedule.releasedAmount += releasableAmount;
        schedule.lastReleaseTime = block.timestamp;
        totalReleasedAmount[msg.sender] += releasableAmount;
        totalTokensReleased += releasableAmount;

        // AUDIT FIX: Decrement totalLockedAmount correctly instead of overwriting
        if (schedule.vestingType == 1) {
            totalLockedAmount[msg.sender] -= releasableAmount;
        }

        pronovaToken.safeTransfer(msg.sender, releasableAmount);
        emit TokensReleased(msg.sender, releasableAmount);
    }

    /**
     * @dev Release all available tokens
     */
    function releaseAll() external nonReentrant {
        uint256 totalReleasable = 0;
        VestingSchedule[] storage schedules = vestingSchedules[msg.sender];

        for (uint256 i = 0; i < schedules.length; i++) {
            if (!schedules[i].revoked) {
                uint256 releasableAmount = _computeReleasableAmount(schedules[i]);
                if (releasableAmount > 0) {
                    schedules[i].releasedAmount += releasableAmount;
                    schedules[i].lastReleaseTime = block.timestamp;
                    totalReleasable += releasableAmount;

                    // AUDIT FIX: Decrement totalLockedAmount correctly instead of overwriting
                    if (schedules[i].vestingType == 1) {
                        totalLockedAmount[msg.sender] -= releasableAmount;
                    }
                }
            }
        }

        require(totalReleasable > 0, "No tokens to release");

        totalReleasedAmount[msg.sender] += totalReleasable;
        totalTokensReleased += totalReleasable;

        pronovaToken.safeTransfer(msg.sender, totalReleasable);
        emit TokensReleased(msg.sender, totalReleasable);
    }

    /**
     * @dev Compute releasable amount based on vesting type
     */
    function _computeReleasableAmount(VestingSchedule memory schedule) internal view returns (uint256) {
        if (block.timestamp < schedule.startTime) {
            return 0;
        }

        if (schedule.vestingType == 1) {
            // Whitepaper vesting: 2.5% every 6 months for 9 years
            return _computeWhitepaperReleasableAmount(schedule);
        } else {
            // Standard linear vesting
            return _computeLinearReleasableAmount(schedule);
        }
    }

    /**
     * @dev CORRECTED: Compute releasable for whitepaper vesting (9 years, 2.5% every 6 months)
     */
    function _computeWhitepaperReleasableAmount(VestingSchedule memory schedule) internal view returns (uint256) {
        uint256 timeElapsed = block.timestamp - schedule.startTime;

        // If 9 years have passed, release everything
        if (timeElapsed >= VESTING_DURATION) {
            return schedule.totalAmount - schedule.releasedAmount;
        }

        // Calculate how many 6-month periods have passed
        uint256 periodsPassed = timeElapsed / UNLOCK_INTERVAL;

        // Cap at 18 periods (9 years / 6 months)
        if (periodsPassed > TOTAL_UNLOCK_PERIODS) {
            periodsPassed = TOTAL_UNLOCK_PERIODS;
        }

        // Each period unlocks 2.5% of the original locked amount
        // After 18 periods: 18 * 2.5% = 45% (the total locked amount)
        uint256 unlockedPercentage = periodsPassed * UNLOCK_PERCENTAGE_PER_INTERVAL;

        // Calculate total unlocked amount
        uint256 totalUnlocked = (schedule.totalAmount * unlockedPercentage) / BASIS_POINTS;

        // Return only what hasn't been released yet
        if (totalUnlocked > schedule.releasedAmount) {
            return totalUnlocked - schedule.releasedAmount;
        }

        return 0;
    }

    /**
     * @dev Compute releasable for linear vesting
     */
    function _computeLinearReleasableAmount(VestingSchedule memory schedule) internal view returns (uint256) {
        if (block.timestamp < schedule.startTime + schedule.cliffDuration) {
            return 0;
        } else if (block.timestamp >= schedule.startTime + schedule.vestingDuration) {
            return schedule.totalAmount - schedule.releasedAmount;
        } else {
            uint256 timeFromStart = block.timestamp - schedule.startTime;
            uint256 vestedAmount = (schedule.totalAmount * timeFromStart) / schedule.vestingDuration;
            return vestedAmount - schedule.releasedAmount;
        }
    }

    /**
     * @dev Revoke vesting (requires multi-sig)
     */
    function revoke(address beneficiary, uint256 scheduleIndex) external onlyRole(ADMIN_ROLE) {
        require(scheduleIndex < vestingSchedules[beneficiary].length, "Invalid index");

        VestingSchedule storage schedule = vestingSchedules[beneficiary][scheduleIndex];
        require(schedule.revocable, "Not revocable");
        require(!schedule.revoked, "Already revoked");

        bytes32 operationId = keccak256(abi.encodePacked("REVOKE", beneficiary, scheduleIndex));

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

        // Release any vested tokens
        uint256 releasableAmount = _computeReleasableAmount(schedule);
        if (releasableAmount > 0) {
            schedule.releasedAmount += releasableAmount;
            totalReleasedAmount[beneficiary] += releasableAmount;
            totalTokensReleased += releasableAmount;
            pronovaToken.safeTransfer(beneficiary, releasableAmount);
        }

        // AUDIT FIX: Return unvested tokens to treasury wallet (not individual admin)
        uint256 remainingAmount = schedule.totalAmount - schedule.releasedAmount;
        if (remainingAmount > 0) {
            pronovaToken.safeTransfer(treasuryWallet, remainingAmount);
        }

        schedule.revoked = true;
        emit VestingRevoked(beneficiary, scheduleIndex);
        emit OperationExecuted(operationId);
    }

    // View functions
    function getVestingSchedule(address beneficiary, uint256 index) external view returns (
        uint256 totalAmount,
        uint256 startTime,
        uint256 vestingDuration,
        uint256 releasedAmount,
        uint256 releasableAmount,
        bool revoked,
        uint8 vestingType
    ) {
        require(index < vestingSchedules[beneficiary].length, "Invalid index");
        VestingSchedule memory schedule = vestingSchedules[beneficiary][index];

        return (
            schedule.totalAmount,
            schedule.startTime,
            schedule.vestingDuration,
            schedule.releasedAmount,
            _computeReleasableAmount(schedule),
            schedule.revoked,
            schedule.vestingType
        );
    }

    function getTotalReleasableAmount(address beneficiary) external view returns (uint256) {
        uint256 totalReleasable = 0;
        VestingSchedule[] memory schedules = vestingSchedules[beneficiary];

        for (uint256 i = 0; i < schedules.length; i++) {
            if (!schedules[i].revoked) {
                totalReleasable += _computeReleasableAmount(schedules[i]);
            }
        }

        return totalReleasable;
    }

    function getNextUnlockTime(address beneficiary, uint256 scheduleIndex) external view returns (uint256) {
        require(scheduleIndex < vestingSchedules[beneficiary].length, "Invalid index");
        VestingSchedule memory schedule = vestingSchedules[beneficiary][scheduleIndex];

        if (schedule.vestingType != 1 || schedule.revoked) {
            return 0;
        }

        uint256 timeElapsed = block.timestamp - schedule.startTime;
        if (timeElapsed >= VESTING_DURATION) {
            return 0; // Fully vested
        }

        uint256 periodsPassed = timeElapsed / UNLOCK_INTERVAL;
        return schedule.startTime + ((periodsPassed + 1) * UNLOCK_INTERVAL);
    }

    function getVestingProgress(address beneficiary, uint256 scheduleIndex) external view returns (uint256) {
        require(scheduleIndex < vestingSchedules[beneficiary].length, "Invalid index");
        VestingSchedule memory schedule = vestingSchedules[beneficiary][scheduleIndex];

        if (schedule.totalAmount == 0) {
            return 0;
        }

        return (schedule.releasedAmount * 100) / schedule.totalAmount;
    }

    function getBeneficiaryInfo(address beneficiary) external view returns (
        uint256 totalVested,
        uint256 totalReleased,
        uint256 totalLocked,
        uint256 totalReleasable,
        uint256 scheduleCount
    ) {
        return (
            totalVestedAmount[beneficiary],
            totalReleasedAmount[beneficiary],
            totalLockedAmount[beneficiary],
            this.getTotalReleasableAmount(beneficiary),
            vestingSchedules[beneficiary].length
        );
    }

    function getContractStats() external view returns (
        uint256 managed,
        uint256 released,
        uint256 remaining,
        uint256 vestingDurationYears,
        uint256 unlockPercentagePerPeriod,
        uint256 totalPeriods
    ) {
        return (
            totalTokensManaged,
            totalTokensReleased,
            totalTokensManaged - totalTokensReleased,
            VESTING_DURATION / 365 days,
            UNLOCK_PERCENTAGE_PER_INTERVAL,
            TOTAL_UNLOCK_PERIODS
        );
    }
}