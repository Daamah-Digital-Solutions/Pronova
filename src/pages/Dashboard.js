import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaWallet, FaExchangeAlt, FaHistory, FaChartLine, FaEthereum, FaDollarSign } from 'react-icons/fa';
import { SiTether } from 'react-icons/si';
import Button from '../components/ui/Button';
import { useSimpleWallet } from '../context/SimpleWalletContext';
import WalletGuard from '../components/auth/WalletGuard';

const Dashboard = () => {
  const navigate = useNavigate();
  const { account, connectWallet, disconnectWallet, formatAddress } = useSimpleWallet();
  const [activeTab, setActiveTab] = useState('buy');
  const [purchaseAmount, setPurchaseAmount] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState('eth');
  const [userPurchases, setUserPurchases] = useState({ totalTokens: '0', totalPaid: '0', referralRewards: '0' });
  const [transactions, setTransactions] = useState([]);
  const [mockAccount, setMockAccount] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Use either real account or mock account for testing
  const activeAccount = account || mockAccount;
  const isWalletConnected = !!activeAccount;

  // Load mock account from localStorage on component mount
  useEffect(() => {
    const savedMockAccount = localStorage.getItem('mockAccount');
    if (savedMockAccount && savedMockAccount !== 'null') {
      setMockAccount(savedMockAccount);
    }
  }, []);

  // Save mock account to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('mockAccount', mockAccount || '');
  }, [mockAccount]);

  // Load user data when wallet connects
  useEffect(() => {
    if (activeAccount) {
      // Load purchases from localStorage
      const savedPurchases = localStorage.getItem(`purchases_${activeAccount}`);
      if (savedPurchases) {
        setUserPurchases(JSON.parse(savedPurchases));
      }

      // Load transactions from localStorage
      const savedTransactions = localStorage.getItem(`transactions_${activeAccount}`);
      if (savedTransactions) {
        setTransactions(JSON.parse(savedTransactions));
      }
    } else {
      // Reset data when wallet disconnects
      setUserPurchases({ totalTokens: '0', totalPaid: '0', referralRewards: '0' });
      setTransactions([]);
    }
  }, [activeAccount]);

  // Mock data for dashboard
  const mockData = {
    presalePhase: 1,
    currentPrice: 0.05,
    nextPhasePrice: 0.07,
    tokensSold: 45000000,
    totalTokens: 100000000
  };

  const tabs = [
    { id: 'buy', label: 'Buy Tokens', icon: <FaExchangeAlt /> },
    { id: 'transactions', label: 'Transactions', icon: <FaHistory /> },
    { id: 'stats', label: 'Statistics', icon: <FaChartLine /> }
  ];

  const calculateTokens = () => {
    if (!purchaseAmount) return 0;
    return parseFloat(purchaseAmount) / mockData.currentPrice;
  };

  // Mock transaction function
  const simulateTransaction = async () => {
    await new Promise(resolve => setTimeout(resolve, 2000));
    const mockTxHash = '0x' + Math.random().toString(16).substr(2, 64);
    return mockTxHash;
  };

  // Handle purchase
  const handlePurchase = async () => {
    if (!activeAccount) {
      setError('Please connect your wallet first');
      return;
    }

    if (!purchaseAmount || parseFloat(purchaseAmount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    // Check minimum purchase ($100)
    if (parseFloat(purchaseAmount) < 100) {
      setError('Minimum purchase amount is $100');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      // The input is always in USD
      const usdAmount = parseFloat(purchaseAmount);

      // Calculate tokens (fixed token price)
      const newTokens = usdAmount / mockData.currentPrice;
      
      // Simulate transaction
      const txHash = await simulateTransaction();
      
      // Update user purchases
      const newTotalTokens = parseFloat(userPurchases.totalTokens) + newTokens;
      const newTotalPaid = parseFloat(userPurchases.totalPaid) + usdAmount;

      const updatedPurchases = {
        totalTokens: newTotalTokens.toString(),
        totalPaid: newTotalPaid.toString(),
        referralRewards: userPurchases.referralRewards
      };

      setUserPurchases(updatedPurchases);
      
      // Save to localStorage
      localStorage.setItem(`purchases_${activeAccount}`, JSON.stringify(updatedPurchases));
      
      // Save transaction to history
      const newTransaction = {
        date: new Date().toISOString(),
        type: 'Token Purchase',
        amount: usdAmount,
        currency: 'USD',
        tokens: newTokens,
        paymentMethod: selectedCurrency.toUpperCase(),
        cryptoAmount: parseFloat(purchaseAmount),
        status: 'Completed',
        hash: txHash,
        referralCode: null,
        referralBonus: 0
      };

      const existingTransactions = localStorage.getItem(`transactions_${activeAccount}`);
      const txList = existingTransactions ? JSON.parse(existingTransactions) : [];
      txList.unshift(newTransaction);
      localStorage.setItem(`transactions_${activeAccount}`, JSON.stringify(txList));
      setTransactions(txList);
      
      // Redirect to congratulations page with purchase data
      navigate('/congratulations', {
        state: {
          purchaseData: {
            ...newTransaction,
            account: activeAccount
          }
        }
      });
      
    } catch (error) {
      console.error('Purchase error:', error);
      setError(error.message || 'Purchase failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <WalletGuard>
      {/* Hero Section */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-20 bg-gradient-to-b from-primary-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-gray-900 dark:text-white">
              Pronova <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-secondary-600">Dashboard</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              Connect your wallet, buy tokens, and manage your Pronova investments
            </p>
          </motion.div>
        </div>
      </section>

      {/* Dashboard Section */}
      <section className="py-16 md:py-24 bg-white dark:bg-gray-800">
        <div className="container-custom">
          {!isWalletConnected ? (
            // Wallet Connection Page
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="max-w-xl mx-auto bg-white dark:bg-gray-900 rounded-xl shadow-xl overflow-hidden"
            >
              <div className="bg-gradient-to-r from-primary-600 to-secondary-600 p-6 text-white">
                <h2 className="text-2xl font-bold">Connect Your Wallet</h2>
                <p className="mt-2 text-white/80">
                  Connect your wallet to access the Pronova Dashboard
                </p>
              </div>
              
              <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                  <button
                    onClick={connectWallet}
                    className="flex items-center justify-center p-4 border-2 border-gray-200 dark:border-gray-700 rounded-lg hover:border-primary-500 dark:hover:border-primary-500 transition-colors"
                  >
                    <FaWallet className="mr-2" />
                    <span className="font-medium text-gray-900 dark:text-white">MetaMask</span>
                  </button>
                  
                  <button
                    onClick={connectWallet}
                    className="flex items-center justify-center p-4 border-2 border-gray-200 dark:border-gray-700 rounded-lg hover:border-primary-500 dark:hover:border-primary-500 transition-colors"
                  >
                    <FaWallet className="mr-2" />
                    <span className="font-medium text-gray-900 dark:text-white">WalletConnect</span>
                  </button>
                </div>
                
                {/* Mock Wallet for Testing */}
                {process.env.NODE_ENV === 'development' && (
                  <div className="mb-8 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Testing Mode</h3>
                    <button
                      onClick={() => {
                        if (mockAccount) {
                          setMockAccount(null);
                          console.log('Mock wallet disconnected');
                        } else {
                          const newMockAccount = '0xMOCK1234567890abcdef1234567890abcdef1234';
                          setMockAccount(newMockAccount);
                          console.log('Mock wallet connected for dashboard testing:', newMockAccount);
                        }
                      }}
                      className="w-full flex items-center justify-center p-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <FaWallet className="mr-2" />
                      <span>{mockAccount ? 'Disconnect Mock Wallet' : 'Connect Mock Wallet (Testing)'}</span>
                    </button>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                      Use this to test the dashboard without MetaMask
                    </p>
                  </div>
                )}
                
                <div className="text-gray-600 dark:text-gray-400 text-sm">
                  <p className="mb-2">
                    By connecting your wallet, you agree to our Terms of Service and Privacy Policy.
                  </p>
                  <p>
                    Need help? Contact <a href="mailto:support@pronova.com" className="text-primary-600 dark:text-primary-400 hover:underline">support@pronova.com</a>
                  </p>
                </div>
              </div>
            </motion.div>
          ) : (
            // Dashboard Content
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Sidebar */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="lg:col-span-1"
              >
                <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden sticky top-24">
                  <div className="bg-gradient-to-r from-primary-600 to-secondary-600 p-6 text-white">
                    <div className="flex items-center mb-4">
                      <FaWallet size={24} className="mr-3" />
                      <h2 className="text-xl font-bold">My Wallet</h2>
                    </div>
                    <div className="flex items-center">
                      <div className="bg-white/20 rounded-lg p-3 w-full">
                        <div className="text-sm text-white/80">Your PRN Balance</div>
                        <div className="text-2xl font-bold">{parseFloat(userPurchases.totalTokens).toLocaleString()} PRN</div>
                        <div className="text-sm text-white/80">${(parseFloat(userPurchases.totalTokens) * mockData.currentPrice).toLocaleString()}</div>
                        <div className="text-xs text-white/60 mt-1">
                          Address: {formatAddress(activeAccount)}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <ul className="space-y-2">
                      {tabs.map((tab) => (
                        <li key={tab.id}>
                          <button
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center w-full p-3 rounded-lg transition-colors ${
                              activeTab === tab.id
                                ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400'
                                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                            }`}
                          >
                            <span className="mr-3">{tab.icon}</span>
                            <span>{tab.label}</span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                    <Button 
                      variant="outline"
                      fullWidth
                      onClick={disconnectWallet}
                    >
                      Disconnect Wallet
                    </Button>
                  </div>
                </div>
              </motion.div>
              
              {/* Main Content */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="lg:col-span-3"
              >
                <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden">
                  {/* Buy Tokens Tab */}
                  {activeTab === 'buy' && (
                    <div className="p-6">
                      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Buy Pronova Tokens</h2>
                      
                      {/* Presale Info */}
                      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg mb-6">
                        <div className="flex flex-wrap justify-between mb-4">
                          <div>
                            <span className="text-sm text-gray-500 dark:text-gray-400">Current Phase</span>
                            <div className="font-semibold text-gray-900 dark:text-white">Phase {mockData.presalePhase}</div>
                          </div>
                          <div>
                            <span className="text-sm text-gray-500 dark:text-gray-400">Current Price</span>
                            <div className="font-semibold text-gray-900 dark:text-white">${mockData.currentPrice}</div>
                          </div>
                          <div>
                            <span className="text-sm text-gray-500 dark:text-gray-400">Next Phase Price</span>
                            <div className="font-semibold text-gray-900 dark:text-white">${mockData.nextPhasePrice}</div>
                          </div>
                        </div>
                        
                        <div className="mb-2">
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-500 dark:text-gray-400">Progress</span>
                            <span className="text-primary-600 dark:text-primary-400 font-medium">
                              {Math.round((mockData.tokensSold / mockData.totalTokens) * 100)}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                            <div 
                              className="bg-primary-600 h-2.5 rounded-full"
                              style={{ width: `${(mockData.tokensSold / mockData.totalTokens) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                        
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {mockData.tokensSold.toLocaleString()} / {mockData.totalTokens.toLocaleString()} tokens sold
                        </div>
                      </div>
                      
                      {/* Purchase Form */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Amount to Purchase</h3>
                          
                          <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Select Currency
                            </label>
                            <div className="flex space-x-3">
                              <button
                                onClick={() => setSelectedCurrency('eth')}
                                className={`flex items-center justify-center p-3 rounded-lg ${
                                  selectedCurrency === 'eth'
                                    ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 border-2 border-primary-500'
                                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-2 border-transparent'
                                }`}
                              >
                                <FaEthereum size={20} className="mr-2" />
                                <span>ETH</span>
                              </button>
                              
                              <button
                                onClick={() => setSelectedCurrency('usdt')}
                                className={`flex items-center justify-center p-3 rounded-lg ${
                                  selectedCurrency === 'usdt'
                                    ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 border-2 border-primary-500'
                                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-2 border-transparent'
                                }`}
                              >
                                <SiTether size={20} className="mr-2" />
                                <span>USDT</span>
                              </button>
                              
                              <button
                                onClick={() => setSelectedCurrency('usd')}
                                className={`flex items-center justify-center p-3 rounded-lg ${
                                  selectedCurrency === 'usd'
                                    ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 border-2 border-primary-500'
                                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-2 border-transparent'
                                }`}
                              >
                                <FaDollarSign size={20} className="mr-2" />
                                <span>USD</span>
                              </button>
                            </div>
                          </div>
                          
                          <div className="mb-6">
                            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Amount (USD)
                            </label>
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                              <input
                                type="number"
                                id="amount"
                                value={purchaseAmount}
                                onChange={(e) => setPurchaseAmount(e.target.value)}
                                className="block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 pl-8 pr-4 py-3 text-gray-900 dark:text-white focus:border-primary-500 focus:ring-primary-500"
                                placeholder="Enter USD amount"
                              />
                            </div>
                            
                            {/* Quick amount buttons */}
                            <div className="flex space-x-2 mt-2">
                              {[100, 500, 1000, 5000].map((amount) => (
                                <button
                                  key={amount}
                                  onClick={() => setPurchaseAmount(amount.toString())}
                                  className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg transition-colors"
                                >
                                  ${amount}
                                </button>
                              ))}
                            </div>
                          </div>
                          
                          {/* Error/Success Messages */}
                          {error && (
                            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                              {error}
                            </div>
                          )}

                          {success && (
                            <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg text-sm">
                              {success}
                            </div>
                          )}

                          <Button 
                            variant="gradient"
                            fullWidth
                            disabled={!activeAccount || isLoading || !purchaseAmount}
                            onClick={handlePurchase}
                          >
                            {isLoading ? 'Processing...' : 'Buy Tokens'}
                          </Button>
                        </div>
                        
                        <div>
                          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Purchase Summary</h3>
                          
                          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                            <div className="flex justify-between py-3 border-b border-gray-200 dark:border-gray-700">
                              <span className="text-gray-600 dark:text-gray-400">USD Amount</span>
                              <span className="font-medium text-gray-900 dark:text-white">
                                {purchaseAmount ? `$${parseFloat(purchaseAmount).toLocaleString()}` : '--'}
                              </span>
                            </div>
                            
                            <div className="flex justify-between py-3 border-b border-gray-200 dark:border-gray-700">
                              <span className="text-gray-600 dark:text-gray-400">Payment Method</span>
                              <span className="font-medium text-gray-900 dark:text-white">{selectedCurrency.toUpperCase()}</span>
                            </div>
                            
                            <div className="flex justify-between py-3 border-b border-gray-200 dark:border-gray-700">
                              <span className="text-gray-600 dark:text-gray-400">Price Per Token</span>
                              <span className="font-medium text-gray-900 dark:text-white">${mockData.currentPrice}</span>
                            </div>
                            
                            <div className="flex justify-between py-3 border-b border-gray-200 dark:border-gray-700">
                              <span className="text-gray-600 dark:text-gray-400">Tokens to Receive</span>
                              <span className="font-medium text-gray-900 dark:text-white">
                                {purchaseAmount ? (parseFloat(purchaseAmount) / mockData.currentPrice).toLocaleString(undefined, { maximumFractionDigits: 0 }) : '0'} PRN
                              </span>
                            </div>
                            
                            <div className="flex justify-between py-3">
                              <span className="text-gray-600 dark:text-gray-400">Phase</span>
                              <span className="font-medium text-blue-600 dark:text-blue-400">Phase 1 (Best Price)</span>
                            </div>
                          </div>
                          
                          <div className="mt-6 text-sm text-gray-600 dark:text-gray-400">
                            <p className="mb-2">
                              <span className="font-semibold">Note:</span> By purchasing tokens, you agree to the terms and conditions of the Pronova presale.
                            </p>
                            <p>
                              Tokens will be immediately sent to your connected wallet after purchase.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Transactions Tab */}
                  {activeTab === 'transactions' && (
                    <div className="p-6">
                      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Transaction History</h2>
                      
                      {transactions.length > 0 ? (
                        <div className="overflow-x-auto">
                          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-800">
                              <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Type</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Amount</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Hash</th>
                              </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                              {transactions.map((tx, index) => (
                                <tr key={index}>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                    {new Date(tx.date).toLocaleDateString()}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                    {tx.type}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                    {tx.amount} {tx.currency}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                      {tx.status}
                                    </span>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 dark:text-blue-400">
                                    <a href={`https://etherscan.io/tx/${tx.hash}`} target="_blank" rel="noopener noreferrer" className="hover:underline">
                                      {tx.hash.substring(0, 10)}...
                                    </a>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <div className="text-gray-500 dark:text-gray-400 mb-3">
                            <FaHistory size={48} className="mx-auto opacity-50" />
                          </div>
                          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Transactions Yet</h3>
                          <p className="text-gray-600 dark:text-gray-400">
                            Your transaction history will appear here after you make your first purchase.
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* Statistics Tab */}
                  {activeTab === 'stats' && (
                    <div className="p-6">
                      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Presale Statistics</h2>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                          <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total Raised</div>
                          <div className="text-2xl font-bold text-gray-900 dark:text-white">$36,000,000</div>
                          <div className="text-sm text-green-600 dark:text-green-400">45% of Phase 1 Goal</div>
                        </div>
                        
                        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                          <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Participants</div>
                          <div className="text-2xl font-bold text-gray-900 dark:text-white">8,459</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">Unique Wallets</div>
                        </div>
                        
                        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                          <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Time Remaining</div>
                          <div className="text-2xl font-bold text-gray-900 dark:text-white">15 Days</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">Until Phase 2</div>
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg mb-8">
                        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Presale Phases</h3>
                        
                        <div className="space-y-6">
                          <div>
                            <div className="flex justify-between mb-2">
                              <span className="font-medium text-gray-900 dark:text-white">Phase 1</span>
                              <span className="text-primary-600 dark:text-primary-400">Current Phase</span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-2">
                              <div className="bg-primary-600 h-2.5 rounded-full w-5/12"></div>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600 dark:text-gray-400">100M tokens at $0.80</span>
                              <span className="text-gray-600 dark:text-gray-400">45% Complete</span>
                            </div>
                          </div>
                          
                          <div>
                            <div className="flex justify-between mb-2">
                              <span className="font-medium text-gray-900 dark:text-white">Phase 2</span>
                              <span className="text-gray-500 dark:text-gray-400">Coming Soon</span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-2">
                              <div className="bg-gray-400 dark:bg-gray-600 h-2.5 rounded-full w-0"></div>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600 dark:text-gray-400">75M tokens at $1.00</span>
                              <span className="text-gray-600 dark:text-gray-400">0% Complete</span>
                            </div>
                          </div>
                          
                          <div>
                            <div className="flex justify-between mb-2">
                              <span className="font-medium text-gray-900 dark:text-white">Phase 3</span>
                              <span className="text-gray-500 dark:text-gray-400">Coming Soon</span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-2">
                              <div className="bg-gray-400 dark:bg-gray-600 h-2.5 rounded-full w-0"></div>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600 dark:text-gray-400">75M tokens at $1.50</span>
                              <span className="text-gray-600 dark:text-gray-400">0% Complete</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-center">
                        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Expected Listing Price</h3>
                        <div className="bg-gradient-to-r from-primary-100 to-secondary-100 dark:from-primary-900/30 dark:to-secondary-900/30 p-4 rounded-lg inline-block">
                          <div className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-secondary-600">
                            $1.70 - $2.50
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            Up to 212.5% from Phase 1 price
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          )}
        </div>
      </section>

      {/* FAQ Section */}
      {!isWalletConnected && (
        <section className="py-16 md:py-24 bg-gray-50 dark:bg-gray-900">
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
                Frequently Asked Questions
              </h2>
              <p className="text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
                Learn more about purchasing Pronova tokens and using the dashboard
              </p>
            </motion.div>

            <div className="max-w-3xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="mb-4 border border-gray-200 dark:border-gray-700 rounded-lg"
              >
                <div className="p-5 bg-white dark:bg-gray-800">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    How do I connect my wallet?
                  </h3>
                  <p className="mt-2 text-gray-600 dark:text-gray-400">
                    Click on the "Connect Wallet" button and select your preferred wallet provider (MetaMask or WalletConnect). Follow the prompts in your wallet to complete the connection.
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mb-4 border border-gray-200 dark:border-gray-700 rounded-lg"
              >
                <div className="p-5 bg-white dark:bg-gray-800">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    What cryptocurrencies can I use to buy Pronova tokens?
                  </h3>
                  <p className="mt-2 text-gray-600 dark:text-gray-400">
                    You can purchase Pronova tokens using ETH (Ethereum), USDT (Tether), or USD (via credit card payment). Select your preferred payment method on the dashboard.
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="mb-4 border border-gray-200 dark:border-gray-700 rounded-lg"
              >
                <div className="p-5 bg-white dark:bg-gray-800">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    When will I receive my tokens?
                  </h3>
                  <p className="mt-2 text-gray-600 dark:text-gray-400">
                    Tokens are sent to your wallet immediately after your purchase is confirmed on the blockchain.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      )}
    </WalletGuard>
  );
};

export default Dashboard;