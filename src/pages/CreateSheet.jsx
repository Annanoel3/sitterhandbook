import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Loader2, PawPrint, Lightbulb } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import VoiceRecorder from '../components/create/VoiceRecorder';
import PhotoUploader from '../components/create/PhotoUploader';

const prompts = [
  "What are your pets' names, breeds, and ages?",
  "Feeding schedule — what, when, how much?",
  "Any medications or special needs?",
  "Pet quirks or behaviors to know about?",
  "Where is the pet food, leashes, treats stored?",
  "Door codes, key locations, alarm info?",
  "Plant watering schedule and locations?",
  "Fish tank or other pet care instructions?",
  "Your contact info and emergency vet number?",
  "Garbage/recycling schedule?",
  "Anything else the sitter should know?",
];

export default function CreateSheet() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [photos, setPhotos] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleVoiceTranscript = (transcript) => {
    setText(prev => {
      if (prev.trim()) {
        return prev + ' ' + transcript;
      }
      return transcript;
    });
  };

  const handleSubmit = async () => {
    if (!text.trim()) return;

    setIsProcessing(true);

    const sheet = await base44.entities.InstructionSheet.create({
      title: title || 'My Pet Sitter Instructions',
      raw_text: text,
      photo_urls: photos.map(p => p.url),
      photo_labels: photos.map(p => p.label),
      status: 'organizing',
    });

    const photoContext = photos
      .filter(p => p.label)
      .map((p, i) => `Photo ${i + 1}: ${p.label}`)
      .join('\n');

    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `You are an expert at organizing pet/house sitting instructions. Take the following rambled notes from a pet owner and organize them into a clear, comprehensive instruction sheet.

RAW NOTES:
${text}

${photoContext ? `PHOTO DESCRIPTIONS:\n${photoContext}` : ''}

Organize into these categories (only include categories that have relevant info). For each category, write clear, easy-to-follow bullet points:

1. owner_contact - Owner's name, phone, email, emergency contacts, vet info
2. house_access - Door codes, key locations, alarm systems, wifi password, parking
3. pets_overview - Names, breeds, ages, personalities, quirks for each pet
4. feeding_schedule - What to feed, when, how much, where food is stored, treats
5. medications - Any medications, dosages, times, how to administer
6. walking_exercise - Walk schedules, leash locations, favorite routes, dog park rules
7. pet_quirks - Behavioral notes, fears, things to avoid, comfort items
8. plants_garden - Watering schedule, which plants, how much water, indoor vs outdoor
9. fish_aquarium - Feeding, tank maintenance, temperature, filter info
10. other_pets - Any other animals (birds, reptiles, etc.) and their care
11. house_rules - Garbage schedule, mail, packages, thermostat, lights, appliances
12. emergency_info - Emergency vet, nearest animal hospital, poison control
13. additional_notes - Anything else that doesn't fit above

Return ONLY valid JSON with this structure (skip empty categories):
{
  "owner_contact": "bullet point text...",
  "house_access": "bullet point text...",
  ...
}

Each value should be a string with clear bullet points using "• " prefix. Make it friendly but thorough.`,
      response_json_schema: {
        type: 'object',
        properties: {
          owner_contact: { type: 'string' },
          house_access: { type: 'string' },
          pets_overview: { type: 'string' },
          feeding_schedule: { type: 'string' },
          medications: { type: 'string' },
          walking_exercise: { type: 'string' },
          pet_quirks: { type: 'string' },
          plants_garden: { type: 'string' },
          fish_aquarium: { type: 'string' },
          other_pets: { type: 'string' },
          house_rules: { type: 'string' },
          emergency_info: { type: 'string' },
          additional_notes: { type: 'string' },
        },
      },
    });

    await base44.entities.InstructionSheet.update(sheet.id, {
      organized_data: result,
      status: 'ready',
    });

    setIsProcessing(false);
    navigate(`/review?id=${sheet.id}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-6 py-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="font-heading text-3xl md:text-4xl font-bold mb-2">
            Tell Us Everything
          </h1>
          <p className="text-muted-foreground text-lg">
            Talk, type, or ramble — we'll make sense of it all.
          </p>
        </motion.div>

        <div className="space-y-8">
          {/* Title */}
          <div>
            <Label htmlFor="title" className="text-sm font-medium mb-2 block">
              Sheet Title (optional)
            </Label>
            <Input
              id="title"
              placeholder="e.g. Instructions for Max & Bella — June Trip"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="rounded-xl h-12 text-base"
            />
          </div>

          {/* Voice Recorder */}
          <Card className="border-border/60 bg-card">
            <CardContent className="p-6">
              <h3 className="font-heading text-lg font-semibold mb-4">🎤 Voice Input</h3>
              <VoiceRecorder onTranscript={handleVoiceTranscript} />
            </CardContent>
          </Card>

          {/* Text Input */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <Label className="text-sm font-medium">✍️ Type or Edit Your Notes</Label>
              <span className="text-xs text-muted-foreground">{text.length} characters</span>
            </div>
            <Textarea
              placeholder="Just start typing or rambling! For example: 'So Max eats twice a day, morning around 7am and evening around 6pm. He gets one cup of the blue bag kibble that's in the pantry bottom shelf. Oh and he needs his joint supplement — it's the little brown bottle next to his food...'"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="min-h-[200px] text-base leading-relaxed rounded-xl resize-y"
            />
          </div>

          {/* Prompt Ideas */}
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">Need ideas? Cover these topics:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {prompts.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => setText(prev => prev + (prev ? '\n\n' : '') + prompt + ' ')}
                    className="text-xs bg-card border border-border/60 rounded-full px-3 py-1.5 text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors cursor-pointer"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Photos */}
          <Card className="border-border/60 bg-card">
            <CardContent className="p-6">
              <h3 className="font-heading text-lg font-semibold mb-4">📸 Photos</h3>
              <PhotoUploader photos={photos} setPhotos={setPhotos} />
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="pt-4 pb-12">
            <Button
              size="lg"
              onClick={handleSubmit}
              disabled={!text.trim() || isProcessing}
              className="w-full rounded-xl py-6 text-base shadow-lg shadow-primary/20"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Organizing your notes...
                </>
              ) : (
                <>
                  <PawPrint className="w-5 h-5 mr-2" />
                  Organize & Create Sheet
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}