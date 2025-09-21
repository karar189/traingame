import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { questTypes } from '../data/routes';

const StationNode = ({ station, index, isCompleted, isCurrent, onClick }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const questType = questTypes[station.questType];
  
  const getNodeStyle = () => {
    if (isCompleted) {
      return 'bg-gradient-to-br from-emerald-400 via-green-500 to-emerald-600 border-emerald-300 text-white shadow-2xl shadow-emerald-500/50';
    } else if (isCurrent) {
      return 'bg-gradient-to-br from-yellow-300 via-amber-400 to-orange-500 border-yellow-200 text-white shadow-2xl shadow-yellow-500/50';
    } else if (station.isUnlocked) {
      return `bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 border-blue-300 text-white shadow-2xl shadow-purple-500/50`;
    } else {
      return 'bg-gradient-to-br from-gray-300 via-gray-400 to-gray-500 border-gray-200 text-gray-600 shadow-lg';
    }
  };

  const x = (station.position.x / 100) * 800;
  const y = (station.position.y / 100) * 500;

  return (
    <motion.div
      className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10"
      style={{ left: `${(x / 800) * 100}%`, top: `${(y / 500) * 100}%` }}
      initial={{ scale: 0, opacity: 0, y: 50 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      transition={{ 
        delay: index * 0.15, 
        duration: 0.8,
        type: "spring",
        stiffness: 100,
        damping: 10
      }}
      whileHover={{ 
        scale: station.isUnlocked ? 1.2 : 1,
        y: station.isUnlocked ? -5 : 0,
        transition: { duration: 0.2 }
      }}
      whileTap={{ scale: station.isUnlocked ? 0.9 : 1 }}
      onMouseEnter={() => station.isUnlocked && setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      onClick={onClick}
    >
      {/* Outer Glow Ring */}
      {(isCurrent || isCompleted) && (
        <motion.div
          className={`absolute inset-0 rounded-full ${
            isCompleted ? 'bg-emerald-400' : 'bg-yellow-400'
          }`}
          animate={{ 
            scale: [1, 1.4, 1],
            opacity: [0.3, 0, 0.3]
          }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}
      
      {/* Station Node Circle */}
      <motion.div 
        className={`
          relative w-20 h-20 rounded-full border-4 flex items-center justify-center
          ${getNodeStyle()}
          transition-all duration-500 backdrop-blur-sm
        `}
        animate={isCurrent ? { 
          boxShadow: [
            "0 0 20px rgba(255, 193, 7, 0.5)",
            "0 0 40px rgba(255, 193, 7, 0.8)",
            "0 0 20px rgba(255, 193, 7, 0.5)"
          ]
        } : {}}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        {/* Inner Content */}
        <div className="text-center relative z-10">
          <motion.div 
            className="text-2xl mb-1 drop-shadow-lg"
            animate={isCurrent ? { rotate: [0, 10, -10, 0] } : {}}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {questType.icon}
          </motion.div>
          <div className="text-sm font-black drop-shadow-md">{station.id}</div>
        </div>
        
        {/* Inner Shine Effect */}
        <motion.div
          className="absolute inset-2 rounded-full bg-gradient-to-tr from-white/30 via-transparent to-transparent"
          animate={{ rotate: 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        />
      </motion.div>

      {/* Enhanced Station Info Tooltip - Only show for unlocked stations */}
      <AnimatePresence>
        {station.isUnlocked && showTooltip && (
          <motion.div
          className="absolute top-full left-1/2 transform -translate-x-1/2 mt-4 
                     bg-gradient-to-br from-white via-blue-50 to-purple-50 rounded-2xl shadow-2xl p-4 min-w-56 z-20
                     border border-white/50 backdrop-blur-md pointer-events-none"
          initial={{ opacity: 0, y: -20, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.8 }}
          transition={{ duration: 0.3, type: "spring" }}
        >
        {/* Station Header */}
        <div className="flex items-center gap-2 mb-3">
          <div className="text-2xl">{questType.icon}</div>
          <div>
            <div className="text-sm font-black text-gray-800 leading-tight">
              {station.name}
            </div>
            <div className="text-xs text-gray-500">
              {station.city}, {station.state}
            </div>
          </div>
        </div>
        
        {/* Quest Title */}
        <div className="text-xs font-semibold text-purple-700 mb-3 bg-purple-100 rounded-lg p-2">
          {station.questTitle}
        </div>
        
        {/* Quest Type Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-2 rounded-full text-xs font-bold
                        bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg mb-3">
          <span className="text-sm">{questType.icon}</span>
          <span>{station.questType.replace('_', ' ').toUpperCase()}</span>
        </div>

        {/* Status Indicators */}
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-2">
            {isCompleted && (
              <div className="flex items-center gap-1 px-2 py-1 bg-green-100 rounded-full">
                <span className="text-green-600">✅</span>
                <span className="text-xs font-bold text-green-700">COMPLETED</span>
              </div>
            )}
            {isCurrent && !isCompleted && (
              <div className="flex items-center gap-1 px-2 py-1 bg-yellow-100 rounded-full animate-pulse">
                <span className="text-yellow-600">⭐</span>
                <span className="text-xs font-bold text-yellow-700">CURRENT</span>
              </div>
            )}
            {!station.isUnlocked && (
              <div className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-full">
                <span className="text-gray-500">🔒</span>
                <span className="text-xs font-bold text-gray-600">LOCKED</span>
              </div>
            )}
          </div>
          
          {station.arrivalTime && (
            <div className="text-xs font-mono bg-blue-100 text-blue-700 px-2 py-1 rounded">
              {station.arrivalTime}
            </div>
          )}
        </div>

        {/* Reward Preview */}
        {station.cardReward && (
          <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl p-3 border border-purple-200">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🎴</span>
              <div>
                <div className="text-xs text-purple-600 font-semibold">REWARD</div>
                <div className="text-sm font-bold text-purple-800">
                  {station.cardReward}
                </div>
              </div>
            </div>
          </div>
        )}
        </motion.div>
        )}
      </AnimatePresence>

      {/* Enhanced Completion Stars */}
      {isCompleted && (
        <motion.div
          className="absolute -top-3 -right-3 z-30"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.5, duration: 0.8, type: "spring" }}
        >
          <motion.div 
            className="w-8 h-8 bg-gradient-to-br from-yellow-300 to-orange-400 rounded-full flex items-center justify-center text-sm shadow-lg border-2 border-white"
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          >
            ⭐
          </motion.div>
        </motion.div>
      )}

      {/* Enhanced Current Station Effects */}
      {isCurrent && (
        <>
          {/* Outer Pulse Ring */}
          <motion.div
            className="absolute inset-0 rounded-full border-4 border-yellow-300/60"
            animate={{ scale: [1, 1.5, 1], opacity: [0.8, 0, 0.8] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          {/* Inner Pulse Ring */}
          <motion.div
            className="absolute inset-2 rounded-full border-2 border-orange-400/40"
            animate={{ scale: [1, 1.3, 1], opacity: [0.6, 0, 0.6] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
          />
        </>
      )}

      {/* Enhanced Distance Marker */}
      <motion.div 
        className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 z-20"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 + 0.5 }}
      >
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg border border-white/20">
          {station.distanceFromSource} km
        </div>
      </motion.div>
    </motion.div>
  );
};

export default StationNode;