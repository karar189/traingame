// Location service for TrainQuest - GPS-based station unlocking
import { durontoExpressRoute } from '../data/routes';

/**
 * Calculate distance between two coordinates using Haversine formula
 * @param {number} lat1 - Latitude of first point
 * @param {number} lon1 - Longitude of first point
 * @param {number} lat2 - Latitude of second point
 * @param {number} lon2 - Longitude of second point
 * @returns {number} Distance in meters
 */
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371000; // Earth's radius in meters
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
          Math.cos(φ1) * Math.cos(φ2) *
          Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  return R * c; // Distance in meters
};

/**
 * Get user's current location using browser geolocation API
 * @returns {Promise<{lat: number, lng: number}>} User's coordinates
 */
export const getCurrentLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser'));
      return;
    }

    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 300000 // 5 minutes cache
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy
        });
      },
      (error) => {
        let errorMessage = 'Unknown location error';
        switch(error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access denied by user';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information unavailable';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out';
            break;
        }
        reject(new Error(errorMessage));
      },
      options
    );
  });
};

/**
 * Find the nearest station to user's current location
 * @param {number} userLat - User's latitude
 * @param {number} userLng - User's longitude
 * @returns {Object|null} Nearest station with distance info
 */
export const findNearestStation = (userLat, userLng) => {
  let nearestStation = null;
  let minDistance = Infinity;

  durontoExpressRoute.stations.forEach(station => {
    if (station.coordinates) {
      const distance = calculateDistance(
        userLat, userLng,
        station.coordinates.lat, station.coordinates.lng
      );

      if (distance < minDistance) {
        minDistance = distance;
        nearestStation = {
          ...station,
          distanceFromUser: distance,
          isWithinRange: distance <= station.proximityRadius
        };
      }
    }
  });

  return nearestStation;
};

/**
 * Get all stations within proximity of user's location
 * @param {number} userLat - User's latitude
 * @param {number} userLng - User's longitude
 * @returns {Array} Array of nearby stations
 */
export const getNearbyStations = (userLat, userLng) => {
  return durontoExpressRoute.stations
    .map(station => {
      if (!station.coordinates) return null;
      
      const distance = calculateDistance(
        userLat, userLng,
        station.coordinates.lat, station.coordinates.lng
      );

      return {
        ...station,
        distanceFromUser: distance,
        isWithinRange: distance <= station.proximityRadius
      };
    })
    .filter(station => station && station.isWithinRange)
    .sort((a, b) => a.distanceFromUser - b.distanceFromUser);
};

/**
 * Check if user should unlock a station based on location and journey progress
 * @param {number} userLat - User's latitude
 * @param {number} userLng - User's longitude
 * @param {Array} completedStations - Array of completed station IDs
 * @returns {Object} Station unlock information
 */
export const checkStationUnlock = (userLat, userLng, completedStations = []) => {
  const nearbyStations = getNearbyStations(userLat, userLng);
  const nearestStation = findNearestStation(userLat, userLng);
  
  // Determine journey progress based on location
  const journeyProgress = determineJourneyProgress(userLat, userLng, completedStations);
  
  return {
    nearestStation,
    nearbyStations,
    journeyProgress,
    locationMessage: generateJourneyLocationMessage(nearestStation, journeyProgress)
  };
};

/**
 * Determine journey progress based on user's location relative to the route
 * @param {number} userLat - User's latitude
 * @param {number} userLng - User's longitude
 * @param {Array} completedStations - Array of completed station IDs
 * @returns {Object} Journey progress information
 */
export const determineJourneyProgress = (userLat, userLng, completedStations = []) => {
  const stations = durontoExpressRoute.stations;
  const stationsWithDistance = stations.map(station => ({
    ...station,
    distanceFromUser: calculateDistance(
      userLat, userLng,
      station.coordinates.lat, station.coordinates.lng
    )
  }));

  // Find the nearest station
  const nearestStation = stationsWithDistance.reduce((nearest, station) => 
    station.distanceFromUser < nearest.distanceFromUser ? station : nearest
  );

  // Determine which stations should be unlocked based on journey progression
  const stationsToUnlock = [];
  const stationsToComplete = [];
  
  // If user is past Bengaluru (closer to later stations), unlock previous stations
  if (nearestStation.id > 1) {
    // Auto-unlock and complete all previous stations
    for (let i = 1; i < nearestStation.id; i++) {
      const station = stations.find(s => s.id === i);
      if (station && !completedStations.includes(i)) {
        stationsToUnlock.push(i);
        stationsToComplete.push(i);
      }
    }
  }

  // Current active station logic - prioritize actual location over journey progression
  let currentActiveStation = null;
  let canUnlockCurrent = false;

  // If user is near a station, that becomes the current active station
  if (nearestStation.distanceFromUser <= nearestStation.proximityRadius) {
    // User is actually at/near a station
    currentActiveStation = nearestStation;
    canUnlockCurrent = true;
  } else {
    // User is not near any station, use journey progression
    const expectedNextStation = completedStations.length + 1;
    currentActiveStation = stations.find(s => s.id === expectedNextStation);
    canUnlockCurrent = false;
  }

  return {
    nearestStation,
    currentActiveStation,
    canUnlockCurrent,
    stationsToUnlock,
    stationsToComplete,
    journeyProgressPercent: Math.min((nearestStation.id - 1) / (stations.length - 1) * 100, 100),
    isOnTrack: nearestStation.distanceFromUser <= nearestStation.proximityRadius * 2 // Within 2x radius
  };
};

/**
 * Generate user-friendly journey location message
 * @param {Object} nearestStation - Nearest station info
 * @param {Object} journeyProgress - Journey progress information
 * @returns {string} Location message
 */
const generateJourneyLocationMessage = (nearestStation, journeyProgress) => {
  if (!nearestStation) {
    return "📍 You're not near any train stations on the Duronto route.";
  }

  const distanceKm = (nearestStation.distanceFromUser / 1000).toFixed(1);
  const { currentActiveStation, canUnlockCurrent, stationsToComplete, isOnTrack } = journeyProgress;
  
  // If user has progressed and stations need to be auto-completed
  if (stationsToComplete.length > 0) {
    return `🚂 Journey progress detected! Auto-completing ${stationsToComplete.length} passed station(s). Current: ${nearestStation.name}`;
  }
  
  // If user is actually at a station
  if (canUnlockCurrent && currentActiveStation && nearestStation.distanceFromUser <= nearestStation.proximityRadius) {
    return `🎯 Perfect! You're at ${currentActiveStation.name}. Ready to start your quest!`;
  }
  
  // If user is near a station but not close enough
  if (nearestStation.distanceFromUser <= nearestStation.proximityRadius * 2) {
    return `🚂 Near ${nearestStation.name} (${distanceKm}km). Get closer to unlock quest!`;
  }
  
  // If user is on track but not at the right station yet
  if (isOnTrack) {
    return `🚂 On route! Nearest: ${nearestStation.name} (${distanceKm}km). Next quest: ${currentActiveStation?.name}`;
  }
  
  // Default message
  return `📍 Nearest station: ${nearestStation.name} (${distanceKm}km away). Next quest: ${currentActiveStation?.name}`;
};

/**
 * Format distance for display
 * @param {number} meters - Distance in meters
 * @returns {string} Formatted distance string
 */
export const formatDistance = (meters) => {
  if (meters < 1000) {
    return `${Math.round(meters)}m`;
  } else {
    return `${(meters / 1000).toFixed(1)}km`;
  }
};