import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AddSectionButton({ categoryConfig, data, onAdd }) {
  const [open, setOpen] = useState(false);

  // Only show sections that don't have content yet
  const missingSections = Object.entries(categoryConfig).filter(([key]) => !data[key]);

  if (missingSections.length === 0) return null;

  return (
    <div className="mt-4">
      <Button
        variant="outline"
        className="w-full rounded-xl border-dashed text-muted-foreground hover:text-foreground"
        onClick={() => setOpen(o => !o)}
      >
        {open ? <X className="w-4 h-4 mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
        {open ? 'Cancel' : 'Add a Section'}
      </Button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
              {missingSections.map(([key, config]) => {
                const Icon = config.icon;
                return (
                  <button
                    key={key}
                    onClick={() => {
                      onAdd(key);
                      setOpen(false);
                    }}
                    className="flex items-center gap-2 text-left px-4 py-3 rounded-xl border border-border/60 bg-card hover:border-primary/40 hover:bg-primary/5 transition-colors text-sm"
                  >
                    <span className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${config.color}`}>
                      <Icon className="w-3.5 h-3.5" />
                    </span>
                    <span className="font-medium">{config.title}</span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}