import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Loader2, PawPrint, Lightbulb, DollarSign } from 'lucide-react';
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

  // Owner info
  const [ownerName, setOwnerName] = useState('');
  const [ownerPhone, setOwnerPhone] = useState('');
  const [ownerEmail, setOwnerEmail] = useState('');

  // Pet sitter info
  const [sitterName, setSitterName] = useState('');
  const [sitterPhone, setSitterPhone] = useState('');

  // Payment rate
  const [payRate, setPayRate] = useState('');
  const [payPeriod, setPayPeriod] = useState('per visit');

  // Sheet details
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [photos, setPhotos] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleVoiceTranscript = (transcript) => {
    // transcript already includes the existing text prefix (set in VoiceRecorder)
    setText(transcript);
  };

  const handleSubmit = async () => {
    if (!text.trim()) return;

    setIsProcessing(true);

    const ownerInfo = [
      ownerName && `Owner: ${ownerName}`,
      ownerPhone && `Phone: ${ownerPhone}`,
      ownerEmail && `Email: ${ownerEmail}`,
    ].filter(Boolean).join('\n');

    const sitterInfo = [
      sitterName && `Pet Sitter: ${sitterName}`,
      sitterPhone && `Sitter Phone: ${sitterPhone}`,
    ].filter(Boolean).join('\n');

    const payInfo = payRate ? `Agreed pay rate: $${payRate} ${payPeriod}` : '';

    const fullNotes = [ownerInfo, sitterInfo, payInfo, text].filter(Boolean).join('\n\n');

    const sheet = await base44.entities.InstructionSheet.create({
      title: title || 'My Pet Sitter Instructions',
      raw_text: text,
      photo_urls: photos.map(p => p.url),
      photo_labels: photos.map(p => p.label),
      photo_captions: photos.map(p => p.caption || ''),
      status: 'organizing',
      organized_data: {
        _owner: { name: ownerName, phone: ownerPhone, email: ownerEmail },
        _sitter: { name: sitterName, phone: sitterPhone },
        _pay: payRate ? `$${payRate} ${payPeriod}` : '',
      },
    });

    const photoContext = photos
      .filter(p => p.label || p.caption)
      .map((p, i) => `Photo ${i + 1}: ${p.label}${p.caption ? ` — ${p.caption}` : ''}`)
      .join('\n');

    const result = await base44.integrations.Core.InvokeLLM({
      model: "claude_sonnet_4_6",
      prompt: `You are an expert at organizing pet/house sitting instructions. Take the following rambled notes from a pet owner and organize them into a clear, comprehensive instruction sheet.

CRITICAL RULES:
1. NEVER invent, assume, or add ANY information not explicitly stated in the notes. No assumptions, no "likely", no "probably", no filling gaps. If it wasn't said, it does not exist.
2. NEVER add negative statements about things not mentioned (e.g. do NOT write "no need to deal with mail" or "no other instructions" — simply omit that topic entirely).
3. NEVER use placeholder text like "unspecified", "unknown", "not mentioned", or "N/A" — if a detail wasn't given, leave it out entirely.
4. COMPLETENESS IS THE MOST IMPORTANT THING. Your job is to be a faithful transcriber, not an editor. Include EVERY detail, no matter how small — exact amounts, times, brand names, specific steps, textures, temperatures, locations, habits, quirks, anything mentioned. If the owner says something step-by-step, write it step-by-step.
5. If something applies to multiple pets, write it out for EACH pet it applies to. Do not collapse shared instructions into one vague line.
6. Do not paraphrase or summarize. Use the owner's own words and phrasing wherever possible.
7. NEVER assign a specific age to a specific pet unless the owner explicitly said which pet is which age. If they said "they are 8 and 9", write "8 and 9 years old" without assigning which age to which pet.
8. NEVER write "breed unspecified", "unknown breed", or any similar placeholder. If a breed was not mentioned, simply do not mention breed at all for that pet.
9. List EVERY pet mentioned in the notes. Do not skip any animal even if fewer details were given about them.
10. Only include categories that have explicit content from the notes.

RAW NOTES:
${fullNotes}

${photoContext ? `PHOTO DESCRIPTIONS:\n${photoContext}` : ''}

Organize into these categories (only include categories that have relevant info from the notes). For each category, write clear bullet points using "• " prefix that preserve ALL specific details:

1. owner_contact - Owner's name, phone, email, trip destination, return date, emergency contacts, vet name/number
2. house_access - Door codes, key locations, alarm systems, wifi password, parking, how to enter
3. pets_overview - Names, breeds, ages, personalities of each pet
4. feeding_schedule - What to feed each pet, when, how much, where food is stored, treats allowed
5. medications - Any medications, dosages, times, how to administer (preserve every detail exactly)
6. walking_exercise - Walk schedules, leash locations, favorite routes, exercise needs
7. pet_quirks - Behavioral notes, fears, things to avoid, comfort items, sleeping spots
8. plants_garden - Which plants, watering schedule, how much water, indoor vs outdoor
9. fish_aquarium - Feeding schedule, tank maintenance, temperature, filter notes
10. other_pets - Any other animals (birds, reptiles, etc.) and their specific care
11. house_rules - Garbage schedule, mail handling, thermostat settings, lights, appliances, quiet hours
12. emergency_info - Emergency vet address/phone, nearest animal hospital, poison control (888-426-4435), what to do if pet is sick
13. additional_notes - Anything else the sitter should know

Return ONLY valid JSON with these exact keys (omit keys with no content):
{
  "owner_contact": "bullet points...",
  "house_access": "bullet points...",
  ...
}

Remember: only include what was actually said. Never fill in gaps with assumed information.`,
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

    // The SDK may return { response: "json string" } or { response: {...} } or the object directly
    let aiData = result;
    if (aiData?.response !== undefined) aiData = aiData.response;
    if (typeof aiData === 'string') {
      try { aiData = JSON.parse(aiData); } catch { aiData = {}; }
    }

    const finalData = {
      ...aiData,
      _owner: { name: ownerName, phone: ownerPhone, email: ownerEmail },
      _sitter: { name: sitterName, phone: sitterPhone },
      _pay: payRate ? `$${payRate} ${payPeriod}` : '',
    };

    await base44.entities.InstructionSheet.update(sheet.id, {
      organized_data: finalData,
      status: 'ready',
    });

    setIsProcessing(false);
    navigate(`/review?id=${sheet.id}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-6 py-10">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="font-heading text-3xl md:text-4xl font-bold mb-2">Tell Us Everything</h1>
          <p className="text-muted-foreground text-lg">Talk, type, or ramble — we'll make sense of it all.</p>
        </motion.div>

        <div className="space-y-8">
          {/* Title */}
          <div>
            <Label htmlFor="title" className="text-sm font-medium mb-2 block">Sheet Title (optional)</Label>
            <Input
              id="title"
              placeholder="e.g. Instructions for Max & Bella — June Trip"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="rounded-xl h-12 text-base"
            />
          </div>

          {/* Owner + Sitter Info */}
          <Card className="border-border/60 bg-card">
            <CardContent className="p-6">
              <h3 className="font-heading text-lg font-semibold mb-5">👤 Owner & Sitter Info</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Owner */}
                <div className="space-y-3">
                  <p className="text-sm font-semibold text-primary uppercase tracking-wide">Home Owner</p>
                  <div>
                    <Label className="text-xs mb-1 block">Name</Label>
                    <Input placeholder="Your name" value={ownerName} onChange={e => setOwnerName(e.target.value)} className="rounded-lg" />
                  </div>
                  <div>
                    <Label className="text-xs mb-1 block">Phone</Label>
                    <Input placeholder="Best number to reach you" value={ownerPhone} onChange={e => setOwnerPhone(e.target.value)} className="rounded-lg" />
                  </div>
                  <div>
                    <Label className="text-xs mb-1 block">Email</Label>
                    <Input placeholder="Your email" value={ownerEmail} onChange={e => setOwnerEmail(e.target.value)} className="rounded-lg" />
                  </div>
                </div>
                {/* Sitter */}
                <div className="space-y-3">
                  <p className="text-sm font-semibold text-accent-foreground uppercase tracking-wide">Pet Sitter</p>
                  <div>
                    <Label className="text-xs mb-1 block">Sitter's Name</Label>
                    <Input placeholder="Sitter's name" value={sitterName} onChange={e => setSitterName(e.target.value)} className="rounded-lg" />
                  </div>
                  <div>
                    <Label className="text-xs mb-1 block">Sitter's Phone</Label>
                    <Input placeholder="Sitter's phone number" value={sitterPhone} onChange={e => setSitterPhone(e.target.value)} className="rounded-lg" />
                  </div>
                </div>
              </div>

              {/* Pay Rate */}
              <div className="mt-5 pt-5 border-t border-border/50">
                <p className="text-sm font-semibold uppercase tracking-wide mb-3 flex items-center gap-2">
                  <DollarSign className="w-4 h-4" /> Agreed Pay Rate
                </p>
                <div className="flex items-center gap-3">
                  <span className="text-muted-foreground text-sm">$</span>
                  <Input
                    placeholder="Amount (e.g. 50)"
                    value={payRate}
                    onChange={e => setPayRate(e.target.value)}
                    className="rounded-lg w-32"
                    type="number"
                    min="0"
                  />
                  <select
                    value={payPeriod}
                    onChange={e => setPayPeriod(e.target.value)}
                    className="rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                  >
                    <option>per visit</option>
                    <option>per day</option>
                    <option>per hour</option>
                    <option>per week</option>
                    <option>flat rate</option>
                  </select>
                  <span className="text-sm text-muted-foreground">(included in your PDF)</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Voice Recorder */}
          <Card className="border-border/60 bg-card">
            <CardContent className="p-6">
              <h3 className="font-heading text-lg font-semibold mb-4">🎤 Voice Input</h3>
              <p className="text-sm text-muted-foreground mb-4">Just speak naturally about everything your sitter needs to know. No need to be organized — we'll handle that!</p>
              <VoiceRecorder onTranscript={handleVoiceTranscript} existingText={text} />
            </CardContent>
          </Card>

          {/* Text Input */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <Label className="text-sm font-medium">✍️ Type or Edit Your Notes</Label>
              <span className="text-xs text-muted-foreground">{text.length} characters</span>
            </div>
            <Textarea
              placeholder="Just start typing or rambling! For example: 'So Max eats twice a day, morning around 7am and evening around 6pm. He gets one cup of the blue bag kibble that's in the pantry bottom shelf...'"
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
                <span className="text-sm font-medium text-primary">Need ideas? Tap to add these topics:</span>
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
                <><Loader2 className="w-5 h-5 mr-2 animate-spin" />Organizing your notes...</>
              ) : (
                <><PawPrint className="w-5 h-5 mr-2" />Organize & Create Sheet<ArrowRight className="w-5 h-5 ml-2" /></>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}