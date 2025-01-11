'use client';

import { Resource, MapTile } from '@/app/types/game';
import { ResourceCard } from './ResourceCard';

interface ResourceGridProps {
  resources: Resource[];
  map: MapTile[][];
}

export function ResourceGrid({ resources, map }: ResourceGridProps) {
  const basicResources = resources.filter(r => r.category === 'basic');
  const rareResources = resources.filter(r => r.category === 'gems');
  const craftedResources = resources.filter(r => r.category === 'crafted');

  const getProducingTiles = (resourceId: string): number => {
    return map.flat().filter(tile => 
      tile.unlocked && (
        (tile.terrain === 'forest' && resourceId === 'wood') ||
        (tile.terrain === 'mountain' && (resourceId === 'stone' || resourceId === 'coal')) ||
        (tile.terrain === 'mine' && (resourceId === 'iron' || resourceId === 'copper' || resourceId === 'diamond' || resourceId === 'ruby' || resourceId === 'sapphire')) ||
        (tile.terrain === 'water' && resourceId === 'water') ||
        (tile.terrain === 'grass' && (resourceId === 'leather' || resourceId === 'cloth' || resourceId === 'herbs'))
      )
    ).length;
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-300">Materials</h3>
        <div className="max-w-[1400px]">
          <div className="grid gap-2" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))' }}>
            {basicResources.map((resource) => (
              <ResourceCard 
                key={resource.id} 
                resource={resource} 
                producingTiles={getProducingTiles(resource.id)}
              />
            ))}
          </div>
        </div>
      </div>
      
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-300">Gems</h3>
        <div className="max-w-[1400px]">
          <div className="grid gap-2" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))' }}>
            {rareResources.map((resource) => (
              <ResourceCard 
                key={resource.id} 
                resource={resource}
                producingTiles={getProducingTiles(resource.id)}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-300">Crafted</h3>
        <div className="max-w-[1400px]">
          <div className="grid gap-2" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))' }}>
            {craftedResources.map((resource) => (
              <ResourceCard 
                key={resource.id} 
                resource={resource}
                producingTiles={getProducingTiles(resource.id)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}