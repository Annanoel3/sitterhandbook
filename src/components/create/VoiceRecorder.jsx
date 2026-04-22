import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Square, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { base44 } from '@/api/base44Client';

export default function VoiceRecorder({ onTranscript, existingText = '' }) {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSupported, setIsSupported] = useState(true);

  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  const startRecording = async () => {
    let stream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch (e) {
      setIsSupported(false);
      return;
    }

    chunksRef.current = [];
    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;

    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };

    mediaRecorder.onstop = async () => {
      stream.getTracks().forEach(t => t.stop());
      setIsProcessing(true);

      const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
      const file = new File([blob], 'recording.webm', { type: 'audio/webm' });

      // Upload audio file
      const { file_url } = await base44.integrations.Core.UploadFile({ file });

      // Transcribe via Whisper backend
      const response = await base44.functions.invoke('transcribeAudio', { audio_url: file_url });
      const transcript = response.data?.transcript || '';

      if (transcript) {
        const combined = existingText
          ? existingText.trimEnd() + ' ' + transcript
          : transcript;
        onTranscript(combined.trim());
      }

      setIsProcessing(false);
    };

    mediaRecorder.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
  };

  if (!isSupported) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted rounded-xl px-4 py-3">
        <MicOff className="w-4 h-4" />
        Microphone access not available. Please allow microphone permissions and try again.
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
            disabled={isProcessing}
            className={`relative z-10 rounded-full w-14 h-14 p-0 shadow-lg transition-all ${
              isRecording
                ? 'bg-destructive hover:bg-destructive/90 shadow-destructive/30'
                : 'bg-primary hover:bg-primary/90 shadow-primary/30'
            }`}
          >
            {isProcessing ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : isRecording ? (
              <Square className="w-5 h-5" />
            ) : (
              <Mic className="w-5 h-5" />
            )}
          </Button>
        </div>
        <div className="text-sm space-y-0.5">
          {isProcessing ? (
            <p className="text-primary font-medium animate-pulse">Transcribing your audio...</p>
          ) : isRecording ? (
            <p className="text-destructive font-medium animate-pulse">● Recording... tap to stop</p>
          ) : (
            <p className="text-muted-foreground">
              {existingText
                ? 'Tap to record more — will append to your notes'
                : 'Tap to start recording — speak naturally!'}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}