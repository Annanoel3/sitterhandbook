import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { X, Loader2, ImagePlus, GripVertical } from 'lucide-react';
import { base44 } from '@/api/base44Client';
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
    const [removed] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, removed);
    setPhotos(reordered);
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-5">
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="rounded-xl"
        >
          {uploading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <ImagePlus className="w-4 h-4 mr-2" />}
          {uploading ? 'Uploading...' : 'Add Photos'}
        </Button>
        <span className="text-sm text-muted-foreground">
          Pets, plants, house areas, door keypads — anything useful
        </span>
      </div>

      <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleFileChange} className="hidden" />

      {photos.length > 0 && (
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="photos" direction="vertical">
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps} className="space-y-4">
                {photos.map((photo, i) => (
                  <Draggable key={photo.url} draggableId={photo.url} index={i}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={`flex gap-4 bg-muted/40 rounded-2xl p-3 border transition-shadow ${snapshot.isDragging ? 'shadow-lg border-primary/30' : 'border-border/40'}`}
                      >
                        {/* Drag handle */}
                        <div {...provided.dragHandleProps} className="flex items-center text-muted-foreground cursor-grab active:cursor-grabbing">
                          <GripVertical className="w-4 h-4" />
                        </div>

                        {/* Thumbnail */}
                        <div className="relative shrink-0">
                          <div className="w-20 h-20 rounded-xl overflow-hidden border border-border bg-muted">
                            <img src={photo.url} alt={photo.label || `Photo ${i + 1}`} className="w-full h-full object-cover" />
                          </div>
                          <button
                            type="button"
                            onClick={() => removePhoto(i)}
                            className="absolute -top-2 -right-2 w-5 h-5 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center shadow-md"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Labels */}
                        <div className="flex-1 space-y-2">
                          <Input
                            placeholder="Short label (e.g. 'Max's food drawer')"
                            value={photo.label}
                            onChange={(e) => updateField(i, 'label', e.target.value)}
                            className="rounded-lg text-sm h-9"
                          />
                          <Textarea
                            placeholder="Caption or notes for the sitter about this photo... (e.g. 'The kibble is on the left, treats on the right — only 2 treats per day!')"
                            value={photo.caption || ''}
                            onChange={(e) => updateField(i, 'caption', e.target.value)}
                            className="rounded-lg text-sm min-h-[60px] resize-none"
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