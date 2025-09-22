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

// Write data to file with backup and error recovery
const writeData = async (data) => {
  try {
    console.log('💾 Writing data to file...');
    
    // Create backup before writing
    const backupFile = `${DATA_FILE}.backup`;
    try {
      const currentData = await fs.readFile(DATA_FILE, 'utf8');
      await fs.writeFile(backupFile, currentData);
      console.log('📄 Backup created successfully');
    } catch (backupError) {
      console.warn('⚠️ Could not create backup:', backupError.message);
    }

    // Write new data
    const jsonString = JSON.stringify(data, null, 2);
    await fs.writeFile(DATA_FILE, jsonString);
    
    console.log('✅ Data written to file successfully');
    console.log(`📊 File size: ${jsonString.length} characters`);
    console.log(`👥 Total sessions: ${Object.keys(data.sessions).length}`);
    
  } catch (error) {
    console.error('❌ Error writing data file:', error);
    
    // Try to restore from backup
    try {
      const backupFile = `${DATA_FILE}.backup`;
      const backupData = await fs.readFile(backupFile, 'utf8');
      await fs.writeFile(DATA_FILE, backupData);
      console.log('🔄 Restored from backup after write failure');
    } catch (restoreError) {
      console.error('💥 Critical: Could not restore from backup:', restoreError);
    }
    
    throw error; // Re-throw to let caller handle
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

    console.log('🔄 Progress update request received:');
    console.log('📊 Session ID:', sessionId);
    console.log('🎮 Game Progress:', gameProgress);

    if (!sessionId) {
      console.log('❌ Missing session ID');
      return res.status(400).json({ error: 'Session ID is required' });
    }

    if (!gameProgress) {
      console.log('❌ Missing game progress data');
      return res.status(400).json({ error: 'Game progress is required' });
    }

    const data = await readData();
    console.log('📖 Data read from file successfully');
    
    if (!data.sessions[sessionId]) {
      console.log('❌ Session not found:', sessionId);
      console.log('🔍 Available sessions:', Object.keys(data.sessions));
      return res.status(404).json({ error: 'Session not found' });
    }

    console.log('📋 Current progress for session:', data.sessions[sessionId].gameProgress);

    // Update game progress
    data.sessions[sessionId].gameProgress = {
      ...data.sessions[sessionId].gameProgress,
      ...gameProgress,
      lastUpdated: new Date().toISOString()
    };

    console.log('📋 Updated progress:', data.sessions[sessionId].gameProgress);

    await writeData(data);
    console.log('💾 Data written to file successfully');

    res.json({
      success: true,
      message: 'Game progress updated',
      sessionId,
      gameProgress: data.sessions[sessionId].gameProgress
    });

    console.log('✅ Progress update completed successfully');

  } catch (error) {
    console.error('❌ Error updating progress:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
});

// Get session data
app.get('/api/session/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    console.log('📊 Session data requested for:', sessionId);
    
    const data = await readData();
    
    const session = data.sessions[sessionId];
    if (!session) {
      console.log('❌ Session not found:', sessionId);
      console.log('🔍 Available sessions:', Object.keys(data.sessions));
      return res.status(404).json({ error: 'Session not found' });
    }

    console.log('✅ Session data found for:', sessionId);
    console.log('🎮 Game progress:', session.gameProgress);

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

// Trade NFT card between wallets
app.post('/api/trade', async (req, res) => {
  try {
    const { fromAddress, toAddress, cardId, fromSessionId } = req.body;
    
    // Validation
    if (!fromAddress || !toAddress || !cardId || !fromSessionId) {
      return res.status(400).json({ 
        error: 'Missing required fields: fromAddress, toAddress, cardId, fromSessionId' 
      });
    }
    
    if (fromAddress.toLowerCase() === toAddress.toLowerCase()) {
      return res.status(400).json({ 
        error: 'Cannot trade with yourself' 
      });
    }
    
    const data = await readData();
    
    // Find sender's session
    const senderSession = data.sessions[fromSessionId];
    if (!senderSession || senderSession.walletAddress.toLowerCase() !== fromAddress.toLowerCase()) {
      return res.status(400).json({ 
        error: 'Invalid sender session or wallet address mismatch' 
      });
    }
    
    // Check if sender has the card
    if (!senderSession.gameProgress.collectedCards.includes(cardId)) {
      return res.status(400).json({ 
        error: 'You do not own this card' 
      });
    }
    
    // Find recipient's wallet and session
    const recipientWallet = data.wallets.find(w => 
      w.walletAddress.toLowerCase() === toAddress.toLowerCase()
    );
    
    if (!recipientWallet) {
      return res.status(400).json({ 
        error: 'Recipient wallet address not found. They need to register first.' 
      });
    }
    
    // Find recipient's most recent session
    const recipientSession = Object.values(data.sessions).find(s => 
      s.walletAddress.toLowerCase() === toAddress.toLowerCase()
    );
    
    if (!recipientSession) {
      return res.status(400).json({ 
        error: 'Recipient has no game progress. They need to play first.' 
      });
    }
    
    // Execute the trade
    // Remove card from sender
    const cardIndex = senderSession.gameProgress.collectedCards.indexOf(cardId);
    senderSession.gameProgress.collectedCards.splice(cardIndex, 1);
    
    // Add card to recipient (avoid duplicates)
    if (!recipientSession.gameProgress.collectedCards.includes(cardId)) {
      recipientSession.gameProgress.collectedCards.push(cardId);
    }
    
    // Update timestamps
    const now = new Date().toISOString();
    senderSession.gameProgress.lastUpdated = now;
    recipientSession.gameProgress.lastUpdated = now;
    
    // Save the updated data
    await writeData(data);
    
    console.log(`🔄 Trade executed: ${cardId} from ${fromAddress} to ${toAddress}`);
    
    res.json({
      success: true,
      message: 'Trade completed successfully!',
      trade: {
        cardId,
        from: fromAddress,
        to: toAddress,
        timestamp: now
      },
      senderCards: senderSession.gameProgress.collectedCards,
      recipientCards: recipientSession.gameProgress.collectedCards
    });
    
  } catch (error) {
    console.error('Error executing trade:', error);
    res.status(500).json({ error: 'Internal server error during trade' });
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

// Verify data integrity endpoint
app.get('/api/verify/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    console.log('🔍 Verifying data integrity for session:', sessionId);
    
    const data = await readData();
    
    if (!data.sessions[sessionId]) {
      return res.status(404).json({ error: 'Session not found' });
    }

    const session = data.sessions[sessionId];
    const verification = {
      sessionExists: true,
      hasGameProgress: !!session.gameProgress,
      collectedCardsCount: session.gameProgress?.collectedCards?.length || 0,
      completedStationsCount: session.gameProgress?.completedStations?.length || 0,
      lastUpdated: session.gameProgress?.lastUpdated || 'Never',
      walletAddress: session.walletAddress
    };

    console.log('🔍 Verification result:', verification);

    res.json({
      success: true,
      sessionId,
      verification
    });

  } catch (error) {
    console.error('Error verifying data:', error);
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