import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { questTypes } from '../data/routes';

const QuestModal = ({ station, onComplete, onClose }) => {
  const [questStep, setQuestStep] = useState('intro'); // intro, active, completed
  const [userAnswer, setUserAnswer] = useState('');
  const [showHint, setShowHint] = useState(false);

  const questType = questTypes[station.questType];

  const handleStartQuest = () => {
    setQuestStep('active');
  };

  const handleCompleteQuest = () => {
    setQuestStep('completed');
    setTimeout(() => {
      onComplete(station.cardReward);
    }, 2000);
  };

  const renderQuestContent = () => {
    switch (station.questType) {
      case 'intro':
        return (
          <div className="text-center">
            <div className="text-6xl mb-4">🚂</div>
            <p className="text-gray-600 mb-6">
              Welcome to your TrainQuest adventure! Click start to begin your journey.
            </p>
            <button
              onClick={handleCompleteQuest}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Start Journey! 🚀
            </button>
          </div>
        );

      case 'trivia':
        return (
          <div>
            <div className="text-4xl text-center mb-4">🧠</div>
            <h3 className="text-lg font-semibold mb-4">Railway Trivia Challenge</h3>
            <div className="bg-blue-50 p-4 rounded-lg mb-4">
              <p className="text-gray-700">
                What is the gauge (track width) of Indian Railways' broad gauge tracks?
              </p>
            </div>
            <div className="space-y-2">
              {['1,676 mm (5 ft 6 in)', '1,435 mm (4 ft 8.5 in)', '1,000 mm (3 ft 3.375 in)', '762 mm (2 ft 6 in)'].map((option, index) => (
                <button
                  key={index}
                  onClick={() => index === 0 ? handleCompleteQuest() : setShowHint(true)}
                  className="w-full text-left p-3 rounded-lg border hover:bg-gray-50 transition-colors"
                >
                  {option}
                </button>
              ))}
            </div>
            {showHint && (
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  💡 Hint: Indian Railways uses a broader gauge than most countries for stability!
                </p>
              </div>
            )}
          </div>
        );

      case 'photo':
        return (
          <div className="text-center">
            <div className="text-4xl mb-4">📸</div>
            <h3 className="text-lg font-semibold mb-4">Photo Challenge</h3>
            <p className="text-gray-600 mb-6">
              Capture a photo of your chai cup or any interesting view from the train window!
            </p>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 mb-4">
              <div className="text-gray-400 text-4xl mb-2">📷</div>
              <p className="text-gray-500">Tap to take photo</p>
            </div>
            <button
              onClick={handleCompleteQuest}
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Photo Captured! ✨
            </button>
          </div>
        );

      case 'ar_scan':
        return (
          <div className="text-center">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-lg font-semibold mb-4">AR Treasure Hunt</h3>
            <p className="text-gray-600 mb-6">
              Look around the station for hidden QR codes or interesting landmarks!
            </p>
            <div className="bg-gradient-to-r from-orange-100 to-red-100 p-6 rounded-lg mb-4">
              <div className="text-2xl mb-2">🎯</div>
              <p className="text-sm">Scanning for treasures...</p>
            </div>
            <button
              onClick={handleCompleteQuest}
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Treasure Found! 💎
            </button>
          </div>
        );

      case 'social':
        return (
          <div className="text-center">
            <div className="text-4xl mb-4">👥</div>
            <h3 className="text-lg font-semibold mb-4">Social Challenge</h3>
            <p className="text-gray-600 mb-6">
              Trade snacks or start a conversation with a fellow passenger!
            </p>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-pink-50 p-4 rounded-lg">
                <div className="text-2xl mb-2">🍪</div>
                <p className="text-sm">Share a snack</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-2xl mb-2">💬</div>
                <p className="text-sm">Start a chat</p>
              </div>
            </div>
            <button
              onClick={handleCompleteQuest}
              className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Mission Accomplished! 🤝
            </button>
          </div>
        );

      case 'food_challenge':
        return (
          <div>
            <div className="text-4xl text-center mb-4">🍛</div>
            <h3 className="text-lg font-semibold mb-4">Food Challenge</h3>
            <p className="text-gray-600 mb-4">
              Identify the famous local dish from {station.city}:
            </p>
            <div className="grid grid-cols-2 gap-3">
              {['Masala Dosa', 'Biryani', 'Vada Pav', 'Rasgulla'].map((dish, index) => (
                <button
                  key={index}
                  onClick={handleCompleteQuest}
                  className="p-3 border rounded-lg hover:bg-gray-50 transition-colors text-center"
                >
                  <div className="text-2xl mb-1">🍽️</div>
                  <div className="text-sm">{dish}</div>
                </button>
              ))}
            </div>
          </div>
        );

      case 'completion':
        return (
          <div className="text-center">
            <div className="text-6xl mb-4">🏆</div>
            <h3 className="text-2xl font-bold mb-4 text-yellow-600">
              Journey Complete!
            </h3>
            <p className="text-gray-600 mb-6">
              Congratulations! You've successfully completed the entire Duronto Express journey!
            </p>
            <div className="bg-gradient-to-r from-yellow-100 to-orange-100 p-6 rounded-lg mb-6">
              <div className="text-4xl mb-2">🎉</div>
              <p className="font-semibold">Epic Achievement Unlocked!</p>
              <p className="text-sm text-gray-600">Delhi Duronto Master</p>
            </div>
            <button
              onClick={handleCompleteQuest}
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-8 py-4 rounded-lg font-bold text-lg transition-colors"
            >
              Claim Rewards! 🎁
            </button>
          </div>
        );

      default:
        return (
          <div className="text-center">
            <div className="text-4xl mb-4">{questType.icon}</div>
            <p className="text-gray-600 mb-6">{station.questDescription}</p>
            <button
              onClick={handleCompleteQuest}
              className={`${questType.color} hover:opacity-90 text-white px-6 py-3 rounded-lg font-semibold transition-opacity`}
            >
              Complete Quest! ✨
            </button>
          </div>
        );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-gradient-to-br from-black/60 via-purple-900/40 to-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      {/* Background Sparkles */}
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-yellow-300 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{ 
            opacity: [0, 1, 0], 
            scale: [0.5, 1.5, 0.5],
            rotate: [0, 180, 360]
          }}
          transition={{
            duration: 2 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}
      
      <motion.div
        initial={{ scale: 0.5, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.5, opacity: 0, y: 50 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="bg-gradient-to-br from-white via-blue-50 to-purple-50 rounded-3xl p-8 max-w-lg w-full max-h-[85vh] overflow-y-auto shadow-2xl border border-white/50 backdrop-blur-md"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Enhanced Header */}
        <div className="relative mb-8">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-100 via-blue-100 to-pink-100 rounded-2xl opacity-50" />
          
          <div className="relative flex justify-between items-start p-4">
            <div className="flex items-center gap-4">
              <motion.div
                className="text-5xl"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {questType.icon}
              </motion.div>
              <div>
                <motion.h2 
                  className="text-2xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  {station.questTitle}
                </motion.h2>
                <motion.p 
                  className="text-sm font-semibold text-gray-600 mt-1"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  📍 {station.name} • {station.city}
                </motion.p>
              </div>
            </div>
            
            <motion.button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-3xl font-bold bg-white/50 rounded-full w-10 h-10 flex items-center justify-center backdrop-blur-sm border border-white/30"
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
            >
              ×
            </motion.button>
          </div>
        </div>

        {/* Enhanced Quest Content */}
        {questStep === 'intro' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            {/* Quest Type Badge */}
            <motion.div 
              className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 text-white mb-6 shadow-lg"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4, type: "spring" }}
            >
              <span className="text-2xl">{questType.icon}</span>
              <span className="font-bold text-lg">{questType.description}</span>
            </motion.div>
            
            {/* Quest Description */}
            <motion.div
              className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 mb-6 border border-white/30"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
            >
              <p className="text-gray-700 text-lg leading-relaxed font-medium">
                {station.questDescription}
              </p>
            </motion.div>
            
            {/* Start Button */}
            <motion.button
              onClick={handleStartQuest}
              className="w-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white py-4 rounded-2xl font-bold text-lg shadow-xl border border-white/20 backdrop-blur-sm"
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <span className="flex items-center justify-center gap-2">
                Start Quest 🚀
              </span>
            </motion.button>
          </motion.div>
        )}

        {questStep === 'active' && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            {renderQuestContent()}
          </motion.div>
        )}

        {questStep === 'completed' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            {/* Celebration Animation */}
            <motion.div
              className="text-8xl mb-6"
              animate={{ 
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ duration: 0.5, repeat: 3 }}
            >
              🎉
            </motion.div>
            
            <motion.h3 
              className="text-3xl font-black bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent mb-4"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Quest Completed!
            </motion.h3>
            
            <motion.p 
              className="text-gray-700 text-lg mb-6 font-medium"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              You earned the <strong className="text-purple-600">{station.cardReward}</strong> card!
            </motion.p>
            
            {/* Reward Card Display */}
            <motion.div 
              className="bg-gradient-to-br from-purple-100 via-pink-100 to-yellow-100 p-6 rounded-3xl shadow-xl border border-white/50 backdrop-blur-sm"
              initial={{ scale: 0, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.5, type: "spring" }}
            >
              <motion.div 
                className="text-6xl mb-3"
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 2, ease: "easeInOut" }}
              >
                🎴
              </motion.div>
              <p className="font-black text-xl text-purple-800 mb-2">{station.cardReward}</p>
              <p className="text-sm text-purple-600 font-semibold bg-white/50 rounded-full px-3 py-1">
                ✨ Added to your collection
              </p>
            </motion.div>
          </motion.div>
        )}

        {/* Enhanced Reward Preview */}
        {questStep !== 'completed' && (
          <motion.div 
            className="mt-8 bg-gradient-to-r from-purple-50 via-blue-50 to-pink-50 rounded-2xl p-6 border border-purple-200/50 backdrop-blur-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <h4 className="text-lg font-bold text-gray-800 mb-4 text-center">🎁 Quest Rewards</h4>
            
            <div className="grid grid-cols-2 gap-4">
              {/* Card Reward */}
              <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 text-center border border-white/30">
                <div className="text-3xl mb-2">🎴</div>
                <div className="text-xs text-gray-600 mb-1">CARD REWARD</div>
                <div className="font-bold text-purple-700 text-sm">{station.cardReward}</div>
              </div>
              
              {/* XP Reward */}
              <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 text-center border border-white/30">
                <div className="text-3xl mb-2">⭐</div>
                <div className="text-xs text-gray-600 mb-1">EXPERIENCE</div>
                <div className="font-bold text-blue-700 text-sm">+100 XP</div>
              </div>
            </div>
            
            {/* Tokens */}
            <div className="mt-4 bg-white/60 backdrop-blur-sm rounded-xl p-3 text-center border border-white/30">
              <div className="flex items-center justify-center gap-2">
                <span className="text-2xl">🪙</span>
                <div>
                  <div className="text-xs text-gray-600">TOKENS</div>
                  <div className="font-bold text-yellow-700">+10 Tokens</div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default QuestModal;