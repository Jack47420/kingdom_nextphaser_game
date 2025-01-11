'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Settings, RefreshCw, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";

interface SettingsDialogProps {
  onRestart: () => void;
}

export function SettingsDialog({ onRestart }: SettingsDialogProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Wait for component to mount to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="icon"
          className="bg-white hover:bg-gray-100 border-gray-200 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 dark:hover:border-gray-600"
        >
          <Settings className="h-4 w-4 text-gray-600 dark:text-gray-300" />
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-white border-gray-200 dark:bg-gray-800 dark:border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-gray-900 dark:text-gray-100">Settings</DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-gray-400">
            Game settings and controls
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <Label className="text-gray-900 dark:text-gray-100">Theme</Label>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setTheme('light')}
                className={`${theme === 'light' ? 'bg-gray-100 dark:bg-gray-700' : 'bg-white dark:bg-gray-800'} hover:bg-gray-100 border-gray-200 dark:border-gray-700 dark:hover:bg-gray-700`}
              >
                <Sun className="h-4 w-4 text-gray-600 dark:text-gray-300 mr-1" />
                Light
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setTheme('dark')}
                className={`${theme === 'dark' ? 'bg-gray-100 dark:bg-gray-700' : 'bg-white dark:bg-gray-800'} hover:bg-gray-100 border-gray-200 dark:border-gray-700 dark:hover:bg-gray-700`}
              >
                <Moon className="h-4 w-4 text-gray-600 dark:text-gray-300 mr-1" />
                Dark
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setTheme('system')}
                className={`${theme === 'system' ? 'bg-gray-100 dark:bg-gray-700' : 'bg-white dark:bg-gray-800'} hover:bg-gray-100 border-gray-200 dark:border-gray-700 dark:hover:bg-gray-700`}
              >
                System
              </Button>
            </div>
          </div>
          <Button 
            variant="destructive" 
            onClick={onRestart}
            className="w-full bg-red-100 hover:bg-red-200 text-red-900 dark:bg-red-900 dark:hover:bg-red-800 dark:text-gray-200"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Restart Game
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
} 