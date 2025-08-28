import React, { useState } from 'react';
import { useWallet } from '../../context/WalletContext';
import { FaWallet, FaExternalLinkAlt, FaTimes, FaSpinner } from 'react-icons/fa';
import { SiMetamask } from 'react-icons/si';

const WalletConnector = ({ className = '' }) => {
  const {
    account,
    connectMetaMask,
    connectWalletConnect,
    disconnectWallet,
    isConnecting,
    error,
    chainId,
    balance,
    walletType,
    networkInfo,
    switchNetwork
  } = useWallet();

  const [showModal, setShowModal] = useState(false);
  const [showAccountModal, setShowAccountModal] = useState(false);

  // Format address for display
  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // Format balance for display
  const formatBalance = (bal) => {
    if (!bal) return '0.00';
    return parseFloat(bal).toFixed(4);
  };

  // Check if network is supported
  const isSupportedNetwork = () => {
    const supportedChainIds = [1, 56, 11155111, 97]; // Mainnet, BSC, Sepolia, BSC Testnet
    return supportedChainIds.includes(chainId);
  };

  // Handle wallet connection
  const handleConnect = async (type) => {
    try {
      if (type === 'metamask') {
        await connectMetaMask();
      } else if (type === 'walletconnect') {
        await connectWalletConnect();
      }
      setShowModal(false);
    } catch (error) {
      console.error('Connection error:', error);
    }
  };

  // Handle network switch
  const handleSwitchNetwork = async (targetChainId) => {
    try {
      await switchNetwork(targetChainId);
    } catch (error) {
      console.error('Network switch error:', error);
    }
  };

  // Handle disconnect
  const handleDisconnect = () => {
    disconnectWallet();
    setShowAccountModal(false);
  };

  // Copy address to clipboard
  const copyAddress = () => {
    if (account) {
      navigator.clipboard.writeText(account);
      // You can add a toast notification here
    }
  };

  // If wallet is connected
  if (account) {
    return (
      <>
        <div className={`relative ${className}`}>
          {/* Network warning */}
          {!isSupportedNetwork() && (
            <div className="mb-2 p-2 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded text-sm">
              Unsupported network. Please switch to a supported network.
            </div>
          )}

          {/* Connected wallet display */}
          <button
            onClick={() => setShowAccountModal(true)}
            className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg"
          >
            <FaWallet className="w-4 h-4" />
            <div className="flex flex-col items-start">
              <span className="text-sm font-medium">{formatAddress(account)}</span>
              <span className="text-xs opacity-80">{formatBalance(balance)} {networkInfo?.name === 'BSC Mainnet' || networkInfo?.name === 'BSC Testnet' ? 'BNB' : 'ETH'}</span>
            </div>
          </button>
        </div>

        {/* Account Modal */}
        {showAccountModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Account Details</h3>
                <button
                  onClick={() => setShowAccountModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <FaTimes className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Wallet Info */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <SiMetamask className="w-5 h-5 text-orange-500" />
                    <span className="font-medium text-gray-900 capitalize">{walletType}</span>
                  </div>
                  <p className="text-sm text-gray-600">Connected</p>
                </div>

                {/* Address */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <div className="flex items-center space-x-2">
                    <code className="bg-gray-100 px-2 py-1 rounded text-sm flex-1">{account}</code>
                    <button
                      onClick={copyAddress}
                      className="text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      <FaExternalLinkAlt className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Balance */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Balance</label>
                  <p className="text-lg font-semibold text-gray-900">
                    {formatBalance(balance)} {networkInfo?.name === 'BSC Mainnet' || networkInfo?.name === 'BSC Testnet' ? 'BNB' : 'ETH'}
                  </p>
                </div>

                {/* Network */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Network</label>
                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-1 rounded text-sm ${isSupportedNetwork() ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {networkInfo?.name || `Chain ID: ${chainId}`}
                    </span>
                    {!isSupportedNetwork() && (
                      <button
                        onClick={() => handleSwitchNetwork(11155111)} // Switch to Sepolia
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        Switch Network
                      </button>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-2 pt-4">
                  <button
                    onClick={handleDisconnect}
                    className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Disconnect
                  </button>
                  <button
                    onClick={() => setShowAccountModal(false)}
                    className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  // If wallet is not connected
  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        disabled={isConnecting}
        className={`flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      >
        {isConnecting ? (
          <>
            <FaSpinner className="w-5 h-5 animate-spin" />
            <span>Connecting...</span>
          </>
        ) : (
          <>
            <FaWallet className="w-5 h-5" />
            <span>Connect Wallet</span>
          </>
        )}
      </button>

      {/* Connection Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Connect Wallet</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FaTimes className="w-6 h-6" />
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div className="space-y-3">
              {/* MetaMask */}
              <button
                onClick={() => handleConnect('metamask')}
                disabled={isConnecting}
                className="w-full flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 disabled:opacity-50"
              >
                <SiMetamask className="w-8 h-8 text-orange-500" />
                <div className="flex-1 text-left">
                  <h4 className="font-medium text-gray-900">MetaMask</h4>
                  <p className="text-sm text-gray-600">Connect using browser wallet</p>
                </div>
                <FaExternalLinkAlt className="w-4 h-4 text-gray-400" />
              </button>

              {/* WalletConnect */}
              <button
                onClick={() => handleConnect('walletconnect')}
                disabled={isConnecting}
                className="w-full flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 disabled:opacity-50"
              >
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                  <FaWallet className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1 text-left">
                  <h4 className="font-medium text-gray-900">WalletConnect</h4>
                  <p className="text-sm text-gray-600">Connect using mobile wallet</p>
                </div>
                <FaExternalLinkAlt className="w-4 h-4 text-gray-400" />
              </button>
            </div>

            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>New to Ethereum?</strong> Learn more about wallets and how to get started.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default WalletConnector;