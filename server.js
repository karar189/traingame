import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;

// Middleware - More permissive CORS for mobile access
app.use(cors({
  origin: '*', // Allow all origins for train WiFi access
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(bodyParser.json());

// Data storage file
const DATA_FILE = path.join(__dirname, 'wallet_data.json');

// Initialize data file if it doesn't exist
const initializeDataFile = async () => {
  try {
    await fs.access(DATA_FILE);
  } catch (error) {
    // File doesn't exist, create it
    const initialData = {
      wallets: [],
      sessions: {},
      metadata: {
        created: new Date().toISOString(),
        totalUsers: 0
      }
    };
    await fs.writeFile(DATA_FILE, JSON.stringify(initialData, null, 2));
    console.log('📄 Initialized wallet data file');
  }
};

// Read data from file
const readData = async () => {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading data file:', error);
    return { wallets: [], sessions: {}, metadata: { totalUsers: 0 } };
  }
};

// Write data to file
const writeData = async (data) => {
  try {
    await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error writing data file:', error);
  }
};

// Validate Ethereum address
const isValidEthereumAddress = (address) => {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
};

// Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'TrainQuest Wallet Server is running!',
    timestamp: new Date().toISOString(),
    port: PORT
  });
});

// Save wallet address
app.post('/api/wallet', async (req, res) => {
  try {
    const { walletAddress, loginMethod, timestamp, gameSession } = req.body;
    
    console.log('📱 Received wallet request from:', req.ip);
    console.log('🔍 Request data:', { walletAddress, loginMethod, timestamp, gameSession });
    console.log('🌐 User-Agent:', req.get('User-Agent'));

    // Validation
    if (!walletAddress) {
      return res.status(400).json({ error: 'Wallet address is required' });
    }

    if (!isValidEthereumAddress(walletAddress)) {
      return res.status(400).json({ error: 'Invalid Ethereum address format' });
    }

    if (!loginMethod || !['metamask', 'manual'].includes(loginMethod)) {
      return res.status(400).json({ error: 'Invalid login method' });
    }

    // Read existing data
    const data = await readData();

    // Check if wallet already exists
    const existingWallet = data.wallets.find(w => w.walletAddress.toLowerCase() === walletAddress.toLowerCase());

    const sessionId = gameSession || Date.now();
    const walletEntry = {
      walletAddress: walletAddress.toLowerCase(),
      loginMethod,
      timestamp: timestamp || new Date().toISOString(),
      sessionId,
      ipAddress: req.ip || req.connection.remoteAddress,
      userAgent: req.get('User-Agent'),
      lastActive: new Date().toISOString()
    };

    if (existingWallet) {
      // Update existing wallet
      Object.assign(existingWallet, walletEntry);
      console.log(`🔄 Updated existing wallet: ${walletAddress}`);
    } else {
      // Add new wallet
      data.wallets.push(walletEntry);
      data.metadata.totalUsers = data.wallets.length;
      console.log(`✅ New wallet registered: ${walletAddress} (${loginMethod})`);
    }

    // Store session data
    data.sessions[sessionId] = {
      walletAddress: walletAddress.toLowerCase(),
      loginMethod,
      startTime: new Date().toISOString(),
      gameProgress: {
        completedStations: [],
        collectedCards: [],
        totalXP: 0,
        tokens: 0
      }
    };

    // Save to file
    await writeData(data);

    res.json({
      success: true,
      message: existingWallet ? 'Wallet updated successfully' : 'Wallet registered successfully',
      sessionId,
      walletAddress: walletAddress.toLowerCase(),
      totalUsers: data.metadata.totalUsers
    });

  } catch (error) {
    console.error('Error saving wallet:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all wallets (for admin/debugging)
app.get('/api/wallets', async (req, res) => {
  try {
    const data = await readData();
    
    // Return sanitized data (remove sensitive info)
    const sanitizedWallets = data.wallets.map(wallet => ({
      walletAddress: wallet.walletAddress,
      loginMethod: wallet.loginMethod,
      timestamp: wallet.timestamp,
      sessionId: wallet.sessionId,
      lastActive: wallet.lastActive
    }));

    res.json({
      wallets: sanitizedWallets,
      totalUsers: data.metadata.totalUsers,
      metadata: data.metadata
    });
  } catch (error) {
    console.error('Error fetching wallets:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update game progress
app.post('/api/progress', async (req, res) => {
  try {
    const { sessionId, gameProgress } = req.body;

    if (!sessionId) {
      return res.status(400).json({ error: 'Session ID is required' });
    }

    const data = await readData();
    
    if (!data.sessions[sessionId]) {
      return res.status(404).json({ error: 'Session not found' });
    }

    // Update game progress
    data.sessions[sessionId].gameProgress = {
      ...data.sessions[sessionId].gameProgress,
      ...gameProgress,
      lastUpdated: new Date().toISOString()
    };

    await writeData(data);

    res.json({
      success: true,
      message: 'Game progress updated',
      sessionId,
      gameProgress: data.sessions[sessionId].gameProgress
    });

  } catch (error) {
    console.error('Error updating progress:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get session data
app.get('/api/session/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const data = await readData();
    
    const session = data.sessions[sessionId];
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    res.json({
      sessionId,
      walletAddress: session.walletAddress,
      loginMethod: session.loginMethod,
      gameProgress: session.gameProgress,
      startTime: session.startTime
    });

  } catch (error) {
    console.error('Error fetching session:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Export wallet data (for manual NFT airdrops)
app.get('/api/export', async (req, res) => {
  try {
    const data = await readData();
    
    // Create export data with game progress
    const exportData = data.wallets.map(wallet => {
      const session = Object.values(data.sessions).find(s => s.walletAddress === wallet.walletAddress);
      return {
        walletAddress: wallet.walletAddress,
        loginMethod: wallet.loginMethod,
        registrationTime: wallet.timestamp,
        lastActive: wallet.lastActive,
        gameProgress: session ? session.gameProgress : null,
        completedStations: session ? session.gameProgress.completedStations.length : 0,
        totalXP: session ? session.gameProgress.totalXP : 0,
        eligibleForNFT: session ? session.gameProgress.completedStations.length >= 3 : false
      };
    });

    res.json({
      exportTime: new Date().toISOString(),
      totalUsers: data.metadata.totalUsers,
      eligibleUsers: exportData.filter(u => u.eligibleForNFT).length,
      wallets: exportData
    });

  } catch (error) {
    console.error('Error exporting data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start server
const startServer = async () => {
  await initializeDataFile();
  
  app.listen(PORT, '0.0.0.0', () => {
    console.log('🚂🎮 TrainQuest Wallet Server Started!');
    console.log(`📍 Server running on: http://localhost:${PORT}`);
    console.log(`🌐 Network access: http://0.0.0.0:${PORT}`);
    console.log(`📊 Admin panel: http://localhost:${PORT}/api/wallets`);
    console.log(`📤 Export data: http://localhost:${PORT}/api/export`);
    console.log('💾 Data will be saved to: wallet_data.json');
    console.log('\n🎯 Users on your WiFi can access via your IP address!');
  });
};

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 Server shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('\n🛑 Server shutting down gracefully...');
  process.exit(0);
});

startServer().catch(console.error);