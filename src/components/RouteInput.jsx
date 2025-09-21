import React, { useState } from 'react';
import { motion } from 'framer-motion';

const RouteInput = ({ onRouteSelect, user, onLogout }) => {
  const [formData, setFormData] = useState({
    source: '',
    destination: '',
    trainNumber: '',
    journeyDate: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    console.log('Input change:', e.target.name, e.target.value);
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call to microservice
    setTimeout(() => {
      setIsLoading(false);
      onRouteSelect(formData);
    }, 2000);
  };

  const popularRoutes = [
    { source: 'Bengaluru City Junction', destination: 'New Delhi', train: 'Duronto Express' },
    { source: 'Mumbai Central', destination: 'New Delhi', train: 'Rajdhani Express' },
    { source: 'Kolkata', destination: 'New Delhi', train: 'Rajdhani Express' },
    { source: 'Chennai Central', destination: 'New Delhi', train: 'Tamil Nadu Express' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Floating Orbs */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-gradient-to-r from-blue-400/20 to-purple-400/20 backdrop-blur-sm pointer-events-none"
            style={{
              width: `${60 + Math.random() * 100}px`,
              height: `${60 + Math.random() * 100}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [0, 100, -50, 0],
              y: [0, -100, 50, 0],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 10 + Math.random() * 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
        
        {/* Twinkling Stars */}
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-yellow-300 rounded-full pointer-events-none"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{ opacity: [0, 1, 0], scale: [0.5, 1.5, 0.5] }}
            transition={{
              duration: 2 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 100, damping: 15 }}
        className="relative z-10 bg-gradient-to-br from-white via-blue-50 to-purple-50 rounded-3xl shadow-2xl p-8 w-full max-w-lg backdrop-blur-md border border-white/50"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 rounded-3xl opacity-10 pointer-events-none">
          <div className="absolute inset-0 pointer-events-none" style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, rgba(59, 130, 246, 0.3) 2px, transparent 2px)`,
            backgroundSize: '30px 30px'
          }} />
        </div>
        
        {/* Header */}
        <div className="relative text-center mb-8">
          <motion.div 
            className="text-6xl mb-4"
            animate={{ 
              rotate: [0, 5, -5, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            🚂
          </motion.div>
          <motion.h1 
            className="text-4xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            TrainQuest
          </motion.h1>
          <motion.p 
            className="text-gray-600 font-medium text-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Enter your train journey details
          </motion.p>
          
          {/* User Info */}
          {user && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-4 p-3 bg-gradient-to-r from-green-100 to-blue-100 rounded-2xl border border-green-200"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">
                    {user.loginMethod === 'metamask' ? '🦊' : '✍️'}
                  </span>
                  <div className="text-left">
                    <div className="text-sm font-bold text-green-800">
                      Connected: {user.loginMethod === 'metamask' ? 'MetaMask' : 'Manual'}
                    </div>
                    <div className="text-xs text-green-600 font-mono">
                      {user.walletAddress.slice(0, 6)}...{user.walletAddress.slice(-4)}
                    </div>
                  </div>
                </div>
                <motion.button
                  onClick={onLogout}
                  className="px-3 py-1 bg-red-100 hover:bg-red-200 text-red-700 rounded-full text-xs font-medium transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Logout
                </motion.button>
              </div>
            </motion.div>
          )}
        </div>

        {/* Quick Select - Duronto Express */}
        <div className="mb-6 p-4 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold text-gray-800">🔥 Currently Active</span>
            <span className="text-xs bg-green-500 text-white px-2 py-1 rounded-full">LIVE</span>
          </div>
          <div className="text-sm text-gray-700 mb-3">
            <strong>Duronto Express (12273)</strong><br />
            Bengaluru → New Delhi
          </div>
          <button
            onClick={() => onRouteSelect({ 
              source: 'Bengaluru City Junction',
              destination: 'New Delhi',
              trainNumber: '12273',
              trainName: 'Duronto Express'
            })}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg font-semibold transition-colors"
          >
            Join Current Journey 🚀
          </button>
        </div>

        {/* Manual Input Form */}
        <form onSubmit={handleSubmit} className="relative z-20 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              From Station
            </label>
            <input
              type="text"
              name="source"
              value={formData.source}
              onChange={handleInputChange}
              placeholder="e.g., Bengaluru City Junction"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              To Station
            </label>
            <input
              type="text"
              name="destination"
              value={formData.destination}
              onChange={handleInputChange}
              placeholder="e.g., New Delhi"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Train Number (Optional)
            </label>
            <input
              type="text"
              name="trainNumber"
              value={formData.trainNumber}
              onChange={handleInputChange}
              placeholder="e.g., 12273"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Journey Date
            </label>
            <input
              type="date"
              name="journeyDate"
              value={formData.journeyDate}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-purple-500 hover:bg-purple-600 disabled:bg-gray-400 text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Finding Route...
              </>
            ) : (
              <>
                Create Quest Route 🗺️
              </>
            )}
          </button>
        </form>

        {/* Popular Routes */}
        <div className="mt-8">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Popular Routes</h3>
          <div className="space-y-2">
            {popularRoutes.map((route, index) => (
              <button
                key={index}
                onClick={() => onRouteSelect(route)}
                className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-medium text-sm">{route.source} → {route.destination}</div>
                    <div className="text-xs text-gray-500">{route.train}</div>
                  </div>
                  <div className="text-gray-400">→</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500">
            🔮 Future: Connect with Soumik's microservice for real-time route data
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default RouteInput;