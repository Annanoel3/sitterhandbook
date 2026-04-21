import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, ChevronDown, ChevronUp, X, Loader2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';

export default function AIGapChecker({ organizedData, rawText }) {
  const [gaps, setGaps] = useState(null);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(true);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (organizedData && rawText) {
      checkForGaps();
    }
  }, []);

  const checkForGaps = async () => {
    setLoading(true);
    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `You are a helpful assistant reviewing a pet-sitting instruction sheet. Look at the organized data below and identify any IMPORTANT missing information that a pet sitter would realistically need.

Organized data:
${JSON.stringify(organizedData, null, 2)}

Original notes:
${rawText}

Only flag things that are genuinely missing and important. Do NOT be pedantic. Focus on:
- Feeding: missing amounts, times, or food type for any animal mentioned
- Medications: mentioned but no dosage or schedule
- Emergency contacts: no vet or backup contact
- Access: how to enter the home if not mentioned
- Any pets mentioned but with very little care info

Return JSON with this shape:
{
  "has_gaps": true/false,
  "gaps": [
    { "category": "Feeding Schedule", "question": "How much food does Max get per meal?" },
    ...
  ]
}

Return at most 5 gaps. If everything looks complete, set has_gaps to false and gaps to [].`,
      response_json_schema: {
        type: 'object',
        properties: {
          has_gaps: { type: 'boolean' },
          gaps: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                category: { type: 'string' },
                question: { type: 'string' },
              },
            },
          },
        },
      },
    });
    setGaps(result);
    setLoading(false);
  };

  if (dismissed) return null;
  if (loading) {
    return (
      <Card className="border-primary/20 bg-primary/5 mb-6">
        <CardContent className="p-4 flex items-center gap-3">
          <Loader2 className="w-4 h-4 animate-spin text-primary" />
          <span className="text-sm text-primary font-medium">AI is reviewing your instructions for anything missing...</span>
        </CardContent>
      </Card>
    );
  }

  if (!gaps || !gaps.has_gaps) return null;

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mb-6">
        <Card className="border-accent/40 bg-accent/5 overflow-hidden">
          <CardContent className="p-0">
            <div className="flex items-center justify-between px-4 py-3 border-b border-accent/20">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-accent" />
                <span className="text-sm font-semibold text-accent-foreground">
                  AI noticed {gaps.gaps.length} thing{gaps.gaps.length > 1 ? 's' : ''} that might be missing
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="sm" onClick={() => setExpanded(e => !e)} className="h-7 w-7 p-0">
                  {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setDismissed(true)} className="h-7 w-7 p-0 text-muted-foreground">
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <AnimatePresence>
              {expanded && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: 'auto' }}
                  exit={{ height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="px-4 py-3 space-y-2">
                    {gaps.gaps.map((gap, i) => (
                      <div key={i} className="flex items-start gap-3 text-sm">
                        <div className="w-5 h-5 rounded-full bg-accent/20 text-accent-foreground flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                          {i + 1}
                        </div>
                        <div>
                          <span className="font-medium text-accent-foreground">{gap.category}: </span>
                          <span className="text-muted-foreground">{gap.question}</span>
                        </div>
                      </div>
                    ))}
                    <p className="text-xs text-muted-foreground pt-1 border-t border-accent/10 mt-2">
                      You can edit any section below by clicking the pencil icon, or dismiss this if everything looks good.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}