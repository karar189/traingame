import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { collectibleCards, snackNFTs } from '../data/routes';

const CardCollection = ({ userCards = [], userSnacks = [], onNavigate }) => {
  const [activeTab, setActiveTab] = useState('cards');
  const [selectedCard, setSelectedCard] = useState(null);

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

  const CardItem = ({ item, isOwned, type = 'card' }) => (
    <motion.div
      className={`
        relative p-4 rounded-lg border-2 cursor-pointer transition-all duration-300
        ${isOwned ? getRarityColor(item.rarity) : 'border-gray-200 bg-gray-100 opacity-50'}
        hover:shadow-lg hover:scale-105
      `}
      whileHover={{ y: -5 }}
      onClick={() => isOwned && setSelectedCard(item)}
    >
      {/* Card Image Placeholder */}
      <div className="aspect-square bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg mb-3 flex items-center justify-center">
        <div className="text-4xl">
          {type === 'card' ? '🎴' : item.name.includes('Chai') ? '☕' : 
           item.name.includes('Samosa') ? '🥟' : 
           item.name.includes('Rasgulla') ? '🍡' : '🍽️'}
        </div>
      </div>

      {/* Card Info */}
      <div className="text-center">
        <h3 className="font-semibold text-sm mb-1 truncate">{item.name}</h3>
        <p className="text-xs text-gray-600 mb-2 line-clamp-2">{item.description}</p>
        
        {/* Rarity Badge */}
        <div className={`
          inline-block px-2 py-1 rounded-full text-xs font-semibold
          ${item.rarity === 'common' ? 'bg-gray-200 text-gray-700' :
            item.rarity === 'uncommon' ? 'bg-green-200 text-green-700' :
            item.rarity === 'rare' ? 'bg-purple-200 text-purple-700' :
            item.rarity === 'epic' ? 'bg-orange-200 text-orange-700' :
            'bg-yellow-200 text-yellow-700'}
        `}>
          {item.rarity}
        </div>
      </div>

      {/* Owned Indicator */}
      {isOwned && (
        <div className="absolute top-2 right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
          <span className="text-white text-xs">✓</span>
        </div>
      )}

      {/* Not Owned Overlay */}
      {!isOwned && (
        <div className="absolute inset-0 bg-gray-900 bg-opacity-30 rounded-lg flex items-center justify-center">
          <div className="text-white text-2xl">🔒</div>
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
          
          <div className="w-32"></div> {/* Spacer for centering */}
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

      {/* Card Detail Modal */}
      <AnimatePresence>
        {selectedCard && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedCard(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white rounded-2xl p-6 max-w-sm w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                <div className="text-6xl mb-4">
                  {activeTab === 'cards' ? '🎴' : 
                   selectedCard.name.includes('Chai') ? '☕' : 
                   selectedCard.name.includes('Samosa') ? '🥟' : 
                   selectedCard.name.includes('Rasgulla') ? '🍡' : '🍽️'}
                </div>
                <h2 className="text-xl font-bold mb-2">{selectedCard.name}</h2>
                <p className="text-gray-600 mb-4">{selectedCard.description}</p>
                
                {selectedCard.effect && (
                  <div className="bg-blue-50 p-3 rounded-lg mb-4">
                    <p className="text-sm text-blue-800">
                      <strong>Effect:</strong> {selectedCard.effect}
                    </p>
                  </div>
                )}

                <div className={`
                  inline-block px-4 py-2 rounded-full font-semibold mb-4
                  ${selectedCard.rarity === 'common' ? 'bg-gray-200 text-gray-700' :
                    selectedCard.rarity === 'uncommon' ? 'bg-green-200 text-green-700' :
                    selectedCard.rarity === 'rare' ? 'bg-purple-200 text-purple-700' :
                    selectedCard.rarity === 'epic' ? 'bg-orange-200 text-orange-700' :
                    'bg-yellow-200 text-yellow-700'}
                `}>
                  {selectedCard.rarity.toUpperCase()}
                </div>

                <button
                  onClick={() => setSelectedCard(null)}
                  className="w-full bg-gray-500 hover:bg-gray-600 text-white py-2 rounded-lg font-semibold transition-colors"
                >
                  Close
                </button>
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