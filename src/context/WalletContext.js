import React, { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';
import WalletConnectProvider from '@walletconnect/web3-provider';
import { CONTRACTS, getNetworkInfo, getContractAddress } from '../config/contracts';
import { PRONOVA_PRESALE_ABI, PRONOVA_TOKEN_ABI, USDT_ABI } from '../config/abis';

const WalletContext = createContext();

export const useWallet = () => useContext(WalletContext);

export const WalletProvider = ({ children }) => {
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [balance, setBalance] = useState(null);
  const [walletType, setWalletType] = useState(null);
  const [contracts, setContracts] = useState({});
  const [networkInfo, setNetworkInfo] = useState(null);

  // Initialize provider from window.ethereum if available
  useEffect(() => {
    const initProvider = async () => {
      if (window.ethereum) {
        try {
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          setProvider(provider);
          
          // Listen for chain changes
          window.ethereum.on('chainChanged', (chainId) => {
            window.location.reload();
          });
          
          // Listen for account changes
          window.ethereum.on('accountsChanged', (accounts) => {
            if (accounts.length === 0) {
              setAccount(null);
              setSigner(null);
              setBalance(null);
            } else {
              connectWallet();
            }
          });
          
          // Check if already connected
          const accounts = await provider.listAccounts();
          if (accounts.length > 0) {
            connectWallet();
          }
        } catch (error) {
          console.error("Error initializing provider:", error);
          setError("Failed to initialize Ethereum provider");
        }
      } else {
        setError("Ethereum provider not found. Please install MetaMask.");
      }
    };
    
    initProvider();
    
    return () => {
      // Clean up listeners
      if (window.ethereum) {
        window.ethereum.removeAllListeners('chainChanged');
        window.ethereum.removeAllListeners('accountsChanged');
      }
    };
  }, []);

  // Initialize contracts when provider and network change
  useEffect(() => {
    const initContracts = async () => {
      if (!provider || !chainId) return;

      try {
        const network = getNetworkInfo(chainId);
        setNetworkInfo(network);

        if (!network) {
          setError(`Unsupported network. Please switch to a supported network.`);
          return;
        }

        // Initialize contract instances
        const pronovaTokenAddress = getContractAddress(chainId, 'PRONOVA_TOKEN');
        const pronovaPresaleAddress = getContractAddress(chainId, 'PRONOVA_PRESALE');
        const usdtAddress = getContractAddress(chainId, 'USDT');

        const contractInstances = {};

        if (pronovaTokenAddress && pronovaTokenAddress !== '0x...') {
          contractInstances.pronovaToken = new ethers.Contract(
            pronovaTokenAddress,
            PRONOVA_TOKEN_ABI,
            provider
          );
        }

        if (pronovaPresaleAddress && pronovaPresaleAddress !== '0x...') {
          contractInstances.pronovaPresale = new ethers.Contract(
            pronovaPresaleAddress,
            PRONOVA_PRESALE_ABI,
            provider
          );
        }

        if (usdtAddress && usdtAddress !== '0x...') {
          contractInstances.usdt = new ethers.Contract(
            usdtAddress,
            USDT_ABI,
            provider
          );
        }

        setContracts(contractInstances);
      } catch (error) {
        console.error("Error initializing contracts:", error);
      }
    };

    initContracts();
  }, [provider, chainId]);

  // Connect to MetaMask
  const connectMetaMask = async () => {
    if (!window.ethereum) {
      setError("MetaMask not found. Please install MetaMask.");
      return;
    }
    
    setIsConnecting(true);
    setError(null);
    
    try {
      // Request account access
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const currentAccount = accounts[0];
      setAccount(currentAccount);
      setWalletType('metamask');
      
      // Get signer
      const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = web3Provider.getSigner();
      setProvider(web3Provider);
      setSigner(signer);
      
      // Get network
      const network = await web3Provider.getNetwork();
      setChainId(network.chainId);
      
      // Get balance
      const balance = await web3Provider.getBalance(currentAccount);
      setBalance(ethers.utils.formatEther(balance));
    } catch (error) {
      console.error("Error connecting MetaMask:", error);
      setError("Failed to connect MetaMask. Please try again.");
    } finally {
      setIsConnecting(false);
    }
  };

  // Connect to WalletConnect
  const connectWalletConnect = async () => {
    setIsConnecting(true);
    setError(null);
    
    try {
      const walletConnectProvider = new WalletConnectProvider({
        infuraId: "YOUR_INFURA_ID", // Replace with your Infura ID
        rpc: {
          1: "https://mainnet.infura.io/v3/YOUR_INFURA_ID",
          56: "https://bsc-dataseed.binance.org/",
          11155111: "https://sepolia.infura.io/v3/YOUR_INFURA_ID"
        }
      });

      await walletConnectProvider.enable();
      
      const web3Provider = new ethers.providers.Web3Provider(walletConnectProvider);
      const signer = web3Provider.getSigner();
      const accounts = await web3Provider.listAccounts();
      const network = await web3Provider.getNetwork();
      
      setProvider(web3Provider);
      setSigner(signer);
      setAccount(accounts[0]);
      setWalletType('walletconnect');
      setChainId(network.chainId);
      
      // Get balance
      const balance = await web3Provider.getBalance(accounts[0]);
      setBalance(ethers.utils.formatEther(balance));
    } catch (error) {
      console.error("Error connecting WalletConnect:", error);
      setError("Failed to connect WalletConnect. Please try again.");
    } finally {
      setIsConnecting(false);
    }
  };

  // Generic connect wallet function
  const connectWallet = async (type = 'metamask') => {
    if (type === 'metamask') {
      await connectMetaMask();
    } else if (type === 'walletconnect') {
      await connectWalletConnect();
    }
  };

  // Disconnect wallet
  const disconnectWallet = () => {
    setAccount(null);
    setSigner(null);
    setBalance(null);
    setWalletType(null);
    setContracts({});
    setNetworkInfo(null);
  };

  // Switch network
  const switchNetwork = async (targetChainId) => {
    if (!window.ethereum) {
      setError("MetaMask not found");
      return;
    }

    try {
      const chainIdHex = `0x${targetChainId.toString(16)}`;
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: chainIdHex }],
      });
    } catch (switchError) {
      // If network doesn't exist, add it
      if (switchError.code === 4902) {
        const networkInfo = getNetworkInfo(targetChainId);
        if (networkInfo) {
          try {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [{
                chainId: `0x${targetChainId.toString(16)}`,
                chainName: networkInfo.name,
                rpcUrls: [networkInfo.rpcUrl],
                blockExplorerUrls: [networkInfo.explorerUrl]
              }],
            });
          } catch (addError) {
            setError("Failed to add network");
          }
        }
      } else {
        setError("Failed to switch network");
      }
    }
  };

  // Contract interaction helpers
  const getContractWithSigner = (contractName) => {
    if (!contracts[contractName] || !signer) return null;
    return contracts[contractName].connect(signer);
  };

  // Utility functions for contract interactions
  const contractHelpers = {
    // Get user's PRN token balance
    getTokenBalance: async () => {
      if (!contracts.pronovaToken || !account) return '0';
      try {
        const balance = await contracts.pronovaToken.balanceOf(account);
        return ethers.utils.formatEther(balance);
      } catch (error) {
        console.error("Error getting token balance:", error);
        return '0';
      }
    },

    // Get user's USDT balance
    getUSDTBalance: async () => {
      if (!contracts.usdt || !account) return '0';
      try {
        const balance = await contracts.usdt.balanceOf(account);
        return ethers.utils.formatUnits(balance, 6); // USDT has 6 decimals
      } catch (error) {
        console.error("Error getting USDT balance:", error);
        return '0';
      }
    },

    // Get presale info
    getPresaleInfo: async () => {
      if (!contracts.pronovaPresale) return null;
      try {
        const [totalRaised, hardCap, progress, currentPhase] = await contracts.pronovaPresale.getPresaleProgress();
        return {
          totalRaised: ethers.utils.formatUnits(totalRaised, 6),
          hardCap: ethers.utils.formatUnits(hardCap, 6),
          progress: progress.toNumber(),
          currentPhase: currentPhase.toNumber()
        };
      } catch (error) {
        console.error("Error getting presale info:", error);
        return null;
      }
    },

    // Get user purchase info
    getUserPurchaseInfo: async () => {
      if (!contracts.pronovaPresale || !account) return null;
      try {
        const [totalTokens, totalPaid, referralTokens, claimed] = await contracts.pronovaPresale.getUserPurchaseInfo(account);
        return {
          totalTokens: ethers.utils.formatEther(totalTokens),
          totalPaid: ethers.utils.formatUnits(totalPaid, 6),
          referralTokens: ethers.utils.formatEther(referralTokens),
          claimed
        };
      } catch (error) {
        console.error("Error getting user purchase info:", error);
        return null;
      }
    }
  };

  return (
    <WalletContext.Provider 
      value={{ 
        account, 
        provider, 
        signer, 
        connectWallet, 
        connectMetaMask,
        connectWalletConnect,
        disconnectWallet, 
        switchNetwork,
        isConnecting, 
        error, 
        chainId,
        balance,
        walletType,
        contracts,
        networkInfo,
        getContractWithSigner,
        contractHelpers
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};