import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { isOnline, isOfflineMode, syncOfflineData, getQueuedActions } from '../utils/offlineService';

const OfflineIndicator = () => {
  const [online, setOnline] = useState(isOnline());
  const [offlineMode, setOfflineModeState] = useState(isOfflineMode());
  const [queuedCount, setQueuedCount] = useState(0);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    const updateOnlineStatus = () => {
      setOnline(isOnline());
      setOfflineModeState(isOfflineMode());
      setQueuedCount(getQueuedActions().length);
    };

    const handleOnline = async () => {
      setOnline(true);
      setOfflineModeState(false);
      
      // Auto-sync when coming back online
      if (getQueuedActions().length > 0) {
        setSyncing(true);
        await syncOfflineData();
        setSyncing(false);
        setQueuedCount(0);
      }
    };

    const handleOffline = () => {
      setOnline(false);
      setOfflineModeState(true);
    };

    // Initial check
    updateOnlineStatus();

    // Listen for connection changes
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Periodic check for queued actions
    const interval = setInterval(updateOnlineStatus, 5000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
    };
  }, []);

  const handleManualSync = async () => {
    if (!online) return;
    
    setSyncing(true);
    const success = await syncOfflineData();
    setSyncing(false);
    
    if (success) {
      setQueuedCount(0);
    }
  };

  return (
    <AnimatePresence>
      {(!online || offlineMode || queuedCount > 0) && (
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -50, opacity: 0 }}
          className={`fixed top-0 left-0 right-0 z-50 px-4 py-2 text-center text-sm font-semibold
                     ${online ? 'bg-yellow-500' : 'bg-red-500'} text-white shadow-lg`}
        >
          <div className="flex items-center justify-center gap-2">
            {/* Connection Status */}
            <div className="flex items-center gap-1">
              {online ? (
                <>
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                  <span>Online</span>
                </>
              ) : (
                <>
                  <span className="w-2 h-2 bg-red-400 rounded-full"></span>
                  <span>Offline Mode</span>
                </>
              )}
            </div>

            {/* Queued Actions */}
            {queuedCount > 0 && (
              <div className="flex items-center gap-1">
                <span>•</span>
                <span>{queuedCount} actions queued</span>
              </div>
            )}

            {/* Sync Status */}
            {syncing && (
              <div className="flex items-center gap-1">
                <span>•</span>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-4 h-4"
                >
                  🔄
                </motion.div>
                <span>Syncing...</span>
              </div>
            )}

            {/* Manual Sync Button */}
            {online && queuedCount > 0 && !syncing && (
              <motion.button
                onClick={handleManualSync}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="ml-2 px-2 py-1 bg-white/20 rounded text-xs hover:bg-white/30 transition-colors"
              >
                Sync Now
              </motion.button>
            )}
          </div>

          {/* Additional Info */}
          {!online && (
            <div className="text-xs opacity-80 mt-1">
              Your progress is saved locally and will sync when connection returns
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default OfflineIndicator;