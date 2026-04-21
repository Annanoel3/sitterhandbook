import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Square, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function VoiceRecorder({ onTranscript, existingText = '' }) {
  const [isRecording, setIsRecording] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const [interimText, setInterimText] = useState('');
  const recognitionRef = useRef(null);
  const committedTextRef = useRef('');
  const isRecordingRef = useRef(false);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) { setIsSupported(false); return; }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      let interim = '';
      // Rebuild committed text from all final results
      let finalText = '';
      for (let i = 0; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalText += event.results[i][0].transcript + ' ';
        } else {
          interim += event.results[i][0].transcript;
        }
      }
      if (finalText) {
        committedTextRef.current = (existingText ? existingText.trimEnd() + ' ' : '') + finalText;
        setInterimText('');
        onTranscript(committedTextRef.current.trim());
      }
      if (interim) setInterimText(interim);
    };

    recognition.onerror = (event) => {
      if (event.error === 'aborted') return;
      if (event.error !== 'no-speech') { setIsRecording(false); isRecordingRef.current = false; }
    };

    recognition.onend = () => {
      if (isRecordingRef.current) {
        try { recognition.start(); } catch (e) { /* ignore */ }
      }
    };

    recognitionRef.current = recognition;
    return () => { isRecordingRef.current = false; try { recognition.stop(); } catch (e) { /* ignore */ } };
  }, []);

  const startRecording = () => {
    if (!recognitionRef.current) return;
    committedTextRef.current = '';
    isRecordingRef.current = true;
    setIsRecording(true);
    setInterimText('');
    try { recognitionRef.current.start(); } catch (e) {
      setTimeout(() => { try { recognitionRef.current.start(); } catch (e2) { /* ignore */ } }, 100);
    }
  };

  const stopRecording = () => {
    isRecordingRef.current = false;
    setIsRecording(false);
    setInterimText('');
    try { recognitionRef.current.stop(); } catch (e) { /* ignore */ }
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
    <div className="space-y-3">
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
            onClick={isRecording ? stopRecording : startRecording}
            className={`relative z-10 rounded-full w-14 h-14 p-0 shadow-lg transition-all ${
              isRecording
                ? 'bg-destructive hover:bg-destructive/90 shadow-destructive/30'
                : 'bg-primary hover:bg-primary/90 shadow-primary/30'
            }`}
          >
            {isRecording ? <Square className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </Button>
        </div>
        <div className="text-sm space-y-0.5">
          {isRecording ? (
            <p className="text-destructive font-medium animate-pulse">● Recording... tap to pause</p>
          ) : (
            <p className="text-muted-foreground">
              {existingText ? (
                <span className="flex items-center gap-1.5">
                  <RotateCcw className="w-3.5 h-3.5" />
                  Tap to continue speaking — will append to your notes
                </span>
              ) : 'Tap to start talking — just speak naturally!'}
            </p>
          )}
        </div>
      </div>

      {isRecording && interimText && (
        <div className="ml-1 text-sm text-muted-foreground italic bg-muted/50 rounded-lg px-3 py-2 border border-border/50">
          <span className="opacity-60">Hearing: </span>{interimText}
        </div>
      )}
    </div>
  );
}