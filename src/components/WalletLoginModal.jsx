import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ethers } from 'ethers';

const WalletLoginModal = ({ isOpen, onClose, onLogin }) => {
  const [loginMethod, setLoginMethod] = useState(null); // 'metamask' or 'manual'
  const [walletAddress, setWalletAddress] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState('');
  const [networkStatus, setNetworkStatus] = useState('checking'); // 'online', 'offline', 'checking'

  useEffect(() => {
    // Check network status
    const checkNetwork = () => {
      setNetworkStatus(navigator.onLine ? 'online' : 'offline');
    };
    
    checkNetwork();
    window.addEventListener('online', checkNetwork);
    window.addEventListener('offline', checkNetwork);
    
    return () => {
      window.removeEventListener('online', checkNetwork);
      window.removeEventListener('offline', checkNetwork);
    };
  }, []);

  const validateWalletAddress = (address) => {
    try {
      return ethers.isAddress(address);
    } catch {
      return false;
    }
  };

  const connectMetaMask = async () => {
    setIsConnecting(true);
    setError('');

    try {
      // Check if MetaMask is installed
      if (!window.ethereum) {
        throw new Error('MetaMask is not installed. Please install MetaMask or use manual login.');
      }

      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });

      if (accounts.length === 0) {
        throw new Error('No accounts found. Please unlock MetaMask.');
      }

      const address = accounts[0];

      // Check if we're on Base Sepolia (or switch to it)
      const baseSepoliaChainId = '0x14A34'; // Base Sepolia chain ID (84532)
      
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: baseSepoliaChainId }],
        });
      } catch (switchError) {
        // If the chain doesn't exist, add it
        if (switchError.code === 4902) {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: baseSepoliaChainId,
              chainName: 'Base Sepolia',
              nativeCurrency: {
                name: 'ETH',
                symbol: 'ETH',
                decimals: 18,
              },
              rpcUrls: ['https://sepolia.base.org'],
              blockExplorerUrls: ['https://sepolia-explorer.base.org'],
            }],
          });
        } else {
          console.warn('Failed to switch to Base Sepolia:', switchError);
          // Continue anyway - we'll save the address regardless of network
        }
      }

      await saveWalletAddress(address, 'metamask');
      
    } catch (err) {
      setError(err.message);
      console.error('MetaMask connection error:', err);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleManualLogin = async () => {
    if (!walletAddress.trim()) {
      setError('Please enter a wallet address');
      return;
    }

    if (!validateWalletAddress(walletAddress.trim())) {
      setError('Invalid wallet address format');
      return;
    }

    setIsConnecting(true);
    setError('');

    try {
      await saveWalletAddress(walletAddress.trim(), 'manual');
    } catch (err) {
      setError('Failed to save wallet address');
      console.error('Manual login error:', err);
    } finally {
      setIsConnecting(false);
    }
  };

  const saveWalletAddress = async (address, method) => {
    try {
      // Use window.location.hostname to get the current host, or fallback to localhost
      const apiHost = window.location.hostname === 'localhost' ? 'localhost' : window.location.hostname;
      const apiUrl = `http://${apiHost}:3001/api/wallet`;
      
      console.log('🔍 Saving wallet to:', apiUrl);
      console.log('📱 Wallet data:', { address, method });
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          walletAddress: address,
          loginMethod: method,
          timestamp: new Date().toISOString(),
          gameSession: Date.now() // Simple session identifier
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save wallet address to backend');
      }

      const result = await response.json();
      console.log('Wallet saved:', result);

      // Call the onLogin callback with user data
      onLogin({
        walletAddress: address,
        loginMethod: method,
        sessionId: result.sessionId
      });

      // Close modal
      onClose();
      
    } catch (err) {
      // If backend is not available, continue with local storage fallback
      console.warn('Backend not available, using local storage:', err);
      
      const userData = {
        walletAddress: address,
        loginMethod: method,
        timestamp: new Date().toISOString(),
        sessionId: Date.now()
      };
      
      localStorage.setItem('trainquest_user', JSON.stringify(userData));
      
      onLogin(userData);
      onClose();
    }
  };

  const resetModal = () => {
    setLoginMethod(null);
    setWalletAddress('');
    setError('');
    setIsConnecting(false);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="bg-gradient-to-br from-white via-blue-50 to-purple-50 rounded-3xl shadow-2xl max-w-md w-full p-6 border border-white/50"
        >
          {/* Header */}
          <div className="text-center mb-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="text-6xl mb-4"
            >
              🚂💎
            </motion.div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Join TrainQuest
            </h2>
            <p className="text-gray-600 mt-2">
              Connect your Base Sepolia wallet to collect NFT rewards!
            </p>
            
            {/* Network Status */}
            <div className={`mt-3 px-3 py-1 rounded-full text-sm font-medium ${
              networkStatus === 'online' 
                ? 'bg-green-100 text-green-700' 
                : networkStatus === 'offline'
                ? 'bg-red-100 text-red-700'
                : 'bg-yellow-100 text-yellow-700'
            }`}>
              {networkStatus === 'online' && '🌐 Online - All features available'}
              {networkStatus === 'offline' && '📱 Offline - Manual login recommended'}
              {networkStatus === 'checking' && '🔍 Checking connection...'}
            </div>
          </div>

          {/* Error Display */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-xl mb-4"
              >
                <div className="flex items-center gap-2">
                  <span>⚠️</span>
                  <span className="text-sm">{error}</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Login Method Selection */}
          {!loginMethod && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              {/* MetaMask Option */}
              <motion.button
                onClick={() => setLoginMethod('metamask')}
                className="w-full p-4 bg-gradient-to-r from-orange-500 to-yellow-500 text-white rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                disabled={networkStatus === 'offline'}
              >
                <div className="flex items-center justify-center gap-3">
                  <span className="text-2xl">🦊</span>
                  <div className="text-left">
                    <div>Connect with MetaMask</div>
                    <div className="text-sm opacity-80">
                      {networkStatus === 'online' ? 'Automatic & Secure' : 'Requires internet'}
                    </div>
                  </div>
                </div>
              </motion.button>

              {/* Manual Option */}
              <motion.button
                onClick={() => setLoginMethod('manual')}
                className="w-full p-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center justify-center gap-3">
                  <span className="text-2xl">✍️</span>
                  <div className="text-left">
                    <div>Enter Wallet Manually</div>
                    <div className="text-sm opacity-80">
                      Works offline • Base Sepolia address
                    </div>
                  </div>
                </div>
              </motion.button>

              <div className="text-center text-sm text-gray-500 mt-4">
                💡 Your wallet address will be saved for NFT airdrops
              </div>
            </motion.div>
          )}

          {/* MetaMask Flow */}
          {loginMethod === 'metamask' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              <div className="text-center">
                <div className="text-4xl mb-3">🦊</div>
                <h3 className="text-xl font-bold text-gray-800">Connect MetaMask</h3>
                <p className="text-gray-600 text-sm mt-2">
                  We'll switch to Base Sepolia network automatically
                </p>
              </div>

              <motion.button
                onClick={connectMetaMask}
                disabled={isConnecting}
                className="w-full p-4 bg-gradient-to-r from-orange-500 to-yellow-500 text-white rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={!isConnecting ? { scale: 1.02 } : {}}
                whileTap={!isConnecting ? { scale: 0.98 } : {}}
              >
                {isConnecting ? (
                  <div className="flex items-center justify-center gap-2">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                    />
                    Connecting...
                  </div>
                ) : (
                  'Connect MetaMask Wallet'
                )}
              </motion.button>

              <button
                onClick={resetModal}
                className="w-full p-2 text-gray-500 hover:text-gray-700 transition-colors"
              >
                ← Back to options
              </button>
            </motion.div>
          )}

          {/* Manual Entry Flow */}
          {loginMethod === 'manual' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              <div className="text-center">
                <div className="text-4xl mb-3">✍️</div>
                <h3 className="text-xl font-bold text-gray-800">Enter Wallet Address</h3>
                <p className="text-gray-600 text-sm mt-2">
                  Paste your Base Sepolia wallet address below
                </p>
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">
                  Base Sepolia Wallet Address
                </label>
                <input
                  type="text"
                  value={walletAddress}
                  onChange={(e) => setWalletAddress(e.target.value)}
                  placeholder="0x..."
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-mono text-sm"
                  disabled={isConnecting}
                />
                <div className="text-xs text-gray-500">
                  Example: 0x742d35Cc6554C0532925a3b8C17890FD5f8B26e7
                </div>
              </div>

              <motion.button
                onClick={handleManualLogin}
                disabled={isConnecting || !walletAddress.trim()}
                className="w-full p-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={!isConnecting && walletAddress.trim() ? { scale: 1.02 } : {}}
                whileTap={!isConnecting && walletAddress.trim() ? { scale: 0.98 } : {}}
              >
                {isConnecting ? (
                  <div className="flex items-center justify-center gap-2">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                    />
                    Saving...
                  </div>
                ) : (
                  'Save Wallet & Continue'
                )}
              </motion.button>

              <button
                onClick={resetModal}
                className="w-full p-2 text-gray-500 hover:text-gray-700 transition-colors"
              >
                ← Back to options
              </button>
            </motion.div>
          )}

          {/* Close Button */}
          <motion.button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            ✕
          </motion.button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default WalletLoginModal;