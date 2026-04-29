import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, PawPrint, Phone, Home, UtensilsCrossed, Pill, Footprints, Heart, AlertTriangle, StickyNote, User, UserCheck, DollarSign } from 'lucide-react';
import { motion } from 'framer-motion';

const exampleSections = [
  {
    icon: Phone,
    title: 'Owner Contact Info',
    color: 'bg-primary/10 text-primary',
    content: `• Owner: **Sarah Mitchell** — traveling to Portland, back July 14th\n• Best number: (512) 555-0182\n• Email: sarah.m@email.com\n• Emergency contact: Mom — Linda Mitchell (512) 555-0199\n• Vet: Barton Hills Animal Clinic — (512) 555-0300`,
  },
  {
    icon: Home,
    title: 'House Access & Entry',
    color: 'bg-accent/20 text-accent-foreground',
    content: `• Front door code: **4821#**\n• Spare key is under the ceramic frog on the porch\n• Alarm code: **1234** — you have 30 seconds after entering to disarm\n• WiFi: HomeNetwork_5G / password: **SunflowerDog22**\n• Back door tends to stick — lift the handle while turning`,
  },
  {
    icon: PawPrint,
    title: 'Meet the Pets',
    color: 'bg-primary/10 text-primary',
    content: `• **Biscuit** — Golden Retriever, 4 years old\n• **Mochi** — Tabby cat, 7 years old\n• **Finn** — Betta fish, lives on the kitchen counter`,
  },
  {
    icon: UtensilsCrossed,
    title: 'Feeding Schedule',
    color: 'bg-secondary text-secondary-foreground',
    content: `• **Biscuit**: 1.5 cups of Purina Pro Plan (red bag, pantry bottom shelf) at 7am and 6pm. Handful of treats is okay after walks.\n• **Mochi**: Half a can of Fancy Feast wet food in the morning, plus dry food in the blue bowl kept topped off. She'll act starving — don't overfeed her.\n• **Finn**: 3–4 pellets once a day, any time is fine.`,
  },
  {
    icon: Pill,
    title: 'Medications',
    color: 'bg-destructive/10 text-destructive',
    content: `• **Biscuit** takes one Apoquel tablet (in the orange bottle on the counter) every morning with breakfast for allergies. Just hide it in a spoonful of peanut butter — he won't notice.\n• **Mochi** gets half a Cosequin capsule sprinkled on her wet food daily for joint support.`,
  },
  {
    icon: Footprints,
    title: 'Walking & Exercise',
    color: 'bg-primary/10 text-primary',
    content: `• **Biscuit** needs 2 walks a day — morning and evening, at least 20 minutes each\n• Leash and bags are hanging by the front door\n• He loves the trail behind the neighborhood — go left out of the driveway, then right on Elm\n• He pulls a bit at first but settles down`,
  },
  {
    icon: Heart,
    title: 'Pet Quirks & Personality',
    color: 'bg-accent/20 text-accent-foreground',
    content: `• **Biscuit** is very social and might jump on guests — just turn your back and he'll calm down. He sleeps in his crate in the bedroom (leave the door open, he'll go in on his own).\n• **Mochi** is shy and will probably hide the first day. Don't force her out — just leave food and she'll warm up. She likes to sleep on the blue blanket on the couch.\n• **Finn** sometimes looks like he's barely moving — that's normal, he's just resting.`,
  },
  {
    icon: AlertTriangle,
    title: 'Emergency Information',
    color: 'bg-destructive/10 text-destructive',
    content: `• Barton Hills Animal Clinic: (512) 555-0300 — open Mon–Sat 8am–6pm\n• 24hr Emergency Vet: Austin Vet Emergency (512) 555-0911 — 2 miles north on Lamar\n• ASPCA Poison Control: 888-426-4435\n• If **Biscuit** eats something he shouldn't, call the vet first before doing anything`,
  },
  {
    icon: StickyNote,
    title: 'Additional Notes',
    color: 'bg-accent/20 text-accent-foreground',
    content: `• Garbage goes out Tuesday night — brown bin to the curb\n• Don't run the dishwasher overnight, it leaks a little (getting fixed next month)\n• Help yourself to anything in the fridge — there's leftover pasta and plenty of snacks\n• My neighbor Karen (yellow house to the left) has a spare key if anything goes wrong`,
  },
];

const EXAMPLE_PHOTOS = [
  {
    url: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&q=80',
    label: 'Biscuit',
    caption: 'This is Biscuit! His food is in the red bag in the pantry. He sleeps in the crate to the right.',
  },
  {
    url: 'https://images.unsplash.com/photo-1495360010541-f48722b91f29?w=400&q=80',
    label: 'Mochi',
    caption: "Mochi is shy but sweet. She hides under the bed when strangers arrive — totally normal. Her food bowl is in the kitchen.",
  },
  {
    url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80',
    label: 'Front door & keypad',
    caption: 'Code is 4821#. Lift the mat to find the frog with the spare key underneath.',
  },
];

function renderContent(text) {
  // Render **bold** markdown and newlines
  return text.split('\n').map((line, li) => {
    const parts = line.split(/(\*\*[^*]+\*\*)/g);
    return (
      <div key={li} className={li > 0 ? 'mt-1' : ''}>
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

export default function ExampleSheet() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-6 py-10">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to home
          </Link>

          <div className="inline-flex items-center gap-2 bg-accent/20 text-accent-foreground rounded-full px-4 py-1.5 text-sm font-medium mb-4">
            <PawPrint className="w-4 h-4" />
            Example Sheet
          </div>

          <h1 className="font-heading text-3xl font-bold mb-1">Sarah's Pet Sitter Instructions</h1>
          <p className="text-muted-foreground">This is what a finished instruction sheet looks like — yours will be personalized to your pets and home.</p>
        </motion.div>

        {/* Owner / Sitter / Pay bar */}
        <Card className="mb-8 border-primary/20 bg-primary/5 overflow-hidden">
          <CardContent className="p-0">
            <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-border/50">
              <div className="p-4 flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <User className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-primary uppercase tracking-wide mb-0.5">Home Owner</p>
                  <p className="text-sm font-medium">Sarah Mitchell</p>
                  <p className="text-xs text-muted-foreground">(512) 555-0182</p>
                  <p className="text-xs text-muted-foreground">sarah.m@email.com</p>
                </div>
              </div>
              <div className="p-4 flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center shrink-0">
                  <UserCheck className="w-4 h-4 text-accent-foreground" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-accent-foreground uppercase tracking-wide mb-0.5">Pet Sitter</p>
                  <p className="text-sm font-medium">Jamie Torres</p>
                  <p className="text-xs text-muted-foreground">(512) 555-0244</p>
                </div>
              </div>
              <div className="p-4 flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                  <DollarSign className="w-4 h-4 text-secondary-foreground" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide mb-0.5 text-secondary-foreground">Agreed Rate</p>
                  <p className="text-sm font-medium">$50 per day</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sections */}
        <div className="space-y-4 mb-10">
          {exampleSections.map((section, i) => {
            const Icon = section.icon;
            return (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card className="border-border/60 shadow-sm">
                  <div className="p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${section.color}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <h2 className="font-heading text-lg font-semibold">{section.title}</h2>
                    </div>
                    <div className="text-sm text-foreground/80 leading-relaxed">
                      {renderContent(section.content)}
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Photos */}
        <div className="mb-10">
          <h3 className="font-heading text-lg font-semibold mb-4">📸 Photo Reference Guide</h3>
          <div className="space-y-3">
            {EXAMPLE_PHOTOS.map((photo) => (
              <div key={photo.label} className="flex gap-3 bg-card border border-border/60 rounded-xl p-3">
                <div className="w-20 h-20 rounded-lg overflow-hidden border border-border shrink-0">
                  <img src={photo.url} alt={photo.label} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm mb-1">{photo.label}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{photo.caption}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 text-center">
          <PawPrint className="w-8 h-8 text-primary mx-auto mb-3" />
          <h3 className="font-heading text-xl font-semibold mb-2">Ready to make yours?</h3>
          <p className="text-sm text-muted-foreground mb-4">Just talk or type — we'll organize everything into a sheet like this, personalized for your pets and home.</p>
          <Link to="/create">
            <Button size="lg" className="rounded-xl shadow-lg shadow-primary/20">
              <PawPrint className="w-5 h-5 mr-2" />
              Create Your Sheet
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}