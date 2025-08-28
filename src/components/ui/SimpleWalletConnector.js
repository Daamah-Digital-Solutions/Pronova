import React from 'react';
import { useSimpleWallet } from '../../context/SimpleWalletContext';
import { FaWallet, FaSpinner, FaExclamationTriangle } from 'react-icons/fa';

const SimpleWalletConnector = ({ className = '' }) => {
  const {
    account,
    isConnecting,
    error,
    connectWallet,
    disconnectWallet,
    isMetaMaskAvailable,
    formatAddress,
    getNetworkName,
    chainId
  } = useSimpleWallet();
  
  const isCorrectNetwork = chainId === 31337; // Hardhat localhost

  if (account) {
    return (
      <div className={`${className}`}>
        {/* Network Warning */}
        {!isCorrectNetwork && (
          <div className="mb-4 p-3 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded-lg text-sm">
            <div className="flex items-center space-x-2">
              <FaExclamationTriangle />
              <span>Connected to {getNetworkName()}</span>
            </div>
          </div>
        )}

        <div className="flex flex-col space-y-3">
          {/* Connection Status */}
          <div className="flex items-center space-x-4">
            <div className={`px-3 py-2 rounded-lg text-sm ${
              isCorrectNetwork ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
            }`}>
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${
                  isCorrectNetwork ? 'bg-green-500' : 'bg-yellow-500'
                }`}></div>
                <span>{isCorrectNetwork ? 'Connected' : 'Wrong Network'}</span>
              </div>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-lg px-4 py-2 shadow-sm">
              <div className="text-sm">
                <div className="font-medium text-gray-900">{formatAddress(account)}</div>
                <div className="text-gray-500">{getNetworkName()}</div>
              </div>
            </div>
            
            <button
              onClick={disconnectWallet}
              className="text-red-600 hover:text-red-800 text-sm"
            >
              Disconnect
            </button>
          </div>

          {/* Balance Display */}
          {account && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="text-sm">
                <div className="font-medium text-blue-900">
                  Wallet Connected
                </div>
                <div className="text-blue-600 text-xs">
                  Ready for presale purchases
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`${className}`}>
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}
      
      <button
        onClick={connectWallet}
        disabled={isConnecting || !isMetaMaskAvailable}
        className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isConnecting ? (
          <>
            <FaSpinner className="w-5 h-5 animate-spin" />
            <span>Connecting...</span>
          </>
        ) : (
          <>
            <FaWallet className="w-5 h-5" />
            <span>
              {isMetaMaskAvailable ? 'Connect Wallet' : 'Install MetaMask'}
            </span>
          </>
        )}
      </button>
      
      {!isMetaMaskAvailable && (
        <p className="mt-2 text-sm text-gray-500">
          Please install{' '}
          <a 
            href="https://metamask.io/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            MetaMask
          </a>
          {' '}to connect your wallet
        </p>
      )}
    </div>
  );
};

export default SimpleWalletConnector;