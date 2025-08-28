// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title PronovaVesting
 * @dev Vesting contract based on whitepaper specifications
 * 45% of tokens locked for 5 years, 2.5% unlock every 6 months
 */
contract PronovaVesting is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    IERC20 public pronovaToken;

    struct VestingSchedule {
        uint256 totalAmount;
        uint256 startTime;
        uint256 cliffDuration;
        uint256 vestingDuration;
        uint256 releasedAmount;
        bool revocable;
        bool revoked;
        uint8 vestingType; // 0: Linear, 1: Whitepaper (45% locked for 5 years)
    }

    // Whitepaper vesting constants
    uint256 public constant LOCKED_PERCENTAGE = 45; // 45% locked
    uint256 public constant VESTING_DURATION = 5 * 365 days; // 5 years
    uint256 public constant UNLOCK_INTERVAL = 180 days; // 6 months
    uint256 public constant UNLOCK_PERCENTAGE_PER_INTERVAL = 250; // 2.5% in basis points (2.5% = 250/10000)
    uint256 public constant BASIS_POINTS = 10000;

    mapping(address => VestingSchedule[]) public vestingSchedules;
    mapping(address => uint256) public totalVestedAmount;
    mapping(address => uint256) public totalReleasedAmount;

    event VestingScheduleCreated(
        address indexed beneficiary,
        uint256 amount,
        uint256 startTime,
        uint256 cliffDuration,
        uint256 vestingDuration,
        uint8 vestingType
    );
    event TokensReleased(address indexed beneficiary, uint256 amount);
    event VestingRevoked(address indexed beneficiary, uint256 scheduleIndex);

    constructor(address _pronovaToken) Ownable(msg.sender) {
        require(_pronovaToken != address(0), "Invalid token address");
        pronovaToken = IERC20(_pronovaToken);
    }

    /**
     * @dev Create standard vesting schedule
     */
    function createVestingSchedule(
        address beneficiary,
        uint256 amount,
        uint256 startTime,
        uint256 cliffDuration,
        uint256 vestingDuration,
        bool revocable
    ) external onlyOwner {
        require(beneficiary != address(0), "Invalid beneficiary");
        require(amount > 0, "Amount must be > 0");
        require(vestingDuration > 0, "Duration must be > 0");
        require(vestingDuration >= cliffDuration, "Cliff > duration");

        vestingSchedules[beneficiary].push(VestingSchedule({
            totalAmount: amount,
            startTime: startTime,
            cliffDuration: cliffDuration,
            vestingDuration: vestingDuration,
            releasedAmount: 0,
            revocable: revocable,
            revoked: false,
            vestingType: 0 // Linear vesting
        }));

        totalVestedAmount[beneficiary] += amount;

        emit VestingScheduleCreated(
            beneficiary,
            amount,
            startTime,
            cliffDuration,
            vestingDuration,
            0
        );
    }

    /**
     * @dev Create whitepaper-based vesting schedule (45% locked, 5-year vesting)
     */
    function createWhitepaperVestingSchedule(
        address beneficiary,
        uint256 amount,
        uint256 startTime,
        bool revocable
    ) external onlyOwner {
        require(beneficiary != address(0), "Invalid beneficiary");
        require(amount > 0, "Amount must be > 0");

        // Calculate locked amount (45% of total)
        uint256 lockedAmount = (amount * LOCKED_PERCENTAGE) / 100;
        uint256 immediateAmount = amount - lockedAmount;

        // Create immediate release schedule for unlocked tokens (55%)
        if (immediateAmount > 0) {
            vestingSchedules[beneficiary].push(VestingSchedule({
                totalAmount: immediateAmount,
                startTime: startTime,
                cliffDuration: 0,
                vestingDuration: 1, // Immediate release
                releasedAmount: 0,
                revocable: false,
                revoked: false,
                vestingType: 0
            }));
        }

        // Create 5-year vesting schedule for locked tokens (45%)
        vestingSchedules[beneficiary].push(VestingSchedule({
            totalAmount: lockedAmount,
            startTime: startTime,
            cliffDuration: 0, // No cliff, but gradual unlock every 6 months
            vestingDuration: VESTING_DURATION, // 5 years
            releasedAmount: 0,
            revocable: revocable,
            revoked: false,
            vestingType: 1 // Whitepaper vesting
        }));

        totalVestedAmount[beneficiary] += amount;

        emit VestingScheduleCreated(
            beneficiary,
            amount,
            startTime,
            0,
            VESTING_DURATION,
            1
        );
    }

    /**
     * @dev Release vested tokens for a specific schedule
     */
    function release(uint256 scheduleIndex) external nonReentrant {
        VestingSchedule storage schedule = vestingSchedules[msg.sender][scheduleIndex];
        require(schedule.totalAmount > 0, "No vesting schedule");
        require(!schedule.revoked, "Schedule revoked");

        uint256 releasableAmount = _computeReleasableAmount(schedule);
        require(releasableAmount > 0, "No tokens to release");

        schedule.releasedAmount += releasableAmount;
        totalReleasedAmount[msg.sender] += releasableAmount;

        pronovaToken.safeTransfer(msg.sender, releasableAmount);
        emit TokensReleased(msg.sender, releasableAmount);
    }

    /**
     * @dev Release all available tokens for the caller
     */
    function releaseAll() external nonReentrant {
        uint256 totalReleasable = 0;
        VestingSchedule[] storage schedules = vestingSchedules[msg.sender];

        for (uint256 i = 0; i < schedules.length; i++) {
            if (!schedules[i].revoked) {
                uint256 releasableAmount = _computeReleasableAmount(schedules[i]);
                if (releasableAmount > 0) {
                    schedules[i].releasedAmount += releasableAmount;
                    totalReleasable += releasableAmount;
                }
            }
        }

        require(totalReleasable > 0, "No tokens to release");
        totalReleasedAmount[msg.sender] += totalReleasable;

        pronovaToken.safeTransfer(msg.sender, totalReleasable);
        emit TokensReleased(msg.sender, totalReleasable);
    }

    /**
     * @dev Revoke a vesting schedule
     */
    function revoke(address beneficiary, uint256 scheduleIndex) external onlyOwner {
        VestingSchedule storage schedule = vestingSchedules[beneficiary][scheduleIndex];
        require(schedule.revocable, "Not revocable");
        require(!schedule.revoked, "Already revoked");

        uint256 releasableAmount = _computeReleasableAmount(schedule);
        if (releasableAmount > 0) {
            schedule.releasedAmount += releasableAmount;
            totalReleasedAmount[beneficiary] += releasableAmount;
            pronovaToken.safeTransfer(beneficiary, releasableAmount);
        }

        uint256 remainingAmount = schedule.totalAmount - schedule.releasedAmount;
        if (remainingAmount > 0) {
            pronovaToken.safeTransfer(owner(), remainingAmount);
        }

        schedule.revoked = true;
        emit VestingRevoked(beneficiary, scheduleIndex);
    }

    /**
     * @dev Compute releasable amount based on vesting type
     */
    function _computeReleasableAmount(VestingSchedule memory schedule) internal view returns (uint256) {
        if (block.timestamp < schedule.startTime) {
            return 0;
        }

        if (schedule.vestingType == 1) {
            // Whitepaper vesting: 2.5% every 6 months
            return _computeWhitepaperReleasableAmount(schedule);
        } else {
            // Standard linear vesting
            return _computeLinearReleasableAmount(schedule);
        }
    }

    /**
     * @dev Compute releasable amount for whitepaper vesting (2.5% every 6 months)
     */
    function _computeWhitepaperReleasableAmount(VestingSchedule memory schedule) internal view returns (uint256) {
        uint256 timeElapsed = block.timestamp - schedule.startTime;
        
        // Calculate how many 6-month intervals have passed
        uint256 intervalsPassed = timeElapsed / UNLOCK_INTERVAL;
        
        // If more than 5 years have passed, release everything
        if (timeElapsed >= VESTING_DURATION) {
            return schedule.totalAmount - schedule.releasedAmount;
        }
        
        // Calculate total unlocked amount (2.5% per interval)
        uint256 totalUnlockedPercentage = intervalsPassed * UNLOCK_PERCENTAGE_PER_INTERVAL;
        
        // Cap at 100%
        if (totalUnlockedPercentage > BASIS_POINTS) {
            totalUnlockedPercentage = BASIS_POINTS;
        }
        
        uint256 totalUnlockedAmount = (schedule.totalAmount * totalUnlockedPercentage) / BASIS_POINTS;
        
        return totalUnlockedAmount - schedule.releasedAmount;
    }

    /**
     * @dev Compute releasable amount for linear vesting
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
     * @dev Get releasable amount for a specific schedule
     */
    function getReleasableAmount(address beneficiary, uint256 scheduleIndex) external view returns (uint256) {
        if (scheduleIndex >= vestingSchedules[beneficiary].length) {
            return 0;
        }
        
        VestingSchedule memory schedule = vestingSchedules[beneficiary][scheduleIndex];
        if (schedule.revoked) {
            return 0;
        }
        return _computeReleasableAmount(schedule);
    }

    /**
     * @dev Get total releasable amount for a beneficiary
     */
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

    /**
     * @dev Get vesting schedule count for a beneficiary
     */
    function getVestingScheduleCount(address beneficiary) external view returns (uint256) {
        return vestingSchedules[beneficiary].length;
    }

    /**
     * @dev Get vesting schedule details
     */
    function getVestingSchedule(address beneficiary, uint256 index) external view returns (
        uint256 totalAmount,
        uint256 startTime,
        uint256 cliffDuration,
        uint256 vestingDuration,
        uint256 releasedAmount,
        bool revocable,
        bool revoked,
        uint8 vestingType
    ) {
        require(index < vestingSchedules[beneficiary].length, "Invalid index");
        VestingSchedule memory schedule = vestingSchedules[beneficiary][index];
        return (
            schedule.totalAmount,
            schedule.startTime,
            schedule.cliffDuration,
            schedule.vestingDuration,
            schedule.releasedAmount,
            schedule.revocable,
            schedule.revoked,
            schedule.vestingType
        );
    }

    /**
     * @dev Get next unlock time for whitepaper vesting
     */
    function getNextUnlockTime(address beneficiary, uint256 scheduleIndex) external view returns (uint256) {
        require(scheduleIndex < vestingSchedules[beneficiary].length, "Invalid index");
        VestingSchedule memory schedule = vestingSchedules[beneficiary][scheduleIndex];
        
        if (schedule.vestingType != 1) {
            return 0; // Not whitepaper vesting
        }
        
        uint256 timeElapsed = block.timestamp - schedule.startTime;
        uint256 intervalsPassed = timeElapsed / UNLOCK_INTERVAL;
        
        return schedule.startTime + ((intervalsPassed + 1) * UNLOCK_INTERVAL);
    }

    /**
     * @dev Get vesting progress percentage (0-100)
     */
    function getVestingProgress(address beneficiary, uint256 scheduleIndex) external view returns (uint256) {
        require(scheduleIndex < vestingSchedules[beneficiary].length, "Invalid index");
        VestingSchedule memory schedule = vestingSchedules[beneficiary][scheduleIndex];
        
        if (schedule.totalAmount == 0) {
            return 0;
        }
        
        return (schedule.releasedAmount * 100) / schedule.totalAmount;
    }

    /**
     * @dev Get comprehensive beneficiary information
     */
    function getBeneficiaryInfo(address beneficiary) external view returns (
        uint256 totalVested,
        uint256 totalReleased,
        uint256 totalReleasable,
        uint256 scheduleCount
    ) {
        return (
            totalVestedAmount[beneficiary],
            totalReleasedAmount[beneficiary],
            this.getTotalReleasableAmount(beneficiary),
            vestingSchedules[beneficiary].length
        );
    }

    /**
     * @dev Get detailed schedule information
     */
    function getScheduleDetails(address beneficiary, uint256 scheduleIndex) external view returns (
        uint256 totalAmount,
        uint256 releasedAmount,
        uint256 releasableAmount,
        uint256 nextUnlockTime,
        uint256 progressPercentage,
        string memory vestingTypeName
    ) {
        require(scheduleIndex < vestingSchedules[beneficiary].length, "Invalid index");
        VestingSchedule memory schedule = vestingSchedules[beneficiary][scheduleIndex];
        
        string memory typeName = schedule.vestingType == 1 ? "Whitepaper" : "Linear";
        
        return (
            schedule.totalAmount,
            schedule.releasedAmount,
            _computeReleasableAmount(schedule),
            this.getNextUnlockTime(beneficiary, scheduleIndex),
            this.getVestingProgress(beneficiary, scheduleIndex),
            typeName
        );
    }

    /**
     * @dev Get all schedules for a beneficiary
     */
    function getAllSchedules(address beneficiary) external view returns (
        uint256[] memory totalAmounts,
        uint256[] memory releasedAmounts,
        uint256[] memory releasableAmounts,
        uint8[] memory vestingTypes,
        bool[] memory revokedStatuses
    ) {
        uint256 count = vestingSchedules[beneficiary].length;
        totalAmounts = new uint256[](count);
        releasedAmounts = new uint256[](count);
        releasableAmounts = new uint256[](count);
        vestingTypes = new uint8[](count);
        revokedStatuses = new bool[](count);
        
        for (uint256 i = 0; i < count; i++) {
            VestingSchedule memory schedule = vestingSchedules[beneficiary][i];
            totalAmounts[i] = schedule.totalAmount;
            releasedAmounts[i] = schedule.releasedAmount;
            releasableAmounts[i] = _computeReleasableAmount(schedule);
            vestingTypes[i] = schedule.vestingType;
            revokedStatuses[i] = schedule.revoked;
        }
    }
}