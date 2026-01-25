import React from 'react';
import { useSimpleWallet } from '../../context/SimpleWalletContext';
import { useWeb3 } from '../../context/Web3Context';
import { FaWallet, FaSpinner, FaExclamationTriangle } from 'react-icons/fa';

const SimpleWalletConnector = ({ className = '' }) => {
  // Use both contexts - Web3Context for mobile support (WalletConnect)
  const {
    account: simpleAccount,
    isConnecting: simpleConnecting,
    error: simpleError,
    connectWallet: simpleConnectWallet,
    disconnectWallet: simpleDisconnect,
    isMetaMaskAvailable,
    formatAddress: simpleFormatAddress,
    getNetworkName: simpleGetNetworkName,
    chainId: simpleChainId
  } = useSimpleWallet();

  const {
    account: web3Account,
    isConnecting: web3Connecting,
    error: web3Error,
    connectWallet: web3ConnectWallet,
    disconnectWallet: web3Disconnect,
    formatAddress: web3FormatAddress,
    getNetworkName: web3GetNetworkName,
    chainId: web3ChainId,
    isMobile,
    isWalletBrowser
  } = useWeb3();

  // Use Web3Context as primary (supports WalletConnect for mobile)
  // Fall back to SimpleWalletContext for desktop with MetaMask
  const account = web3Account || simpleAccount;
  const isConnecting = web3Connecting || simpleConnecting;
  const error = web3Error || simpleError;
  const chainId = web3ChainId || simpleChainId;

  // Choose the appropriate connect function based on environment
  const connectWallet = () => {
    // On mobile or when in wallet browser, use Web3Context (supports WalletConnect)
    if (isMobile || !isMetaMaskAvailable) {
      web3ConnectWallet();
    } else {
      // On desktop with MetaMask available, use Web3Context as well for consistency
      web3ConnectWallet();
    }
  };

  const disconnectWallet = () => {
    if (web3Account) {
      web3Disconnect();
    }
    if (simpleAccount) {
      simpleDisconnect();
    }
  };

  const formatAddress = (addr) => {
    return web3FormatAddress(addr) || simpleFormatAddress(addr);
  };

  const getNetworkName = () => {
    return web3GetNetworkName?.() || simpleGetNetworkName();
  };

  const isCorrectNetwork = [31337, 97, 56].includes(chainId); // Hardhat localhost, BSC Testnet, BSC Mainnet

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

  // On mobile, we can always connect via WalletConnect even without MetaMask
  const canConnect = isMetaMaskAvailable || isMobile;

  return (
    <div className={`${className}`}>
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      <button
        onClick={connectWallet}
        disabled={isConnecting}
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
            <span>Connect Wallet</span>
          </>
        )}
      </button>

      {/* Mobile hint */}
      {isMobile && !isWalletBrowser && !isConnecting && (
        <p className="mt-2 text-sm text-gray-500">
          You'll be redirected to your wallet app to approve the connection
        </p>
      )}

      {/* Desktop without MetaMask hint */}
      {!isMetaMaskAvailable && !isMobile && (
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
          {' '}or use WalletConnect to connect your wallet
        </p>
      )}
    </div>
  );
};

export default SimpleWalletConnector;