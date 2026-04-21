import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { X, Loader2, ImagePlus, GripVertical } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

export default function PhotoUploader({ photos, setPhotos }) {
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setUploading(true);
    const newPhotos = [];
    for (const file of files) {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      newPhotos.push({ url: file_url, label: '', caption: '' });
    }
    setPhotos(prev => [...prev, ...newPhotos]);
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removePhoto = (index) => setPhotos(prev => prev.filter((_, i) => i !== index));

  const updateField = (index, field, value) =>
    setPhotos(prev => prev.map((p, i) => i === index ? { ...p, [field]: value } : p));

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const reordered = Array.from(photos);
    const [moved] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, moved);
    setPhotos(reordered);
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()} disabled={uploading} className="rounded-xl">
          {uploading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <ImagePlus className="w-4 h-4 mr-2" />}
          {uploading ? 'Uploading...' : 'Add Photos'}
        </Button>
        <span className="text-sm text-muted-foreground">Drag to reorder · add a label & caption to each</span>
      </div>

      <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleFileChange} className="hidden" />

      {photos.length > 0 && (
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="photos" direction="vertical">
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps} className="space-y-3">
                {photos.map((photo, i) => (
                  <Draggable key={photo.url} draggableId={photo.url} index={i}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={`flex gap-3 bg-card border rounded-xl p-3 transition-shadow ${snapshot.isDragging ? 'shadow-lg border-primary/30' : 'border-border/60'}`}
                      >
                        {/* Drag handle */}
                        <div {...provided.dragHandleProps} className="flex items-center text-muted-foreground/40 hover:text-muted-foreground cursor-grab active:cursor-grabbing pt-1">
                          <GripVertical className="w-4 h-4" />
                        </div>

                        {/* Thumbnail */}
                        <div className="relative shrink-0">
                          <div className="w-20 h-20 rounded-lg overflow-hidden border border-border bg-muted">
                            <img src={photo.url} alt={photo.label || `Photo ${i + 1}`} className="w-full h-full object-cover" />
                          </div>
                          <button
                            type="button"
                            onClick={() => removePhoto(i)}
                            className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center shadow-md hover:bg-destructive/80 transition-colors"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Labels */}
                        <div className="flex-1 space-y-2">
                          <Input
                            placeholder="Label (e.g. Max the tabby cat, Kitchen pantry)"
                            value={photo.label}
                            onChange={(e) => updateField(i, 'label', e.target.value)}
                            className="rounded-lg text-sm h-8"
                          />
                          <Textarea
                            placeholder="Caption / notes (e.g. This is where the cat food is stored, second shelf)"
                            value={photo.caption || ''}
                            onChange={(e) => updateField(i, 'caption', e.target.value)}
                            className="rounded-lg text-xs min-h-[56px] resize-none"
                          />
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )}
    </div>
  );
}