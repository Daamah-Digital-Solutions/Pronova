import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { getContractAddress, METAMASK_NETWORK_CONFIG } from '../config/contracts';
import { web3Service } from '../services/web3Service';

const Web3Context = createContext();

export const useWeb3 = () => useContext(Web3Context);

// WalletConnect Project ID from environment
const WALLETCONNECT_PROJECT_ID = process.env.REACT_APP_WALLETCONNECT_PROJECT_ID || '';

export const Web3Provider = ({ children }) => {
  const [account, setAccount] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState(null);
  const [web3, setWeb3] = useState(null);
  const [contracts, setContracts] = useState({});
  const [balances, setBalances] = useState({});
  const [presaleInfo, setPresaleInfo] = useState({});
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [walletConnectProvider, setWalletConnectProvider] = useState(null);

  // Detect mobile device
  const isMobile = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  };

  // Check if running inside MetaMask in-app browser
  const isMetaMaskBrowser = () => {
    return typeof window !== 'undefined' &&
           window.ethereum &&
           (window.ethereum.isMetaMask ||
            navigator.userAgent.includes('MetaMaskMobile'));
  };

  // Check if MetaMask is available (desktop or MetaMask browser)
  const isMetaMaskAvailable = () => {
    return typeof window !== 'undefined' && window.ethereum;
  };

  // Check if we're in a wallet's in-app browser (MetaMask, Trust Wallet, etc.)
  const isWalletBrowser = () => {
    if (typeof window === 'undefined') return false;
    const ua = navigator.userAgent.toLowerCase();
    return window.ethereum ||
           ua.includes('metamask') ||
           ua.includes('trust') ||
           ua.includes('coinbase') ||
           ua.includes('tokenpocket');
  };

  // Load user balances
  const loadBalances = useCallback(async () => {
    if (!account || !web3) return;

    try {
      const ethBalance = await web3.getBalance(account);

      setBalances({
        eth: ethBalance,
        usdt: 0,
        prn: 0
      });
    } catch (error) {
      console.error('Error loading balances:', error);
    }
  }, [account, web3]);

  // Load presale information
  const loadPresaleInfo = useCallback(async () => {
    try {
      const phaseInfo = await web3Service.getCurrentPhaseInfo();
      const progress = await web3Service.getPresaleProgress();

      let userInfo = null;
      let isWhitelisted = false;

      if (account) {
        userInfo = await web3Service.getUserPurchaseInfo(account);
        isWhitelisted = await web3Service.isWhitelisted(account);
      }

      setPresaleInfo({
        currentPhase: phaseInfo?.phaseNumber || 1,
        tokenPrice: phaseInfo?.pricePerToken || 0.80, // Phase 1 default price
        totalRaised: progress?.totalRaised || 0,
        hardCap: progress?.hardCap || 31000000, // Total presale hard cap
        userPurchased: userInfo?.totalTokens || 0,
        isWhitelisted,
        // Phase timing info for countdown
        phaseStartTime: phaseInfo?.startTime || null,
        phaseEndTime: phaseInfo?.endTime || null,
        isPhaseActive: phaseInfo?.isActive || false,
        tokensAllocated: phaseInfo?.tokensAllocated || 0,
        tokensSold: phaseInfo?.tokensSold || 0
      });
    } catch (error) {
      console.error('Error loading presale info:', error);
      // Use sensible defaults to avoid NaN/Infinity in UI
      setPresaleInfo({
        currentPhase: 1,
        tokenPrice: 0.80, // Phase 1 price
        totalRaised: 0,
        hardCap: 31000000, // Total presale hard cap
        userPurchased: 0,
        isWhitelisted: false,
        phaseStartTime: null,
        phaseEndTime: null,
        isPhaseActive: false,
        tokensAllocated: 0,
        tokensSold: 0
      });
    }
  }, [account]);

  // Initialize Web3 and contracts
  const initializeWeb3 = useCallback(async (provider) => {
    if (!provider || !account || !chainId) return;

    try {
      let ethersProvider;

      // Handle different provider types
      if (provider.request) {
        // Standard EIP-1193 provider (MetaMask, etc.)
        ethersProvider = new ethers.providers.Web3Provider(provider);
      } else if (provider.provider) {
        // WalletConnect provider
        ethersProvider = new ethers.providers.Web3Provider(provider.provider);
      } else {
        ethersProvider = new ethers.providers.Web3Provider(provider);
      }

      const signer = ethersProvider.getSigner();

      // Initialize web3Service
      web3Service.initialize(ethersProvider, signer, chainId);

      setWeb3(ethersProvider);
      setContracts(web3Service.contracts);

      await loadBalances();
      await loadPresaleInfo();

    } catch (error) {
      console.error('Error initializing Web3:', error);
      setError('Failed to initialize Web3');
    }
  }, [account, chainId, loadBalances, loadPresaleInfo]);

  // Connect using injected provider (MetaMask, Trust Wallet in-app browser, etc.)
  const connectInjected = async () => {
    if (!window.ethereum) {
      throw new Error('No injected provider found');
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
        const chainIdHex = await window.ethereum.request({
          method: 'eth_chainId'
        });
        const chainIdNum = parseInt(chainIdHex, 16);
        setChainId(chainIdNum);

        // Initialize Web3 with the provider
        await initializeWeb3(window.ethereum);

        // Check if on supported network
        const supportedChains = [31337, 97, 56];
        if (!supportedChains.includes(chainIdNum)) {
          setError("Please switch to BSC Testnet or BSC Mainnet");
          // Try to switch network
          await switchToBSCNetwork();
        }

        return true;
      }
      return false;
    } catch (error) {
      console.error("Error connecting injected wallet:", error);
      throw error;
    } finally {
      setIsConnecting(false);
    }
  };

  // Clear stale WalletConnect sessions from localStorage
  const clearWalletConnectSessions = () => {
    try {
      // Clear WalletConnect v2 storage keys
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (
          key.startsWith('wc@2:') ||
          key.startsWith('walletconnect') ||
          key.includes('walletconnect')
        )) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(key => localStorage.removeItem(key));
      console.log('Cleared WalletConnect sessions:', keysToRemove.length);
    } catch (e) {
      console.error('Error clearing WalletConnect sessions:', e);
    }
  };

  // Connect using WalletConnect
  const connectWalletConnect = async () => {
    setIsConnecting(true);
    setError(null);

    try {
      // Clear any stale sessions before connecting
      clearWalletConnectSessions();

      // Dynamic import to avoid issues with SSR
      const { EthereumProvider } = await import('@walletconnect/ethereum-provider');

      const provider = await EthereumProvider.init({
        projectId: WALLETCONNECT_PROJECT_ID,
        chains: [97], // BSC Testnet
        optionalChains: [56, 31337], // BSC Mainnet, Localhost
        showQrModal: true,
        qrModalOptions: {
          themeMode: 'dark',
        },
        metadata: {
          name: 'Pronova Presale',
          description: 'PRN Token Presale Platform',
          url: window.location.origin,
          icons: [`${window.location.origin}/logo192.png`]
        }
      });

      // Connect and enable the provider
      await provider.connect();

      const accounts = provider.accounts;
      const chainId = provider.chainId;

      if (accounts.length > 0) {
        setAccount(accounts[0]);
        setChainId(chainId);
        setWalletConnectProvider(provider);

        // Initialize Web3 with WalletConnect provider
        const ethersProvider = new ethers.providers.Web3Provider(provider);
        const signer = ethersProvider.getSigner();
        web3Service.initialize(ethersProvider, signer, chainId);
        setWeb3(ethersProvider);
        setContracts(web3Service.contracts);

        // Setup event listeners
        provider.on('accountsChanged', (accounts) => {
          if (accounts.length === 0) {
            disconnectWallet();
          } else {
            setAccount(accounts[0]);
          }
        });

        provider.on('chainChanged', (chainId) => {
          setChainId(parseInt(chainId, 16));
        });

        provider.on('disconnect', () => {
          disconnectWallet();
        });

        await loadBalances();
        await loadPresaleInfo();

        return true;
      }
      return false;
    } catch (error) {
      console.error("Error connecting WalletConnect:", error);

      // Handle stale session errors by clearing and retrying once
      if (error.message?.includes('session') || error.message?.includes('No matching key')) {
        console.log('Stale session detected, clearing and retrying...');
        clearWalletConnectSessions();
        setError('Session expired. Please try connecting again.');
      } else if (error.message?.includes('User rejected')) {
        setError('Connection rejected by user');
      } else {
        setError('Failed to connect via WalletConnect. Please try again.');
      }
      throw error;
    } finally {
      setIsConnecting(false);
    }
  };

  // Main connect function - decides which method to use
  const connectWallet = async (method = null) => {
    setError(null);

    try {
      // If running in a wallet's in-app browser, use injected provider directly
      if (isWalletBrowser() && window.ethereum) {
        console.log('Detected wallet browser, using injected provider');
        await connectInjected();
        setShowWalletModal(false);
        return;
      }

      // If method is specified, use that method
      if (method === 'injected' && window.ethereum) {
        await connectInjected();
        setShowWalletModal(false);
        return;
      }

      if (method === 'walletconnect') {
        await connectWalletConnect();
        setShowWalletModal(false);
        return;
      }

      // On mobile without injected provider, use WalletConnect
      if (isMobile() && !window.ethereum) {
        console.log('Mobile device without injected provider, using WalletConnect');
        await connectWalletConnect();
        return;
      }

      // On desktop with MetaMask, use injected
      if (window.ethereum) {
        console.log('Desktop with MetaMask, using injected provider');
        await connectInjected();
        return;
      }

      // No wallet available - show options or redirect
      if (isMobile()) {
        // On mobile without wallet, offer to open in MetaMask
        setShowWalletModal(true);
      } else {
        setError("No wallet found. Please install MetaMask.");
      }
    } catch (error) {
      console.error("Error connecting wallet:", error);
      if (!error.message?.includes('rejected')) {
        setError(error.message || "Failed to connect wallet");
      }
    }
  };

  // Open current page in MetaMask app (mobile)
  const openInMetaMask = () => {
    const currentUrl = window.location.href;
    // MetaMask deep link format
    const metamaskUrl = `https://metamask.app.link/dapp/${currentUrl.replace(/^https?:\/\//, '')}`;
    window.location.href = metamaskUrl;
  };

  // Switch to BSC network
  const switchToBSCNetwork = async (testnet = true) => {
    const chainConfig = testnet ? {
      chainId: '0x61', // 97 in hex
      chainName: 'BSC Testnet',
      nativeCurrency: {
        name: 'BNB',
        symbol: 'BNB',
        decimals: 18
      },
      rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org:8545/'],
      blockExplorerUrls: ['https://testnet.bscscan.com']
    } : {
      chainId: '0x38', // 56 in hex
      chainName: 'BSC Mainnet',
      nativeCurrency: {
        name: 'BNB',
        symbol: 'BNB',
        decimals: 18
      },
      rpcUrls: ['https://bsc-dataseed.binance.org/'],
      blockExplorerUrls: ['https://bscscan.com']
    };

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: chainConfig.chainId }],
      });
    } catch (switchError) {
      // Chain not added, try to add it
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [chainConfig],
          });
        } catch (addError) {
          console.error("Error adding network:", addError);
          setError("Failed to add BSC network to wallet");
        }
      } else {
        console.error("Error switching network:", switchError);
      }
    }
  };

  // Switch to localhost network
  const switchToLocalhostNetwork = async () => {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x7A69' }],
      });
    } catch (switchError) {
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

      await loadBalances();
      await loadPresaleInfo();

      return receipt;
    } catch (error) {
      console.error('Error buying with ETH:', error);
      throw error;
    }
  };

  // Disconnect wallet
  const disconnectWallet = async () => {
    // Disconnect WalletConnect if active
    if (walletConnectProvider) {
      try {
        await walletConnectProvider.disconnect();
      } catch (e) {
        console.error('Error disconnecting WalletConnect:', e);
      }
      setWalletConnectProvider(null);
    }

    // Clear all WalletConnect sessions from localStorage
    clearWalletConnectSessions();

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

  // Listen for account and network changes (injected provider)
  useEffect(() => {
    if (!window.ethereum) return;

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
            .then(chainId => {
              const chainIdNum = parseInt(chainId, 16);
              setChainId(chainIdNum);
              initializeWeb3(window.ethereum);
            });
        }
      })
      .catch(console.error);

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, [initializeWeb3]);

  // Re-initialize when account or chainId changes
  useEffect(() => {
    if (account && chainId && window.ethereum && !walletConnectProvider) {
      initializeWeb3(window.ethereum);
    }
  }, [account, chainId, initializeWeb3, walletConnectProvider]);

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
    showWalletModal,

    // Wallet actions
    connectWallet,
    connectInjected,
    connectWalletConnect,
    disconnectWallet,
    switchToLocalhostNetwork,
    switchToBSCNetwork,
    openInMetaMask,
    setShowWalletModal,

    // Contract interactions
    buyWithETH,
    loadBalances,
    loadPresaleInfo,

    // Utilities
    isMetaMaskAvailable: isMetaMaskAvailable(),
    isMetaMaskBrowser: isMetaMaskBrowser(),
    isMobile: isMobile(),
    isWalletBrowser: isWalletBrowser(),
    formatAddress,
    formatBalance,
    getNetworkName: () => getNetworkName(chainId),
    isConnected: !!account,
    isCorrectNetwork: [31337, 97, 56].includes(chainId)
  };

  return (
    <Web3Context.Provider value={value}>
      {children}
    </Web3Context.Provider>
  );
};
