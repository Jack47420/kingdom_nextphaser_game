import { Resource } from '../types/game';

export const initialResources: Resource[] = [
  // Basic Materials
  {
    id: 'wood',
    name: 'Wood',
    amount: 100,
    icon: 'Trees',
    category: 'basic',
    maxAmount: 1000
  },
  {
    id: 'stone',
    name: 'Stone',
    amount: 50,
    icon: 'Mountain',
    category: 'basic',
    maxAmount: 1000
  },
  {
    id: 'iron',
    name: 'Iron',
    amount: 30,
    icon: 'Hammer',
    category: 'basic',
    maxAmount: 800
  },
  {
    id: 'copper',
    name: 'Copper',
    amount: 40,
    icon: 'CircleDot',
    category: 'basic',
    maxAmount: 800
  },
  {
    id: 'coal',
    name: 'Coal',
    amount: 60,
    icon: 'Circle',
    category: 'basic',
    maxAmount: 1000
  },
  {
    id: 'leather',
    name: 'Leather',
    amount: 25,
    icon: 'Scroll',
    category: 'basic',
    maxAmount: 500
  },
  {
    id: 'cloth',
    name: 'Cloth',
    amount: 35,
    icon: 'Shirt',
    category: 'basic',
    maxAmount: 500
  },
  {
    id: 'herbs',
    name: 'Herbs',
    amount: 45,
    icon: 'Flower2',
    category: 'basic',
    maxAmount: 300
  },
  {
    id: 'water',
    name: 'Water',
    amount: 200,
    icon: 'Droplets',
    category: 'basic',
    maxAmount: 2000
  },
  {
    id: 'clay',
    name: 'Clay',
    amount: 70,
    icon: 'Square',
    category: 'basic',
    maxAmount: 700
  },
  // Gems
  {
    id: 'diamond',
    name: 'Diamond',
    amount: 5,
    icon: 'Diamond',
    category: 'rare',
    maxAmount: 100
  },
  {
    id: 'ruby',
    name: 'Ruby',
    amount: 8,
    icon: 'Gem',
    category: 'rare',
    maxAmount: 150
  },
  {
    id: 'sapphire',
    name: 'Sapphire',
    amount: 6,
    icon: 'Hexagon',
    category: 'rare',
    maxAmount: 120
  },
  // Crafted
  {
    id: 'tools',
    name: 'Tools',
    amount: 5,
    icon: 'Wrench',
    category: 'crafted',
    maxAmount: 50
  },
  {
    id: 'weapons',
    name: 'Weapons',
    amount: 3,
    icon: 'Sword',
    category: 'crafted',
    maxAmount: 30
  }
];