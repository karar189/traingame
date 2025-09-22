// Hardcoded route data for Bengaluru to New Delhi Duronto Express
export const durontoExpressRoute = {
  trainNumber: "12273",
  trainName: "New Delhi Duronto Express",
  source: "Bengaluru Yeshwantpur (YPR)",
  destination: "New Delhi (NDLS)",
  totalDistance: "2444 km",
  totalDuration: "34h 15m",
  stations: [
    {
      id: 1,
      code: "YPR",
      name: "Bengaluru Yeshwantpur",
      city: "Bengaluru",
      state: "Karnataka",
      arrivalTime: null,
      departureTime: "20:15",
      platform: "1",
      stopDuration: "Start",
      distanceFromSource: 0,
      questType: "photo",
      questTitle: "📸 Bengaluru Tech Hub Selfie",
      questDescription: "Take a selfie at Yeshwantpur Railway Station or any iconic Bengaluru tech landmark (UB City, Cubbon Park, or Vidhana Soudha)",
      questChallenge: "Share your #TrainQuest journey starting from the Silicon Valley of India! 🚂💻",
      twitterTemplate: "🚂 Starting my #TrainQuest journey from Bengaluru - the Silicon Valley of India! 🇮🇳💻 From Yeshwantpur to New Delhi, let's collect some NFTs! 🎮 #BengaluruToDelhi #NFTQuest #TechCity",
      hashtags: ["TrainQuest", "BengaluruToDelhi", "NFTQuest", "TechCity", "SiliconValleyIndia"],
      cardReward: "bengaluru-tech",
      isCompleted: false,
      isUnlocked: true,
      position: { x: 20, y: 85 },
      coordinates: { lat: 13.0287, lng: 77.5641 }, // Yeshwantpur Railway Station
      proximityRadius: 5000 // 5km radius
    },
    {
      id: 2,
      code: "HYB",
      name: "Hyderabad Deccan",
      city: "Hyderabad",
      state: "Telangana",
      arrivalTime: "04:30",
      departureTime: "04:35",
      platform: "1",
      stopDuration: "5m",
      distanceFromSource: 612,
      questType: "photo",
      questTitle: "📸 Hyderabad Heritage Hunt",
      questDescription: "Snap a photo at Hyderabad Deccan Railway Station or famous landmarks like Charminar, Golconda Fort, or Hussain Sagar Lake",
      questChallenge: "Showcase the City of Pearls and Nizams! Don't forget to try some biryani! 🍛👑",
      twitterTemplate: "🏛️ Exploring Hyderabad - the City of Pearls! 💎 Just stopped at Deccan Railway Station on my #TrainQuest to Delhi! The heritage and biryani here are unmatched! 🍛 #HyderabadHeritage #CityOfPearls #NFTQuest",
      hashtags: ["TrainQuest", "HyderabadHeritage", "CityOfPearls", "NFTQuest", "Biryani"],
      cardReward: "hyderabad-heritage",
      isCompleted: false,
      isUnlocked: false,
      position: { x: 30, y: 70 },
      coordinates: { lat: 17.3850, lng: 78.4867 }, // Hyderabad Deccan Railway Station
      proximityRadius: 8000 // 8km radius
    },
    {
      id: 3,
      code: "NGP",
      name: "Nagpur Junction",
      city: "Nagpur",
      state: "Maharashtra",
      arrivalTime: "12:45",
      departureTime: "12:50",
      platform: "3",
      stopDuration: "5m",
      distanceFromSource: 1012,
      questType: "photo",
      questTitle: "📸 Orange City Explorer",
      questDescription: "Capture Nagpur Junction or iconic spots like Deekshabhoomi, Sitabuldi Fort, or pose with famous Nagpur oranges! 🍊",
      questChallenge: "Show off the geographical heart of India and its famous oranges! 🇮🇳🍊",
      twitterTemplate: "🍊 At the Orange City - Nagpur! 🚂 Halfway through my #TrainQuest journey at Nagpur Junction! The geographical center of India has the sweetest oranges! 🇮🇳 #OrangeCity #NagpurJunction #NFTQuest #HeartOfIndia",
      hashtags: ["TrainQuest", "OrangeCity", "NagpurJunction", "NFTQuest", "HeartOfIndia"],
      cardReward: "nagpur-orange",
      isCompleted: false,
      isUnlocked: false,
      position: { x: 45, y: 55 },
      coordinates: { lat: 21.1458, lng: 79.0882 }, // Nagpur Junction Railway Station
      proximityRadius: 10000 // 10km radius
    },
    {
      id: 4,
      code: "BPL",
      name: "Bhopal Junction",
      city: "Bhopal",
      state: "Madhya Pradesh",
      arrivalTime: "18:20",
      departureTime: "18:25",
      platform: "2",
      stopDuration: "5m",
      distanceFromSource: 1456,
      questType: "photo",
      questTitle: "📸 City of Lakes Adventure",
      questDescription: "Photograph Bhopal Junction or scenic spots like Upper Lake, Lower Lake, Taj-ul-Masajid, or Van Vihar National Park",
      questChallenge: "Share the beauty of Madhya Pradesh's lake city! 🏞️💧",
      twitterTemplate: "🏞️ Beautiful Bhopal - the City of Lakes! 💧 Stopped at Bhopal Junction during my #TrainQuest adventure! The lakes and Madhya Pradesh culture are breathtaking! 🚂 #CityOfLakes #BhopalJunction #NFTQuest #MadhyaPradesh",
      hashtags: ["TrainQuest", "CityOfLakes", "BhopalJunction", "NFTQuest", "MadhyaPradesh"],
      cardReward: "bhopal-lakes",
      isCompleted: false,
      isUnlocked: false,
      position: { x: 55, y: 40 },
      coordinates: { lat: 23.2599, lng: 77.4126 }, // Bhopal Junction Railway Station
      proximityRadius: 8000 // 8km radius
    },
    {
      id: 5,
      code: "JHS",
      name: "Jhansi Junction",
      city: "Jhansi",
      state: "Uttar Pradesh",
      arrivalTime: "23:45",
      departureTime: "23:50",
      platform: "1",
      stopDuration: "5m",
      distanceFromSource: 1789,
      questType: "photo",
      questTitle: "📸 Warrior Queen's Legacy",
      questDescription: "Capture Jhansi Junction or historic landmarks like Jhansi Fort, Rani Mahal, or Ganesh Mandir - honoring Rani Lakshmibai's bravery! ⚔️👑",
      questChallenge: "Honor the legendary Rani Lakshmibai and Bundelkhand's rich history! 🏰⚔️",
      twitterTemplate: "⚔️ At historic Jhansi! 👑 Visiting the land of brave Rani Lakshmibai during my #TrainQuest journey! The warrior queen's legacy lives on in every corner of this city! 🏰 #JhansiJunction #RaniLakshmibai #NFTQuest #WarriorQueen",
      hashtags: ["TrainQuest", "JhansiJunction", "RaniLakshmibai", "NFTQuest", "WarriorQueen"],
      cardReward: "jhansi-warrior",
      isCompleted: false,
      isUnlocked: false,
      position: { x: 65, y: 30 },
      coordinates: { lat: 25.4484, lng: 78.5685 }, // Jhansi Junction Railway Station
      proximityRadius: 8000 // 8km radius
    },
    {
      id: 6,
      code: "NDLS",
      name: "New Delhi",
      city: "New Delhi",
      state: "Delhi",
      arrivalTime: "06:30",
      departureTime: null,
      platform: "16",
      stopDuration: "End",
      distanceFromSource: 2444,
      questType: "photo",
      questTitle: "📸 Capital Conquest Victory!",
      questDescription: "Final photo at New Delhi Railway Station or iconic landmarks like India Gate, Red Fort, Lotus Temple, or Qutub Minar! 🏛️🇮🇳",
      questChallenge: "Celebrate completing your epic TrainQuest journey to India's capital! 🎉🚂",
      twitterTemplate: "🎉 JOURNEY COMPLETE! 🚂 Just arrived at New Delhi Railway Station after an epic #TrainQuest adventure from Bengaluru! 🇮🇳 Collected NFTs, made memories, and explored incredible India! 🏛️ #NewDelhi #TrainQuestComplete #NFTMaster #IndiaGate",
      hashtags: ["TrainQuest", "NewDelhi", "TrainQuestComplete", "NFTMaster", "IndiaGate"],
      cardReward: "delhi-master",
      isCompleted: false,
      isUnlocked: false,
      position: { x: 80, y: 15 },
      coordinates: { lat: 28.6448, lng: 77.2197 }, // New Delhi Railway Station
      proximityRadius: 10000 // 10km radius
    }
  ]
};

// Quest types configuration
export const questTypes = {
  photo: {
    icon: "📸",
    color: "bg-green-500",
    description: "Capture the moment"
  }
};

// Sample collectible cards data
export const collectibleCards = [
  {
    id: "bengaluru-tech",
    name: "Bengaluru Tech Hub",
    rarity: "common",
    description: "The Garden City and Silicon Valley of India",
    image: "/assets/cards/bengaluru-tech.svg",
    station: "YPR"
  },
  {
    id: "hyderabad-heritage",
    name: "Hyderabad Heritage",
    rarity: "uncommon",
    description: "City of Pearls and Nizams",
    image: "/assets/cards/hyderabad-heritage.svg",
    station: "HYB"
  },
  {
    id: "nagpur-orange",
    name: "Nagpur Orange King",
    rarity: "rare",
    description: "Geographical center of India",
    image: "/assets/cards/nagpur-orange.svg",
    station: "NGP"
  },
  {
    id: "bhopal-lakes",
    name: "Bhopal Lake Master",
    rarity: "rare",
    description: "City of Lakes in Madhya Pradesh",
    image: "/assets/cards/bhopal-lakes.svg",
    station: "BPL"
  },
  {
    id: "jhansi-warrior",
    name: "Jhansi Warrior Queen",
    rarity: "epic",
    description: "Legacy of Rani Lakshmibai",
    image: "/assets/cards/jhansi-warrior.svg",
    station: "JHS"
  },
  {
    id: "delhi-master",
    name: "Delhi Duronto Master",
    rarity: "legendary",
    description: "Capital city conquest complete",
    image: "/assets/cards/delhi-master.svg",
    station: "NDLS"
  }
];

// Snack NFTs data
export const snackNFTs = [
  {
    id: "chai",
    name: "Railway Chai",
    description: "The perfect train journey companion",
    effect: "Reduces quest cooldown by 5 minutes",
    rarity: "common",
    image: "/assets/snacks/chai.svg"
  },
  {
    id: "samosa",
    name: "Station Samosa",
    description: "Crispy and delicious",
    effect: "Duplicate any common card",
    rarity: "uncommon",
    image: "/assets/snacks/samosa.svg"
  },
  {
    id: "rasgulla",
    name: "Bengali Rasgulla",
    description: "Sweet memories of Bengal",
    effect: "Unlock hidden station quest",
    rarity: "rare",
    image: "/assets/snacks/rasgulla.svg"
  },
  {
    id: "vada-pav",
    name: "Mumbai Vada Pav",
    description: "Street food champion",
    effect: "Double XP for next quest",
    rarity: "uncommon",
    image: "/assets/snacks/vada-pav.svg"
  }
];