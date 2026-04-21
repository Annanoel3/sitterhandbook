import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Pencil, Check, X } from 'lucide-react';

export default function CategorySection({ icon: Icon, title, content, onUpdate, color }) {
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState('');

  if (!content || (Array.isArray(content) && content.length === 0)) return null;

  const displayContent = Array.isArray(content) ? content.join('\n') : 
    typeof content === 'object' ? JSON.stringify(content, null, 2) : String(content);

  const startEdit = () => {
    setEditValue(displayContent);
    setEditing(true);
  };

  const saveEdit = () => {
    onUpdate(editValue);
    setEditing(false);
  };

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
          {!editing && (
            <Button variant="ghost" size="sm" onClick={startEdit} className="text-muted-foreground hover:text-foreground">
              <Pencil className="w-4 h-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {editing ? (
          <div className="space-y-3">
            <Textarea
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="min-h-[120px] text-sm"
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
          <div className="text-sm text-foreground/80 whitespace-pre-wrap leading-relaxed">
            {displayContent}
          </div>
        )}
      </CardContent>
    </Card>
  );
}