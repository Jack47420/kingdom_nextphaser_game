import { Resource } from '../types/game';

export const initialResources: Resource[] = [
  // Basic Materials
  {
    id: 'wood',
    name: 'Wood',
    amount: 100,
    icon: 'Trees',
    category: 'basic',
    rarity: 'common',
    origin: 'forest',
    maxAmount: 10000
  },
  {
    id: 'stone',
    name: 'Stone',
    amount: 62,
    icon: 'Mountain',
    category: 'basic',
    rarity: 'common',
    origin: 'mountain',
    maxAmount: 10000
  },
  {
    id: 'iron',
    name: 'Iron',
    amount: 0,
    icon: 'Hammer',
    category: 'basic',
    rarity: 'uncommon',
    origin: 'mine',
    maxAmount: 8000
  },
  {
    id: 'copper',
    name: 'Copper',
    amount: 0,
    icon: 'CircleDot',
    category: 'basic',
    rarity: 'common',
    origin: 'mine',
    maxAmount: 8000
  },
  {
    id: 'coal',
    name: 'Coal',
    amount: 0,
    icon: 'Circle',
    category: 'basic',
    rarity: 'uncommon',
    origin: 'mountain',
    maxAmount: 10000
  },
  {
    id: 'leather',
    name: 'Leather',
    amount: 0,
    icon: 'Scroll',
    category: 'basic',
    rarity: 'rare',
    origin: 'grass',
    maxAmount: 5000
  },
  {
    id: 'cloth',
    name: 'Cloth',
    amount: 0,
    icon: 'Shirt',
    category: 'basic',
    rarity: 'uncommon',
    origin: 'grass',
    maxAmount: 5000
  },
  {
    id: 'herbs',
    name: 'Herbs',
    amount: 0,
    icon: 'Flower2',
    category: 'basic',
    rarity: 'common',
    origin: 'grass',   
    maxAmount: 3000
  },
  {
    id: 'water',
    name: 'Water',
    amount: 0,
    icon: 'Droplets',
    category: 'basic',
    rarity: 'common',
    origin: 'water',
    maxAmount: 20000
  },
  // Gems
  {
    id: 'diamond',
    name: 'Diamond',
    amount: 0,
    icon: 'Diamond',
    category: 'gems',
    rarity: 'rare',
    origin: 'mine',
    maxAmount: 1000
  },
  {
    id: 'ruby',
    name: 'Ruby',
    amount: 0,
    icon: 'Gem',
    category: 'gems',
    rarity: 'epic',
    origin: 'mine',
    maxAmount: 1500
  },
  {
    id: 'sapphire',
    name: 'Sapphire',
    amount: 0,
    icon: 'Hexagon',
    category: 'gems',
    rarity: 'legendary',
    origin: 'mine',
    maxAmount: 1200
  },
  // Crafted
  {
    id: 'tools',
    name: 'Tools',
    amount: 0,
    icon: 'Wrench',
    category: 'crafted',
    rarity: 'uncommon',
    origin: 'crafted',
    maxAmount: 500
  },
  {
    id: 'weapons',
    name: 'Weapons',
    amount: 0,
    icon: 'Sword',
    category: 'crafted',
    rarity: 'rare',
    origin: 'crafted',
    maxAmount: 300
  }
];
