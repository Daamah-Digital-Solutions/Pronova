import React, { createContext, useContext, useState, useEffect } from 'react';

const SimpleWalletContext = createContext();

export const useSimpleWallet = () => useContext(SimpleWalletContext);

export const SimpleWalletProvider = ({ children }) => {
  const [account, setAccount] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState(null);
  const [chainId, setChainId] = useState(null);

  // Check if MetaMask is available
  const isMetaMaskAvailable = () => {
    return typeof window !== 'undefined' && window.ethereum;
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
      }
    } catch (error) {
      console.error("Error connecting wallet:", error);
      setError("Failed to connect wallet. Please try again.");
    } finally {
      setIsConnecting(false);
    }
  };

  // Disconnect wallet
  const disconnectWallet = () => {
    setAccount(null);
    setChainId(null);
    setError(null);
  };

  // Listen for account changes
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

  // Format address for display
  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // Get network name
  const getNetworkName = (chainId) => {
    const networks = {
      1: 'Ethereum Mainnet',
      11155111: 'Sepolia Testnet',
      56: 'BSC Mainnet',
      97: 'BSC Testnet'
    };
    return networks[chainId] || `Chain ID: ${chainId}`;
  };

  const value = {
    account,
    chainId,
    isConnecting,
    error,
    connectWallet,
    disconnectWallet,
    isMetaMaskAvailable: isMetaMaskAvailable(),
    formatAddress,
    getNetworkName: () => getNetworkName(chainId)
  };

  return (
    <SimpleWalletContext.Provider value={value}>
      {children}
    </SimpleWalletContext.Provider>
  );
};