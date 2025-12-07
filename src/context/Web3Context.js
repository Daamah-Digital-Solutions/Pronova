import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { getContractAddress, METAMASK_NETWORK_CONFIG } from '../config/contracts';
import { web3Service } from '../services/web3Service';

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
    try {
      // Get current phase info
      const phaseInfo = await web3Service.getCurrentPhaseInfo();
      const progress = await web3Service.getPresaleProgress();

      let userInfo = null;
      let isWhitelisted = false;

      if (account) {
        userInfo = await web3Service.getUserPurchaseInfo(account);
        isWhitelisted = await web3Service.isWhitelisted(account);
      }

      setPresaleInfo({
        currentPhase: phaseInfo?.phaseNumber || 0,
        tokenPrice: phaseInfo?.pricePerToken || '0',
        totalRaised: progress?.totalRaised || '0',
        hardCap: progress?.hardCap || '31000000',
        userPurchased: userInfo?.totalTokens || '0',
        isWhitelisted
      });
    } catch (error) {
      console.error('Error loading presale info:', error);
      // Set default values on error
      setPresaleInfo({
        currentPhase: 0,
        tokenPrice: '0',
        totalRaised: '0',
        hardCap: '0',
        userPurchased: '0',
        isWhitelisted: false
      });
    }
  }, [account]);

  // Initialize Web3 and contracts
  const initializeWeb3 = useCallback(async () => {
    if (!window.ethereum || !account || !chainId) return;

    try {
      // Create ethers provider and signer
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      // Initialize web3Service with provider, signer, and chainId
      web3Service.initialize(provider, signer, chainId);

      setWeb3(provider);
      setContracts(web3Service.contracts);

      // Load initial data
      await loadBalances();
      await loadPresaleInfo();

    } catch (error) {
      console.error('Error initializing Web3:', error);
      setError('Failed to initialize Web3');
    }
  }, [account, chainId, loadBalances, loadPresaleInfo]);

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
        const chainIdNum = parseInt(chainId, 16);
        setChainId(chainIdNum);

        // Supported networks: Localhost (31337), BSC Testnet (97), BSC Mainnet (56)
        const supportedChains = [31337, 97, 56];
        if (!supportedChains.includes(chainIdNum)) {
          setError("Please connect to Hardhat Localhost, BSC Testnet, or BSC Mainnet");
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
    if (!account) {
      throw new Error('Wallet not connected');
    }

    try {
      const result = await web3Service.buyWithETH(ethAmount, referrer);
      const receipt = await result.wait();

      // Reload balances and presale info after purchase
      await loadBalances();
      await loadPresaleInfo();

      return receipt;
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
    isCorrectNetwork: [31337, 97, 56].includes(chainId) // Support localhost, BSC testnet, and BSC mainnet
  };

  return (
    <Web3Context.Provider value={value}>
      {children}
    </Web3Context.Provider>
  );
};