import { Resource } from '../types/game';

export const initialResources: Resource[] = [
  // Basic Materials
  {
    id: 'wood',
    name: 'Wood',
    amount: 100,
    icon: 'Trees',
    category: 'basic',
    maxAmount: 10000
  },
  {
    id: 'stone',
    name: 'Stone',
    amount: 50,
    icon: 'Mountain',
    category: 'basic',
    maxAmount: 10000
  },
  {
    id: 'iron',
    name: 'Iron',
    amount: 30,
    icon: 'Hammer',
    category: 'basic',
    maxAmount: 8000
  },
  {
    id: 'copper',
    name: 'Copper',
    amount: 40,
    icon: 'CircleDot',
    category: 'basic',
    maxAmount: 8000
  },
  {
    id: 'coal',
    name: 'Coal',
    amount: 60,
    icon: 'Circle',
    category: 'basic',
    maxAmount: 10000
  },
  {
    id: 'leather',
    name: 'Leather',
    amount: 25,
    icon: 'Scroll',
    category: 'basic',
    maxAmount: 5000
  },
  {
    id: 'cloth',
    name: 'Cloth',
    amount: 35,
    icon: 'Shirt',
    category: 'basic',
    maxAmount: 5000
  },
  {
    id: 'herbs',
    name: 'Herbs',
    amount: 45,
    icon: 'Flower2',
    category: 'basic',
    maxAmount: 3000
  },
  {
    id: 'water',
    name: 'Water',
    amount: 200,
    icon: 'Droplets',
    category: 'basic',
    maxAmount: 20000
  },
  {
    id: 'clay',
    name: 'Clay',
    amount: 70,
    icon: 'Square',
    category: 'basic',
    maxAmount: 7000
  },
  // Gems
  {
    id: 'diamond',
    name: 'Diamond',
    amount: 5,
    icon: 'Diamond',
    category: 'rare',
    maxAmount: 1000
  },
  {
    id: 'ruby',
    name: 'Ruby',
    amount: 8,
    icon: 'Gem',
    category: 'rare',
    maxAmount: 1500
  },
  {
    id: 'sapphire',
    name: 'Sapphire',
    amount: 6,
    icon: 'Hexagon',
    category: 'rare',
    maxAmount: 1200
  },
  // Crafted
  {
    id: 'tools',
    name: 'Tools',
    amount: 5,
    icon: 'Wrench',
    category: 'crafted',
    maxAmount: 500
  },
  {
    id: 'weapons',
    name: 'Weapons',
    amount: 3,
    icon: 'Sword',
    category: 'crafted',
    maxAmount: 300
  }
];