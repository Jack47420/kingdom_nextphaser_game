import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sword } from 'lucide-react';

export function GameHeader() {
  return (
    <div className="mb-8">
      <Card className="bg-primary text-primary-foreground">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <Sword className="h-6 w-6" />
            Resource Kingdom
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription className="text-primary-foreground/80">
            Manage your resources, craft items, and build your kingdom
          </CardDescription>
        </CardContent>
      </Card>
    </div>
  );
}