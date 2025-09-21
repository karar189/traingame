import React, { useState } from 'react'
import GameMap from './components/GameMap'
import CardCollection from './components/CardCollection'
import RouteInput from './components/RouteInput'
import './App.css'

function App() {
  const [currentView, setCurrentView] = useState('route-input') // route-input, game-map, collection
  const [selectedRoute, setSelectedRoute] = useState(null)
  const [userProgress, setUserProgress] = useState({
    completedStations: [],
    collectedCards: [],
    collectedSnacks: [],
    totalXP: 0,
    tokens: 0
  })

  const handleRouteSelect = (route) => {
    console.log('Route selected:', route)
    setSelectedRoute(route)
    setCurrentView('game-map')
  }

  const renderCurrentView = () => {
    switch (currentView) {
      case 'route-input':
        return <RouteInput onRouteSelect={handleRouteSelect} />
      
      case 'game-map':
        return (
          <GameMap 
            selectedRoute={selectedRoute}
            userProgress={userProgress}
            onProgressUpdate={setUserProgress}
            onNavigate={setCurrentView}
          />
        )
      
      case 'collection':
        return (
          <CardCollection 
            userCards={userProgress.collectedCards}
            userSnacks={userProgress.collectedSnacks}
            onNavigate={setCurrentView}
          />
        )
      
      default:
        return <RouteInput onRouteSelect={handleRouteSelect} />
    }
  }

  return (
    <div className="App min-h-screen">
      {renderCurrentView()}
    </div>
  )
}

export default App
