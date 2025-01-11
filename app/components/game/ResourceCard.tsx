'use client';

import { Resource } from '@/app/types/game';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import * as Icons from 'lucide-react';
import { cn } from '@/lib/utils';
import { RESOURCE_RATES } from '@/app/config/game-config';
import { TrendingUp } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface ResourceCardProps {
  resource: Resource;
  producingTiles?: number;
}

export function ResourceCard({ resource, producingTiles = 0 }: ResourceCardProps) {
  const IconComponent = Icons[resource.icon as keyof typeof Icons] as React.ElementType;
  
  // Format the amount based on resource category
  const formatAmount = (amount: number, category: string) => {
    if (category === 'basic') {
      return Math.floor(amount);
    }
    return amount.toFixed(2);
  };

  const displayAmount = formatAmount(resource.amount, resource.category);
  const growthRate = RESOURCE_RATES[resource.category] * producingTiles;
  const displayRate = formatAmount(growthRate, resource.category);
  
  const getResourceDescription = () => {
    switch (resource.category) {
      case 'basic':
        return 'A basic resource gathered from the world';
      case 'rare':
        return 'A rare and valuable resource';
      case 'crafted':
        return 'A resource crafted from other materials';
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Card className={cn(
            'transition-all duration-200 hover:shadow-lg p-2 bg-white border-gray-200 dark:bg-gray-800 dark:border-gray-700 min-w-[150px] max-w-[250px]',
            resource.category === 'rare' && 'border-amber-500/50 bg-amber-50/50 dark:border-amber-700/50 dark:bg-gray-800/90',
            resource.category === 'crafted' && 'border-blue-500/50 bg-blue-50/50 dark:border-blue-700/50 dark:bg-gray-800/90'
          )}>
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                {IconComponent && <IconComponent className="h-4 w-4 text-gray-600 dark:text-gray-400" />}
                <span className="font-medium text-sm text-gray-900 dark:text-gray-200">{displayAmount}/{resource.maxAmount}</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
                <TrendingUp className="h-3 w-3" />
                <span>{displayRate}/s</span>
              </div>
            </div>
            <Progress 
              value={(resource.amount / resource.maxAmount) * 100} 
              className="h-1 bg-gray-200 dark:bg-gray-700"
            />
          </Card>
        </TooltipTrigger>
        <TooltipContent className="bg-white border-gray-200 dark:bg-gray-800 dark:border-gray-700">
          <div className="space-y-1">
            <p className="font-medium text-gray-900 dark:text-gray-200">{resource.name}</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">{getResourceDescription()}</p>
            {producingTiles > 0 && (
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Produced by {producingTiles} {producingTiles === 1 ? 'tile' : 'tiles'}
              </p>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}