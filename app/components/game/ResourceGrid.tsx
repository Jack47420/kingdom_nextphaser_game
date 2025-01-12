'use client';

import { Resource, MapTile } from '@/app/types/game';
import { ResourceCard } from './ResourceCard';

interface ResourceGridProps {
  resources: Resource[];
  map: MapTile[][];
}

export function ResourceGrid({ resources, map }: ResourceGridProps) {
  const getProducingTiles = (resourceId: string): number => {
    return map.flat().filter(tile => 
      tile.unlocked && (
        (tile.terrain === 'forest' && resourceId === 'wood') ||
        (tile.terrain === 'mountain' && (resourceId === 'stone' || resourceId === 'coal')) ||
        (tile.terrain === 'mine' && (resourceId === 'iron' || resourceId === 'copper' || resourceId === 'diamond' || resourceId === 'ruby' || resourceId === 'sapphire')) ||
        (tile.terrain === 'water' && resourceId === 'water') ||
        (tile.terrain === 'grass' && (resourceId === 'herbs'))
      )
    ).length;
  };

  // Filter resources to only show those with either growth rate or non-zero amount
  const visibleResources = resources.filter(resource => {
    const producingTiles = getProducingTiles(resource.id);
    return resource.amount > 0 || producingTiles > 0;
  });

  const basicResources = visibleResources.filter(r => r.category === 'basic');
  const rareResources = visibleResources.filter(r => r.category === 'gems');
  const craftedResources = visibleResources.filter(r => r.category === 'crafted');

  // Only render sections that have visible resources
  return (
    <div className="space-y-6">
      {basicResources.length > 0 && (
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
      )}
      
      {rareResources.length > 0 && (
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
      )}

      {craftedResources.length > 0 && (
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
      )}
    </div>
  );
}