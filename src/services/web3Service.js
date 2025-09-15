import { ethers } from 'ethers';
import axios from 'axios';
import { CONTRACTS, getContractAddress, getNetworkInfo } from '../config/contracts';
import { PRONOVA_PRESALE_ABI, PRONOVA_TOKEN_ABI, USDT_ABI } from '../config/abis';

class Web3Service {
  constructor() {
    this.provider = null;
    this.signer = null;
    this.contracts = {};
    this.chainId = null;
  }

  // Initialize the service with provider and signer
  initialize(provider, signer, chainId) {
    this.provider = provider;
    this.signer = signer;
    this.chainId = chainId;
    this.initializeContracts();
  }

  // Initialize contract instances
  initializeContracts() {
    if (!this.provider || !this.chainId) return;

    const pronovaTokenAddress = getContractAddress(this.chainId, 'PRONOVA_TOKEN');
    const pronovaPresaleAddress = getContractAddress(this.chainId, 'PRONOVA_PRESALE');
    const usdtAddress = getContractAddress(this.chainId, 'USDT');

    if (pronovaTokenAddress && pronovaTokenAddress !== '0x...') {
      this.contracts.pronovaToken = new ethers.Contract(
        pronovaTokenAddress,
        PRONOVA_TOKEN_ABI,
        this.provider
      );
    }

    if (pronovaPresaleAddress && pronovaPresaleAddress !== '0x...') {
      this.contracts.pronovaPresale = new ethers.Contract(
        pronovaPresaleAddress,
        PRONOVA_PRESALE_ABI,
        this.provider
      );
    }

    if (usdtAddress && usdtAddress !== '0x...') {
      this.contracts.usdt = new ethers.Contract(
        usdtAddress,
        USDT_ABI,
        this.provider
      );
    }
  }

  // Get contract with signer for transactions
  getContractWithSigner(contractName) {
    if (!this.contracts[contractName] || !this.signer) return null;
    return this.contracts[contractName].connect(this.signer);
  }

  // ==================== PRESALE FUNCTIONS ====================

  // Get current presale phase information
  async getCurrentPhaseInfo() {
    try {
      if (!this.contracts.pronovaPresale) throw new Error('Presale contract not initialized');
      
      const currentPhase = await this.contracts.pronovaPresale.currentPhase();
      const phaseInfo = await this.contracts.pronovaPresale.getPhaseInfo(currentPhase);
      
      return {
        phaseNumber: currentPhase.toNumber(),
        pricePerToken: ethers.utils.formatUnits(phaseInfo.pricePerToken, 6),
        tokensAllocated: ethers.utils.formatEther(phaseInfo.tokensAllocated),
        tokensSold: ethers.utils.formatEther(phaseInfo.tokensSold),
        tokensRemaining: ethers.utils.formatEther(phaseInfo.tokensRemaining),
        isActive: phaseInfo.isActive,
        startTime: new Date(phaseInfo.startTime.toNumber() * 1000),
        endTime: new Date(phaseInfo.endTime.toNumber() * 1000)
      };
    } catch (error) {
      console.error('Error getting current phase info:', error);
      throw error;
    }
  }

  // Get presale progress and statistics
  async getPresaleProgress() {
    try {
      if (!this.contracts.pronovaPresale) throw new Error('Presale contract not initialized');
      
      const [totalRaised, hardCap, progress, currentPhase] = await this.contracts.pronovaPresale.getPresaleProgress();
      
      return {
        totalRaised: ethers.utils.formatUnits(totalRaised, 6),
        hardCap: ethers.utils.formatUnits(hardCap, 6),
        progress: progress.toNumber(),
        currentPhase: currentPhase.toNumber(),
        progressPercentage: (progress.toNumber() / 100).toFixed(2)
      };
    } catch (error) {
      console.error('Error getting presale progress:', error);
      throw error;
    }
  }

  // Get user's purchase information
  async getUserPurchaseInfo(userAddress) {
    try {
      if (!this.contracts.pronovaPresale) throw new Error('Presale contract not initialized');
      if (!userAddress) throw new Error('User address required');
      
      const [totalTokens, totalPaid, referralTokens, claimed] = await this.contracts.pronovaPresale.getUserPurchaseInfo(userAddress);
      const remainingLimit = await this.contracts.pronovaPresale.getUserRemainingLimit(userAddress);
      
      return {
        totalTokens: ethers.utils.formatEther(totalTokens),
        totalPaid: ethers.utils.formatUnits(totalPaid, 6),
        referralTokens: ethers.utils.formatEther(referralTokens),
        claimed,
        remainingLimit: ethers.utils.formatUnits(remainingLimit, 6)
      };
    } catch (error) {
      console.error('Error getting user purchase info:', error);
      throw error;
    }
  }

  // Calculate tokens for USD amount
  async calculateTokens(usdAmount) {
    try {
      const phaseInfo = await this.getCurrentPhaseInfo();
      const tokens = parseFloat(usdAmount) / parseFloat(phaseInfo.pricePerToken);
      return tokens.toFixed(2);
    } catch (error) {
      console.error('Error calculating tokens:', error);
      throw error;
    }
  }

  // ==================== PURCHASE FUNCTIONS ====================

  // Purchase with ETH
  async buyWithETH(ethAmount, referrer = ethers.constants.AddressZero) {
    try {
      const contract = this.getContractWithSigner('pronovaPresale');
      if (!contract) throw new Error('Contract not available');
      
      const value = ethers.utils.parseEther(ethAmount.toString());
      const gasEstimate = await contract.estimateGas.buyWithETH(referrer, { value });
      
      const tx = await contract.buyWithETH(referrer, {
        value,
        gasLimit: gasEstimate.mul(120).div(100) // Add 20% buffer
      });
      
      return {
        hash: tx.hash,
        wait: () => tx.wait()
      };
    } catch (error) {
      console.error('Error buying with ETH:', error);
      throw error;
    }
  }

  // Purchase with BNB
  async buyWithBNB(bnbAmount, referrer = ethers.constants.AddressZero) {
    try {
      const contract = this.getContractWithSigner('pronovaPresale');
      if (!contract) throw new Error('Contract not available');
      
      const value = ethers.utils.parseEther(bnbAmount.toString());
      const gasEstimate = await contract.estimateGas.buyWithBNB(referrer, { value });
      
      const tx = await contract.buyWithBNB(referrer, {
        value,
        gasLimit: gasEstimate.mul(120).div(100)
      });
      
      return {
        hash: tx.hash,
        wait: () => tx.wait()
      };
    } catch (error) {
      console.error('Error buying with BNB:', error);
      throw error;
    }
  }

  // Purchase with USDT
  async buyWithUSDT(usdtAmount, referrer = ethers.constants.AddressZero) {
    try {
      const presaleContract = this.getContractWithSigner('pronovaPresale');
      const usdtContract = this.getContractWithSigner('usdt');
      
      if (!presaleContract || !usdtContract) throw new Error('Contracts not available');
      
      const amount = ethers.utils.parseUnits(usdtAmount.toString(), 6);
      const presaleAddress = getContractAddress(this.chainId, 'PRONOVA_PRESALE');
      
      // Check allowance
      const currentAllowance = await usdtContract.allowance(await this.signer.getAddress(), presaleAddress);
      
      // Approve if needed
      if (currentAllowance.lt(amount)) {
        const approveTx = await usdtContract.approve(presaleAddress, amount);
        await approveTx.wait();
      }
      
      // Execute purchase
      const gasEstimate = await presaleContract.estimateGas.buyWithUSDT(amount, referrer);
      const tx = await presaleContract.buyWithUSDT(amount, referrer, {
        gasLimit: gasEstimate.mul(120).div(100)
      });
      
      return {
        hash: tx.hash,
        wait: () => tx.wait()
      };
    } catch (error) {
      console.error('Error buying with USDT:', error);
      throw error;
    }
  }

  // Check USDT allowance
  async checkUSDTAllowance(userAddress) {
    try {
      if (!this.contracts.usdt) throw new Error('USDT contract not initialized');
      
      const presaleAddress = getContractAddress(this.chainId, 'PRONOVA_PRESALE');
      const allowance = await this.contracts.usdt.allowance(userAddress, presaleAddress);
      
      return ethers.utils.formatUnits(allowance, 6);
    } catch (error) {
      console.error('Error checking USDT allowance:', error);
      throw error;
    }
  }

  // Approve USDT spending
  async approveUSDT(amount) {
    try {
      const contract = this.getContractWithSigner('usdt');
      if (!contract) throw new Error('USDT contract not available');
      
      const presaleAddress = getContractAddress(this.chainId, 'PRONOVA_PRESALE');
      const value = ethers.utils.parseUnits(amount.toString(), 6);
      
      const tx = await contract.approve(presaleAddress, value);
      return {
        hash: tx.hash,
        wait: () => tx.wait()
      };
    } catch (error) {
      console.error('Error approving USDT:', error);
      throw error;
    }
  }

  // Claim tokens
  async claimTokens() {
    try {
      const contract = this.getContractWithSigner('pronovaPresale');
      if (!contract) throw new Error('Contract not available');
      
      const gasEstimate = await contract.estimateGas.claimTokens();
      const tx = await contract.claimTokens({
        gasLimit: gasEstimate.mul(120).div(100)
      });
      
      return {
        hash: tx.hash,
        wait: () => tx.wait()
      };
    } catch (error) {
      console.error('Error claiming tokens:', error);
      throw error;
    }
  }

  // ==================== TOKEN FUNCTIONS ====================

  // Get token balance
  async getTokenBalance(userAddress) {
    try {
      if (!this.contracts.pronovaToken) return '0';
      
      const balance = await this.contracts.pronovaToken.balanceOf(userAddress);
      return ethers.utils.formatEther(balance);
    } catch (error) {
      console.error('Error getting token balance:', error);
      return '0';
    }
  }

  // Get USDT balance
  async getUSDTBalance(userAddress) {
    try {
      if (!this.contracts.usdt) return '0';
      
      const balance = await this.contracts.usdt.balanceOf(userAddress);
      return ethers.utils.formatUnits(balance, 6);
    } catch (error) {
      console.error('Error getting USDT balance:', error);
      return '0';
    }
  }

  // ==================== PRICE FUNCTIONS ====================

  // Get current crypto prices from contract
  async getCurrentPrices() {
    try {
      if (!this.contracts.pronovaPresale) throw new Error('Presale contract not initialized');
      
      const [ethPrice, bnbPrice, ethChainlinkActive, bnbChainlinkActive] = await this.contracts.pronovaPresale.getCurrentPrices();
      
      return {
        eth: ethers.utils.formatUnits(ethPrice, 6),
        bnb: ethers.utils.formatUnits(bnbPrice, 6),
        ethChainlinkActive,
        bnbChainlinkActive
      };
    } catch (error) {
      console.error('Error getting current prices:', error);
      // Fallback to external API
      return await this.getPricesFromAPI();
    }
  }

  // Get prices from external API (fallback)
  async getPricesFromAPI() {
    try {
      const response = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=ethereum,binancecoin&vs_currencies=usd');
      return {
        eth: response.data.ethereum.usd.toString(),
        bnb: response.data.binancecoin.usd.toString(),
        ethChainlinkActive: false,
        bnbChainlinkActive: false
      };
    } catch (error) {
      console.error('Error getting prices from API:', error);
      return {
        eth: '3000',
        bnb: '300',
        ethChainlinkActive: false,
        bnbChainlinkActive: false
      };
    }
  }

  // ==================== REFERRAL FUNCTIONS ====================

  // Get referral information
  async getReferralInfo(referrerAddress) {
    try {
      if (!this.contracts.pronovaPresale) throw new Error('Presale contract not initialized');
      
      const [totalReferred, totalRewards, referredCount, referredUsers] = await this.contracts.pronovaPresale.getReferralInfo(referrerAddress);
      
      return {
        totalReferred: ethers.utils.formatUnits(totalReferred, 6),
        totalRewards: ethers.utils.formatEther(totalRewards),
        referredCount: referredCount.toNumber(),
        referredUsers
      };
    } catch (error) {
      console.error('Error getting referral info:', error);
      throw error;
    }
  }

  // ==================== UTILITY FUNCTIONS ====================

  // Check if user is whitelisted
  async isWhitelisted(userAddress) {
    try {
      if (!this.contracts.pronovaPresale) return false;
      return await this.contracts.pronovaPresale.whitelist(userAddress);
    } catch (error) {
      console.error('Error checking whitelist status:', error);
      return false;
    }
  }

  // Get expected listing price range
  async getExpectedListingPrice() {
    try {
      if (!this.contracts.pronovaPresale) throw new Error('Presale contract not initialized');
      
      const [minPrice, maxPrice] = await this.contracts.pronovaPresale.getExpectedListingPrice();
      
      return {
        min: ethers.utils.formatUnits(minPrice, 6),
        max: ethers.utils.formatUnits(maxPrice, 6)
      };
    } catch (error) {
      console.error('Error getting expected listing price:', error);
      return { min: '1.7', max: '2.5' };
    }
  }

  // Convert USD to ETH amount
  async convertUSDToETH(usdAmount) {
    try {
      const prices = await this.getCurrentPrices();
      return (parseFloat(usdAmount) / parseFloat(prices.eth)).toFixed(6);
    } catch (error) {
      console.error('Error converting USD to ETH:', error);
      throw error;
    }
  }

  // Convert USD to BNB amount
  async convertUSDToBNB(usdAmount) {
    try {
      const prices = await this.getCurrentPrices();
      return (parseFloat(usdAmount) / parseFloat(prices.bnb)).toFixed(6);
    } catch (error) {
      console.error('Error converting USD to BNB:', error);
      throw error;
    }
  }
}

export const web3Service = new Web3Service();
export default web3Service;