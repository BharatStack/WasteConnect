
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface VoiceInterfaceProps {
  onVoiceCommand: (command: string, language: string) => void;
}

const VoiceInterface = ({ onVoiceCommand }: VoiceInterfaceProps) => {
  const [isListening, setIsListening] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('hi-IN');
  const [lastCommand, setLastCommand] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const recognitionRef = useRef<any>(null);
  const { toast } = useToast();

  const supportedLanguages = [
    { code: 'hi-IN', name: 'Hindi', native: 'हिंदी' },
    { code: 'bn-IN', name: 'Bengali', native: 'বাংলা' },
    { code: 'ta-IN', name: 'Tamil', native: 'தமிழ்' },
    { code: 'te-IN', name: 'Telugu', native: 'తెలుగు' },
    { code: 'mr-IN', name: 'Marathi', native: 'मराठी' },
    { code: 'pa-IN', name: 'Punjabi', native: 'ਪੰਜਾਬੀ' },
    { code: 'gu-IN', name: 'Gujarati', native: 'ગુજરાતી' },
    { code: 'kn-IN', name: 'Kannada', native: 'ಕನ್ನಡ' },
    { code: 'ml-IN', name: 'Malayalam', native: 'മലയാളം' },
    { code: 'or-IN', name: 'Odia', native: 'ଓଡ଼ିଆ' },
    { code: 'en-IN', name: 'English', native: 'English' }
  ];

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = selectedLanguage;

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setLastCommand(transcript);
        onVoiceCommand(transcript, selectedLanguage);
        setIsListening(false);
        
        // Provide audio feedback
        speakResponse(`Command received: ${transcript}`, selectedLanguage);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        toast({
          title: "Voice Recognition Error",
          description: "Unable to process voice input. Please try again.",
          variant: "destructive",
        });
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [selectedLanguage, onVoiceCommand, toast]);

  const startListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.lang = selectedLanguage;
      recognitionRef.current.start();
      setIsListening(true);
      toast({
        title: "Listening...",
        description: "Speak your command clearly",
      });
    } else {
      toast({
        title: "Voice Recognition Unavailable",
        description: "Your browser doesn't support voice recognition.",
        variant: "destructive",
      });
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  };

  const speakResponse = (text: string, language: string) => {
    if ('speechSynthesis' in window) {
      setIsSpeaking(true);
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language;
      utterance.rate = 0.8;
      
      utterance.onend = () => {
        setIsSpeaking(false);
      };

      window.speechSynthesis.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const getWelcomeMessage = (langCode: string) => {
    const messages: { [key: string]: string } = {
      'hi-IN': 'नमस्ते! मैं आपकी कृषि अपशिष्ट प्रबंधन में सहायता करूंगा।',
      'bn-IN': 'নমস্কার! আমি আপনার কৃষি বর্জ্য ব্যবস্থাপনায় সাহায্য করব।',
      'ta-IN': 'வணக்கம்! உங்கள் விவசாய கழிவு மேலாண்மையில் நான் உதவுகிறேன்।',
      'te-IN': 'నమస్కారం! మీ వ్యవసాయ వ్యర్థాల నిర్వహణలో నేను సహాయం చేస్తాను।',
      'mr-IN': 'नमस्कार! मी तुमच्या कृषी कचरा व्यवस्थापनात मदत करेन।',
      'pa-IN': 'ਸਤ ਸ੍ਰੀ ਅਕਾਲ! ਮੈਂ ਤੁਹਾਡੇ ਖੇਤੀ ਰਹਿੰਦ-ਖੂੰਹਦ ਪ੍ਰਬੰਧਨ ਵਿੱਚ ਮਦਦ ਕਰਾਂਗਾ।',
      'gu-IN': 'નમસ્તે! હું તમારા કૃષિ કચરાના સંચાલનમાં મદદ કરીશ।',
      'kn-IN': 'ನಮಸ್ಕಾರ! ನಿಮ್ಮ ಕೃಷಿ ತ್ಯಾಜ್ಯ ನಿರ್ವಹಣೆಯಲ್ಲಿ ನಾನು ಸಹಾಯ ಮಾಡುತ್ತೇನೆ।',
      'ml-IN': 'നമസ്കാരം! നിങ്ങളുടെ കാർഷിക മാലിന്യ സംസ്കരണത്തിൽ ഞാൻ സഹായിക്കും।',
      'or-IN': 'ନମସ୍କାର! ମୁଁ ଆପଣଙ୍କର କୃଷି ବର୍ଜ୍ୟ ପରିଚାଳନାରେ ସାହାଯ୍ୟ କରିବି।',
      'en-IN': 'Hello! I will help you with your agricultural waste management.'
    };
    return messages[langCode] || messages['en-IN'];
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mic className="h-5 w-5 text-eco-green-600" />
          Voice Interface
        </CardTitle>
        <CardDescription>
          Speak commands in your preferred language for hands-free operation
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Select Language</label>
          <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {supportedLanguages.map((lang) => (
                <SelectItem key={lang.code} value={lang.code}>
                  {lang.native} ({lang.name})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={isListening ? stopListening : startListening}
            className={`flex-1 ${isListening ? 'bg-red-600 hover:bg-red-700' : 'bg-eco-green-600 hover:bg-eco-green-700'}`}
          >
            {isListening ? (
              <>
                <MicOff className="h-4 w-4 mr-2" />
                Stop Listening
              </>
            ) : (
              <>
                <Mic className="h-4 w-4 mr-2" />
                Start Voice Command
              </>
            )}
          </Button>

          <Button
            onClick={isSpeaking ? stopSpeaking : () => speakResponse(getWelcomeMessage(selectedLanguage), selectedLanguage)}
            variant="outline"
          >
            {isSpeaking ? (
              <VolumeX className="h-4 w-4" />
            ) : (
              <Volume2 className="h-4 w-4" />
            )}
          </Button>
        </div>

        {lastCommand && (
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-sm font-medium">Last Command:</p>
            <p className="text-sm text-gray-600">{lastCommand}</p>
          </div>
        )}

        <div className="text-xs text-gray-500 space-y-1">
          <p><strong>Voice Commands:</strong></p>
          <p>• "Log waste data" - Open waste entry form</p>
          <p>• "Take photo" - Start image recognition</p>
          <p>• "Show alternatives" - Display sustainable options</p>
          <p>• "Government programs" - View available programs</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default VoiceInterface;
