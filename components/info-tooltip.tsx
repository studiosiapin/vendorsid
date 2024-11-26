import React from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider
} from '@/components/ui/tooltip';
import { InfoCircledIcon } from '@radix-ui/react-icons';
import { cn } from '@/lib/utils';

interface InfoTooltipProps {
  message: string;
  size?: 'small' | 'medium' | 'large';
}

const InfoTooltip = ({ message, size = 'medium' }: InfoTooltipProps) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <InfoCircledIcon
            className={cn(
              'inline-flex cursor-pointer items-center',
              size === 'small'
                ? 'h-4 w-4'
                : size === 'medium'
                ? 'h-5 w-5'
                : 'h-6 w-6'
            )}
          />
        </TooltipTrigger>
        <TooltipContent>{message}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default InfoTooltip;
