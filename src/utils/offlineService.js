// Offline service for TrainQuest - Handles poor internet connectivity
import { durontoExpressRoute } from '../data/routes';

/**
 * Local Storage keys for offline data
 */
const STORAGE_KEYS = {
  USER_PROGRESS: 'trainquest_user_progress',
  OFFLINE_ACTIONS: 'trainquest_offline_actions',
  LAST_KNOWN_LOCATION: 'trainquest_last_location',
  GAME_STATE: 'trainquest_game_state',
  OFFLINE_MODE: 'trainquest_offline_mode'
};

/**
 * Save user progress to local storage
 * @param {Object} progress - User progress object
 */
export const saveProgressOffline = (progress) => {
  try {
    const progressWithTimestamp = {
      ...progress,
      lastUpdated: new Date().toISOString(),
      version: '1.0'
    };
    localStorage.setItem(STORAGE_KEYS.USER_PROGRESS, JSON.stringify(progressWithTimestamp));
    console.log('Progress saved offline:', progressWithTimestamp);
  } catch (error) {
    console.error('Failed to save progress offline:', error);
  }
};

/**
 * Load user progress from local storage
 * @returns {Object|null} User progress or null if not found
 */
export const loadProgressOffline = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.USER_PROGRESS);
    if (stored) {
      const progress = JSON.parse(stored);
      console.log('Progress loaded from offline storage:', progress);
      return progress;
    }
  } catch (error) {
    console.error('Failed to load offline progress:', error);
  }
  return null;
};

/**
 * Save last known location for offline use
 * @param {Object} location - Location object {lat, lng, timestamp}
 */
export const saveLastKnownLocation = (location) => {
  try {
    const locationWithTimestamp = {
      ...location,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem(STORAGE_KEYS.LAST_KNOWN_LOCATION, JSON.stringify(locationWithTimestamp));
  } catch (error) {
    console.error('Failed to save location offline:', error);
  }
};

/**
 * Get last known location from offline storage
 * @returns {Object|null} Last known location or null
 */
export const getLastKnownLocation = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.LAST_KNOWN_LOCATION);
    if (stored) {
      const location = JSON.parse(stored);
      const age = Date.now() - new Date(location.timestamp).getTime();
      
      // Return location if it's less than 1 hour old
      if (age < 60 * 60 * 1000) {
        return location;
      }
    }
  } catch (error) {
    console.error('Failed to load last known location:', error);
  }
  return null;
};

/**
 * Queue actions for when internet comes back
 * @param {Object} action - Action to queue {type, data, timestamp}
 */
export const queueOfflineAction = (action) => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.OFFLINE_ACTIONS);
    const actions = stored ? JSON.parse(stored) : [];
    
    const actionWithTimestamp = {
      ...action,
      timestamp: new Date().toISOString(),
      id: Date.now() + Math.random()
    };
    
    actions.push(actionWithTimestamp);
    localStorage.setItem(STORAGE_KEYS.OFFLINE_ACTIONS, JSON.stringify(actions));
    console.log('Action queued for sync:', actionWithTimestamp);
  } catch (error) {
    console.error('Failed to queue offline action:', error);
  }
};

/**
 * Get queued offline actions
 * @returns {Array} Array of queued actions
 */
export const getQueuedActions = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.OFFLINE_ACTIONS);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to get queued actions:', error);
    return [];
  }
};

/**
 * Clear queued actions after successful sync
 */
export const clearQueuedActions = () => {
  try {
    localStorage.removeItem(STORAGE_KEYS.OFFLINE_ACTIONS);
    console.log('Queued actions cleared after sync');
  } catch (error) {
    console.error('Failed to clear queued actions:', error);
  }
};

/**
 * Check if device is online
 * @returns {boolean} Online status
 */
export const isOnline = () => {
  return navigator.onLine;
};

/**
 * Set offline mode flag
 * @param {boolean} isOffline - Whether app is in offline mode
 */
export const setOfflineMode = (isOffline) => {
  localStorage.setItem(STORAGE_KEYS.OFFLINE_MODE, JSON.stringify(isOffline));
};

/**
 * Check if app is in offline mode
 * @returns {boolean} Offline mode status
 */
export const isOfflineMode = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.OFFLINE_MODE);
    return stored ? JSON.parse(stored) : false;
  } catch (error) {
    return false;
  }
};

/**
 * Get offline-capable location using multiple fallbacks
 * @returns {Promise<Object>} Location object or fallback
 */
export const getOfflineLocation = async () => {
  // Try GPS first (with short timeout for poor connectivity)
  try {
    const position = await new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('GPS timeout'));
      }, 5000); // 5 second timeout

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          clearTimeout(timeout);
          resolve(pos);
        },
        (error) => {
          clearTimeout(timeout);
          reject(error);
        },
        {
          enableHighAccuracy: false, // Use less accurate but faster location
          timeout: 4000,
          maximumAge: 300000 // Accept 5-minute-old location
        }
      );
    });

    const location = {
      lat: position.coords.latitude,
      lng: position.coords.longitude,
      accuracy: position.coords.accuracy,
      source: 'gps'
    };

    // Save for offline use
    saveLastKnownLocation(location);
    return location;

  } catch (gpsError) {
    console.warn('GPS failed, trying fallbacks:', gpsError.message);

    // Fallback 1: Last known location
    const lastKnown = getLastKnownLocation();
    if (lastKnown) {
      return {
        ...lastKnown,
        source: 'cached',
        note: 'Using last known location'
      };
    }

    // Fallback 2: IP-based location (if online)
    if (isOnline()) {
      try {
        const response = await fetch('https://ipapi.co/json/', { 
          timeout: 3000 
        });
        const data = await response.json();
        
        const location = {
          lat: data.latitude,
          lng: data.longitude,
          accuracy: 10000, // IP location is less accurate
          source: 'ip',
          city: data.city
        };

        saveLastKnownLocation(location);
        return location;
      } catch (ipError) {
        console.warn('IP location failed:', ipError.message);
      }
    }

    // Fallback 3: Manual location based on train route (smart guess)
    const routeProgress = loadProgressOffline();
    if (routeProgress && routeProgress.completedStations) {
      const nextStationId = routeProgress.completedStations.length + 1;
      const nextStation = durontoExpressRoute.stations.find(s => s.id === nextStationId);
      
      if (nextStation && nextStation.coordinates) {
        return {
          lat: nextStation.coordinates.lat,
          lng: nextStation.coordinates.lng,
          accuracy: 50000,
          source: 'route_estimate',
          note: `Estimated location based on journey progress (${nextStation.name})`
        };
      }
    }

    // Fallback 4: Default to Bengaluru (starting point)
    return {
      lat: 13.0287,
      lng: 77.5641,
      accuracy: 100000,
      source: 'default',
      note: 'Using default starting location (Bengaluru)'
    };
  }
};

/**
 * Sync offline data when connection is restored
 */
export const syncOfflineData = async () => {
  if (!isOnline()) {
    console.log('Cannot sync - still offline');
    return false;
  }

  try {
    console.log('Syncing offline data...');
    
    // Get queued actions
    const queuedActions = getQueuedActions();
    
    if (queuedActions.length === 0) {
      console.log('No offline actions to sync');
      return true;
    }

    // Here you would normally send to your backend
    // For now, we'll just simulate the sync
    console.log(`Syncing ${queuedActions.length} offline actions:`, queuedActions);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Clear queued actions after successful sync
    clearQueuedActions();
    setOfflineMode(false);
    
    console.log('Offline data synced successfully');
    return true;
    
  } catch (error) {
    console.error('Failed to sync offline data:', error);
    return false;
  }
};

/**
 * Initialize offline capabilities
 */
export const initializeOfflineMode = () => {
  // Listen for online/offline events
  window.addEventListener('online', () => {
    console.log('Connection restored - syncing offline data');
    setOfflineMode(false);
    syncOfflineData();
  });

  window.addEventListener('offline', () => {
    console.log('Connection lost - entering offline mode');
    setOfflineMode(true);
  });

  // Check initial connection status
  if (!isOnline()) {
    setOfflineMode(true);
  }

  console.log('Offline mode initialized');
};