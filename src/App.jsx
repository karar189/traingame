import React, { useState, useEffect } from 'react'
import GameMap from './components/GameMap'
import CardCollection from './components/CardCollection'
import RouteInput from './components/RouteInput'
import WalletLoginModal from './components/WalletLoginModal'
import './App.css'

function App() {
  const [currentView, setCurrentView] = useState('wallet-login') // wallet-login, route-input, game-map, collection
  const [selectedRoute, setSelectedRoute] = useState(null)
  const [userProgress, setUserProgress] = useState({
    completedStations: [],
    collectedCards: [],
    collectedSnacks: [],
    totalXP: 0,
    tokens: 0,
    questCompletions: {
      'bengaluru-tech': false,
      'hyderabad-heritage': false,
      'nagpur-orange': false,
      'bhopal-lakes': false,
      'jhansi-warrior': false,
      'delhi-master': false
    }
  })
  const [user, setUser] = useState(null) // { walletAddress, loginMethod, sessionId }
  const [showWalletModal, setShowWalletModal] = useState(false)

  // Check for existing user session on app load
  useEffect(() => {
    console.log('🔍 Checking for existing user session...')
    const savedUser = localStorage.getItem('trainquest_user')
    
    if (savedUser) {
      console.log('📱 Found saved user data in localStorage:', savedUser)
      try {
        const userData = JSON.parse(savedUser)
        setUser(userData)
        setCurrentView('route-input')
        console.log('✅ Successfully restored user session:', userData)
        
        // Try to load progress from backend
        if (userData.sessionId) {
          loadProgressFromBackend(userData.sessionId)
        }
      } catch (error) {
        console.error('❌ Error parsing saved user data:', error)
        localStorage.removeItem('trainquest_user')
        console.log('🧹 Cleared corrupted user data from localStorage')
      }
    } else {
      console.log('🚫 No saved user session found')
    }
  }, [])

  const handleWalletLogin = (userData) => {
    setUser(userData)
    setCurrentView('route-input')
    console.log('✅ User logged in:', userData)
    
    // Ensure user data is saved to localStorage for persistence
    localStorage.setItem('trainquest_user', JSON.stringify(userData))
    console.log('💾 User data saved to localStorage for persistence')
    
    // Sync progress with backend if available
    syncProgressWithBackend(userData.sessionId, userProgress)
  }

  const handleLogout = () => {
    console.log('🚪 User logging out')
    setUser(null)
    setUserProgress({
      completedStations: [],
      collectedCards: [],
      collectedSnacks: [],
      totalXP: 0,
      tokens: 0,
      questCompletions: {
        'bengaluru-tech': false,
        'hyderabad-heritage': false,
        'nagpur-orange': false,
        'bhopal-lakes': false,
        'jhansi-warrior': false,
        'delhi-master': false
      }
    })
    localStorage.removeItem('trainquest_user')
    console.log('🧹 Cleared user data from localStorage')
    setCurrentView('wallet-login')
  }

  const syncProgressWithBackend = async (sessionId, progress) => {
    try {
      console.log('🌐 Syncing progress with backend...');
      console.log('📊 Session ID:', sessionId);
      console.log('🎮 Progress data:', progress);
      
      const apiHost = window.location.hostname === 'localhost' ? 'localhost' : window.location.hostname;
      const response = await fetch(`http://${apiHost}:3001/api/progress`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId,
          gameProgress: progress
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ Backend sync failed:', errorData);
        throw new Error(`Backend sync failed: ${errorData.error || response.statusText}`);
      }

      const result = await response.json();
      console.log('✅ Progress synced with backend successfully:', result);
      return result;
    } catch (error) {
      console.error('❌ Failed to sync progress with backend:', error);
      throw error; // Re-throw to allow caller to handle
    }
  }

  const loadProgressFromBackend = async (sessionId) => {
    try {
      const apiHost = window.location.hostname === 'localhost' ? 'localhost' : window.location.hostname;
      const response = await fetch(`http://${apiHost}:3001/api/session/${sessionId}`)
      
      if (response.ok) {
        const sessionData = await response.json()
        if (sessionData.gameProgress) {
          console.log('📊 Loaded progress from backend:', sessionData.gameProgress)
          setUserProgress(sessionData.gameProgress)
          return true
        }
      }
    } catch (error) {
      console.warn('Failed to load progress from backend:', error)
    }
    return false
  }

  const handleProgressUpdate = async (newProgress) => {
    console.log('🔄 App: Updating user progress with new data:', newProgress)
    console.log('🎴 App: New collected cards:', newProgress.collectedCards)
    setUserProgress(newProgress)
    
    // Save to localStorage for persistence
    if (user) {
      const updatedUserData = {
        ...user,
        lastProgressUpdate: new Date().toISOString()
      };
      localStorage.setItem('trainquest_user', JSON.stringify(updatedUserData));
      console.log('💾 App: Updated localStorage with latest user data');
    }
    
    // Sync with backend if user is logged in
    if (user?.sessionId) {
      console.log('🌐 App: Syncing progress with backend for session:', user.sessionId)
      try {
        await syncProgressWithBackend(user.sessionId, newProgress);
        console.log('✅ Backend sync completed successfully');
      } catch (error) {
        console.error('❌ Backend sync failed, but local state updated:', error);
        // Show user notification about sync failure
        setTimeout(() => {
          alert('⚠️ Progress saved locally but failed to sync with server. Your progress is safe and will sync when connection is restored.');
        }, 1000);
      }
    }
  }

  const handleRouteSelect = (route) => {
    console.log('Route selected:', route)
    setSelectedRoute(route)
    setCurrentView('game-map')
  }

  const renderCurrentView = () => {
    switch (currentView) {
      case 'wallet-login':
        return (
          <WalletLoginModal
            isOpen={true}
            onClose={() => {}} // Prevent closing without login
            onLogin={handleWalletLogin}
          />
        )
      
      case 'route-input':
        return <RouteInput onRouteSelect={handleRouteSelect} user={user} onLogout={handleLogout} />
      
      case 'game-map':
        return (
          <GameMap 
            selectedRoute={selectedRoute}
            userProgress={userProgress}
            onProgressUpdate={handleProgressUpdate}
            onNavigate={setCurrentView}
            user={user}
            onLogout={handleLogout}
          />
        )
      
      case 'collection':
        return (
          <CardCollection 
            userCards={userProgress.collectedCards}
            userSnacks={userProgress.collectedSnacks}
            onNavigate={setCurrentView}
            user={user}
            onProgressUpdate={setUserProgress}
            onLogout={handleLogout}
          />
        )
      
      default:
        return <RouteInput onRouteSelect={handleRouteSelect} user={user} onLogout={handleLogout} />
    }
  }

  return (
    <div className="App min-h-screen">
      {renderCurrentView()}
      
      {/* Debug Panel - Development Only */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 right-4 z-50">
          <button
            onClick={() => {
              const userData = localStorage.getItem('trainquest_user')
              console.log('🔍 Current localStorage data:', userData)
              alert(`localStorage data:\n${userData || 'No data found'}`)
            }}
            className="bg-gray-800 text-white px-3 py-1 rounded text-xs opacity-50 hover:opacity-100"
          >
            Debug localStorage
          </button>
        </div>
      )}
    </div>
  )
}

export default App
