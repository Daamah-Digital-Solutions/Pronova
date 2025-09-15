// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title PronovaToken (PRN)
 * @dev ERC20 token for Pronova ecosystem based on whitepaper specifications
 */
contract PronovaToken is ERC20, ERC20Burnable, ERC20Pausable, Ownable, ReentrancyGuard {
    
    // Token specifications from whitepaper
    uint256 public constant TOTAL_SUPPLY = 1_000_000_000 * 10**18; // 1 billion PRN tokens
    
    // Allocation percentages as per whitepaper
    uint256 public constant PRESALE_ALLOCATION = 400_000_000 * 10**18; // 40%
    uint256 public constant TEAM_ALLOCATION = 150_000_000 * 10**18; // 15%
    uint256 public constant LIQUIDITY_ALLOCATION = 200_000_000 * 10**18; // 20%
    uint256 public constant MARKETING_ALLOCATION = 100_000_000 * 10**18; // 10%
    uint256 public constant STAKING_ALLOCATION = 150_000_000 * 10**18; // 15%

    // Contract addresses for allocations
    address public presaleContract;
    address public teamWallet;
    address public liquidityWallet;
    address public marketingWallet;
    address public stakingContract;

    // Vesting information as per whitepaper
    uint256 public constant LOCKED_PERCENTAGE = 45; // 45% of tokens locked
    uint256 public constant UNLOCK_INTERVAL = 180 days; // 6 months
    uint256 public constant UNLOCK_PERCENTAGE_PER_INTERVAL = 250; // 2.5% (in basis points)
    uint256 public constant TOTAL_VESTING_DURATION = 5 * 365 days; // 5 years

    // State variables
    bool public allocationsDistributed = false;
    uint256 public vestingStartTime;
    uint256 public totalBurned = 0;
    uint256 public teamMembersCount = 0;
    
    mapping(address => uint256) public lockedBalances;
    mapping(address => uint256) public lastUnlockTime;
    mapping(address => bool) public isTeamMember;

    // Events
    event PresaleContractSet(address indexed presaleContract);
    event TeamWalletSet(address indexed teamWallet);
    event LiquidityWalletSet(address indexed liquidityWallet);
    event MarketingWalletSet(address indexed marketingWallet);
    event StakingContractSet(address indexed stakingContract);
    event AllocationsDistributed();
    event TokensUnlocked(address indexed account, uint256 amount);
    event VestingStarted(uint256 startTime);
    event TeamMemberAdded(address indexed member);
    event TeamMemberRemoved(address indexed member);

    constructor() ERC20("Pronova", "PRN") Ownable(msg.sender) {
        // Mint total supply to contract initially for proper distribution
        _mint(address(this), TOTAL_SUPPLY);
    }

    /**
     * @dev Set presale contract address
     */
    function setPresaleContract(address _presaleContract) external onlyOwner {
        require(_presaleContract != address(0), "Invalid address");
        require(presaleContract == address(0), "Already set");
        presaleContract = _presaleContract;
        emit PresaleContractSet(_presaleContract);
    }

    /**
     * @dev Set team wallet address
     */
    function setTeamWallet(address _teamWallet) external onlyOwner {
        require(_teamWallet != address(0), "Invalid address");
        require(teamWallet == address(0), "Already set");
        teamWallet = _teamWallet;
        emit TeamWalletSet(_teamWallet);
    }

    /**
     * @dev Set liquidity wallet address
     */
    function setLiquidityWallet(address _liquidityWallet) external onlyOwner {
        require(_liquidityWallet != address(0), "Invalid address");
        require(liquidityWallet == address(0), "Already set");
        liquidityWallet = _liquidityWallet;
        emit LiquidityWalletSet(_liquidityWallet);
    }

    /**
     * @dev Set marketing wallet address
     */
    function setMarketingWallet(address _marketingWallet) external onlyOwner {
        require(_marketingWallet != address(0), "Invalid address");
        require(marketingWallet == address(0), "Already set");
        marketingWallet = _marketingWallet;
        emit MarketingWalletSet(_marketingWallet);
    }

    /**
     * @dev Set staking contract address
     */
    function setStakingContract(address _stakingContract) external onlyOwner {
        require(_stakingContract != address(0), "Invalid address");
        require(stakingContract == address(0), "Already set");
        stakingContract = _stakingContract;
        emit StakingContractSet(_stakingContract);
    }

    /**
     * @dev Distribute tokens to all allocation addresses
     */
    function distributeAllocations() external onlyOwner nonReentrant {
        require(!allocationsDistributed, "Already distributed");
        require(presaleContract != address(0), "Presale contract not set");
        require(teamWallet != address(0), "Team wallet not set");
        require(liquidityWallet != address(0), "Liquidity wallet not set");
        require(marketingWallet != address(0), "Marketing wallet not set");
        require(stakingContract != address(0), "Staking contract not set");

        // Transfer allocations
        _transfer(address(this), presaleContract, PRESALE_ALLOCATION);
        _transfer(address(this), teamWallet, TEAM_ALLOCATION);
        _transfer(address(this), liquidityWallet, LIQUIDITY_ALLOCATION);
        _transfer(address(this), marketingWallet, MARKETING_ALLOCATION);
        _transfer(address(this), stakingContract, STAKING_ALLOCATION);

        allocationsDistributed = true;
        emit AllocationsDistributed();
    }

    /**
     * @dev Start vesting period as per whitepaper (45% locked for 5 years)
     */
    function startVesting() external onlyOwner {
        require(vestingStartTime == 0, "Vesting already started");
        require(allocationsDistributed, "Allocations not distributed");
        
        vestingStartTime = block.timestamp;
        
        // Lock 45% of team allocation (as per whitepaper)
        uint256 teamLockedAmount = (TEAM_ALLOCATION * LOCKED_PERCENTAGE) / 100;
        lockedBalances[teamWallet] = teamLockedAmount;
        lastUnlockTime[teamWallet] = vestingStartTime;
        
        emit VestingStarted(vestingStartTime);
    }

    /**
     * @dev Unlock vested tokens (2.5% every 6 months as per whitepaper)
     */
    function unlockVestedTokens() external nonReentrant {
        require(vestingStartTime > 0, "Vesting not started");
        require(lockedBalances[msg.sender] > 0, "No locked tokens");
        
        uint256 timeElapsed = block.timestamp - lastUnlockTime[msg.sender];
        require(timeElapsed >= UNLOCK_INTERVAL, "Unlock interval not reached");
        
        // Calculate number of intervals passed
        uint256 intervalsPassed = timeElapsed / UNLOCK_INTERVAL;
        
        // Calculate unlock amount (2.5% per interval of original locked amount)
        uint256 originalLockedAmount = (TEAM_ALLOCATION * LOCKED_PERCENTAGE) / 100;
        uint256 unlockAmount = (originalLockedAmount * UNLOCK_PERCENTAGE_PER_INTERVAL * intervalsPassed) / 10000;
        
        // Ensure we don't unlock more than what's locked
        if (unlockAmount > lockedBalances[msg.sender]) {
            unlockAmount = lockedBalances[msg.sender];
        }
        
        // Update locked balance
        lockedBalances[msg.sender] -= unlockAmount;
        lastUnlockTime[msg.sender] = block.timestamp;
        
        // Transfer unlocked tokens
        _transfer(address(this), msg.sender, unlockAmount);
        
        emit TokensUnlocked(msg.sender, unlockAmount);
    }

    /**
     * @dev Get unlockable amount for an address
     */
    function getUnlockableAmount(address account) external view returns (uint256) {
        if (vestingStartTime == 0 || lockedBalances[account] == 0) {
            return 0;
        }
        
        uint256 timeElapsed = block.timestamp - lastUnlockTime[account];
        if (timeElapsed < UNLOCK_INTERVAL) {
            return 0;
        }
        
        uint256 intervalsPassed = timeElapsed / UNLOCK_INTERVAL;
        uint256 originalLockedAmount = (TEAM_ALLOCATION * LOCKED_PERCENTAGE) / 100;
        uint256 unlockAmount = (originalLockedAmount * UNLOCK_PERCENTAGE_PER_INTERVAL * intervalsPassed) / 10000;
        
        if (unlockAmount > lockedBalances[account]) {
            unlockAmount = lockedBalances[account];
        }
        
        return unlockAmount;
    }

    /**
     * @dev Pause token transfers
     */
    function pause() public onlyOwner {
        _pause();
    }

    /**
     * @dev Unpause token transfers
     */
    function unpause() public onlyOwner {
        _unpause();
    }

    /**
     * @dev Emergency withdrawal function
     */
    function emergencyWithdraw() external onlyOwner {
        uint256 balance = balanceOf(address(this));
        if (balance > 0) {
            _transfer(address(this), owner(), balance);
        }
    }

    /**
     * @dev Get allocation information
     */
    function getAllocationInfo() external pure returns (
        uint256 presaleAlloc,
        uint256 teamAlloc,
        uint256 liquidityAlloc,
        uint256 marketingAlloc,
        uint256 stakingAlloc
    ) {
        return (
            PRESALE_ALLOCATION,
            TEAM_ALLOCATION,
            LIQUIDITY_ALLOCATION,
            MARKETING_ALLOCATION,
            STAKING_ALLOCATION
        );
    }

    /**
     * @dev Add team member for tracking
     */
    function addTeamMember(address member) external onlyOwner {
        require(member != address(0), "Invalid address");
        require(!isTeamMember[member], "Already team member");
        isTeamMember[member] = true;
        teamMembersCount++;
        emit TeamMemberAdded(member);
    }

    /**
     * @dev Remove team member
     */
    function removeTeamMember(address member) external onlyOwner {
        require(isTeamMember[member], "Not a team member");
        isTeamMember[member] = false;
        teamMembersCount--;
        emit TeamMemberRemoved(member);
    }

    /**
     * @dev Override _update to track burns
     */
    function _update(address from, address to, uint256 value)
        internal
        override(ERC20, ERC20Pausable)
    {
        if (to == address(0)) {
            totalBurned += value;
        }
        super._update(from, to, value);
    }
}