'use client';

import { Card } from '@/components/ui/card';
import { Settlement } from '@/app/types/game';

interface SettlementPanelProps {
  onStartPlacement: (type: Settlement['type']) => void;
}

export function SettlementPanel({ onStartPlacement }: SettlementPanelProps) {
  const settlements = [
    { type: 'village' as const, icon: '🏠', label: 'Village' },
    { type: 'town' as const, icon: '🏘️', label: 'Town' },
    { type: 'city' as const, icon: '🏰', label: 'City' }
  ];

  return (
    <>
      {settlements.map(({ type, icon, label }) => (
        <Card 
          key={type}
          className="p-4 cursor-grab active:cursor-grabbing hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          onClick={() => onStartPlacement(type)}
        >
          <div className="flex flex-col items-center gap-2">
            <span className="text-2xl">{icon}</span>
            <span className="text-sm font-medium">{label}</span>
          </div>
        </Card>
      ))}
    </>
  );
} 