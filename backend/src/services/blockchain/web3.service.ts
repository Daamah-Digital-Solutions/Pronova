import { ethers } from 'ethers';
import { cache } from '../../config/redis';

interface NetworkConfig {
  name: string;
  rpcUrl: string;
  chainId: number;
  nativeCurrency: string;
}

interface ContractAddresses {
  token: string;
  presale: string;
  vesting: string;
}

export class Web3Service {
  private providers: Map<string, ethers.Provider> = new Map();
  private contracts: Map<string, ethers.Contract> = new Map();

  private networks: Record<string, NetworkConfig> = {
    ethereum: {
      name: 'Ethereum',
      rpcUrl: process.env.ETHEREUM_RPC_URL || '',
      chainId: 1,
      nativeCurrency: 'ETH',
    },
    bsc: {
      name: 'BSC',
      rpcUrl: process.env.BSC_RPC_URL || '',
      chainId: 56,
      nativeCurrency: 'BNB',
    },
    polygon: {
      name: 'Polygon',
      rpcUrl: process.env.POLYGON_RPC_URL || '',
      chainId: 137,
      nativeCurrency: 'MATIC',
    },
  };

  private contractAddresses: Record<string, ContractAddresses> = {
    ethereum: {
      token: process.env.TOKEN_CONTRACT_ADDRESS || '',
      presale: process.env.PRESALE_CONTRACT_ADDRESS || '',
      vesting: process.env.VESTING_CONTRACT_ADDRESS || '',
    },
    bsc: {
      token: process.env.BSC_TOKEN_CONTRACT_ADDRESS || '',
      presale: process.env.BSC_PRESALE_CONTRACT_ADDRESS || '',
      vesting: process.env.BSC_VESTING_CONTRACT_ADDRESS || '',
    },
  };

  constructor() {
    this.initializeProviders();
  }

  private initializeProviders() {
    Object.entries(this.networks).forEach(([network, config]) => {
      if (config.rpcUrl) {
        const provider = new ethers.JsonRpcProvider(config.rpcUrl);
        this.providers.set(network, provider);
      }
    });
  }

  public getProvider(network: string): ethers.Provider | null {
    return this.providers.get(network) || null;
  }

  public async getGasPrice(network: string): Promise<bigint | null> {
    const provider = this.getProvider(network);
    if (!provider) return null;

    try {
      const feeData = await provider.getFeeData();
      return feeData.gasPrice;
    } catch (error) {
      console.error(`Error getting gas price for ${network}:`, error);
      return null;
    }
  }

  public async getBlockNumber(network: string): Promise<number | null> {
    const provider = this.getProvider(network);
    if (!provider) return null;

    try {
      return await provider.getBlockNumber();
    } catch (error) {
      console.error(`Error getting block number for ${network}:`, error);
      return null;
    }
  }

  public async getTransactionReceipt(
    network: string,
    txHash: string
  ): Promise<ethers.TransactionReceipt | null> {
    const provider = this.getProvider(network);
    if (!provider) return null;

    try {
      return await provider.getTransactionReceipt(txHash);
    } catch (error) {
      console.error(`Error getting transaction receipt for ${txHash}:`, error);
      return null;
    }
  }

  public async validateTransaction(
    network: string,
    txHash: string,
    expectedValue?: bigint,
    expectedTo?: string
  ): Promise<boolean> {
    const receipt = await this.getTransactionReceipt(network, txHash);
    if (!receipt || receipt.status !== 1) return false;

    if (expectedValue && receipt.value !== expectedValue) return false;
    if (expectedTo && receipt.to?.toLowerCase() !== expectedTo.toLowerCase()) return false;

    return true;
  }

  public async getCachedPrice(symbol: string): Promise<number | null> {
    const cacheKey = `price:${symbol.toLowerCase()}`;
    const cachedPrice = await cache.get(cacheKey);
    
    if (cachedPrice) {
      return parseFloat(cachedPrice);
    }

    // In production, integrate with price feeds like CoinGecko or Chainlink
    const prices: Record<string, number> = {
      eth: 3000,
      bnb: 300,
      matic: 0.8,
    };

    const price = prices[symbol.toLowerCase()];
    if (price) {
      await cache.set(cacheKey, price.toString(), 300); // Cache for 5 minutes
    }

    return price || null;
  }

  public convertUsdToTokens(usdAmount: number, tokenPriceUsd: number): bigint {
    const tokens = usdAmount / tokenPriceUsd;
    return ethers.parseEther(tokens.toString());
  }

  public convertTokensToUsd(tokenAmount: bigint, tokenPriceUsd: number): number {
    const tokens = parseFloat(ethers.formatEther(tokenAmount));
    return tokens * tokenPriceUsd;
  }

  public async estimateGas(
    network: string,
    to: string,
    data: string,
    value?: bigint
  ): Promise<bigint | null> {
    const provider = this.getProvider(network);
    if (!provider) return null;

    try {
      return await provider.estimateGas({
        to,
        data,
        value: value || 0n,
      });
    } catch (error) {
      console.error(`Error estimating gas:`, error);
      return null;
    }
  }

  public isValidAddress(address: string): boolean {
    return ethers.isAddress(address);
  }

  public isValidTransactionHash(hash: string): boolean {
    return /^0x[a-fA-F0-9]{64}$/.test(hash);
  }

  public getNetworkByChainId(chainId: number): string | null {
    for (const [network, config] of Object.entries(this.networks)) {
      if (config.chainId === chainId) {
        return network;
      }
    }
    return null;
  }

  public getSupportedNetworks(): string[] {
    return Object.keys(this.networks);
  }
}

export const web3Service = new Web3Service();