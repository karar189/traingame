import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { collectibleCards, snackNFTs } from '../data/routes';

// Import NFT card images
import bengaluruImg from '../assets/bangalore.jpg';
import hyderabadImg from '../assets/hydrebad.jpg';
import nagpurImg from '../assets/nagpur.jpg';
import bhopalImg from '../assets/bhopal.jpg';
import jhansiImg from '../assets/jhansi.jpg';
import delhiImg from '../assets/delhi.jpg';

const CardCollection = ({ userCards = [], userSnacks = [], onNavigate, user = null, onProgressUpdate = null }) => {
  const [activeTab, setActiveTab] = useState('cards');
  const [selectedCard, setSelectedCard] = useState(null);
  const [showTradeModal, setShowTradeModal] = useState(false);
  const [tradeAddress, setTradeAddress] = useState('');
  const [isTrading, setIsTrading] = useState(false);

  // Debug logging for received cards
  console.log('🎴 CardCollection: Received userCards:', userCards);
  console.log('🍽️ CardCollection: Received userSnacks:', userSnacks);

  // Map card IDs to images
  const cardImages = {
    'bengaluru-tech': bengaluruImg,
    'hyderabad-heritage': hyderabadImg,
    'nagpur-orange': nagpurImg,
    'bhopal-lakes': bhopalImg,
    'jhansi-warrior': jhansiImg,
    'delhi-duronto': delhiImg,
  };

  const getRarityColor = (rarity) => {
    switch (rarity) {
      case 'common': return 'border-gray-400 bg-gray-50';
      case 'uncommon': return 'border-green-400 bg-green-50';
      case 'rare': return 'border-purple-400 bg-purple-50';
      case 'epic': return 'border-orange-400 bg-orange-50';
      case 'legendary': return 'border-yellow-400 bg-yellow-50';
      default: return 'border-gray-400 bg-gray-50';
    }
  };

  const handleShare = (card) => {
    const shareText = `🎴 Check out my ${card.name} NFT card from TrainQuest! 🚂 Collected during my epic journey from Bengaluru to Delhi! #TrainQuest #NFT #TravelGaming`;
    
    if (navigator.share) {
      navigator.share({
        title: `My ${card.name} NFT Card`,
        text: shareText,
        url: window.location.href
      });
    } else {
      // Fallback to Twitter
      const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
      window.open(twitterUrl, '_blank');
    }
  };

  const handleTrade = async (card) => {
    setSelectedCard(card);
    setShowTradeModal(true);
  };

  const executeTrade = async () => {
    if (!tradeAddress || !selectedCard || !user) return;
    
    setIsTrading(true);
    try {
      // Call the backend trade API
      const response = await fetch('http://localhost:3001/api/trade', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fromAddress: user.walletAddress,
          toAddress: tradeAddress,
          cardId: selectedCard.id,
          fromSessionId: user.sessionId
        })
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Trade failed');
      }
      
      // Show success message
      alert(`✅ Trade completed! ${selectedCard.name} has been sent to ${tradeAddress}`);
      
      // Update local state to reflect the trade
      if (onProgressUpdate && result.senderCards) {
        // Update the user's progress with the new card collection
        onProgressUpdate(prevProgress => ({
          ...prevProgress,
          collectedCards: result.senderCards
        }));
      } else {
        // Fallback: refresh the page if no update function provided
        window.location.reload();
      }
      
      setShowTradeModal(false);
      setTradeAddress('');
      setSelectedCard(null);
      
      console.log('Trade completed successfully:', result);
      
    } catch (error) {
      console.error('Trade failed:', error);
      alert(`❌ Trade failed: ${error.message}`);
    } finally {
      setIsTrading(false);
    }
  };

  const CardItem = ({ item, isOwned, type = 'card' }) => (
    <motion.div
      className={`
        relative rounded-xl border-2 cursor-pointer transition-all duration-300 overflow-hidden
        ${isOwned ? getRarityColor(item.rarity) : 'border-gray-300 bg-gray-50'}
        hover:shadow-xl hover:scale-105 group
      `}
      whileHover={{ y: -8 }}
      onClick={() => isOwned && setSelectedCard(item)}
    >
      {/* Card Image */}
      <div className="aspect-square relative overflow-hidden">
        {type === 'card' && cardImages[item.id] ? (
          <img 
            src={cardImages[item.id]} 
            alt={item.name}
            className={`w-full h-full object-cover transition-all duration-300 ${
              !isOwned ? 'filter blur-sm grayscale opacity-40' : 'group-hover:scale-110'
            }`}
          />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center ${
            !isOwned ? 'filter blur-sm grayscale opacity-40' : ''
          }`}>
            <div className="text-6xl">
              {type === 'card' ? '🎴' : item.name.includes('Chai') ? '☕' : 
               item.name.includes('Samosa') ? '🥟' : 
               item.name.includes('Rasgulla') ? '🍡' : '🍽️'}
            </div>
          </div>
        )}
        
        {/* Rarity Glow Effect */}
        {isOwned && (
          <div className={`absolute inset-0 opacity-20 bg-gradient-to-t ${
            item.rarity === 'common' ? 'from-gray-500' :
            item.rarity === 'uncommon' ? 'from-green-500' :
            item.rarity === 'rare' ? 'from-purple-500' :
            item.rarity === 'epic' ? 'from-orange-500' :
            'from-yellow-500'
          }`} />
        )}
      </div>

      {/* Card Info */}
      <div className="p-4">
        <div className="text-center">
          <h3 className={`font-bold text-sm mb-1 truncate ${!isOwned ? 'text-gray-400' : 'text-gray-800'}`}>
            {item.name}
          </h3>
          <p className={`text-xs mb-2 line-clamp-2 ${!isOwned ? 'text-gray-400' : 'text-gray-600'}`}>
            {item.description}
          </p>
          
          {/* Rarity Badge */}
          <div className={`
            inline-block px-3 py-1 rounded-full text-xs font-bold
            ${!isOwned ? 'bg-gray-200 text-gray-500' :
              item.rarity === 'common' ? 'bg-gray-200 text-gray-700' :
              item.rarity === 'uncommon' ? 'bg-green-200 text-green-700' :
              item.rarity === 'rare' ? 'bg-purple-200 text-purple-700' :
              item.rarity === 'epic' ? 'bg-orange-200 text-orange-700' :
              'bg-yellow-200 text-yellow-700'}
          `}>
            {item.rarity.toUpperCase()}
          </div>
        </div>
      </div>

      {/* Owned Indicator */}
      {isOwned && (
        <motion.div 
          className="absolute top-3 right-3 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <span className="text-white text-sm font-bold">✓</span>
        </motion.div>
      )}

      {/* Not Owned Lock Overlay */}
      {!isOwned && (
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div 
            className="bg-black/60 backdrop-blur-sm rounded-full p-4"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="text-white text-3xl">🔒</div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-700 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-yellow-300 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{ opacity: [0, 1, 0], scale: [0.5, 1, 0.5] }}
            transition={{
              duration: 2 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>
      
      {/* Enhanced Navigation Header */}
      <div className="relative bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 shadow-2xl">
        <div className="absolute inset-0 bg-black/10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 2px, transparent 2px)`,
            backgroundSize: '20px 20px'
          }} />
        </div>
        
        <div className="relative flex items-center justify-between max-w-4xl mx-auto p-4">
          <motion.button
            onClick={() => onNavigate('game-map')}
            className="flex items-center gap-3 text-white hover:text-yellow-100 bg-white/20 backdrop-blur-sm rounded-2xl px-4 py-2 border border-white/30"
            whileHover={{ scale: 1.05, x: -5 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="text-2xl">←</span>
            <span className="font-semibold">Back to Map</span>
          </motion.button>
          
          <motion.h1 
            className="text-3xl font-black bg-gradient-to-r from-white to-yellow-100 bg-clip-text text-transparent drop-shadow-lg"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.2 }}
          >
            🎴 My Collection
          </motion.h1>
          
          {/* Refresh Button */}
          <motion.button
            onClick={() => {
              console.log('🔄 Manual refresh requested');
              window.location.reload();
            }}
            className="flex items-center gap-2 text-white hover:text-yellow-100 bg-white/20 backdrop-blur-sm rounded-2xl px-4 py-2 border border-white/30"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title="Refresh collection to see latest cards"
          >
            <span className="text-xl">🔄</span>
            <span className="font-semibold">Refresh</span>
          </motion.button>
        </div>
      </div>

      <div className="relative max-w-4xl mx-auto p-6">
      {/* Enhanced Header */}
      <motion.div 
        className="text-center mb-8"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="text-4xl font-black text-white mb-3 drop-shadow-lg">
          Your Epic Collection
        </h2>
        <p className="text-xl text-yellow-100 font-medium drop-shadow">
          Collect cards and snacks from your train journey adventures
        </p>
      </motion.div>

      {/* Enhanced Tabs */}
      <motion.div 
        className="flex justify-center mb-8"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4 }}
      >
        <div className="bg-white/20 backdrop-blur-md rounded-2xl p-2 flex border border-white/30 shadow-xl">
          <motion.button
            onClick={() => setActiveTab('cards')}
            className={`px-8 py-3 rounded-xl font-bold text-lg transition-all ${
              activeTab === 'cards' 
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg' 
                : 'text-white/80 hover:text-white hover:bg-white/10'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            🎴 Cards ({userCards.length}/{collectibleCards.length})
          </motion.button>
          <motion.button
            onClick={() => setActiveTab('snacks')}
            className={`px-8 py-3 rounded-xl font-bold text-lg transition-all ${
              activeTab === 'snacks' 
                ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg' 
                : 'text-white/80 hover:text-white hover:bg-white/10'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            🍽️ Snacks ({userSnacks.length}/{snackNFTs.length})
          </motion.button>
        </div>
      </motion.div>

      {/* Collection Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {activeTab === 'cards' 
          ? collectibleCards.map(card => (
              <CardItem 
                key={card.id} 
                item={card} 
                isOwned={userCards.includes(card.id)}
                type="card"
              />
            ))
          : snackNFTs.map(snack => (
              <CardItem 
                key={snack.id} 
                item={snack} 
                isOwned={userSnacks.includes(snack.id)}
                type="snack"
              />
            ))
        }
      </div>

      {/* Collection Stats */}
      <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4 text-center">Collection Progress</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {Math.round((userCards.length / collectibleCards.length) * 100)}%
            </div>
            <div className="text-sm text-gray-600">Cards Collected</div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${(userCards.length / collectibleCards.length) * 100}%` }}
              ></div>
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {Math.round((userSnacks.length / snackNFTs.length) * 100)}%
            </div>
            <div className="text-sm text-gray-600">Snacks Collected</div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div 
                className="bg-purple-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${(userSnacks.length / snackNFTs.length) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Card Detail Modal */}
      <AnimatePresence>
        {selectedCard && !showTradeModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedCard(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              className="bg-gradient-to-br from-white to-blue-50 rounded-3xl p-6 max-w-md w-full shadow-2xl border border-white/50"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                {/* Card Image */}
                <div className="aspect-square mb-4 rounded-2xl overflow-hidden shadow-lg">
                  {activeTab === 'cards' && cardImages[selectedCard.id] ? (
                    <img 
                      src={cardImages[selectedCard.id]} 
                      alt={selectedCard.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                      <div className="text-8xl">
                        {activeTab === 'cards' ? '🎴' : 
                         selectedCard.name.includes('Chai') ? '☕' : 
                         selectedCard.name.includes('Samosa') ? '🥟' : 
                         selectedCard.name.includes('Rasgulla') ? '🍡' : '🍽️'}
                      </div>
                    </div>
                  )}
                </div>

                <h2 className="text-2xl font-bold mb-2 text-gray-800">{selectedCard.name}</h2>
                <p className="text-gray-600 mb-4 leading-relaxed">{selectedCard.description}</p>
                
                {selectedCard.effect && (
                  <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl mb-4">
                    <p className="text-sm text-blue-800">
                      <strong>✨ Effect:</strong> {selectedCard.effect}
                    </p>
                  </div>
                )}

                <div className={`
                  inline-block px-6 py-2 rounded-full font-bold mb-6 text-sm
                  ${selectedCard.rarity === 'common' ? 'bg-gray-200 text-gray-700' :
                    selectedCard.rarity === 'uncommon' ? 'bg-green-200 text-green-700' :
                    selectedCard.rarity === 'rare' ? 'bg-purple-200 text-purple-700' :
                    selectedCard.rarity === 'epic' ? 'bg-orange-200 text-orange-700' :
                    'bg-yellow-200 text-yellow-700'}
                `}>
                  {selectedCard.rarity.toUpperCase()} RARITY
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 mb-4">
                  <motion.button
                    onClick={() => handleShare(selectedCard)}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-3 rounded-xl font-bold transition-all shadow-lg"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    📤 Share
                  </motion.button>
                  <motion.button
                    onClick={() => handleTrade(selectedCard)}
                    className="flex-1 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white py-3 rounded-xl font-bold transition-all shadow-lg"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    🔄 Trade
                  </motion.button>
                </div>

                <motion.button
                  onClick={() => setSelectedCard(null)}
                  className="w-full bg-gray-500 hover:bg-gray-600 text-white py-3 rounded-xl font-semibold transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Close
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Trade Modal */}
      <AnimatePresence>
        {showTradeModal && selectedCard && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowTradeModal(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              className="bg-gradient-to-br from-white to-orange-50 rounded-3xl p-6 max-w-md w-full shadow-2xl border border-white/50"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                <div className="text-4xl mb-4">🔄</div>
                <h2 className="text-2xl font-bold mb-2 text-gray-800">Trade NFT Card</h2>
                <p className="text-gray-600 mb-6">
                  Send <strong>{selectedCard.name}</strong> to another player
                </p>

                <div className="text-left mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Recipient Wallet Address
                  </label>
                  <input
                    type="text"
                    value={tradeAddress}
                    onChange={(e) => setTradeAddress(e.target.value.toLowerCase())}
                    placeholder="0x1234567890abcdef..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent font-mono text-sm"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Enter the wallet address of the player you want to trade with. They must be registered in the game.
                  </p>
                  <div className="mt-2 p-2 bg-blue-50 rounded-lg">
                    <p className="text-xs text-blue-700">
                      💡 <strong>Test Address:</strong> Try trading with other registered players from the wallet data.
                    </p>
                  </div>
                  {tradeAddress && !tradeAddress.match(/^0x[a-fA-F0-9]{40}$/) && (
                    <p className="text-xs text-red-500 mt-1">
                      ⚠️ Invalid wallet address format. Should be 42 characters starting with 0x.
                    </p>
                  )}
                </div>

                <div className="flex gap-3">
                  <motion.button
                    onClick={() => setShowTradeModal(false)}
                    className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 rounded-xl font-semibold transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    onClick={executeTrade}
                    disabled={!tradeAddress || isTrading || !tradeAddress.match(/^0x[a-fA-F0-9]{40}$/)}
                    className="flex-1 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 rounded-xl font-bold transition-all shadow-lg"
                    whileHover={!isTrading && tradeAddress && tradeAddress.match(/^0x[a-fA-F0-9]{40}$/) ? { scale: 1.02 } : {}}
                    whileTap={!isTrading && tradeAddress && tradeAddress.match(/^0x[a-fA-F0-9]{40}$/) ? { scale: 0.98 } : {}}
                  >
                    {isTrading ? (
                      <div className="flex items-center justify-center gap-2">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                        />
                        Trading...
                      </div>
                    ) : (
                      'Execute Trade'
                    )}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      </div>
    </div>
  );
};

export default CardCollection;