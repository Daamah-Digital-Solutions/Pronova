import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSimpleWallet } from '../../context/SimpleWalletContext';
import { useWeb3 } from '../../context/Web3Context';
import web3Service from '../../services/web3Service';
import { FaEthereum, FaSpinner, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import { SiBinance } from 'react-icons/si';

const PresalePurchase = ({ className = '' }) => {
  const navigate = useNavigate();
  const {
    account: simpleAccount,
    chainId: simpleChainId,
    connectWallet,
    error: walletError
  } = useSimpleWallet();

  const {
    account: web3Account,
    chainId: web3ChainId,
    isConnected: web3IsConnected,
    isCorrectNetwork: web3IsCorrectNetwork,
    presaleInfo,
    loadPresaleInfo
  } = useWeb3();

  // Use Web3Context if available, otherwise fall back to SimpleWallet
  const account = web3Account || simpleAccount;
  const chainId = web3ChainId || simpleChainId;

  // State management
  const [paymentMethod, setPaymentMethod] = useState('ETH');
  const [usdAmount, setUsdAmount] = useState('');
  const [cryptoAmount, setCryptoAmount] = useState('');
  const [tokenAmount, setTokenAmount] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [transaction, setTransaction] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [balances, setBalances] = useState({ eth: '0', bnb: '0', usdt: '0' });
  const [userPurchases, setUserPurchases] = useState({ totalTokens: '0', totalPaid: '0', referralRewards: '0' });
  const [mockAccount, setMockAccount] = useState(null);
  const [prices, setPrices] = useState({ eth: '3000', bnb: '300' }); // Fallback prices

  // Get presale info from Web3Context or use defaults
  const currentPhase = presaleInfo?.currentPhase || 1;
  const tokenPrice = presaleInfo?.tokenPrice || '0.05';
  // For testnet/development, allow purchases without strict whitelist check
  // The smart contract will enforce whitelist if enabled
  const isWhitelisted = presaleInfo?.isWhitelisted ?? true;

  // Use either real account or mock account for testing
  const activeAccount = account || mockAccount;
  const isConnected = web3IsConnected || !!activeAccount;
  const isCorrectNetwork = web3IsCorrectNetwork || [31337, 97, 56].includes(chainId); // Support localhost, BSC testnet, BSC mainnet

  // Load real crypto prices from blockchain
  useEffect(() => {
    const loadPrices = async () => {
      try {
        const currentPrices = await web3Service.getCurrentPrices();
        setPrices({
          eth: currentPrices.eth,
          bnb: currentPrices.bnb
        });
      } catch (error) {
        console.error('Error loading prices:', error);
        // Keep fallback prices
      }
    };

    loadPrices();
    // Reload prices every 60 seconds
    const interval = setInterval(loadPrices, 60000);
    return () => clearInterval(interval);
  }, []);

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

  // Load mock balances when wallet connects
  useEffect(() => {
    if (activeAccount) {
      // Mock balances for testing
      setBalances({
        eth: '5.5432', // 5.5432 ETH
        bnb: '12.8901', // 12.8901 BNB  
        usdt: '1000.00' // 1000 USDT
      });
      
      // Load any existing purchases from localStorage
      const savedPurchases = localStorage.getItem(`purchases_${activeAccount}`);
      if (savedPurchases) {
        setUserPurchases(JSON.parse(savedPurchases));
      }
    }
  }, [activeAccount]);


  // Calculate crypto and token amounts
  const calculateAmounts = useCallback(async () => {
    if (!usdAmount) return;

    try {
      const usd = parseFloat(usdAmount);
      if (isNaN(usd) || usd <= 0) return;

      // Calculate crypto amount using real prices
      let cryptoAmt = '0';
      if (paymentMethod === 'ETH') {
        const ethPrice = parseFloat(prices.eth);
        cryptoAmt = (usd / ethPrice).toFixed(6);
      } else if (paymentMethod === 'BNB') {
        const bnbPrice = parseFloat(prices.bnb);
        cryptoAmt = (usd / bnbPrice).toFixed(6);
      } else if (paymentMethod === 'USDT') {
        cryptoAmt = usd.toFixed(2);
      }

      // Calculate token amount using current token price
      const tokens = (usd / parseFloat(tokenPrice)).toFixed(0);

      setCryptoAmount(cryptoAmt);
      setTokenAmount(tokens);
    } catch (error) {
      console.error('Error calculating amounts:', error);
    }
  }, [usdAmount, paymentMethod, tokenPrice, prices]);

  useEffect(() => {
    if (usdAmount && tokenPrice) {
      calculateAmounts();
    }
  }, [usdAmount, paymentMethod, tokenPrice, calculateAmounts]);


  // Mock transaction function
  const simulateTransaction = async () => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Generate mock transaction hash
    const mockTxHash = '0x' + Math.random().toString(16).substr(2, 64);
    return mockTxHash;
  };

  // Handle purchase
  const handlePurchase = async () => {
    console.log('Purchase button clicked!');
    console.log('Account:', account);
    console.log('USD Amount:', usdAmount);
    console.log('Is Connected:', isConnected);
    
    if (!isConnected) {
      setError('Please connect your wallet first');
      return;
    }

    if (!usdAmount || parseFloat(usdAmount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    // Check minimum purchase ($100)
    if (parseFloat(usdAmount) < 100) {
      setError('Minimum purchase amount is $100');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccess('');
    setTransaction(null);

    try {
      let txHash;
      let receipt;

      // Use real Web3 transactions if connected to MetaMask
      if (web3IsConnected && web3Account) {
        try {
          if (paymentMethod === 'ETH' || paymentMethod === 'BNB') {
            // For BSC Testnet, we use BNB
            const cryptoAmt = parseFloat(cryptoAmount);
            const referrerAddress = referralCode || '0x0000000000000000000000000000000000000000';

            if (paymentMethod === 'BNB' || chainId === 97 || chainId === 56) {
              const result = await web3Service.buyWithBNB(cryptoAmt, referrerAddress);
              receipt = await result.wait();
              txHash = receipt.transactionHash;
            } else {
              const result = await web3Service.buyWithETH(cryptoAmt, referrerAddress);
              receipt = await result.wait();
              txHash = receipt.transactionHash;
            }
          } else if (paymentMethod === 'USDT') {
            const usdtAmt = parseFloat(cryptoAmount);
            const referrerAddress = referralCode || '0x0000000000000000000000000000000000000000';
            const result = await web3Service.buyWithUSDT(usdtAmt, referrerAddress);
            receipt = await result.wait();
            txHash = receipt.transactionHash;
          }

          // Reload presale info after successful purchase
          if (loadPresaleInfo) {
            await loadPresaleInfo();
          }
        } catch (web3Error) {
          console.error('Web3 transaction error:', web3Error);
          throw web3Error;
        }
      } else {
        // Fall back to mock simulation for testing without wallet
        const ethPrice = parseFloat(prices.eth);
        const ethAmount = parseFloat(usdAmount) / ethPrice;

        // Check if user has enough ETH (for mock mode)
        if (parseFloat(balances.eth) < ethAmount) {
          setError('Insufficient ETH balance');
          setIsLoading(false);
          return;
        }

        // Simulate transaction
        txHash = await simulateTransaction();
      }

      // Update user purchases
      const newTokens = parseFloat(tokenAmount);
      const newTotalTokens = parseFloat(userPurchases.totalTokens) + newTokens;
      const newTotalPaid = parseFloat(userPurchases.totalPaid) + parseFloat(usdAmount);
      const referralBonus = referralCode ? newTokens * 0.05 : 0; // 5% bonus
      const newReferralRewards = parseFloat(userPurchases.referralRewards) + referralBonus;

      const updatedPurchases = {
        totalTokens: newTotalTokens.toString(),
        totalPaid: newTotalPaid.toString(),
        referralRewards: newReferralRewards.toString()
      };

      setUserPurchases(updatedPurchases);

      // Save to localStorage
      localStorage.setItem(`purchases_${activeAccount}`, JSON.stringify(updatedPurchases));

      // Save transaction to history
      const newTransaction = {
        date: new Date().toISOString(),
        type: 'Token Purchase',
        amount: parseFloat(usdAmount),
        currency: 'USD',
        tokens: newTokens,
        paymentMethod: paymentMethod,
        cryptoAmount: parseFloat(cryptoAmount),
        status: 'Completed',
        hash: txHash,
        referralCode: referralCode || null,
        referralBonus: referralBonus
      };

      const existingTransactions = localStorage.getItem(`transactions_${activeAccount}`);
      const transactions = existingTransactions ? JSON.parse(existingTransactions) : [];
      transactions.unshift(newTransaction); // Add to beginning of array
      localStorage.setItem(`transactions_${activeAccount}`, JSON.stringify(transactions));

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

  // Get payment method icon
  const getPaymentIcon = (method) => {
    switch (method) {
      case 'ETH':
        return <FaEthereum className="w-5 h-5" />;
      case 'BNB':
        return <SiBinance className="w-5 h-5" />;
      case 'USDT':
        return <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold">₮</div>;
      default:
        return null;
    }
  };

  // Check if network supports payment method (simplified for mock data)
  const isPaymentMethodSupported = (method) => {
    // TODO: Implement actual network checking when Web3 is ready
    return true; // For now, all payment methods are supported
  };

  return (
    <div className={`bg-white rounded-xl shadow-lg p-6 ${className}`}>
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Purchase PRN Tokens</h3>
        <p className="text-gray-600">Join the presale and secure your PRN tokens</p>
      </div>

      {/* Phase Info */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h4 className="font-semibold text-gray-900">Phase {currentPhase}</h4>
            <p className="text-sm text-gray-600">Price: ${tokenPrice} per PRN</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Status</p>
            <p className="font-semibold text-green-600">Active 🟢</p>
          </div>
        </div>
      </div>

      {/* Payment Method Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">Payment Method</label>
        <div className="grid grid-cols-3 gap-3">
          {['ETH', 'BNB', 'USDT'].map((method) => (
            <button
              key={method}
              onClick={() => setPaymentMethod(method)}
              disabled={!isPaymentMethodSupported(method)}
              className={`flex items-center justify-center space-x-2 p-3 rounded-lg border transition-all ${
                paymentMethod === method
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-gray-300'
              } ${!isPaymentMethodSupported(method) ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              {getPaymentIcon(method)}
              <span className="font-medium">{method}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Amount Input */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Amount (USD)</label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
          <input
            type="number"
            value={usdAmount}
            onChange={(e) => setUsdAmount(e.target.value)}
            placeholder="Enter amount"
            className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        {/* Quick amount buttons */}
        <div className="flex space-x-2 mt-2">
          {[100, 500, 1000, 5000].map((amount) => (
            <button
              key={amount}
              onClick={() => setUsdAmount(amount.toString())}
              className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              ${amount}
            </button>
          ))}
        </div>
      </div>

      {/* Conversion Display */}
      {cryptoAmount && tokenAmount && (
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">You Pay</p>
              <p className="font-semibold">{cryptoAmount} {paymentMethod}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">You Receive</p>
              <p className="font-semibold">{tokenAmount} PRN</p>
            </div>
          </div>
        </div>
      )}

      {/* Referral Code */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Referral Code (Optional)</label>
        <input
          type="text"
          value={referralCode}
          onChange={(e) => setReferralCode(e.target.value)}
          placeholder="Enter referral code"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Balance Display */}
      {activeAccount && (
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h4 className="font-medium text-gray-900 mb-2">Your Balances</h4>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-gray-600">ETH</p>
              <p className="font-medium">{balances.eth}</p>
            </div>
            <div>
              <p className="text-gray-600">BNB</p>
              <p className="font-medium">{balances.bnb}</p>
            </div>
            <div>
              <p className="text-gray-600">USDT</p>
              <p className="font-medium">{balances.usdt}</p>
            </div>
          </div>
        </div>
      )}

      {/* Error/Success Messages */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-center space-x-2">
          <FaExclamationTriangle className="w-5 h-5" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg flex items-center space-x-2">
          <FaCheckCircle className="w-5 h-5" />
          <span>{success}</span>
        </div>
      )}

      {/* Transaction Hash */}
      {transaction && (
        <div className="mb-4 p-3 bg-blue-100 border border-blue-400 text-blue-700 rounded-lg">
          <p className="text-sm">Transaction Hash:</p>
          <a
            href={`https://etherscan.io/tx/${transaction.hash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 break-all"
          >
            {transaction.hash}
          </a>
        </div>
      )}

      {/* Purchase Button */}
      <button
        onClick={handlePurchase}
        disabled={!activeAccount || isLoading || !usdAmount || !isWhitelisted}
        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
      >
        {isLoading ? (
          <>
            <FaSpinner className="w-5 h-5 animate-spin" />
            <span>Processing...</span>
          </>
        ) : (
          <span>Purchase Tokens</span>
        )}
      </button>

      {/* Debug Info */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-4 p-3 bg-gray-100 rounded-lg text-xs">
          <p>Debug Info:</p>
          <p>Real Account: {account ? `Connected (${account})` : 'Not Connected'}</p>
          <p>Mock Account: {mockAccount ? `Mock (${mockAccount})` : 'Not Connected'}</p>
          <p>Active Account: {activeAccount ? `Active (${activeAccount})` : 'Not Connected'}</p>
          <p>USD Amount: {usdAmount || 'Empty'}</p>
          <p>Is Loading: {isLoading ? 'Yes' : 'No'}</p>
          <p>Is Whitelisted: {isWhitelisted ? 'Yes' : 'No'}</p>
          <p>Button Disabled: {(!activeAccount || isLoading || !usdAmount || !isWhitelisted) ? 'Yes' : 'No'}</p>
          <p>MetaMask Available: {typeof window !== 'undefined' && window.ethereum ? 'Yes' : 'No'}</p>
          
          <div className="mt-2 space-x-2">
            {!account && (
              <button
                onClick={async () => {
                  console.log('Testing wallet connection...');
                  if (window.ethereum) {
                    try {
                      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                      console.log('Accounts:', accounts);
                    } catch (error) {
                      console.error('Connection error:', error);
                    }
                  } else {
                    console.log('MetaMask not found');
                  }
                }}
                className="bg-blue-500 text-white px-3 py-1 rounded text-xs"
              >
                Test Real Connection
              </button>
            )}
            
            <button
              onClick={() => {
                // Toggle mock wallet for testing
                if (mockAccount) {
                  // Disconnect mock wallet
                  setMockAccount(null);
                  console.log('Mock wallet disconnected');
                  setSuccess('');
                  setError('');
                } else {
                  // Connect mock wallet
                  const newMockAccount = '0xMOCK1234567890abcdef1234567890abcdef1234';
                  setMockAccount(newMockAccount);
                  console.log('Mock wallet connected for testing:', newMockAccount);
                  setError('');
                  setSuccess('Mock wallet connected for testing!');
                }
              }}
              className="bg-green-500 text-white px-3 py-1 rounded text-xs"
            >
              {mockAccount ? 'Disconnect Mock' : 'Mock Wallet Connect'}
            </button>
          </div>
        </div>
      )}

      {/* Whitelist Status */}
      {account && !isWhitelisted && (
        <div className="mt-4 p-3 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded-lg">
          <p className="text-sm">You are not whitelisted for this presale. Please complete KYC verification first.</p>
        </div>
      )}

      {/* User Purchase Info */}
      {activeAccount && (
        <div className="mt-6 bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-3">Your Purchase Summary</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600">Total Tokens</p>
              <p className="font-medium">{parseFloat(userPurchases.totalTokens).toLocaleString()} PRN</p>
            </div>
            <div>
              <p className="text-gray-600">Total Paid</p>
              <p className="font-medium">${parseFloat(userPurchases.totalPaid).toLocaleString()}</p>
            </div>
            <div>
              <p className="text-gray-600">Referral Rewards</p>
              <p className="font-medium">{parseFloat(userPurchases.referralRewards).toFixed(0)} PRN</p>
            </div>
            <div>
              <p className="text-gray-600">Remaining Limit</p>
              <p className="font-medium">${(100000 - parseFloat(userPurchases.totalPaid)).toLocaleString()}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PresalePurchase;