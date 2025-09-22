import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { durontoExpressRoute } from '../data/routes';
import StationNode from './StationNode';
import QuestModal from './QuestModal';
import { getCurrentLocation, checkStationUnlock, formatDistance } from '../utils/locationService';
import { 
  saveProgressOffline, 
  loadProgressOffline, 
  getOfflineLocation, 
  queueOfflineAction,
  initializeOfflineMode,
  isOnline 
} from '../utils/offlineService';
import OfflineIndicator from './OfflineIndicator';

const GameMap = ({ selectedRoute, userProgress = {}, onProgressUpdate, onNavigate }) => {
  const [selectedStation, setSelectedStation] = useState(null);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [userLocation, setUserLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [locationStatus, setLocationStatus] = useState('checking'); // checking, granted, denied, error
  const [nearestStation, setNearestStation] = useState(null);
  const [locationMessage, setLocationMessage] = useState('📍 Checking your location...');
  
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
    console.log(`🎯 Completing quest for station ${stationId}`);
    
    // Mark current station as completed
    const newQuestCompletions = {
      ...safeUserProgress.questCompletions,
      [reward]: true // Mark the specific quest as completed
    };
    
    // Avoid duplicate cards
    const currentCards = safeUserProgress.collectedCards || [];
    const newCollectedCards = currentCards.includes(reward) 
      ? currentCards 
      : [...currentCards, reward];

    const newProgress = {
      ...safeUserProgress,
      completedStations: [...safeUserProgress.completedStations, stationId],
      totalXP: safeUserProgress.totalXP + 100,
      collectedCards: newCollectedCards,
      tokens: safeUserProgress.tokens + 10,
      questCompletions: newQuestCompletions
    };
    
    console.log('🎴 Quest completed! Adding card to collection:', reward);
    console.log('📊 Updated progress:', newProgress);
    console.log('🎯 New collected cards:', newProgress.collectedCards);
    
    onProgressUpdate(newProgress);
    
    // Show success notification
    if (!currentCards.includes(reward)) {
      setTimeout(() => {
        alert(`🎉 Quest completed! You've earned the "${reward}" NFT card! Check your collection to see it.`);
      }, 2500);
    }
    
    // Mark current station as completed in route data
    const currentStation = durontoExpressRoute.stations.find(s => s.id === stationId);
    if (currentStation) {
      currentStation.isCompleted = true;
      console.log(`✅ Marked station ${currentStation.name} as completed`);
    }
    
    setSelectedStation(null);
  };

  // Initialize offline mode and load saved data
  useEffect(() => {
    // Initialize offline capabilities
    initializeOfflineMode();
    
    // Load saved progress from offline storage
    const savedProgress = loadProgressOffline();
    if (savedProgress && onProgressUpdate) {
      console.log('Loading saved progress from offline storage');
      onProgressUpdate(savedProgress);
    }
    
    // Reset all stations to initial state (GPS-based unlocking)
    if (durontoExpressRoute.stations.length > 0) {
      durontoExpressRoute.stations.forEach((station, index) => {
        station.isUnlocked = index === 0; // Only first station unlocked initially
        station.isCompleted = false; // No stations completed initially
      });
      console.log('🔄 Reset station states - GPS-based unlocking enabled');
    }
    
    // Get user's location using offline-capable method
    setLocationStatus('checking');
    setLocationMessage('📍 Getting your location...');
    
    getOfflineLocation()
      .then((location) => {
        setUserLocation(location);
        setLocationStatus('granted');
        
        // Show location source in message
        let sourceMessage = '';
        switch (location.source) {
          case 'gps':
            sourceMessage = '📍 GPS location acquired';
            break;
          case 'cached':
            sourceMessage = '📍 Using cached location (offline mode)';
            break;
          case 'ip':
            sourceMessage = '📍 Using network-based location';
            break;
          case 'route_estimate':
            sourceMessage = `📍 Estimated location: ${location.note}`;
            break;
          case 'default':
            sourceMessage = `📍 ${location.note}`;
            break;
          default:
            sourceMessage = '📍 Location acquired';
        }
        
        setLocationMessage(sourceMessage);
        checkUserLocation(location.lat, location.lng);
        console.log('📍 Real GPS location acquired:', location);
      })
      .catch((error) => {
        setLocationError(error.message);
        setLocationStatus('error');
        setLocationMessage('📍 All location methods failed. Use manual buttons!');
        console.warn('All location methods failed:', error);
      });
  }, []);

  // Check user location against stations and handle journey progress
  const checkUserLocation = (lat, lng) => {
    const locationInfo = checkStationUnlock(lat, lng, safeUserProgress.completedStations);
    setNearestStation(locationInfo.nearestStation);
    setLocationMessage(locationInfo.locationMessage);
    
    const { journeyProgress } = locationInfo;
    
    // Auto-complete stations that user has passed
    if (journeyProgress.stationsToComplete.length > 0) {
      const newCompletedStations = [...safeUserProgress.completedStations];
      const newCollectedCards = [...safeUserProgress.collectedCards];
      let newXP = safeUserProgress.totalXP;
      let newTokens = safeUserProgress.tokens;
      
      journeyProgress.stationsToComplete.forEach(stationId => {
        if (!newCompletedStations.includes(stationId)) {
          newCompletedStations.push(stationId);
          const station = durontoExpressRoute.stations.find(s => s.id === stationId);
          if (station) {
            newCollectedCards.push(station.cardReward);
            newXP += 100;
            newTokens += 10;
            
            // Mark station as completed in the route data
            station.isCompleted = true;
          }
        }
      });
      
      // Update progress
      const updatedProgress = {
        ...safeUserProgress,
        completedStations: newCompletedStations,
        collectedCards: newCollectedCards,
        totalXP: newXP,
        tokens: newTokens
      };
      
      onProgressUpdate(updatedProgress);
      
      // Save progress offline
      saveProgressOffline(updatedProgress);
      
      // Queue action for sync when online
      if (!isOnline()) {
        queueOfflineAction({
          type: 'progress_update',
          data: updatedProgress
        });
      }
    }
    
    // GPS-based station unlocking based on journey progress
    if (journeyProgress.stationsToUnlock && journeyProgress.stationsToUnlock.length > 0) {
      journeyProgress.stationsToUnlock.forEach(stationId => {
        const station = durontoExpressRoute.stations.find(s => s.id === stationId);
        if (station && !station.isUnlocked) {
          station.isUnlocked = true;
          console.log(`🔓 GPS-based unlock: ${station.name}`);
        }
      });
    }

    // Unlock current active station if user is near it
    if (journeyProgress.canUnlockCurrent && journeyProgress.currentActiveStation) {
      const stationToUnlock = durontoExpressRoute.stations.find(s => s.id === journeyProgress.currentActiveStation.id);
      if (stationToUnlock && !stationToUnlock.isUnlocked) {
        stationToUnlock.isUnlocked = true;
        setLocationMessage(`🎉 ${stationToUnlock.name} unlocked! Ready for your quest!`);
        console.log(`🔓 Proximity unlock: ${stationToUnlock.name}`);
      }
    }
  };

  // Refresh location periodically (every 30 seconds)
  useEffect(() => {
    if (locationStatus === 'granted' && userLocation) {
      const interval = setInterval(() => {
        getCurrentLocation()
          .then((location) => {
            setUserLocation(location);
            checkUserLocation(location.lat, location.lng);
          })
          .catch((error) => {
            console.warn('Location update failed:', error);
          });
      }, 30000); // 30 seconds

      return () => clearInterval(interval);
    }
  }, [locationStatus, userLocation, safeUserProgress.completedStations]);

  // Manual location refresh function
  const refreshLocation = () => {
    setLocationStatus('checking');
    setLocationMessage('📍 Refreshing your location...');
    
    getOfflineLocation()
      .then((location) => {
        setUserLocation(location);
        setLocationStatus('granted');
        
        let sourceMessage = '';
        switch (location.source) {
          case 'gps':
            sourceMessage = '📍 GPS location refreshed';
            break;
          case 'cached':
            sourceMessage = '📍 Using cached location (offline mode)';
            break;
          case 'ip':
            sourceMessage = '📍 Using network-based location';
            break;
          default:
            sourceMessage = '📍 Location refreshed';
        }
        
        setLocationMessage(sourceMessage);
        checkUserLocation(location.lat, location.lng);
        console.log('📍 Location manually refreshed:', location);
      })
      .catch((error) => {
        setLocationError(error.message);
        setLocationStatus('error');
        setLocationMessage('📍 Location refresh failed. Please try again.');
        console.warn('Location refresh failed:', error);
      });
  };

  return (
    <>
      {/* Offline Status Indicator */}
      <OfflineIndicator />
      
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
              {/* Location Status */}
              <div className="text-xs text-yellow-200 drop-shadow mt-1 max-w-xs">
                {locationMessage}
                {locationStatus === 'error' && (
                  <div className="text-xs text-yellow-100 mt-1 font-semibold animate-pulse">
                    👆 Use manual location buttons above!
                  </div>
                )}
              </div>
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
            
            {/* Location Refresh Button */}
            <motion.button
              onClick={() => {
                setLocationStatus('checking');
                setLocationMessage('📍 Refreshing location...');
                getOfflineLocation()
                  .then((location) => {
                    setUserLocation(location);
                    setLocationStatus('granted');
                    checkUserLocation(location.lat, location.lng);
                  })
                  .catch((error) => {
                    setLocationError(error.message);
                    setLocationStatus('error');
                    
                    // Provide helpful error message with manual option
                    let userFriendlyMessage = '';
                    if (error.message.includes('denied')) {
                      userFriendlyMessage = '📍 Location denied. Use manual buttons below!';
                    } else if (error.message.includes('unavailable')) {
                      userFriendlyMessage = '📍 GPS unavailable. Use manual location buttons!';
                    } else {
                      userFriendlyMessage = '📍 Location failed. Use manual buttons!';
                    }
                    
                    setLocationMessage(userFriendlyMessage);
                  });
              }}
              className="bg-white/20 backdrop-blur-sm rounded-2xl px-4 py-2 text-center border border-white/30 hover:bg-white/30 transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="text-2xl">
                {locationStatus === 'checking' ? '🔄' : '📍'}
              </div>
              <div className="text-xs text-yellow-200 font-semibold">Location</div>
            </motion.button>
            
            {/* GPS Refresh Button - Force location update */}
            <motion.button
              onClick={refreshLocation}
              className="bg-blue-500/20 backdrop-blur-sm rounded-2xl px-4 py-2 text-center border border-blue-300/30 hover:bg-blue-500/30 transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title="Force refresh GPS to calculate current route progress"
            >
              <div className="text-2xl">🔄</div>
              <div className="text-xs text-yellow-200 font-semibold">Refresh</div>
            </motion.button>
            
            {/* Manual Sync Button - Force sync with server */}
            <motion.button
              onClick={() => {
                console.log('🔄 Manual sync requested');
                onProgressUpdate(safeUserProgress);
              }}
              className="bg-green-500/20 backdrop-blur-sm rounded-2xl px-4 py-2 text-center border border-green-300/30 hover:bg-green-500/30 transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title="Force sync progress with server"
            >
              <div className="text-2xl">💾</div>
              <div className="text-xs text-yellow-200 font-semibold">Sync</div>
            </motion.button>
            
            {/* Manual Location Override - Always show when location fails */}
            {(locationStatus === 'error' || process.env.NODE_ENV === 'development') && (
              <motion.button
                onClick={() => {
                  // Set location to Nagpur (since you're actually there)
                  const nagpurCoords = { lat: 21.1458, lng: 79.0882 };
                  setUserLocation(nagpurCoords);
                  setLocationStatus('manual');
                  setLocationMessage('🎯 Manual location: At Nagpur Junction (Your actual location)');
                  checkUserLocation(nagpurCoords.lat, nagpurCoords.lng);
                }}
                className="bg-green-500/20 backdrop-blur-sm rounded-2xl px-4 py-2 text-center border border-green-300/30 hover:bg-green-500/30 transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                  title="Set location to Nagpur (you're currently here)"
              >
                <div className="text-2xl">🎯</div>
                <div className="text-xs text-yellow-200 font-semibold">Manual</div>
              </motion.button>
            )}
            
            {/* Additional location options */}
            {(locationStatus === 'error' || locationStatus === 'manual') && (
              <>
                <motion.button
                  onClick={() => {
                    // Simulate being at Hyderabad
                    const hyderabadCoords = { lat: 17.3850, lng: 78.4867 };
                    setUserLocation(hyderabadCoords);
                    setLocationStatus('manual');
                    setLocationMessage('🚂 Manual location: Near Hyderabad Deccan');
                    checkUserLocation(hyderabadCoords.lat, hyderabadCoords.lng);
                  }}
                  className="bg-blue-500/20 backdrop-blur-sm rounded-2xl px-4 py-2 text-center border border-blue-300/30 hover:bg-blue-500/30 transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  title="Set location to Hyderabad"
                >
                  <div className="text-2xl">🏛️</div>
                  <div className="text-xs text-yellow-200 font-semibold">HYD</div>
                </motion.button>
                
                <motion.button
                  onClick={() => {
                    // Simulate being at Bengaluru
                    const bengaluruCoords = { lat: 13.0287, lng: 77.5641 };
                    setUserLocation(bengaluruCoords);
                    setLocationStatus('manual');
                    setLocationMessage('🚂 Manual location: At Bengaluru Yeshwantpur');
                    checkUserLocation(bengaluruCoords.lat, bengaluruCoords.lng);
                  }}
                  className="bg-purple-500/20 backdrop-blur-sm rounded-2xl px-4 py-2 text-center border border-purple-300/30 hover:bg-purple-500/30 transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  title="Set location to Bengaluru"
                >
                  <div className="text-2xl">🌆</div>
                  <div className="text-xs text-yellow-200 font-semibold">BLR</div>
                </motion.button>
              </>
            )}
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
             <div className="relative flex-1 w-full p-4 pb-24 overflow-visible">
        <div className="relative w-full h-full min-h-96">
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
          // Check if quest is completed using questCompletions
          const isCompleted = safeUserProgress.questCompletions && safeUserProgress.questCompletions[station.cardReward];
          const isUnlocked = station.isUnlocked; // GPS-based unlocking
          
          // Current station logic: unlocked but not completed, and user is near it
          const isNearStation = nearestStation && nearestStation.id === station.id && 
                               nearestStation.distanceFromUser <= nearestStation.proximityRadius;
          const isCurrent = isUnlocked && !isCompleted && isNearStation;
          
          // Debug logging for first few renders
          if (index < 3) {
            console.log(`🔍 Station ${station.name}: unlocked=${isUnlocked}, completed=${isCompleted}, near=${isNearStation}, current=${isCurrent}`);
          }
          
          return (
            <StationNode
              key={station.id}
              station={{...station, isUnlocked}} // Pass computed unlock state
              index={index}
              isCompleted={isCompleted}
              isCurrent={isCurrent} // Show current if user is near an unlocked, incomplete station
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
    </>
  );
};

export default GameMap;