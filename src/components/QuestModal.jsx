import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const QuestModal = ({ station, onComplete, onClose }) => {
  const [questStep, setQuestStep] = useState('intro'); // intro, instructions, posted, completed
  const [isPosting, setIsPosting] = useState(false);

  // Generate Twitter/X URL with pre-filled content
  const generateTwitterUrl = () => {
    const baseUrl = 'https://x.com/intent/tweet';
    const text = encodeURIComponent(station.twitterTemplate);
    const hashtags = encodeURIComponent(station.hashtags.join(','));
    
    return `${baseUrl}?text=${text}&hashtags=${hashtags}`;
  };

  const handleStartQuest = () => {
    setQuestStep('instructions');
  };

  const handlePostToTwitter = () => {
    setIsPosting(true);
    const twitterUrl = generateTwitterUrl();
    
    // Open Twitter in new tab
    window.open(twitterUrl, '_blank', 'width=550,height=420');
    
    // Move to next step after opening Twitter
    setTimeout(() => {
      setIsPosting(false);
      setQuestStep('posted');
    }, 1000);
  };

  const handleQuestComplete = () => {
    setQuestStep('completed');
    setTimeout(() => {
      onComplete(station.cardReward);
    }, 2000);
  };

  const renderQuestContent = () => {
    switch (questStep) {
      case 'intro':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <motion.div
              animate={{ 
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-8xl mb-6"
            >
              📸
            </motion.div>
            <h3 className="text-3xl font-bold text-gray-800 mb-4">
              {station.questTitle}
            </h3>
            <p className="text-gray-600 text-lg mb-6 leading-relaxed">
              {station.questDescription}
            </p>
            <div className="bg-gradient-to-r from-blue-100 to-purple-100 p-4 rounded-xl mb-6">
              <p className="text-blue-800 font-semibold">
                🎯 Challenge: {station.questChallenge}
              </p>
            </div>
            <motion.button
              onClick={handleStartQuest}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              📷 Start Photo Quest
            </motion.button>
          </motion.div>
        );

      case 'instructions':
        return (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-center"
          >
            <div className="text-6xl mb-6">📱</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-6">
              Photo Quest Instructions
            </h3>
            
            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-6 rounded-2xl mb-6 text-left">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">1️⃣</span>
                  <div>
                    <p className="font-semibold text-gray-800">Take Your Photo</p>
                    <p className="text-gray-600 text-sm">Snap a selfie or photo at the suggested locations</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <span className="text-2xl">2️⃣</span>
                  <div>
                    <p className="font-semibold text-gray-800">Post to Twitter/X</p>
                    <p className="text-gray-600 text-sm">We'll open Twitter with a pre-written post - just add your photo!</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <span className="text-2xl">3️⃣</span>
                  <div>
                    <p className="font-semibold text-gray-800">Come Back & Complete</p>
                    <p className="text-gray-600 text-sm">Return here and click "Quest Done" to claim your NFT!</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-xl mb-6">
              <p className="text-sm text-gray-600 mb-2">📝 <strong>Pre-written Tweet:</strong></p>
              <p className="text-sm text-gray-700 italic bg-white p-3 rounded-lg">
                "{station.twitterTemplate}"
              </p>
            </div>

            <motion.button
              onClick={handlePostToTwitter}
              disabled={isPosting}
              className="bg-gradient-to-r from-blue-400 to-blue-600 text-white px-8 py-3 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
              whileHover={!isPosting ? { scale: 1.05, y: -2 } : {}}
              whileTap={!isPosting ? { scale: 0.95 } : {}}
            >
              {isPosting ? (
                <div className="flex items-center gap-2">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                  />
                  Opening Twitter...
                </div>
              ) : (
                <>🐦 Post to Twitter/X</>
              )}
            </motion.button>
          </motion.div>
        );

      case 'posted':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 360]
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-8xl mb-6"
            >
              🎉
            </motion.div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              Great! Twitter/X Should Be Open
            </h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
              1. Add your photo to the pre-written tweet<br/>
              2. Post it to Twitter/X<br/>
              3. Come back here and click "Quest Done"!
            </p>
            
            <div className="bg-green-50 border border-green-200 p-4 rounded-xl mb-6">
              <p className="text-green-800 font-semibold">
                ✅ Ready to complete your quest?
              </p>
            </div>

            <div className="flex gap-4 justify-center">
              <motion.button
                onClick={() => setQuestStep('instructions')}
                className="bg-gray-500 text-white px-6 py-2 rounded-xl font-medium hover:bg-gray-600 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                ← Back to Instructions
              </motion.button>
              
              <motion.button
                onClick={handleQuestComplete}
                className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-3 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                🎯 Quest Done!
              </motion.button>
            </div>
          </motion.div>
        );

      case 'completed':
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <motion.div
              animate={{ 
                rotate: [0, 360],
                scale: [1, 1.3, 1]
              }}
              transition={{ duration: 1.5 }}
              className="text-8xl mb-6"
            >
              🏆
            </motion.div>
            <h3 className="text-3xl font-bold text-green-600 mb-4">
              Quest Completed!
            </h3>
            <p className="text-gray-600 mb-4">
              Amazing work! You've earned your NFT card:
            </p>
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-4 rounded-xl font-bold text-xl mb-6">
              🎴 {station.cardReward}
            </div>
            <div className="text-sm text-gray-500">
              +100 XP • +10 Tokens • +1 NFT Card
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

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
          className="bg-gradient-to-br from-white via-blue-50 to-purple-50 rounded-3xl shadow-2xl max-w-2xl w-full p-8 border border-white/50 max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <div className="text-3xl">🚂</div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  {station.name}
                </h2>
                <p className="text-gray-500 text-sm">
                  {station.city}, {station.state}
                </p>
              </div>
            </div>
            <motion.button
              onClick={onClose}
              className="w-10 h-10 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              ✕
            </motion.button>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between text-xs text-gray-500 mb-2">
              <span>Quest Progress</span>
              <span>
                {questStep === 'intro' && '1/4'}
                {questStep === 'instructions' && '2/4'}
                {questStep === 'posted' && '3/4'}
                {questStep === 'completed' && '4/4'}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
                initial={{ width: '25%' }}
                animate={{ 
                  width: questStep === 'intro' ? '25%' : 
                        questStep === 'instructions' ? '50%' : 
                        questStep === 'posted' ? '75%' : '100%'
                }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>

          {/* Quest Content */}
          <div className="min-h-[300px] flex items-center justify-center">
            {renderQuestContent()}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default QuestModal;