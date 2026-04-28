import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Wand2, Mic, Square, Loader2, X, MicOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { base44 } from '@/api/base44Client';

export default function AiEditor({ sheetId, data, onUpdated }) {
  const [open, setOpen] = useState(false);
  const [instruction, setInstruction] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  const startRecording = async () => {
    let stream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch {
      alert('Microphone access not available.');
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
      setIsTranscribing(true);

      const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
      const file = new File([blob], 'recording.webm', { type: 'audio/webm' });
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      const response = await base44.functions.invoke('transcribeAudio', { audio_url: file_url });
      const transcript = response.data?.transcript || '';
      if (transcript) {
        setInstruction(prev => prev ? prev.trimEnd() + ' ' + transcript : transcript);
      }
      setIsTranscribing(false);
    };

    mediaRecorder.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current?.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
  };

  const handleApply = async () => {
    if (!instruction.trim()) return;
    setIsProcessing(true);

    const currentSections = Object.entries(data)
      .filter(([k]) => !k.startsWith('_'))
      .map(([k, v]) => `${k}:\n${v}`)
      .join('\n\n');

    const result = await base44.integrations.Core.InvokeLLM({
      model: "claude_sonnet_4_6",
      prompt: `You are editing a pet/house sitting instruction sheet based on the owner's requested changes.

CURRENT INSTRUCTION SHEET CONTENT:
${currentSections}

OWNER'S REQUESTED CHANGES:
${instruction}

Apply the requested changes carefully. You may add new information, remove information, or modify existing details as requested. Do not change anything that was not mentioned in the requested changes. Preserve all existing bullet point formatting using "• " prefix.

Return ONLY a valid JSON object (no markdown, no code fences) with the same section keys as above, updated to reflect the changes. Only include sections that have content. Example:
{"pets_overview":"...","feeding_schedule":"...",...}`,
    });

    let rawStr = result;
    if (rawStr && typeof rawStr === 'object' && rawStr.response !== undefined) rawStr = rawStr.response;
    if (typeof rawStr !== 'string') rawStr = JSON.stringify(rawStr);
    rawStr = rawStr.trim().replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/i, '').trim();

    let aiData = {};
    try { aiData = JSON.parse(rawStr); } catch { aiData = {}; }

    const updatedData = {
      ...data,
      ...aiData,
    };

    await base44.entities.InstructionSheet.update(sheetId, { organized_data: updatedData });
    onUpdated(updatedData);
    setInstruction('');
    setIsProcessing(false);
    setOpen(false);
  };

  return (
    <>
      {/* Floating Edit Button */}
      <Button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 rounded-xl"
        variant="outline"
      >
        <Wand2 className="w-4 h-4" />
        Edit
      </Button>

      {/* Modal */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
            onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-lg p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Wand2 className="w-5 h-5 text-primary" />
                  <h2 className="font-heading text-lg font-semibold">Edit with AI</h2>
                </div>
                <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-sm text-muted-foreground mb-4">
                Describe what you'd like to add, remove, or change. For example: <em>"Remove the fish feeding section"</em> or <em>"Add that Kaiju's vet is Dr. Smith at 512-555-0100"</em>
              </p>

              <Textarea
                placeholder="Type your changes here..."
                value={instruction}
                onChange={(e) => setInstruction(e.target.value)}
                className="min-h-[120px] rounded-xl text-sm mb-4 resize-none"
              />

              <div className="flex items-center gap-3">
                {/* Voice button */}
                <div className="relative">
                  <Button
                    type="button"
                    size="icon"
                    onClick={isRecording ? stopRecording : startRecording}
                    disabled={isTranscribing || isProcessing}
                    className={`rounded-full w-10 h-10 shrink-0 ${isRecording ? 'bg-destructive hover:bg-destructive/90' : 'bg-muted hover:bg-muted/80 text-foreground border border-border'}`}
                    variant="ghost"
                  >
                    {isTranscribing ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : isRecording ? (
                      <Square className="w-4 h-4" />
                    ) : (
                      <Mic className="w-4 h-4" />
                    )}
                  </Button>
                  {isRecording && (
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-destructive rounded-full animate-pulse" />
                  )}
                </div>
                <span className="text-xs text-muted-foreground flex-1">
                  {isTranscribing ? 'Transcribing...' : isRecording ? '● Recording — tap to stop' : 'Or tap mic to speak your changes'}
                </span>

                <Button
                  onClick={handleApply}
                  disabled={!instruction.trim() || isProcessing || isRecording || isTranscribing}
                  className="rounded-xl"
                >
                  {isProcessing ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Applying...</>
                  ) : (
                    <><Wand2 className="w-4 h-4 mr-2" />Apply Changes</>
                  )}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}