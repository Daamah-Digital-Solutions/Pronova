import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getContractAddress, METAMASK_NETWORK_CONFIG } from '../config/contracts';

const Web3Context = createContext();

export const useWeb3 = () => useContext(Web3Context);

export const Web3Provider = ({ children }) => {
  const [account, setAccount] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState(null);
  const [web3, setWeb3] = useState(null);
  const [contracts, setContracts] = useState({});
  const [balances, setBalances] = useState({});
  const [presaleInfo, setPresaleInfo] = useState({});

  // Check if MetaMask is available
  const isMetaMaskAvailable = () => {
    return typeof window !== 'undefined' && window.ethereum;
  };

  // Load user balances
  const loadBalances = useCallback(async () => {
    if (!account || !web3) return;

    try {
      // Get ETH balance
      const ethBalance = await web3.getBalance(account);
      
      setBalances({
        eth: ethBalance,
        usdt: 0, // Would load from USDT contract
        prn: 0   // Would load from PRN contract
      });
    } catch (error) {
      console.error('Error loading balances:', error);
    }
  }, [account, web3]);

  // Load presale information
  const loadPresaleInfo = useCallback(async () => {
    if (!contracts.presale) return;

    try {
      // Mock presale info for now
      setPresaleInfo({
        currentPhase: 1,
        tokenPrice: '0.05',
        totalRaised: '0',
        hardCap: '31000000',
        userPurchased: '0',
        isWhitelisted: true // Mock as whitelisted
      });
    } catch (error) {
      console.error('Error loading presale info:', error);
    }
  }, [contracts.presale]);

  // Initialize Web3 and contracts
  const initializeWeb3 = useCallback(async () => {
    if (!window.ethereum || !account || !chainId) return;

    try {
      // Create Web3 instance using window.ethereum
      const web3Instance = {
        ethereum: window.ethereum,
        getBalance: async (address) => {
          const balance = await window.ethereum.request({
            method: 'eth_getBalance',
            params: [address, 'latest']
          });
          return parseInt(balance, 16);
        },
        call: async (to, data) => {
          return await window.ethereum.request({
            method: 'eth_call',
            params: [{ to, data }, 'latest']
          });
        },
        sendTransaction: async (transaction) => {
          return await window.ethereum.request({
            method: 'eth_sendTransaction',
            params: [transaction]
          });
        }
      };

      setWeb3(web3Instance);

      // Initialize contract instances
      const tokenAddress = getContractAddress(chainId, 'PRONOVA_TOKEN');
      const presaleAddress = getContractAddress(chainId, 'PRONOVA_PRESALE');
      const usdtAddress = getContractAddress(chainId, 'USDT');

      const contractInstances = {
        token: tokenAddress ? createContract(tokenAddress, 'PronovaToken') : null,
        presale: presaleAddress ? createContract(presaleAddress, 'PronovaPresale') : null,
        usdt: usdtAddress ? createContract(usdtAddress, 'MockUSDT') : null
      };

      setContracts(contractInstances);

      // Load initial data
      await loadBalances();
      await loadPresaleInfo();

    } catch (error) {
      console.error('Error initializing Web3:', error);
      setError('Failed to initialize Web3');
    }
  }, [account, chainId, loadBalances, loadPresaleInfo]);

  // Create contract instance helper
  const createContract = (address, contractType) => {
    const abis = {
      PronovaToken: [
        "function name() view returns (string)",
        "function symbol() view returns (string)",
        "function totalSupply() view returns (uint256)",
        "function balanceOf(address) view returns (uint256)",
        "function transfer(address to, uint256 amount) returns (bool)",
        "function allowance(address owner, address spender) view returns (uint256)",
        "function approve(address spender, uint256 amount) returns (bool)"
      ],
      PronovaPresale: [
        "function currentPhase() view returns (uint256)",
        "function buyWithETH(address referrer) payable",
        "function buyWithUSDT(uint256 amount, address referrer)",
        "function getPhaseInfo(uint256 phaseId) view returns (uint256 pricePerToken, uint256 tokensAllocated, uint256 tokensSold, uint256 tokensRemaining, bool isActive, uint256 startTime, uint256 endTime)",
        "function getUserPurchaseInfo(address user) view returns (uint256 totalTokens, uint256 totalPaid, uint256 referralTokens, bool claimed)",
        "function getPresaleProgress() view returns (uint256 totalRaised, uint256 hardCap, uint256 progressPercentage, uint256 currentPhaseId)",
        "function whitelist(address) view returns (bool)",
        "function ethToUsdPrice() view returns (uint256)"
      ],
      MockUSDT: [
        "function balanceOf(address) view returns (uint256)",
        "function transfer(address to, uint256 amount) returns (bool)",
        "function approve(address spender, uint256 amount) returns (bool)",
        "function allowance(address owner, address spender) view returns (uint256)",
        "function decimals() view returns (uint8)"
      ]
    };

    return {
      address,
      abi: abis[contractType] || [],
      call: async (method, ...args) => {
        // Simplified contract call implementation
        // In a full implementation, you'd encode the function call properly
        console.log(`Calling ${method} on ${address} with args:`, args);
        // For now, return mock data
        return null;
      }
    };
  };


  // Connect to MetaMask
  const connectWallet = async () => {
    if (!isMetaMaskAvailable()) {
      setError("MetaMask not found. Please install MetaMask.");
      return;
    }
    
    setIsConnecting(true);
    setError(null);
    
    try {
      // Request account access
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      });
      
      if (accounts.length > 0) {
        setAccount(accounts[0]);
        
        // Get chain ID
        const chainId = await window.ethereum.request({ 
          method: 'eth_chainId' 
        });
        setChainId(parseInt(chainId, 16));

        // Check if we need to switch to localhost network
        if (parseInt(chainId, 16) !== 31337) {
          await switchToLocalhostNetwork();
        }
      }
    } catch (error) {
      console.error("Error connecting wallet:", error);
      setError("Failed to connect wallet. Please try again.");
    } finally {
      setIsConnecting(false);
    }
  };

  // Switch to localhost network
  const switchToLocalhostNetwork = async () => {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x7A69' }], // 31337 in hex
      });
    } catch (switchError) {
      // If network doesn't exist, add it
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [METAMASK_NETWORK_CONFIG],
          });
        } catch (addError) {
          console.error("Error adding network:", addError);
          setError("Failed to add Hardhat network to MetaMask");
        }
      } else {
        console.error("Error switching network:", switchError);
        setError("Failed to switch to Hardhat network");
      }
    }
  };

  // Buy tokens with ETH
  const buyWithETH = async (ethAmount, referrer = '0x0000000000000000000000000000000000000000') => {
    if (!contracts.presale || !account) {
      throw new Error('Wallet not connected or contract not available');
    }

    try {
      const transaction = {
        from: account,
        to: contracts.presale.address,
        value: '0x' + ethAmount.toString(16),
        data: '0x' // Would encode buyWithETH function call
      };

      const txHash = await web3.sendTransaction(transaction);
      return txHash;
    } catch (error) {
      console.error('Error buying with ETH:', error);
      throw error;
    }
  };

  // Disconnect wallet
  const disconnectWallet = () => {
    setAccount(null);
    setChainId(null);
    setError(null);
    setContracts({});
    setBalances({});
    setPresaleInfo({});
  };

  // Get network name
  const getNetworkName = (chainId) => {
    const networks = {
      1: 'Ethereum Mainnet',
      11155111: 'Sepolia Testnet',
      56: 'BSC Mainnet',
      97: 'BSC Testnet',
      31337: 'Hardhat Localhost'
    };
    return networks[chainId] || `Chain ID: ${chainId}`;
  };

  // Format address for display
  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // Format balance
  const formatBalance = (balance, decimals = 18) => {
    if (!balance) return '0';
    const divisor = Math.pow(10, decimals);
    const result = balance / divisor;
    return result.toFixed(4);
  };

  // Listen for account and network changes
  useEffect(() => {
    if (!isMetaMaskAvailable()) return;

    const handleAccountsChanged = (accounts) => {
      if (accounts.length === 0) {
        disconnectWallet();
      } else {
        setAccount(accounts[0]);
      }
    };

    const handleChainChanged = (chainId) => {
      setChainId(parseInt(chainId, 16));
    };

    window.ethereum.on('accountsChanged', handleAccountsChanged);
    window.ethereum.on('chainChanged', handleChainChanged);

    // Check if already connected
    window.ethereum.request({ method: 'eth_accounts' })
      .then(accounts => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          window.ethereum.request({ method: 'eth_chainId' })
            .then(chainId => setChainId(parseInt(chainId, 16)));
        }
      })
      .catch(console.error);

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, []);

  // Initialize Web3 when account or chainId changes
  useEffect(() => {
    if (account && chainId) {
      initializeWeb3();
    }
  }, [account, chainId, initializeWeb3]);

  const value = {
    // Wallet state
    account,
    chainId,
    isConnecting,
    error,
    web3,
    contracts,
    balances,
    presaleInfo,

    // Wallet actions
    connectWallet,
    disconnectWallet,
    switchToLocalhostNetwork,

    // Contract interactions
    buyWithETH,
    loadBalances,
    loadPresaleInfo,

    // Utilities
    isMetaMaskAvailable: isMetaMaskAvailable(),
    formatAddress,
    formatBalance,
    getNetworkName: () => getNetworkName(chainId),
    isConnected: !!account,
    isCorrectNetwork: chainId === 31337
  };

  return (
    <Web3Context.Provider value={value}>
      {children}
    </Web3Context.Provider>
  );
};