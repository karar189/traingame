import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { durontoExpressRoute, questTypes } from '../data/routes';
import StationNode from './StationNode';
import QuestModal from './QuestModal';

const GameMap = ({ selectedRoute, userProgress = {}, onProgressUpdate, onNavigate }) => {
  const [selectedStation, setSelectedStation] = useState(null);
  const [currentLevel, setCurrentLevel] = useState(1);
  
  // Ensure userProgress has default values
  const safeUserProgress = {
    completedStations: [],
    collectedCards: [],
    collectedSnacks: [],
    totalXP: 0,
    tokens: 0,
    ...userProgress
  };

  // Generate SVG path for the winding route
  const generatePath = () => {
    const stations = durontoExpressRoute.stations;
    let pathData = '';
    
    stations.forEach((station, index) => {
      const x = (station.position.x / 100) * 800; // Scale to container width
      const y = (station.position.y / 100) * 500; // Scale to container height (reduced from 600 to 500)
      
      if (index === 0) {
        pathData += `M ${x} ${y}`;
      } else {
        // Create smooth curves between stations
        const prevStation = stations[index - 1];
        const prevX = (prevStation.position.x / 100) * 800;
        const prevY = (prevStation.position.y / 100) * 600;
        
        const controlX1 = prevX + (x - prevX) * 0.3;
        const controlY1 = prevY;
        const controlX2 = prevX + (x - prevX) * 0.7;
        const controlY2 = y;
        
        pathData += ` C ${controlX1} ${controlY1}, ${controlX2} ${controlY2}, ${x} ${y}`;
      }
    });
    
    return pathData;
  };

  const handleStationClick = (station) => {
    if (station.isUnlocked) {
      setSelectedStation(station);
    }
  };

  const completeQuest = (stationId, reward) => {
    // Mark current station as completed
    const newProgress = {
      ...safeUserProgress,
      completedStations: [...safeUserProgress.completedStations, stationId],
      totalXP: safeUserProgress.totalXP + 100,
      collectedCards: [...safeUserProgress.collectedCards, reward],
      tokens: safeUserProgress.tokens + 10
    };
    
    onProgressUpdate(newProgress);
    
    // Unlock next station
    const nextStation = durontoExpressRoute.stations.find(s => s.id === stationId + 1);
    if (nextStation) {
      nextStation.isUnlocked = true;
    }
    
    setSelectedStation(null);
  };

  // Initialize first station as unlocked and current
  useEffect(() => {
    if (durontoExpressRoute.stations.length > 0) {
      durontoExpressRoute.stations[0].isUnlocked = true;
      // Make sure currentStation matches the first unlocked station
      if (safeUserProgress.currentStation === 1 && safeUserProgress.completedStations.length === 0) {
        // First station should be current if no stations are completed
      }
    }
  }, [safeUserProgress]);

  return (
    <div className="relative w-full h-screen bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-700 overflow-hidden flex flex-col">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {/* Floating Clouds */}
        <motion.div
          className="absolute top-20 left-10 w-32 h-20 bg-white bg-opacity-20 rounded-full blur-sm"
          animate={{ x: [0, 50, 0], y: [0, -20, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-40 right-20 w-24 h-16 bg-white bg-opacity-15 rounded-full blur-sm"
          animate={{ x: [0, -30, 0], y: [0, 15, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-32 left-32 w-28 h-18 bg-white bg-opacity-10 rounded-full blur-sm"
          animate={{ x: [0, 40, 0], y: [0, -25, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        
        {/* Twinkling Stars */}
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
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
      </div>

      {/* Enhanced Header */}
      <motion.div 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative z-10 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-white shadow-2xl"
      >
        {/* Header Background Pattern */}
        <div className="absolute inset-0 bg-black/10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 2px, transparent 2px)`,
            backgroundSize: '20px 20px'
          }} />
        </div>
        
        <div className="relative flex justify-between items-center max-w-6xl mx-auto p-4">
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-3"
          >
            <div className="text-4xl animate-bounce">🚂</div>
            <div>
              <h1 className="text-3xl font-black bg-gradient-to-r from-white to-yellow-100 bg-clip-text text-transparent drop-shadow-lg">
                TrainQuest
              </h1>
              <p className="text-sm font-medium text-yellow-100 drop-shadow">
                {durontoExpressRoute.trainName}
              </p>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex gap-4"
          >
            {/* XP Counter */}
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl px-4 py-2 text-center border border-white/30">
              <motion.div 
                className="text-2xl font-bold text-yellow-100"
                key={safeUserProgress.totalXP}
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                {safeUserProgress.totalXP}
              </motion.div>
              <div className="text-xs text-yellow-200 font-semibold">⭐ XP</div>
            </div>
            
            {/* Tokens Counter */}
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl px-4 py-2 text-center border border-white/30">
              <motion.div 
                className="text-2xl font-bold text-yellow-100"
                key={safeUserProgress.tokens}
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                {safeUserProgress.tokens}
              </motion.div>
              <div className="text-xs text-yellow-200 font-semibold">🪙 Tokens</div>
            </div>
            
            {/* Progress Counter */}
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl px-4 py-2 text-center border border-white/30">
              <div className="text-2xl font-bold text-yellow-100">
                {safeUserProgress.completedStations.length}/{durontoExpressRoute.stations.length}
              </div>
              <div className="text-xs text-yellow-200 font-semibold">🏁 Stations</div>
            </div>
          </motion.div>
        </div>
        
        {/* Progress Bar */}
        <div className="relative h-2 bg-black/20">
          <motion.div
            className="h-full bg-gradient-to-r from-yellow-300 to-green-400 shadow-lg"
            initial={{ width: 0 }}
            animate={{ 
              width: `${(safeUserProgress.completedStations.length / durontoExpressRoute.stations.length) * 100}%` 
            }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
        </div>
      </motion.div>

      {/* Game Map Container */}
      <div className="relative flex-1 w-full p-4 pb-24">
        <svg 
          className="absolute inset-0 w-full h-full drop-shadow-lg" 
          viewBox="0 0 800 500"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Enhanced Railway track path */}
          <defs>
            <linearGradient id="trackGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#D4AF37" />
              <stop offset="25%" stopColor="#FFD700" />
              <stop offset="50%" stopColor="#FFA500" />
              <stop offset="75%" stopColor="#FF8C00" />
              <stop offset="100%" stopColor="#D4AF37" />
            </linearGradient>
            
            <linearGradient id="railGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#C0C0C0" />
              <stop offset="50%" stopColor="#E6E6FA" />
              <stop offset="100%" stopColor="#C0C0C0" />
            </linearGradient>
            
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge> 
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
            
            <filter id="shadow">
              <feDropShadow dx="2" dy="4" stdDeviation="3" floodColor="rgba(0,0,0,0.3)"/>
            </filter>
          </defs>
          
          {/* Track Shadow */}
          <motion.path
            d={generatePath()}
            stroke="rgba(0,0,0,0.2)"
            strokeWidth="16"
            fill="none"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 3, ease: "easeInOut" }}
          />
          
          {/* Main Track */}
          <motion.path
            d={generatePath()}
            stroke="url(#trackGradient)"
            strokeWidth="12"
            fill="none"
            strokeLinecap="round"
            filter="url(#glow)"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 3, ease: "easeInOut" }}
          />
          
          {/* Railway Rails */}
          <motion.path
            d={generatePath()}
            stroke="url(#railGradient)"
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
            strokeDasharray="0"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 3, ease: "easeInOut", delay: 0.3 }}
          />
          
          {/* Animated Sparkles on Track */}
          <motion.path
            d={generatePath()}
            stroke="#FFD700"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            strokeDasharray="2,20"
            initial={{ pathLength: 0, strokeDashoffset: 0 }}
            animate={{ 
              pathLength: 1,
              strokeDashoffset: [0, -22, -44]
            }}
            transition={{ 
              pathLength: { duration: 3, ease: "easeInOut", delay: 0.5 },
              strokeDashoffset: { duration: 2, repeat: Infinity, ease: "linear" }
            }}
          />
        </svg>

        {/* Station Nodes */}
        {durontoExpressRoute.stations.map((station, index) => {
          const isCompleted = safeUserProgress.completedStations.includes(station.id);
          const isCurrent = station.isUnlocked && !isCompleted;
          
          return (
            <StationNode
              key={station.id}
              station={station}
              index={index}
              isCompleted={isCompleted}
              isCurrent={isCurrent}
              onClick={() => handleStationClick(station)}
            />
          );
        })}

        {/* Enhanced Floating train animation */}
        <motion.div
          className="absolute pointer-events-none z-20"
          animate={{
            x: [50, 150, 250, 350, 450, 550, 650, 750],
            y: [400, 350, 320, 280, 240, 200, 160, 120],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="relative"
          >
            <div className="text-6xl drop-shadow-2xl">🚂</div>
            {/* Train smoke */}
            <motion.div
              className="absolute -top-4 left-8 text-2xl opacity-60"
              animate={{ 
                y: [-5, -15, -25],
                opacity: [0.6, 0.3, 0],
                scale: [0.8, 1.2, 1.5]
              }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              💨
            </motion.div>
            {/* Speed lines */}
            <motion.div
              className="absolute top-4 -left-8 text-yellow-300"
              animate={{ x: [-10, -20, -10] }}
              transition={{ duration: 0.5, repeat: Infinity }}
            >
              ⚡⚡⚡
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Quest Modal */}
      <AnimatePresence>
        {selectedStation && (
          <QuestModal
            station={selectedStation}
            onComplete={(reward) => completeQuest(selectedStation.id, reward)}
            onClose={() => setSelectedStation(null)}
          />
        )}
      </AnimatePresence>

      {/* Enhanced Bottom Navigation */}
      <motion.div 
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-purple-900 via-blue-900 to-indigo-900 backdrop-blur-lg border-t border-white/20 shadow-2xl"
      >
        {/* Navigation Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        
        <div className="relative flex justify-around items-center max-w-md mx-auto p-4">
          <motion.button 
            onClick={() => onNavigate('game-map')}
            className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-gradient-to-b from-yellow-400 to-orange-500 text-white shadow-lg border border-yellow-300"
            whileHover={{ scale: 1.1, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="text-3xl drop-shadow-lg">🗺️</span>
            <span className="text-xs font-bold">Map</span>
          </motion.button>
          
          <motion.button 
            onClick={() => onNavigate('collection')}
            className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-white/10 backdrop-blur-sm text-white border border-white/20 hover:bg-white/20 transition-all"
            whileHover={{ scale: 1.1, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="text-3xl drop-shadow-lg">🎴</span>
            <span className="text-xs font-bold">Cards</span>
          </motion.button>
          
          <motion.button 
            className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-white/10 backdrop-blur-sm text-white border border-white/20 hover:bg-white/20 transition-all"
            whileHover={{ scale: 1.1, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="text-3xl drop-shadow-lg">💬</span>
            <span className="text-xs font-bold">Chat</span>
            {/* Notification Badge */}
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold">
              3
            </div>
          </motion.button>
          
          <motion.button 
            className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-white/10 backdrop-blur-sm text-white border border-white/20 hover:bg-white/20 transition-all"
            whileHover={{ scale: 1.1, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="text-3xl drop-shadow-lg">👤</span>
            <span className="text-xs font-bold">Profile</span>
          </motion.button>
        </div>
        
        {/* Bottom Glow Effect */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent rounded-full" />
      </motion.div>
    </div>
  );
};

export default GameMap;