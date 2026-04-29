import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Pencil, Check, X, Bold, AlignJustify } from 'lucide-react';

// Renders **bold** markdown and preserves newlines
export function renderMarkdown(text) {
  if (!text) return null;
  return text.split('\n').map((line, li) => {
    const parts = line.split(/(\*\*[^*]+\*\*)/g);
    return (
      <div key={li}>
        {parts.map((part, pi) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={pi}>{part.slice(2, -2)}</strong>;
          }
          return <span key={pi}>{part}</span>;
        })}
      </div>
    );
  });
}

export default function CategorySection({ icon: Icon, title, content, onUpdate, color, autoEdit = false, locked = false }) {
  const [editing, setEditing] = useState(autoEdit);
  const [editValue, setEditValue] = useState('');
  const [lineSpacing, setLineSpacing] = useState(1);
  const textareaRef = useRef(null);

  useEffect(() => {
    if (autoEdit) {
      setEditValue(typeof content === 'string' ? content : '');
      setEditing(true);
    }
  }, [autoEdit]);

  if (!content && !autoEdit) return null;
  if (Array.isArray(content) && content.length === 0 && !autoEdit) return null;

  const displayContent = Array.isArray(content) ? content.join('\n') :
    typeof content === 'object' ? JSON.stringify(content, null, 2) : String(content || '');

  const previewLines = displayContent.split('\n').slice(0, 3).join('\n');

  const startEdit = () => {
    setEditValue(displayContent);
    setEditing(true);
  };

  const saveEdit = () => {
    onUpdate(editValue);
    setEditing(false);
  };

  // Wrap selected text with **bold**
  const handleBold = () => {
    const ta = textareaRef.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const selected = editValue.slice(start, end);
    if (!selected) return;

    // Toggle bold: if already bolded, remove markers; else add
    let newValue;
    if (selected.startsWith('**') && selected.endsWith('**') && selected.length > 4) {
      newValue = editValue.slice(0, start) + selected.slice(2, -2) + editValue.slice(end);
    } else {
      newValue = editValue.slice(0, start) + `**${selected}**` + editValue.slice(end);
    }
    setEditValue(newValue);
    // Restore focus
    setTimeout(() => { ta.focus(); ta.setSelectionRange(start, end + 4); }, 0);
  };

  // Insert blank line at cursor
  const handleAddSpace = () => {
    const ta = textareaRef.current;
    if (!ta) return;
    const pos = ta.selectionStart;
    const newValue = editValue.slice(0, pos) + '\n' + editValue.slice(pos);
    setEditValue(newValue);
    setTimeout(() => { ta.focus(); ta.setSelectionRange(pos + 1, pos + 1); }, 0);
  };

  const spacingClass = lineSpacing === 2 ? 'leading-loose' : lineSpacing === 1.5 ? 'leading-relaxed' : 'leading-normal';

  return (
    <Card className="border-border/60 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
              <Icon className="w-5 h-5" />
            </div>
            <CardTitle className="font-heading text-lg">{title}</CardTitle>
          </div>
          {!editing && !locked && (
            <Button variant="ghost" size="sm" onClick={startEdit} className="text-muted-foreground hover:text-foreground">
              <Pencil className="w-4 h-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {locked ? (
          <div className="relative">
            <div className="text-sm text-foreground/80 whitespace-pre-wrap leading-relaxed line-clamp-3">
              {previewLines}
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-card to-transparent pointer-events-none" />
          </div>
        ) : editing ? (
          <div className="space-y-2">
            {/* Formatting toolbar */}
            <div className="flex items-center gap-2 flex-wrap pb-1 border-b border-border/40">
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={handleBold}
                className="h-7 px-2 text-xs gap-1"
                title="Bold selected text (wraps in **)"
              >
                <Bold className="w-3 h-3" /> Bold
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={handleAddSpace}
                className="h-7 px-2 text-xs gap-1"
                title="Insert blank line at cursor"
              >
                <AlignJustify className="w-3 h-3" /> Add Space
              </Button>
              <div className="flex items-center gap-1 ml-auto">
                <span className="text-xs text-muted-foreground">Preview spacing:</span>
                {[1, 1.5, 2].map(s => (
                  <button
                    key={s}
                    onClick={() => setLineSpacing(s)}
                    className={`text-xs px-2 py-0.5 rounded border transition-colors ${lineSpacing === s ? 'bg-primary text-primary-foreground border-primary' : 'border-border text-muted-foreground hover:border-primary/40'}`}
                  >
                    {s === 1 ? 'Normal' : s === 1.5 ? 'Relaxed' : 'Loose'}
                  </button>
                ))}
              </div>
            </div>
            <div className="text-xs text-muted-foreground">
              Tip: Select text and press <strong>Bold</strong> to make it bold. Use <strong>Add Space</strong> to insert extra line breaks.
            </div>
            <textarea
              ref={textareaRef}
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="w-full min-h-[140px] text-sm rounded-lg border border-input bg-transparent px-3 py-2 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-y"
            />
            <div className="flex gap-2">
              <Button size="sm" onClick={saveEdit} className="rounded-lg">
                <Check className="w-4 h-4 mr-1" /> Save
              </Button>
              <Button size="sm" variant="outline" onClick={() => setEditing(false)} className="rounded-lg">
                <X className="w-4 h-4 mr-1" /> Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className={`text-sm text-foreground/80 whitespace-pre-wrap ${spacingClass}`}>
            {renderMarkdown(displayContent)}
          </div>
        )}
      </CardContent>
    </Card>
  );
}