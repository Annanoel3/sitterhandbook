import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Camera, X, Loader2, ImagePlus } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';

export default function PhotoUploader({ photos, setPhotos }) {
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = React.useState(false);

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    setUploading(true);
    const newPhotos = [];

    for (const file of files) {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      newPhotos.push({ url: file_url, label: '' });
    }

    setPhotos(prev => [...prev, ...newPhotos]);
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removePhoto = (index) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const updateLabel = (index, label) => {
    setPhotos(prev => prev.map((p, i) => i === index ? { ...p, label } : p));
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="rounded-xl"
        >
          {uploading ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <ImagePlus className="w-4 h-4 mr-2" />
          )}
          {uploading ? 'Uploading...' : 'Add Photos'}
        </Button>
        <span className="text-sm text-muted-foreground">
          Pets, plants, house areas, anything helpful
        </span>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileChange}
        className="hidden"
      />

      <AnimatePresence>
        {photos.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4"
          >
            {photos.map((photo, i) => (
              <motion.div
                key={photo.url}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="relative group"
              >
                <div className="aspect-square rounded-xl overflow-hidden border border-border bg-muted">
                  <img
                    src={photo.url}
                    alt={photo.label || `Photo ${i + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removePhoto(i)}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                >
                  <X className="w-3 h-3" />
                </button>
                <Input
                  placeholder="Label this photo..."
                  value={photo.label}
                  onChange={(e) => updateLabel(i, e.target.value)}
                  className="mt-2 text-xs h-8 rounded-lg"
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}