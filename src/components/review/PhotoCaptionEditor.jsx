import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Textarea } from '@/components/ui/textarea';

export default function PhotoCaptionEditor({ sheet, setSheet, sheetId }) {
  const [editingIndex, setEditingIndex] = useState(null);
  const [draftCaption, setDraftCaption] = useState('');

  const startEdit = (i) => {
    setEditingIndex(i);
    setDraftCaption(sheet.photo_captions?.[i] || '');
  };

  const saveCaption = async (i) => {
    const newCaptions = [...(sheet.photo_captions || sheet.photo_urls.map(() => ''))];
    newCaptions[i] = draftCaption;
    const updated = { ...sheet, photo_captions: newCaptions };
    setSheet(updated);
    setEditingIndex(null);
    await base44.entities.InstructionSheet.update(sheetId, { photo_captions: newCaptions });
  };

  return (
    <div className="mt-10 mb-8">
      <h3 className="font-heading text-lg font-semibold mb-3">📸 Photo Reference Guide</h3>
      <div className="space-y-3">
        {sheet.photo_urls.map((url, i) => {
          const label = sheet.photo_labels?.[i] || `Photo ${i + 1}`;
          const caption = sheet.photo_captions?.[i] || '';
          const isEditing = editingIndex === i;

          return (
            <div key={url} className="flex gap-3 bg-card border border-border/60 rounded-xl p-3">
              <div className="w-20 h-20 rounded-lg overflow-hidden border border-border shrink-0">
                <img src={url} alt={label} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm mb-1">{label}</p>
                {isEditing ? (
                  <div className="space-y-2">
                    <Textarea
                      value={draftCaption}
                      onChange={(e) => setDraftCaption(e.target.value)}
                      className="text-xs min-h-[60px] resize-none rounded-lg"
                      placeholder="Add a caption..."
                      autoFocus
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => saveCaption(i)}
                        className="text-xs bg-primary text-primary-foreground rounded-md px-3 py-1 hover:bg-primary/90 transition-colors"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingIndex(null)}
                        className="text-xs text-muted-foreground hover:text-foreground transition-colors px-2"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => startEdit(i)}
                    className="text-left w-full group"
                  >
                    {caption ? (
                      <p className="text-xs text-muted-foreground leading-relaxed group-hover:text-foreground transition-colors">{caption}</p>
                    ) : (
                      <p className="text-xs text-muted-foreground/50 italic group-hover:text-muted-foreground transition-colors">Click to add a caption...</p>
                    )}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}