import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Mic } from 'lucide-react';

interface VoiceCommandHelpModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const VoiceCommandHelpModal: React.FC<VoiceCommandHelpModalProps> = ({
  open,
  onOpenChange,
}) => {
  const commandCategories = [
    {
      title: 'Navigation',
      commands: [
        'Go home / Go to start',
        'Go to profile',
        'Go to messages / inbox',
        'Go to my listings',
      ],
    },
    {
      title: 'Actions',
      commands: [
        'I want to donate',
        'I need help / I want to request',
        'Create donation',
        'Make a request',
      ],
    },
    {
      title: 'Search & Feed',
      commands: [
        'Show requests',
        'Show donations',
        'Find [category] (e.g., furniture, food)',
        'Search for [item]',
      ],
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mic className="w-5 h-5" />
            Voice Commands
          </DialogTitle>
          <DialogDescription>
            Here are the commands you can use to navigate and interact with the app.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-[60vh] pr-4">
          <div className="space-y-6">
            {commandCategories.map((category, index) => (
              <div key={index} className="space-y-2">
                <h3 className="font-semibold text-lg text-primary border-b pb-1">
                  {category.title}
                </h3>
                <ul className="space-y-2">
                  {category.commands.map((cmd, cmdIndex) => (
                    <li key={cmdIndex} className="flex items-start gap-2 text-sm">
                      <span className="bg-muted px-2 py-1 rounded text-muted-foreground font-mono">
                        "{cmd}"
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
