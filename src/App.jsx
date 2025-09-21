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
    tokens: 0
  })
  const [user, setUser] = useState(null) // { walletAddress, loginMethod, sessionId }
  const [showWalletModal, setShowWalletModal] = useState(false)

  // Check for existing user session on app load
  useEffect(() => {
    const savedUser = localStorage.getItem('trainquest_user')
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser)
        setUser(userData)
        setCurrentView('route-input')
        console.log('Loaded existing user session:', userData)
      } catch (error) {
        console.error('Error loading saved user:', error)
        localStorage.removeItem('trainquest_user')
      }
    }
  }, [])

  const handleWalletLogin = (userData) => {
    setUser(userData)
    setCurrentView('route-input')
    console.log('User logged in:', userData)
    
    // Sync progress with backend if available
    syncProgressWithBackend(userData.sessionId, userProgress)
  }

  const handleLogout = () => {
    setUser(null)
    setUserProgress({
      completedStations: [],
      collectedCards: [],
      collectedSnacks: [],
      totalXP: 0,
      tokens: 0
    })
    localStorage.removeItem('trainquest_user')
    setCurrentView('wallet-login')
  }

  const syncProgressWithBackend = async (sessionId, progress) => {
    try {
      const apiHost = window.location.hostname === 'localhost' ? 'localhost' : window.location.hostname;
      await fetch(`http://${apiHost}:3001/api/progress`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId,
          gameProgress: progress
        }),
      })
      console.log('Progress synced with backend')
    } catch (error) {
      console.warn('Failed to sync progress with backend:', error)
    }
  }

  const handleProgressUpdate = (newProgress) => {
    setUserProgress(newProgress)
    
    // Sync with backend if user is logged in
    if (user?.sessionId) {
      syncProgressWithBackend(user.sessionId, newProgress)
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
    </div>
  )
}

export default App
