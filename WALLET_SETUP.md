# 🚂💎 TrainQuest Wallet Integration

## Overview
TrainQuest now includes a complete wallet integration system for collecting Base Sepolia wallet addresses from train passengers. This system is designed to work offline-first and is perfect for train environments with limited internet connectivity.

## 🎯 Features

### ✅ Completed Features
- **Dual Login System**: MetaMask integration + Manual wallet input
- **Base Sepolia Network**: Automatic network switching for MetaMask users
- **Offline-First Design**: Works without internet, saves data locally
- **Local Backend**: Express.js server to store wallet addresses
- **Network Accessible**: Other passengers can connect via your WiFi
- **Wallet Validation**: Ensures valid Ethereum address format
- **Progress Sync**: Game progress syncs with wallet data
- **Export Functionality**: Easy export for manual NFT airdrops

## 🚀 Quick Start

### 1. Start Both Servers
```bash
# Terminal 1: Start backend server
npm run server

# Terminal 2: Start frontend (accessible to other devices)
npm run dev -- --host

# Or run both together
npm start
```

### 2. Access URLs
- **Frontend (Local)**: http://localhost:5173/
- **Frontend (Network)**: http://10.139.98.126:5173/ (your actual IP)
- **Backend API**: http://localhost:3001/
- **Admin Panel**: http://localhost:3001/api/wallets
- **Export Data**: http://localhost:3001/api/export

### 3. Share with Train Passengers
Tell passengers to:
1. Connect to your WiFi
2. Go to: `http://10.139.98.126:5173/` (replace with your IP)
3. Enter their Base Sepolia wallet address
4. Play the game and collect NFT rewards!

## 📱 User Flow

### New User Experience
1. **Login Modal**: Users see wallet connection options
2. **MetaMask Option**: 
   - Connects to MetaMask
   - Auto-switches to Base Sepolia network
   - Saves wallet address
3. **Manual Option**: 
   - Works offline
   - Users paste their Base Sepolia address
   - Validates address format
4. **Game Integration**: 
   - Wallet info shown in header
   - Progress syncs with backend
   - NFT rewards tracked per wallet

## 🛠 Technical Implementation

### Frontend Components
- **`WalletLoginModal.jsx`**: Main login interface
- **`App.jsx`**: User session management
- **`RouteInput.jsx`**: Shows user wallet info
- **`GameMap.jsx`**: Syncs progress with backend

### Backend API Endpoints
- `POST /api/wallet` - Save wallet address
- `GET /api/wallets` - View all registered wallets
- `POST /api/progress` - Update game progress
- `GET /api/export` - Export data for NFT airdrops
- `GET /api/health` - Server health check

### Data Storage
- **File**: `wallet_data.json`
- **Structure**: 
  ```json
  {
    "wallets": [
      {
        "walletAddress": "0x...",
        "loginMethod": "metamask|manual",
        "timestamp": "2024-...",
        "sessionId": 1234567890
      }
    ],
    "sessions": {
      "1234567890": {
        "gameProgress": {
          "completedStations": [1, 2],
          "totalXP": 200,
          "tokens": 20
        }
      }
    }
  }
  ```

## 🎮 Game Integration

### Wallet-Linked Features
- **Progress Tracking**: Each wallet has individual progress
- **NFT Eligibility**: Based on completed stations
- **Reward System**: Tokens and XP tied to wallet
- **Session Management**: Persistent login across app restarts

### Offline Capabilities
- **Local Storage**: Fallback when backend unavailable
- **Manual Sync**: Button to sync when connection restored
- **Cached Progress**: Game works completely offline
- **Queue System**: Actions queued for later sync

## 📤 NFT Airdrop Process

### Export User Data
```bash
curl http://localhost:3001/api/export > eligible_users.json
```

### Sample Export Data
```json
{
  "exportTime": "2024-09-21T21:30:00.000Z",
  "totalUsers": 15,
  "eligibleUsers": 8,
  "wallets": [
    {
      "walletAddress": "0xDD1D232bCE6C5A264AB3248293fb6D3Fea20359c",
      "completedStations": 4,
      "totalXP": 400,
      "eligibleForNFT": true
    }
  ]
}
```

### Manual Airdrop Steps
1. Export user data from backend
2. Filter users with `eligibleForNFT: true`
3. Use your preferred NFT minting tool
4. Send NFTs to the wallet addresses

## 🔧 Configuration

### Network Settings
- **Base Sepolia Chain ID**: `0x14A34` (84532)
- **RPC URL**: `https://sepolia.base.org`
- **Explorer**: `https://sepolia-explorer.base.org`

### Server Configuration
- **Port**: 3001 (backend), 5173 (frontend)
- **CORS**: Enabled for cross-origin requests
- **File Storage**: JSON file in project root

## 🚨 Troubleshooting

### Common Issues
1. **Server won't start**: Check if port 3001 is available
2. **MetaMask not working**: Ensure users have MetaMask installed
3. **Network access**: Make sure firewall allows connections
4. **Offline mode**: Manual wallet input always works

### Debug Commands
```bash
# Check server health
curl http://localhost:3001/api/health

# View registered wallets
curl http://localhost:3001/api/wallets

# Check your network IP
ipconfig getifaddr en0  # macOS
hostname -I             # Linux
```

## 🎯 Perfect for Train Environment

### Why This Setup Works Great
- **Offline-First**: No internet required for basic functionality
- **Local Network**: Uses your WiFi hotspot
- **Simple UX**: One-click wallet connection or manual entry
- **Persistent**: Data saved locally, won't lose progress
- **Scalable**: Can handle many concurrent users
- **Export Ready**: Easy to get wallet addresses for airdrops

### Train Passenger Instructions
> "Hey everyone! 🚂 Want to earn some NFTs during our journey?
> 1. Connect to my WiFi: [Your WiFi Name]
> 2. Open browser → go to: http://10.139.98.126:5173/
> 3. Enter your Base Sepolia wallet address (or connect MetaMask)
> 4. Play the train game and complete stations
> 5. I'll airdrop NFTs to everyone who completes 3+ stations!"

## 🎉 Success!
You now have a complete wallet integration system that's perfect for collecting Base Sepolia addresses from train passengers and managing NFT airdrops based on game progress!