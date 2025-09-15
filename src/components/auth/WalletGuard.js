import React from 'react';
import { motion } from 'framer-motion';
import { FaWallet, FaExclamationTriangle } from 'react-icons/fa';
import { useSimpleWallet } from '../../context/SimpleWalletContext';
import Button from '../ui/Button';

const WalletGuard = ({ children }) => {
  const { account, connectWallet } = useSimpleWallet();

  // Check for mock account in localStorage for testing
  const mockAccount = localStorage.getItem('mockAccount');
  const activeAccount = account || (mockAccount && mockAccount !== 'null' ? mockAccount : null);

  if (!activeAccount) {
    return (
      <div className="min-h-screen pt-32 pb-16 bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-md mx-auto text-center"
          >
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700">
              {/* Icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="w-20 h-20 bg-gradient-to-r from-primary-600 to-secondary-500 rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <FaWallet className="text-3xl text-white" />
              </motion.div>

              {/* Title */}
              <h1 className="text-2xl md:text-3xl font-bold mb-4 text-gray-900 dark:text-white">
                Wallet Connection Required
              </h1>

              {/* Description */}
              <p className="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                To access your dashboard and view your PRN token purchases, please connect your cryptocurrency wallet.
              </p>

              {/* Warning */}
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-xl p-4 mb-6">
                <div className="flex items-start gap-3">
                  <FaExclamationTriangle className="text-yellow-600 dark:text-yellow-400 text-lg flex-shrink-0 mt-0.5" />
                  <div className="text-left">
                    <h3 className="font-semibold text-yellow-800 dark:text-yellow-300 mb-1 text-sm">
                      Important
                    </h3>
                    <p className="text-xs text-yellow-700 dark:text-yellow-400 leading-relaxed">
                      Connect the same wallet you used to purchase PRN tokens to view your transaction history and token balance.
                    </p>
                  </div>
                </div>
              </div>

              {/* Connect Wallet Button */}
              <div className="space-y-4">
                <Button
                  variant="primary"
                  size="large"
                  fullWidth
                  onClick={connectWallet}
                  className="group"
                >
                  <FaWallet className="group-hover:scale-110 transition-transform" />
                  Connect Wallet
                </Button>

                {/* Mock Wallet for Testing */}
                {process.env.NODE_ENV === 'development' && (
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                    <p className="text-xs text-gray-500 mb-2">For testing purposes:</p>
                    <Button
                      variant="outline"
                      size="medium"
                      fullWidth
                      onClick={() => {
                        const mockAddr = '0xMOCK1234567890abcdef1234567890abcdef1234';
                        localStorage.setItem('mockAccount', mockAddr);
                        window.location.reload(); // Refresh to trigger auth check
                      }}
                    >
                      Use Mock Wallet
                    </Button>
                  </div>
                )}
              </div>

              {/* Help Text */}
              <div className="mt-8 text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                  Don't have a wallet?
                </p>
                <div className="flex flex-col gap-2 text-xs">
                  <a 
                    href="https://metamask.io/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary-600 dark:text-primary-400 hover:underline"
                  >
                    Download MetaMask
                  </a>
                  <a 
                    href="https://trustwallet.com/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary-600 dark:text-primary-400 hover:underline"
                  >
                    Download Trust Wallet
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // If wallet is connected, render the protected content
  return children;
};

export default WalletGuard;