import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Square } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function VoiceRecorder({ onTranscript }) {
  const [isRecording, setIsRecording] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const recognitionRef = useRef(null);
  const fullTranscriptRef = useRef('');

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setIsSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      let finalTranscript = '';
      let interimTranscript = '';
      
      for (let i = 0; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalTranscript += result[0].transcript + ' ';
        } else {
          interimTranscript += result[0].transcript;
        }
      }
      
      if (finalTranscript) {
        fullTranscriptRef.current += finalTranscript;
        onTranscript(fullTranscriptRef.current.trim());
      }
    };

    recognition.onerror = (event) => {
      console.log('Speech recognition error:', event.error);
      if (event.error !== 'no-speech') {
        setIsRecording(false);
      }
    };

    recognition.onend = () => {
      if (isRecording) {
        try { recognition.start(); } catch (e) { /* already started */ }
      }
    };

    recognitionRef.current = recognition;

    return () => {
      try { recognition.stop(); } catch (e) { /* not started */ }
    };
  }, []);

  const toggleRecording = () => {
    if (!recognitionRef.current) return;
    
    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      fullTranscriptRef.current = '';
      try {
        recognitionRef.current.start();
        setIsRecording(true);
      } catch (e) {
        recognitionRef.current.stop();
        setTimeout(() => {
          recognitionRef.current.start();
          setIsRecording(true);
        }, 100);
      }
    }
  };

  if (!isSupported) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted rounded-xl px-4 py-3">
        <MicOff className="w-4 h-4" />
        Voice recording not supported in this browser. Please type instead.
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <div className="relative">
        <AnimatePresence>
          {isRecording && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="absolute inset-0 rounded-full bg-destructive/20 animate-pulse-ring"
            />
          )}
        </AnimatePresence>
        <Button
          type="button"
          size="lg"
          onClick={toggleRecording}
          className={`relative z-10 rounded-full w-14 h-14 p-0 shadow-lg transition-all ${
            isRecording
              ? 'bg-destructive hover:bg-destructive/90 shadow-destructive/30'
              : 'bg-primary hover:bg-primary/90 shadow-primary/30'
          }`}
        >
          {isRecording ? <Square className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
        </Button>
      </div>
      <div className="text-sm">
        {isRecording ? (
          <span className="text-destructive font-medium">Recording... tap to stop</span>
        ) : (
          <span className="text-muted-foreground">Tap to start talking</span>
        )}
      </div>
    </div>
  );
}