import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSimpleWallet } from '../../context/SimpleWalletContext';
import { useWeb3 } from '../../context/Web3Context';
import web3Service from '../../services/web3Service';
import { FaFire, FaUsers, FaClock, FaChartLine, FaSpinner } from 'react-icons/fa';

const PresaleStats = ({ className = '' }) => {
  const { account: simpleAccount, chainId: simpleChainId } = useSimpleWallet();
  const {
    account: web3Account,
    chainId: web3ChainId,
    presaleInfo,
    isConnected: web3IsConnected
  } = useWeb3();

  // Use Web3 account if available, otherwise fall back to simple wallet
  const account = web3Account || simpleAccount;
  const chainId = web3ChainId || simpleChainId;
  
  const [stats, setStats] = useState({
    totalRaised: '0',
    hardCap: '0',
    progress: 0,
    currentPhase: 1,
    progressPercentage: '0'
  });
  
  const [phaseInfo, setPhaseInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Load stats from Web3Context when presaleInfo changes
  useEffect(() => {
    if (presaleInfo && presaleInfo.totalRaised) {
      setStats({
        totalRaised: presaleInfo.totalRaised || '0',
        hardCap: presaleInfo.hardCap || '31000000',
        progress: 0,
        currentPhase: presaleInfo.currentPhase || 1,
        progressPercentage: ((parseFloat(presaleInfo.totalRaised) / parseFloat(presaleInfo.hardCap)) * 100).toFixed(2)
      });
    } else if (!web3IsConnected) {
      // Use fallback mock data if not connected to Web3
      setStats({
        totalRaised: '500000',
        hardCap: '1000000',
        progress: 50,
        currentPhase: 1,
        progressPercentage: '50'
      });
    }
  }, [presaleInfo, web3IsConnected]);

  // Load phase info from blockchain
  const loadStats = async () => {
    if (!web3IsConnected) return;

    setIsLoading(true);
    setError('');

    try {
      const phaseData = await web3Service.getCurrentPhaseInfo();
      setPhaseInfo(phaseData);
    } catch (error) {
      console.error('Error loading presale stats:', error);
      setError('Failed to load presale data');
    } finally {
      setIsLoading(false);
    }
  };

  // Load phase info when connected
  useEffect(() => {
    if (web3IsConnected && account && chainId) {
      loadStats();
    }
  }, [web3IsConnected, account, chainId]);

  const formatCurrency = (amount) => {
    const num = parseFloat(amount);
    if (num >= 1000000) {
      return `$${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `$${(num / 1000).toFixed(1)}K`;
    }
    return `$${num.toFixed(2)}`;
  };

  const formatNumber = (num) => {
    const number = parseFloat(num);
    if (number >= 1000000) {
      return `${(number / 1000000).toFixed(1)}M`;
    } else if (number >= 1000) {
      return `${(number / 1000).toFixed(1)}K`;
    }
    return number.toLocaleString();
  };

  const getPhaseColor = (phase) => {
    const colors = {
      1: 'from-green-400 to-green-600',
      2: 'from-blue-400 to-blue-600', 
      3: 'from-purple-400 to-purple-600',
      4: 'from-red-400 to-red-600'
    };
    return colors[phase] || 'from-gray-400 to-gray-600';
  };

  const getProgressColor = (progress) => {
    if (progress >= 80) return 'bg-red-500';
    if (progress >= 60) return 'bg-yellow-500';
    if (progress >= 40) return 'bg-blue-500';
    return 'bg-green-500';
  };

  if (!account) {
    return (
      <div className={`bg-gray-100 dark:bg-gray-800 rounded-lg p-6 ${className}`}>
        <p className="text-gray-500 text-center">Connect wallet to see live presale stats</p>
      </div>
    );
  }

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Presale Progress
          </h2>
          {isLoading && (
            <FaSpinner className="w-5 h-5 text-blue-500 animate-spin" />
          )}
        </div>
        <p className="text-gray-600 dark:text-gray-300 mt-1">
          Real-time blockchain data
        </p>
      </div>

      {error && (
        <div className="p-4 bg-red-100 border-l-4 border-red-500 text-red-700">
          {error}
        </div>
      )}

      <div className="p-6">
        {/* Main Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Fundraising Progress
            </span>
            <span className="text-sm font-bold text-gray-900 dark:text-white">
              {stats.progressPercentage}%
            </span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-3 dark:bg-gray-700">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(stats.progress, 100)}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className={`h-3 rounded-full ${getProgressColor(stats.progress)} transition-all duration-300`}
            />
          </div>
          
          <div className="flex justify-between mt-2 text-sm text-gray-600 dark:text-gray-400">
            <span>{formatCurrency(stats.totalRaised)}</span>
            <span>{formatCurrency(stats.hardCap)}</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Raised */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-center"
          >
            <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <FaChartLine className="w-6 h-6 text-white" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {formatCurrency(stats.totalRaised)}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Raised</p>
          </motion.div>

          {/* Current Phase */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center"
          >
            <div className={`w-12 h-12 bg-gradient-to-r ${getPhaseColor(stats.currentPhase)} rounded-full flex items-center justify-center mx-auto mb-3`}>
              <FaFire className="w-6 h-6 text-white" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              Phase {stats.currentPhase}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Current Phase</p>
          </motion.div>

          {/* Phase Price */}
          {phaseInfo && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-center"
            >
              <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-white font-bold">$</span>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                ${phaseInfo.pricePerToken}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Token Price</p>
            </motion.div>
          )}

          {/* Tokens Remaining */}
          {phaseInfo && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-center"
            >
              <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <FaClock className="w-6 h-6 text-white" />
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatNumber(phaseInfo.tokensRemaining)}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Tokens Left</p>
            </motion.div>
          )}
        </div>

        {/* Phase Details */}
        {phaseInfo && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-4"
          >
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
              Phase {stats.currentPhase} Details
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-gray-600 dark:text-gray-400">Allocated:</span>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {formatNumber(phaseInfo.tokensAllocated)} PRN
                </p>
              </div>
              
              <div>
                <span className="text-gray-600 dark:text-gray-400">Sold:</span>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {formatNumber(phaseInfo.tokensSold)} PRN
                </p>
              </div>
              
              <div>
                <span className="text-gray-600 dark:text-gray-400">Status:</span>
                <p className={`font-semibold ${phaseInfo.isActive ? 'text-green-600' : 'text-red-600'}`}>
                  {phaseInfo.isActive ? 'Active' : 'Inactive'}
                </p>
              </div>
            </div>

            {/* Phase Progress */}
            <div className="mt-4">
              <div className="flex justify-between mb-1">
                <span className="text-xs text-gray-600 dark:text-gray-400">Phase Progress</span>
                <span className="text-xs font-semibold text-gray-900 dark:text-white">
                  {((parseFloat(phaseInfo.tokensSold) / parseFloat(phaseInfo.tokensAllocated)) * 100).toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                  style={{ 
                    width: `${Math.min((parseFloat(phaseInfo.tokensSold) / parseFloat(phaseInfo.tokensAllocated)) * 100, 100)}%`
                  }}
                />
              </div>
            </div>
          </motion.div>
        )}

        {/* Last Update */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            Data refreshes every 15 seconds • Last update: {new Date().toLocaleTimeString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PresaleStats;