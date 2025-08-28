// Contract ABIs for interaction with smart contracts

export const PRONOVA_TOKEN_ABI = [
  // ERC20 Standard Functions
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function totalSupply() view returns (uint256)",
  "function balanceOf(address owner) view returns (uint256)",
  "function transfer(address to, uint256 amount) returns (bool)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function transferFrom(address from, address to, uint256 amount) returns (bool)",

  // Pronova Token Specific Functions
  "function PRESALE_ALLOCATION() view returns (uint256)",
  "function TEAM_ALLOCATION() view returns (uint256)",
  "function LIQUIDITY_ALLOCATION() view returns (uint256)",
  "function MARKETING_ALLOCATION() view returns (uint256)",
  "function STAKING_ALLOCATION() view returns (uint256)",
  "function LOCKED_PERCENTAGE() view returns (uint256)",
  "function presaleContract() view returns (address)",
  "function teamWallet() view returns (address)",
  "function liquidityWallet() view returns (address)",
  "function marketingWallet() view returns (address)",
  "function stakingContract() view returns (address)",
  "function allocationsDistributed() view returns (bool)",
  "function vestingStartTime() view returns (uint256)",
  "function totalBurned() view returns (uint256)",
  "function teamMembersCount() view returns (uint256)",
  "function lockedBalances(address account) view returns (uint256)",
  "function isTeamMember(address member) view returns (bool)",
  "function getUnlockableAmount(address account) view returns (uint256)",
  "function getAllocationInfo() view returns (uint256, uint256, uint256, uint256, uint256)",

  // Events
  "event Transfer(address indexed from, address indexed to, uint256 value)",
  "event Approval(address indexed owner, address indexed spender, uint256 value)",
  "event AllocationsDistributed()",
  "event VestingStarted(uint256 startTime)",
  "event TokensUnlocked(address indexed account, uint256 amount)",
  "event TeamMemberAdded(address indexed member)",
  "event TeamMemberRemoved(address indexed member)"
];

export const PRONOVA_PRESALE_ABI = [
  // View Functions
  "function pronovaToken() view returns (address)",
  "function usdtToken() view returns (address)",
  "function currentPhase() view returns (uint256)",
  "function totalPhases() view returns (uint256)",
  "function referralPercentage() view returns (uint256)",
  "function claimEnabled() view returns (bool)",
  "function whitelistEnabled() view returns (bool)",
  "function treasuryWallet() view returns (address)",
  "function totalRaisedUSD() view returns (uint256)",
  "function presaleHardCap() view returns (uint256)",
  "function maxPurchasePerUser() view returns (uint256)",

  // Phase Management
  "function phases(uint256 phaseId) view returns (uint256, uint256, uint256, uint256, uint256, uint256, uint256, bool)",
  "function getPhaseInfo(uint256 phaseId) view returns (uint256, uint256, uint256, uint256, bool, uint256, uint256)",

  // User Functions
  "function userPurchases(address user) view returns (uint128, uint128, uint64, bool)",
  "function whitelist(address user) view returns (bool)",
  "function referralRewards(address user) view returns (uint256)",
  "function userTotalPurchased(address user) view returns (uint256)",
  "function getUserPurchaseInfo(address user) view returns (uint256, uint256, uint256, bool)",
  "function getUserRemainingLimit(address user) view returns (uint256)",

  // Purchase Functions
  "function buyWithETH(address referrer) payable",
  "function buyWithBNB(address referrer) payable", 
  "function buyWithUSDT(uint256 amount, address referrer)",
  "function claimTokens()",

  // Price Functions
  "function getCurrentPrices() view returns (uint256, uint256, bool, bool)",
  "function getExpectedListingPrice() view returns (uint256, uint256)",

  // Analytics
  "function getPresaleProgress() view returns (uint256, uint256, uint256, uint256)",
  "function getReferralInfo(address referrer) view returns (uint256, uint256, uint256, address[])",

  // Events
  "event TokensPurchased(address indexed buyer, uint256 amount, uint256 tokens, uint256 phase, string paymentMethod)",
  "event PhaseUpdated(uint256 phase, bool isActive)",
  "event ReferralRewardEarned(address indexed referrer, address indexed buyer, uint256 reward)",
  "event TokensClaimed(address indexed user, uint256 amount)",
  "event WhitelistUpdated(address indexed user, bool status)",
  "event PriceUpdated(string token, uint256 price)",
  "event HardCapReached(uint256 totalRaised)",
  "event UserPurchaseLimitUpdated(uint256 newLimit)"
];

export const PRONOVA_VESTING_ABI = [
  // View Functions
  "function pronovaToken() view returns (address)",
  "function LOCKED_PERCENTAGE() view returns (uint256)",
  "function VESTING_DURATION() view returns (uint256)",
  "function UNLOCK_INTERVAL() view returns (uint256)",
  "function UNLOCK_PERCENTAGE_PER_INTERVAL() view returns (uint256)",

  // Vesting Schedule Management
  "function vestingSchedules(address beneficiary, uint256 index) view returns (uint256, uint256, uint256, uint256, uint256, bool, bool, uint8)",
  "function totalVestedAmount(address beneficiary) view returns (uint256)",
  "function totalReleasedAmount(address beneficiary) view returns (uint256)",
  "function getVestingScheduleCount(address beneficiary) view returns (uint256)",
  "function getVestingSchedule(address beneficiary, uint256 index) view returns (uint256, uint256, uint256, uint256, uint256, bool, bool, uint8)",

  // Release Functions
  "function getReleasableAmount(address beneficiary, uint256 scheduleIndex) view returns (uint256)",
  "function getTotalReleasableAmount(address beneficiary) view returns (uint256)",
  "function release(uint256 scheduleIndex)",
  "function releaseAll()",

  // Analytics Functions
  "function getNextUnlockTime(address beneficiary, uint256 scheduleIndex) view returns (uint256)",
  "function getVestingProgress(address beneficiary, uint256 scheduleIndex) view returns (uint256)",
  "function getBeneficiaryInfo(address beneficiary) view returns (uint256, uint256, uint256, uint256)",
  "function getScheduleDetails(address beneficiary, uint256 scheduleIndex) view returns (uint256, uint256, uint256, uint256, uint256, string)",
  "function getAllSchedules(address beneficiary) view returns (uint256[], uint256[], uint256[], uint8[], bool[])",

  // Events
  "event VestingScheduleCreated(address indexed beneficiary, uint256 amount, uint256 startTime, uint256 cliffDuration, uint256 vestingDuration, uint8 vestingType)",
  "event TokensReleased(address indexed beneficiary, uint256 amount)",
  "event VestingRevoked(address indexed beneficiary, uint256 scheduleIndex)"
];

export const USDT_ABI = [
  // Standard ERC20 functions for USDT
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function totalSupply() view returns (uint256)",
  "function balanceOf(address owner) view returns (uint256)",
  "function transfer(address to, uint256 amount) returns (bool)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function transferFrom(address from, address to, uint256 amount) returns (bool)",

  // Events
  "event Transfer(address indexed from, address indexed to, uint256 value)",
  "event Approval(address indexed owner, address indexed spender, uint256 value)"
];