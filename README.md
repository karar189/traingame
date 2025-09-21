# 🚂 TrainQuest - Gamified Train Journey Experience

TrainQuest transforms train journeys into exciting social gaming adventures! Built with React, Tailwind CSS, and Framer Motion.

## 🎮 Features

### ✨ Core Gameplay
- **Station-based Quests**: Every train station becomes a unique quest challenge
- **Candy Crush-style Map**: Beautiful winding path with milestone stations
- **Multiple Quest Types**: Trivia, photo challenges, AR scans, social interactions, and food challenges
- **NFT Card Collection**: Collect unique station-themed cards as rewards
- **Snack Trading System**: Collect and trade digital snacks with special effects

### 🗺️ Current Route
- **Hardcoded Route**: Bengaluru to New Delhi Duronto Express (12273)
- **15 Stations**: From Bengaluru City Junction to New Delhi
- **Real Train Data**: Actual station names, timings, and distances
- **Regional Themes**: Each station reflects local culture and specialties

### 🎨 UI/UX
- **Gamified Design**: Inspired by popular mobile games like Candy Crush
- **Smooth Animations**: Powered by Framer Motion
- **Responsive Design**: Works on mobile and desktop
- **Beautiful Gradients**: Eye-catching color schemes throughout

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd traingame

# Install dependencies
npm install

# Start development server
npm run dev
```

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🏗️ Project Structure

```
src/
├── components/
│   ├── GameMap.jsx          # Main game map with station path
│   ├── StationNode.jsx      # Individual station milestone
│   ├── QuestModal.jsx       # Quest interaction interface
│   ├── CardCollection.jsx   # NFT card collection viewer
│   └── RouteInput.jsx       # Train route input form
├── data/
│   └── routes.js           # Train route and quest data
├── App.jsx                 # Main app component
└── main.jsx               # App entry point
```

## 🎯 Quest Types

1. **Intro Quest** 🚂 - Journey introduction
2. **Trivia** 🧠 - Railway and local knowledge
3. **Photo Challenge** 📸 - Capture moments
4. **AR Scan** 🔍 - Find hidden treasures
5. **Social** 👥 - Interact with passengers
6. **Food Challenge** 🍛 - Local cuisine identification
7. **Cultural** 🎭 - Learn about local traditions
8. **Nature** 🌿 - Spot wildlife and landscapes
9. **Completion** 🏆 - Journey finale

## 🎴 Collectibles

### Station Cards
- **Bengaluru Tech Hub** - Silicon Valley of India
- **Junction Master** - Railway junction expertise
- **Salem Chai Master** - Perfect chai brewing
- **Erode Textile King** - Textile capital mastery
- And many more...

### Snack NFTs
- **Railway Chai** ☕ - Reduces quest cooldown
- **Station Samosa** 🥟 - Duplicate common cards
- **Bengali Rasgulla** 🍡 - Unlock hidden quests
- **Mumbai Vada Pav** 🍞 - Double XP boost

## 🔮 Future Integrations

### Microservice Integration
- Connect with Soumik's route microservice
- Real-time train data
- Dynamic station generation
- Live passenger rooms

### Planned Features
- **Web3 Integration**: Real NFT minting and trading
- **Social Features**: Chat rooms, friend systems
- **Tournaments**: Seasonal competitions
- **Brand Partnerships**: Real coupon rewards
- **Multi-route Support**: All Indian train routes

## 🎨 Design Assets Needed

See `DESIGN_ASSETS_LIST.md` for comprehensive list of required visual assets including:
- Train and railway elements
- Station illustrations
- Quest icons and cards
- Food and snack graphics
- UI components and animations

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite
- **Styling**: Tailwind CSS 4
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **State Management**: React Hooks

## 🎮 How to Play

1. **Start Journey**: Select Duronto Express route
2. **Complete Quests**: Tap unlocked stations to start quests
3. **Collect Cards**: Earn unique NFT cards for each completed quest
4. **Progress Forward**: Unlock next stations by completing current ones
5. **Build Collection**: Gather all cards to become a Duronto Master!

## 🤝 Contributing

This is a hackathon project built for train passengers! Feel free to:
- Add new quest types
- Create additional train routes
- Improve animations and UI
- Add social features

## 📱 Mobile-First Design

TrainQuest is designed primarily for mobile devices, perfect for:
- Playing during train journeys
- Easy one-handed operation
- Touch-friendly interactions
- Offline-capable gameplay

---

**Built with ❤️ for Indian Railway passengers**

*Transform your next train journey into an epic quest adventure!* 🚂✨