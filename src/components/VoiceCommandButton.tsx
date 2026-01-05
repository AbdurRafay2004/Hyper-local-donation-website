import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, HelpCircle } from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Define the interfaces for the Speech Recognition API
interface SpeechRecognitionEvent {
  results: {
    [index: number]: {
      [index: number]: {
        transcript: string;
      };
    };
  };
}

interface SpeechRecognitionErrorEvent {
  error: string;
}

interface ISpeechRecognition {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onstart: () => void;
  onend: () => void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
  start: () => void;
  stop: () => void;
}

// Define the interface for the window object to include webkitSpeechRecognition
interface Window {
  SpeechRecognition: new () => ISpeechRecognition;
  webkitSpeechRecognition: new () => ISpeechRecognition;
}

declare let window: Window;

export const VoiceCommandButton: React.FC = () => {
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<ISpeechRecognition | null>(null);
  const [showHelp, setShowHelp] = useState(false);
  const navigate = useNavigate();

  const handleCommand = useCallback((command: string) => {
    const lowerCommand = command.toLowerCase();

    // Help Command
    if (lowerCommand.includes('help') || lowerCommand.includes('what can i say') || lowerCommand.includes('commands')) {
        setShowHelp(true);
        toast.success("Opening help");
        return;
    }

    // General Navigation
    if (lowerCommand.includes('home') || lowerCommand.includes('go to start')) {
      navigate('/');
      toast.success("Navigating home");
      return;
    }
    if (lowerCommand.includes('profile')) {
      navigate('/profile');
      toast.success("Navigating to profile");
      return;
    }
    if (lowerCommand.includes('messages') || lowerCommand.includes('inbox')) {
      navigate('/messages');
      toast.success("Navigating to messages");
      return;
    }
    if (lowerCommand.includes('my listings')) {
        navigate('/my-listings');
        toast.success("Navigating to my listings");
        return;
    }

    // Creation Actions
    if (lowerCommand.includes('donate') && (lowerCommand.includes('want to') || lowerCommand.includes('i') || lowerCommand.includes('create'))) {
       // "I want to donate", "create donation"
       // But distinguish from "find donations"
       if (!lowerCommand.includes('find') && !lowerCommand.includes('search') && !lowerCommand.includes('show') && !lowerCommand.includes('see')) {
           navigate('/create-listing');
           toast.success("Opening donation form");
           return;
       }
    }

    if (lowerCommand.includes('request') && (lowerCommand.includes('want to') || lowerCommand.includes('create') || lowerCommand.includes('make') || lowerCommand.includes('need'))) {
         // "I want to request", "make a request", "I need help"
         if (!lowerCommand.includes('find') && !lowerCommand.includes('search') && !lowerCommand.includes('show') && !lowerCommand.includes('see')) {
            navigate('/create-request');
            toast.success("Opening request form");
            return;
         }
    }

    // Feed / Search Logic
    const categories = ['clothes', 'food', 'electronics', 'furniture', 'books', 'toys', 'medical', 'other'];
    const foundCategory = categories.find(cat => lowerCommand.includes(cat));

    // "Is there anything I can donate in the [category] category?" -> Show REQUESTS for that category
    // "Show me furniture requests"
    if ((lowerCommand.includes('can donate') || lowerCommand.includes('requests')) && foundCategory) {
        navigate(`/feed?tab=requests&category=${foundCategory}`);
        toast.success(`Showing requests for ${foundCategory}`);
        return;
    }

    // "Show me donations", "Find furniture"
    if ((lowerCommand.includes('donations') || lowerCommand.includes('find') || lowerCommand.includes('show')) && foundCategory) {
         // Default to donations if not specified "requests"
         navigate(`/feed?tab=donations&category=${foundCategory}`);
         toast.success(`Showing donations for ${foundCategory}`);
         return;
    }

    // Explicit tab navigation without category
    if (lowerCommand.includes('show requests') || lowerCommand.includes('see requests')) {
        navigate('/feed?tab=requests');
        toast.success("Showing all requests");
        return;
    }

    if (lowerCommand.includes('show donations') || lowerCommand.includes('see donations')) {
        navigate('/feed?tab=donations');
        toast.success("Showing all donations");
        return;
    }

    // Search term fallback
    if (lowerCommand.includes('search for')) {
        const searchTerm = lowerCommand.split('search for')[1].trim();
        if (searchTerm) {
            navigate(`/feed?search=${encodeURIComponent(searchTerm)}`);
            toast.success(`Searching for ${searchTerm}`);
            return;
        }
    }

    toast.info(`Command received: "${command}" (No action taken)`);
  }, [navigate]);

  useEffect(() => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();

      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = 'en-US';

      recognitionInstance.onstart = () => {
        setIsListening(true);
        toast.info("Listening...", { duration: 2000 });
      };

      recognitionInstance.onend = () => {
        setIsListening(false);
      };

      recognitionInstance.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = event.results[0][0].transcript.toLowerCase();
        console.log('Voice command:', transcript);
        handleCommand(transcript);
      };

      recognitionInstance.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
        if (event.error === 'not-allowed') {
          toast.error("Microphone access denied.");
        } else {
            toast.error("Could not understand.");
        }
      };

      setRecognition(recognitionInstance);
    } else {
      console.warn("Speech Recognition API not supported in this browser.");
    }
  }, [handleCommand]);

  const toggleListening = () => {
    if (!recognition) {
        toast.error("Voice commands not supported in this browser.");
        return;
    }

    if (isListening) {
      recognition.stop();
    } else {
      recognition.start();
    }
  };

  return (
    <div className="fixed bottom-20 left-6 z-50 flex flex-col items-center gap-2">
         {/* Help Button */}
         <Button
            variant="secondary"
            size="icon"
            className="w-8 h-8 rounded-full shadow-md bg-background hover:bg-muted"
            onClick={() => setShowHelp(true)}
            title="Voice Commands Help"
        >
            <HelpCircle className="w-4 h-4 text-foreground" />
        </Button>

        {/* Mic Button */}
        <Button
            onClick={toggleListening}
            size="icon"
            className={`w-12 h-12 rounded-full shadow-lg transition-all duration-300 ${
                isListening ? 'bg-red-500 hover:bg-red-600 animate-pulse' : 'bg-primary hover:bg-primary/90'
            }`}
            aria-label={isListening ? "Stop listening" : "Start voice command"}
        >
            {isListening ? <MicOff className="w-5 h-5 text-white" /> : <Mic className="w-5 h-5 text-white" />}
        </Button>

        <Dialog open={showHelp} onOpenChange={setShowHelp}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Voice Commands</DialogTitle>
                    <DialogDescription>
                        Try saying these commands to navigate and control the app.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                        <h4 className="font-medium text-primary">Navigation</h4>
                        <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                            <li>"Go home"</li>
                            <li>"Go to profile"</li>
                            <li>"Open messages"</li>
                            <li>"My listings"</li>
                        </ul>
                    </div>
                    <div className="space-y-2">
                        <h4 className="font-medium text-primary">Actions</h4>
                        <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                            <li>"I want to donate"</li>
                            <li>"Make a request"</li>
                            <li>"Search for [item]"</li>
                        </ul>
                    </div>
                    <div className="space-y-2">
                        <h4 className="font-medium text-primary">Finding Items</h4>
                        <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                            <li>"Show me furniture"</li>
                            <li>"Find clothes donations"</li>
                            <li>"Can I donate food?" (Shows requests)</li>
                        </ul>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    </div>
  );
};
