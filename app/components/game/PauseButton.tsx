'use client';

import { Button } from "@/components/ui/button";
import { Pause, Play } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface PauseButtonProps {
  isPaused: boolean;
  onPause: (paused: boolean) => void;
}

export function PauseButton({ isPaused, onPause }: PauseButtonProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => onPause(!isPaused)}
            className="bg-white hover:bg-gray-100 border-gray-200 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 dark:hover:border-gray-600"
          >
            {isPaused ? (
              <Play className="h-4 w-4 text-gray-600 dark:text-gray-300" />
            ) : (
              <Pause className="h-4 w-4 text-gray-600 dark:text-gray-300" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="left" className="bg-white border-gray-200 dark:bg-gray-800 dark:border-gray-700">
          <p className="text-gray-900 dark:text-gray-200">{isPaused ? 'Resume Game' : 'Pause Game'}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
} 