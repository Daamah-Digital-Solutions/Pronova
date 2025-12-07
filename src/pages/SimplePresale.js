import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaWallet, FaRocket, FaCheckCircle, FaExternalLinkAlt, FaDollarSign } from 'react-icons/fa';
import { useWeb3 } from '../context/Web3Context';
import { useTheme } from '../context/ThemeContext';
import Button from '../components/ui/Button';
import web3Service from '../services/web3Service';

const SimplePresale = () => {
  const { darkMode } = useTheme();
  const {
    isConnected: web3IsConnected,
    account: web3Account,
    connectWallet,
    presaleInfo,
    loadPresaleInfo,
    chainId
  } = useWeb3();

  const [usdAmount, setUsdAmount] = useState('100');
  const [bnbNeeded, setBnbNeeded] = useState('0');
  const [prnTokens, setPrnTokens] = useState('0');
  const [isProcessing, setIsProcessing] = useState(false);
  const [txHash, setTxHash] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [bnbPrice, setBnbPrice] = useState(0);

  // Load BNB price
  useEffect(() => {
    const loadPrices = async () => {
      try {
        const prices = await web3Service.getCurrentPrices();
        setBnbPrice(prices.bnb || 600);
      } catch (err) {
        console.error('Error loading prices:', err);
        setBnbPrice(600);
      }
    };
    loadPrices();
  }, []);

  // Calculate BNB and PRN amounts when USD amount changes
  useEffect(() => {
    if (!usdAmount || parseFloat(usdAmount) < 100) {
      setBnbNeeded('0');
      setPrnTokens('0');
      return;
    }

    const usd = parseFloat(usdAmount);
    const tokenPrice = presaleInfo?.tokenPrice || 0.014;

    const bnb = bnbPrice > 0 ? (usd / bnbPrice).toFixed(6) : '0';
    setBnbNeeded(bnb);

    const tokens = (usd / tokenPrice).toFixed(2);
    setPrnTokens(tokens);
  }, [usdAmount, bnbPrice, presaleInfo]);

  const handleBuyNow = async () => {
    setError('');
    setSuccess('');
    setTxHash('');

    if (!web3IsConnected || !web3Account) {
      setError('Please connect your wallet first');
      return;
    }

    const usd = parseFloat(usdAmount);
    if (isNaN(usd) || usd < 100) {
      setError('Minimum purchase is $100 USD');
      return;
    }

    if (parseFloat(bnbNeeded) <= 0) {
      setError('Invalid BNB amount calculated');
      return;
    }

    setIsProcessing(true);

    try {
      const referrerAddress = '0x0000000000000000000000000000000000000000';
      const result = await web3Service.buyWithBNB(parseFloat(bnbNeeded), referrerAddress);
      const receipt = await result.wait();

      setTxHash(receipt.transactionHash);
      setSuccess(`Successfully purchased ${prnTokens} PRN tokens!`);
      setUsdAmount('100');

      if (loadPresaleInfo) {
        await loadPresaleInfo();
      }
    } catch (err) {
      console.error('Purchase error:', err);
      if (err.code === 4001) {
        setError('Transaction rejected by user');
      } else if (err.message && err.message.includes('insufficient funds')) {
        setError('Insufficient BNB balance for this transaction');
      } else {
        setError(err.message || 'Transaction failed. Please try again.');
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const progressPercentage = presaleInfo?.totalRaised && presaleInfo?.hardCap
    ? ((parseFloat(presaleInfo.totalRaised) / parseFloat(presaleInfo.hardCap)) * 100).toFixed(2)
    : 0;

  const explorerUrl = chainId === 56
    ? 'https://bscscan.com'
    : 'https://testnet.bscscan.com';

  return (
    <div className={`min-h-screen py-20 px-4 ${
      darkMode
        ? 'bg-gradient-to-br from-dark-900 via-gray-900 to-dark-800'
        : 'bg-gradient-to-br from-gray-50 via-white to-blue-50'
    }`}>
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-primary-500/5 dark:bg-primary-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary-500/5 dark:bg-secondary-500/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-3xl mx-auto relative z-10">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-primary-600 to-primary-500 rounded-2xl mb-6 shadow-neon">
            <FaRocket className="text-4xl text-white" />
          </div>
          <h1 className={`text-5xl md:text-6xl font-heading font-bold mb-4 ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            PRN Token Presale
          </h1>
          <p className={`text-xl ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Join the future of decentralized investing
          </p>
        </motion.div>

        {/* Main Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className={`backdrop-blur-sm rounded-3xl p-8 md:p-10 shadow-2xl ${
            darkMode
              ? 'bg-dark-800/50 border border-primary-600/20'
              : 'bg-white/80 border border-gray-200'
          }`}
        >

          {/* Token Info */}
          <div className={`text-center mb-8 pb-8 ${
            darkMode ? 'border-b border-primary-600/20' : 'border-b border-gray-200'
          }`}>
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className={`px-4 py-2 rounded-full ${
                darkMode
                  ? 'bg-primary-600/20 border border-primary-600/30'
                  : 'bg-primary-100 border border-primary-200'
              }`}>
                <span className={`font-semibold ${
                  darkMode ? 'text-primary-400' : 'text-primary-700'
                }`}>
                  Phase {presaleInfo?.currentPhase || 1}
                </span>
              </div>
              <div className={`px-4 py-2 rounded-full ${
                darkMode
                  ? 'bg-secondary-500/20 border border-secondary-500/30'
                  : 'bg-secondary-100 border border-secondary-200'
              }`}>
                <span className={`font-semibold ${
                  darkMode ? 'text-secondary-300' : 'text-secondary-700'
                }`}>
                  ${presaleInfo?.tokenPrice || '0.014'} / PRN
                </span>
              </div>
            </div>
          </div>

          {/* Progress Section */}
          <div className="mb-10">
            <div className="flex justify-between items-center mb-3">
              <span className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Presale Progress
              </span>
              <span className="text-primary-400 font-bold text-lg">{progressPercentage}%</span>
            </div>

            <div className={`relative w-full h-6 rounded-full overflow-hidden ${
              darkMode
                ? 'bg-dark-900 border border-primary-600/20'
                : 'bg-gray-200 border border-gray-300'
            }`}>
              <motion.div
                className="h-full bg-gradient-to-r from-primary-600 to-primary-500 rounded-full shadow-neon"
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(progressPercentage, 100)}%` }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </div>

            <div className="flex justify-between items-center mt-3">
              <div className="text-center">
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Raised</p>
                <p className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  ${presaleInfo?.totalRaised || '0'}
                </p>
              </div>
              <div className="text-center">
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Target</p>
                <p className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  ${presaleInfo?.hardCap || '31,000,000'}
                </p>
              </div>
            </div>
          </div>

          {/* Connect Wallet or Purchase Form */}
          {!web3IsConnected ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <div className="text-center mb-6">
                <FaWallet className="text-6xl text-primary-500 mx-auto mb-4" />
                <p className={`mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Connect your wallet to participate
                </p>
                <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                  MetaMask, Trust Wallet, or WalletConnect
                </p>
              </div>
              <Button
                variant="gradient"
                size="large"
                fullWidth
                onClick={connectWallet}
              >
                <FaWallet />
                Connect Wallet
              </Button>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="space-y-6"
            >
              {/* Connected Account */}
              <div className={`flex items-center justify-between p-4 rounded-xl ${
                darkMode
                  ? 'bg-primary-600/10 border border-primary-600/20'
                  : 'bg-primary-50 border border-primary-200'
              }`}>
                <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Connected:</span>
                <span className={`font-mono font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {web3Account?.slice(0, 6)}...{web3Account?.slice(-4)}
                </span>
              </div>

              {/* USD Amount Input */}
              <div>
                <label className={`block font-semibold mb-3 ${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Enter Amount (USD)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                    <FaDollarSign className={`text-xl ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                  </div>
                  <input
                    type="number"
                    min="100"
                    step="10"
                    value={usdAmount}
                    onChange={(e) => setUsdAmount(e.target.value)}
                    className={`w-full rounded-xl pl-12 pr-4 py-4 text-lg font-semibold placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all ${
                      darkMode
                        ? 'bg-dark-900 border border-primary-600/30 text-white focus:border-primary-500'
                        : 'bg-white border border-gray-300 text-gray-900 focus:border-primary-500'
                    }`}
                    placeholder="100"
                    disabled={isProcessing}
                  />
                </div>
                <p className="text-sm text-gray-500 mt-2">Minimum: $100 USD</p>
              </div>

              {/* Calculation Display */}
              <div className={`rounded-xl p-6 space-y-4 ${
                darkMode
                  ? 'bg-dark-900 border border-primary-600/20'
                  : 'bg-gray-50 border border-gray-200'
              }`}>
                <div className="flex justify-between items-center">
                  <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>BNB Needed</span>
                  <span className={`font-bold text-xl ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {bnbNeeded} BNB
                  </span>
                </div>
                <div className={`h-px ${darkMode ? 'bg-primary-600/20' : 'bg-gray-200'}`}></div>
                <div className="flex justify-between items-center">
                  <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>PRN Tokens</span>
                  <span className="text-primary-400 font-bold text-xl">{prnTokens} PRN</span>
                </div>
                <div className={`h-px ${darkMode ? 'bg-primary-600/20' : 'bg-gray-200'}`}></div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">BNB Price</span>
                  <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>${bnbPrice}</span>
                </div>
              </div>

              {/* Buy Button */}
              <Button
                variant="gradient"
                size="large"
                fullWidth
                onClick={handleBuyNow}
                disabled={isProcessing || parseFloat(usdAmount) < 100}
              >
                {isProcessing ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <FaRocket />
                    </motion.div>
                    Processing...
                  </>
                ) : (
                  <>
                    <FaRocket />
                    Buy PRN Tokens
                  </>
                )}
              </Button>

              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-500/10 border border-red-500/30 rounded-xl p-4"
                >
                  <p className="text-red-400 text-sm font-medium">{error}</p>
                </motion.div>
              )}

              {/* Success Message */}
              {success && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-green-500/10 border border-green-500/30 rounded-xl p-6 space-y-3"
                >
                  <div className="flex items-center gap-3">
                    <FaCheckCircle className="text-green-400 text-2xl" />
                    <p className="text-green-400 font-semibold text-lg">{success}</p>
                  </div>

                  {txHash && (
                    <div className="space-y-2">
                      <p className="text-xs text-gray-400 uppercase tracking-wide">Transaction Hash</p>
                      <p className={`text-xs font-mono break-all rounded-lg p-3 ${
                        darkMode ? 'text-gray-300 bg-dark-900' : 'text-gray-700 bg-gray-100'
                      }`}>
                        {txHash}
                      </p>
                      <a
                        href={`${explorerUrl}/tx/${txHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-primary-400 hover:text-primary-300 text-sm font-medium transition-colors"
                      >
                        View on BSCScan
                        <FaExternalLinkAlt className="text-xs" />
                      </a>
                    </div>
                  )}
                </motion.div>
              )}
            </motion.div>
          )}
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center mt-8"
        >
          <p className="text-gray-500 text-sm">
            Powered by Pronova Protocol • Binance Smart Chain
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default SimplePresale;
