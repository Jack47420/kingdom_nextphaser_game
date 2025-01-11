import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sword } from 'lucide-react';

export function GameHeader() {
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2">
        <Sword className="h-5 w-5 text-gray-600 dark:text-gray-400" />
        <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">Resource Kingdom</h1>
      </div>
      <p className="text-sm text-gray-800 dark:text-gray-400">
        Manage your resources, craft items, and build your kingdom
      </p>
    </div>
  );
}