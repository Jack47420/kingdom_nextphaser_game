'use client';

import { Resource } from '@/app/types/game';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import * as Icons from 'lucide-react';
import { cn } from '@/lib/utils';

interface ResourceCardProps {
  resource: Resource;
}

export function ResourceCard({ resource }: ResourceCardProps) {
  const IconComponent = Icons[resource.icon as keyof typeof Icons];
  
  return (
    <Card className={cn(
      'transition-all duration-200 hover:shadow-lg p-2',
      resource.category === 'rare' && 'border-amber-500/50 bg-amber-50/50',
      resource.category === 'crafted' && 'border-blue-500/50 bg-blue-50/50'
    )}>
      <div className="flex items-center gap-2 mb-1">
        {IconComponent && <IconComponent className="h-4 w-4 text-muted-foreground" />}
        <span className="font-medium text-sm">{resource.amount}/{resource.maxAmount}</span>
      </div>
      <Progress 
        value={(resource.amount / resource.maxAmount) * 100} 
        className="h-1"
      />
    </Card>
  );
}