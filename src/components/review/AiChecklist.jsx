import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, ChevronDown, ChevronUp, AlertCircle, CheckCircle2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';

export default function AiChecklist({ organizedData, rawText }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState(null);

  const runCheck = async () => {
    setLoading(true);
    setOpen(true);
    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `You are a helpful assistant reviewing pet/house sitting instructions for completeness.

Here is the organized instruction data:
${JSON.stringify(organizedData, null, 2)}

Original notes: ${rawText || '(not available)'}

Review these instructions carefully and identify any IMPORTANT missing details that a pet sitter would genuinely need. Focus on things that could cause problems if missing. Be specific and friendly.

Examples of gaps to look for:
- Pets mentioned but breed not stated
- Pets mentioned but no feeding times or amounts given
- Feeding instructions that mention multiple pets but only detail one of them
- Medications mentioned but no dosage, schedule, or exact administration method
- Dog mentioned but no walk frequency
- Fish mentioned but no feeding schedule
- House access mentioned but no alarm code or wifi
- No vet contact information
- No owner emergency contact
- No return date mentioned

Return JSON with this structure:
{
  "missing": [
    {"issue": "short description", "suggestion": "friendly prompt to add this info"}
  ],
  "looks_good": ["thing 1 that is complete", "thing 2"]
}

Only flag truly important missing items (max 6). If nothing major is missing, missing array can be empty.`,
      response_json_schema: {
        type: 'object',
        properties: {
          missing: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                issue: { type: 'string' },
                suggestion: { type: 'string' },
              },
            },
          },
          looks_good: { type: 'array', items: { type: 'string' } },
        },
      },
    });
    setItems(result);
    setLoading(false);
  };

  return (
    <Card className="border-primary/30 bg-primary/5 mb-6">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            <span className="font-medium text-primary">AI Completeness Check</span>
            {items && items.missing?.length === 0 && (
              <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">All good!</span>
            )}
            {items && items.missing?.length > 0 && (
              <span className="text-xs bg-destructive/10 text-destructive px-2 py-0.5 rounded-full">
                {items.missing.length} item{items.missing.length > 1 ? 's' : ''} to review
              </span>
            )}
          </div>
          <Button
            size="sm"
            variant={items ? 'ghost' : 'default'}
            onClick={items ? () => setOpen(o => !o) : runCheck}
            disabled={loading}
            className="rounded-lg text-xs"
          >
            {loading ? (
              <><span className="animate-pulse">Checking...</span></>
            ) : items ? (
              open ? <><ChevronUp className="w-3.5 h-3.5 mr-1" />Hide</> : <><ChevronDown className="w-3.5 h-3.5 mr-1" />Show</>
            ) : (
              <><Sparkles className="w-3.5 h-3.5 mr-1" />Check for gaps</>
            )}
          </Button>
        </div>

        <AnimatePresence>
          {open && items && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="mt-4 space-y-3">
                {items.missing?.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-destructive uppercase tracking-wide mb-2">Things to add</p>
                    <div className="space-y-2">
                      {items.missing.map((item, i) => (
                        <div key={i} className="flex gap-2 bg-destructive/5 border border-destructive/15 rounded-lg p-3">
                          <AlertCircle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-destructive">{item.issue}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">{item.suggestion}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {items.looks_good?.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-primary uppercase tracking-wide mb-2">Looks complete ✓</p>
                    <div className="flex flex-wrap gap-2">
                      {items.looks_good.map((item, i) => (
                        <span key={i} className="flex items-center gap-1 text-xs bg-primary/10 text-primary rounded-full px-2.5 py-1">
                          <CheckCircle2 className="w-3 h-3" /> {item}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}