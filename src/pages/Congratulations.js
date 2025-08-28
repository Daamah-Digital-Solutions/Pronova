import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FaCheckCircle, 
  FaRocket, 
  FaShare, 
  FaTwitter, 
  FaTelegram, 
  FaDiscord,
  FaExternalLinkAlt,
  FaChartLine,
  FaGift
} from 'react-icons/fa';
import { useSimpleWallet } from '../context/SimpleWalletContext';
import Button from '../components/ui/Button';

const Congratulations = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { account, formatAddress } = useSimpleWallet();
  const [purchaseData, setPurchaseData] = useState(null);
  const [showConfetti, setShowConfetti] = useState(true);

  // Get purchase data from location state or localStorage
  useEffect(() => {
    if (location.state?.purchaseData) {
      setPurchaseData(location.state.purchaseData);
    } else {
      // If no state, redirect to dashboard
      navigate('/dashboard');
    }

    // Hide confetti after 3 seconds
    const timer = setTimeout(() => setShowConfetti(false), 3000);
    return () => clearTimeout(timer);
  }, [location.state, navigate]);

  const shareText = `🚀 I just bought ${purchaseData?.tokens || 0} $PRN tokens! Join the Pronova presale now! 💎`;
  const shareUrl = window.location.origin;

  const socialShares = [
    {
      name: 'Twitter',
      icon: FaTwitter,
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      name: 'Telegram',
      icon: FaTelegram,
      url: `https://t.me/share/url?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
      color: 'bg-blue-400 hover:bg-blue-500'
    },
    {
      name: 'Discord',
      icon: FaDiscord,
      url: '#',
      color: 'bg-indigo-500 hover:bg-indigo-600'
    }
  ];

  if (!purchaseData) {
    return null; // Will redirect to dashboard
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-10 -left-10 w-20 h-20 bg-blue-500/10 rounded-full animate-pulse"></div>
        <div className="absolute top-1/4 right-10 w-16 h-16 bg-purple-500/10 rounded-full animate-bounce delay-75"></div>
        <div className="absolute bottom-1/4 left-1/4 w-12 h-12 bg-pink-500/10 rounded-full animate-pulse delay-150"></div>
        <div className="absolute top-1/2 right-1/3 w-8 h-8 bg-yellow-500/10 rounded-full animate-bounce delay-300"></div>
      </div>

      {/* Confetti Effect */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
              initial={{
                top: '-10px',
                left: `${Math.random() * 100}%`,
                rotate: 0,
                scale: 0
              }}
              animate={{
                top: '100vh',
                rotate: 360,
                scale: [0, 1, 0]
              }}
              transition={{
                duration: 3,
                delay: Math.random() * 2,
                ease: 'easeOut'
              }}
            />
          ))}
        </div>
      )}

      <div className="container-custom pt-20 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center"
        >
          {/* Success Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2, type: "spring", stiffness: 200 }}
            className="mb-8"
          >
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-green-500/20 rounded-full animate-ping"></div>
              <FaCheckCircle className="w-24 h-24 text-green-500 relative z-10" />
            </div>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-green-600 via-blue-600 to-purple-600"
          >
            Congratulations! 🎉
          </motion.h1>

          {/* Success Message */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 mb-8"
          >
            Your Pronova token purchase was successful!
          </motion.p>

          {/* Purchase Details Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-8 mx-auto max-w-2xl"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Tokens Purchased */}
              <div className="text-center p-4 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-xl">
                <FaRocket className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Tokens Purchased</h3>
                <p className="text-3xl font-bold text-green-600">
                  {parseFloat(purchaseData.tokens).toLocaleString()} PRN
                </p>
                {purchaseData.referralBonus > 0 && (
                  <p className="text-sm text-green-500 mt-1">
                    + {purchaseData.referralBonus} bonus tokens
                  </p>
                )}
              </div>

              {/* Amount Paid */}
              <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl">
                <FaChartLine className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Amount Paid</h3>
                <p className="text-3xl font-bold text-blue-600">
                  ${parseFloat(purchaseData.amount).toLocaleString()}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  via {purchaseData.paymentMethod}
                </p>
              </div>
            </div>

            {/* Transaction Details */}
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Wallet:</span>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {formatAddress(account || purchaseData.account)}
                  </p>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Transaction:</span>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {purchaseData.hash?.substring(0, 10)}...
                  </p>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Date:</span>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {new Date(purchaseData.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Next Steps */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.0 }}
            className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white mb-8"
          >
            <h3 className="text-2xl font-bold mb-4">What's Next?</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <FaRocket className="w-8 h-8 mx-auto mb-3 opacity-80" />
                <h4 className="font-semibold mb-2">Token Launch</h4>
                <p className="text-sm opacity-90">Your tokens will be available at TGE (Token Generation Event)</p>
              </div>
              <div className="text-center">
                <FaGift className="w-8 h-8 mx-auto mb-3 opacity-80" />
                <h4 className="font-semibold mb-2">Early Access</h4>
                <p className="text-sm opacity-90">Get exclusive access to Pronova platform features</p>
              </div>
              <div className="text-center">
                <FaDiscord className="w-8 h-8 mx-auto mb-3 opacity-80" />
                <h4 className="font-semibold mb-2">Join Community</h4>
                <p className="text-sm opacity-90">Connect with other investors in our Discord</p>
              </div>
            </div>
          </motion.div>

          {/* Share Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.2 }}
            className="mb-8"
          >
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              <FaShare className="inline-block mr-2" />
              Share Your Success!
            </h3>
            <div className="flex justify-center space-x-4">
              {socialShares.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center space-x-2 px-4 py-2 ${social.color} text-white rounded-lg transition-all duration-300 transform hover:scale-105`}
                >
                  <social.icon className="w-5 h-5" />
                  <span>{social.name}</span>
                </a>
              ))}
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.4 }}
            className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6"
          >
            <Link to="/dashboard">
              <Button variant="gradient" size="lg">
                View Dashboard
              </Button>
            </Link>
            
            <Link to="/presale">
              <Button variant="outline" size="lg">
                Buy More Tokens
              </Button>
            </Link>

            <a 
              href={`https://etherscan.io/tx/${purchaseData.hash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              <span>View Transaction</span>
              <FaExternalLinkAlt className="w-4 h-4" />
            </a>
          </motion.div>

          {/* Footer Message */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.6 }}
            className="mt-12 text-center"
          >
            <p className="text-gray-600 dark:text-gray-400">
              Thank you for believing in Pronova! 🚀 
              <br />
              <span className="text-sm">
                Keep an eye on your email for important updates about the token launch.
              </span>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Congratulations;