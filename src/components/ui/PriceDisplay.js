import React, { useState, useEffect } from 'react';
import { useSimpleWallet } from '../../context/SimpleWalletContext';
import { useWeb3 } from '../../context/Web3Context';
import web3Service from '../../services/web3Service';
import { FaEthereum, FaSpinner, FaSync } from 'react-icons/fa';
import { SiBinance } from 'react-icons/si';

const PriceDisplay = ({ className = '' }) => {
  const { account: simpleAccount, chainId: simpleChainId } = useSimpleWallet();
  const {
    account: web3Account,
    chainId: web3ChainId,
    isConnected: web3IsConnected
  } = useWeb3();

  // Use Web3 account if available
  const account = web3Account || simpleAccount;
  const chainId = web3ChainId || simpleChainId;
  
  const [prices, setPrices] = useState({
    eth: '0',
    bnb: '0',
    ethChainlinkActive: false,
    bnbChainlinkActive: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [error, setError] = useState('');

  // Load prices from blockchain/API
  const loadPrices = async () => {
    setIsLoading(true);
    setError('');

    try {
      const priceData = await web3Service.getCurrentPrices();
      setPrices(priceData);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Error loading prices:', error);
      setError('Failed to load prices');
      // Set fallback prices on error
      setPrices({
        eth: '3000',
        bnb: '300',
        ethChainlinkActive: false,
        bnbChainlinkActive: false
      });
      setLastUpdate(new Date());
    } finally {
      setIsLoading(false);
    }
  };

  // Load prices on component mount
  useEffect(() => {
    loadPrices();
    // Reload prices every 60 seconds
    const interval = setInterval(loadPrices, 60000);
    return () => clearInterval(interval);
  }, []);

  const formatPrice = (price) => {
    const numPrice = parseFloat(price);
    if (numPrice >= 1000) {
      return `$${(numPrice / 1000).toFixed(1)}k`;
    }
    return `$${numPrice.toFixed(2)}`;
  };

  const formatTime = (date) => {
    if (!date) return '';
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (!account) {
    return (
      <div className={`bg-gray-100 dark:bg-gray-800 rounded-lg p-4 ${className}`}>
        <p className="text-gray-500 text-center">Connect wallet to see live prices</p>
      </div>
    );
  }

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Live Crypto Prices
        </h3>
        <button
          onClick={loadPrices}
          disabled={isLoading}
          className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors disabled:opacity-50"
        >
          <FaSync className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          <span className="text-sm">Refresh</span>
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Price Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* ETH Price */}
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
          <div className="flex items-center space-x-3">
            <FaEthereum className="w-8 h-8 text-blue-500" />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  ETH
                </span>
                {prices.ethChainlinkActive && (
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                    Live
                  </span>
                )}
              </div>
              <div className="text-lg font-bold text-gray-900 dark:text-white">
                {formatPrice(prices.eth)}
              </div>
            </div>
          </div>
        </div>

        {/* BNB Price */}
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
          <div className="flex items-center space-x-3">
            <SiBinance className="w-8 h-8 text-yellow-500" />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  BNB
                </span>
                {prices.bnbChainlinkActive && (
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                    Live
                  </span>
                )}
              </div>
              <div className="text-lg font-bold text-gray-900 dark:text-white">
                {formatPrice(prices.bnb)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Loading Indicator */}
      {isLoading && (
        <div className="flex items-center justify-center mt-4 text-blue-600">
          <FaSpinner className="w-4 h-4 animate-spin mr-2" />
          <span className="text-sm">Updating prices...</span>
        </div>
      )}

      {/* Last Update */}
      {lastUpdate && !isLoading && (
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500">
            Last updated: {formatTime(lastUpdate)}
          </p>
        </div>
      )}

      {/* Data Source Info */}
      <div className="mt-4 text-center">
        <p className="text-xs text-gray-400">
          {prices.ethChainlinkActive || prices.bnbChainlinkActive ? 'Chainlink Oracle' : 'CoinGecko API'}
        </p>
      </div>
    </div>
  );
};

export default PriceDisplay;