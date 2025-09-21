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
      questType: "intro",
      questTitle: "Welcome to TrainQuest!",
      questDescription: "Begin your epic journey from the Garden City of India",
      cardReward: "Bengaluru Tech Hub",
      isCompleted: false,
      isUnlocked: true,
      position: { x: 20, y: 85 }
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
      questType: "cultural",
      questTitle: "City of Pearls Explorer",
      questDescription: "Discover the rich heritage of the Nizams and Biryani capital",
      cardReward: "Hyderabad Heritage",
      isCompleted: false,
      isUnlocked: false,
      position: { x: 30, y: 70 }
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
      questType: "trivia",
      questTitle: "Orange City Challenge",
      questDescription: "Test your knowledge about the geographical center of India",
      cardReward: "Nagpur Orange King",
      isCompleted: false,
      isUnlocked: false,
      position: { x: 45, y: 55 }
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
      questTitle: "City of Lakes Explorer",
      questDescription: "Capture the beauty of the lakes and Madhya Pradesh culture",
      cardReward: "Bhopal Lake Master",
      isCompleted: false,
      isUnlocked: false,
      position: { x: 55, y: 40 }
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
      questType: "cultural",
      questTitle: "Rani Lakshmibai's Fort",
      questDescription: "Explore the heroic tales of the warrior queen and Bundelkhand culture",
      cardReward: "Jhansi Warrior Queen",
      isCompleted: false,
      isUnlocked: false,
      position: { x: 65, y: 30 }
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
      questType: "completion",
      questTitle: "Capital Conquest Complete!",
      questDescription: "You've successfully completed the epic Duronto journey to India's capital!",
      cardReward: "Delhi Duronto Master",
      isCompleted: false,
      isUnlocked: false,
      position: { x: 80, y: 15 }
    }
  ]
};

// Quest types configuration
export const questTypes = {
  intro: {
    icon: "🚂",
    color: "bg-blue-500",
    description: "Journey begins here!"
  },
  trivia: {
    icon: "🧠",
    color: "bg-purple-500",
    description: "Test your knowledge"
  },
  photo: {
    icon: "📸",
    color: "bg-green-500",
    description: "Capture the moment"
  },
  ar_scan: {
    icon: "🔍",
    color: "bg-orange-500",
    description: "Find hidden treasures"
  },
  social: {
    icon: "👥",
    color: "bg-pink-500",
    description: "Connect with others"
  },
  food_challenge: {
    icon: "🍛",
    color: "bg-red-500",
    description: "Culinary adventure"
  },
  cultural: {
    icon: "🎭",
    color: "bg-indigo-500",
    description: "Cultural exploration"
  },
  nature: {
    icon: "🌿",
    color: "bg-emerald-500",
    description: "Nature discovery"
  },
  completion: {
    icon: "🏆",
    color: "bg-yellow-500",
    description: "Journey complete!"
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