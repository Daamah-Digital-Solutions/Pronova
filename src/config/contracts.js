// Smart Contract Configuration
export const CONTRACTS = {
  // Network configurations
  NETWORKS: {
    LOCALHOST: {
      chainId: 31337,
      name: 'Localhost',
      rpcUrl: 'http://127.0.0.1:8545',
      explorerUrl: 'http://localhost:8545'
    },
    MAINNET: {
      chainId: 1,
      name: 'Ethereum Mainnet',
      rpcUrl: 'https://mainnet.infura.io/v3/YOUR_INFURA_KEY',
      explorerUrl: 'https://etherscan.io'
    },
    SEPOLIA: {
      chainId: 11155111,
      name: 'Sepolia Testnet',
      rpcUrl: 'https://sepolia.infura.io/v3/YOUR_INFURA_KEY',
      explorerUrl: 'https://sepolia.etherscan.io'
    },
    BSC: {
      chainId: 56,
      name: 'BSC Mainnet',
      rpcUrl: 'https://bsc-dataseed.binance.org/',
      explorerUrl: 'https://bscscan.com'
    },
    BSC_TESTNET: {
      chainId: 97,
      name: 'BSC Testnet',
      rpcUrl: 'https://data-seed-prebsc-1-s1.binance.org:8545/',
      explorerUrl: 'https://testnet.bscscan.com'
    }
  },

  // Contract addresses (will be updated after deployment)
  ADDRESSES: {
    LOCALHOST: {
      PRONOVA_TOKEN: '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512',
      PRONOVA_PRESALE: '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0',
      PRONOVA_VESTING: '0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9',
      USDT: '0x5FbDB2315678afecb367f032d93F642f64180aa3' // MockUSDT
    },
    MAINNET: {
      PRONOVA_TOKEN: '0x...', // To be updated after deployment
      PRONOVA_PRESALE: '0x...', // To be updated after deployment
      PRONOVA_VESTING: '0x...', // To be updated after deployment
      USDT: '0xdAC17F958D2ee523a2206206994597C13D831ec7'
    },
    SEPOLIA: {
      PRONOVA_TOKEN: '0x...', // To be updated after deployment
      PRONOVA_PRESALE: '0x...', // To be updated after deployment
      PRONOVA_VESTING: '0x...', // To be updated after deployment
      USDT: '0x...', // Testnet USDT address
    },
    BSC: {
      PRONOVA_TOKEN: '0x...',
      PRONOVA_PRESALE: '0x...',
      PRONOVA_VESTING: '0x...',
      USDT: '0x55d398326f99059fF775485246999027B3197955'
    },
    BSC_TESTNET: {
      PRONOVA_TOKEN: '0xa3896C07c4e7D9771e9E3417b7352fBD14704253',
      PRONOVA_PRESALE: '0x29Ffc342bE650C1ce3e4e102AfB2285FD29f7cF5',
      PRONOVA_VESTING: '0xd8Cce8EE40B8BdE0f220DCa8084Cd7CeF423bD2a',
      USDT: '0xbcA887cE632E642DA28aF66433A70B62925F4a08', // MockUSDT on BSC testnet
    }
  },

  // Supported payment tokens
  PAYMENT_TOKENS: {
    ETH: {
      symbol: 'ETH',
      name: 'Ethereum',
      decimals: 18,
      address: '0x0000000000000000000000000000000000000000', // Native token
      coingeckoId: 'ethereum'
    },
    BNB: {
      symbol: 'BNB',
      name: 'Binance Coin',
      decimals: 18,
      address: '0x0000000000000000000000000000000000000000', // Native token
      coingeckoId: 'binancecoin'
    },
    USDT: {
      symbol: 'USDT',
      name: 'Tether USD',
      decimals: 6,
      coingeckoId: 'tether'
    }
  }
};

// Utility function to get contract address by network
export const getContractAddress = (networkId, contractName) => {
  const networkName = Object.keys(CONTRACTS.NETWORKS).find(
    key => CONTRACTS.NETWORKS[key].chainId === networkId
  );
  
  return CONTRACTS.ADDRESSES[networkName]?.[contractName];
};

// Utility function to get network info
export const getNetworkInfo = (chainId) => {
  return Object.values(CONTRACTS.NETWORKS).find(network => network.chainId === chainId);
};

// Default network (for development)
export const DEFAULT_NETWORK = CONTRACTS.NETWORKS.BSC_TESTNET;

// Test accounts for localhost
export const TEST_ACCOUNTS = [
  {
    address: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
    privateKey: "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",
    balance: "10000 ETH"
  },
  {
    address: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8", 
    privateKey: "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d",
    balance: "10000 ETH"
  }
];

// MetaMask network configuration for localhost
export const METAMASK_NETWORK_CONFIG = {
  chainId: '0x7A69', // 31337 in hex
  chainName: 'Hardhat Localhost',
  nativeCurrency: {
    name: 'Ethereum',
    symbol: 'ETH',
    decimals: 18
  },
  rpcUrls: ['http://127.0.0.1:8545'],
  blockExplorerUrls: ['http://localhost:8545']
};