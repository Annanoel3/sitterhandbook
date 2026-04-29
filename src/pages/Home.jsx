import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { PawPrint, Mic, FileText, Camera, Sparkles, LogIn, Eye } from 'lucide-react';
import { motion } from 'framer-motion';
import { base44 } from '@/api/base44Client';

const features = [
  { icon: Mic, title: 'Talk or Type', desc: 'Ramble away — we\'ll organize it all for you' },
  { icon: Camera, title: 'Add Photos', desc: 'Upload pics of pets, plants, house areas' },
  { icon: Sparkles, title: 'AI Organizes', desc: 'We turn your notes into clear instructions' },
  { icon: FileText, title: 'Download PDF', desc: 'Get a beautiful, printable instruction sheet' },
];

export default function Home() {
  const handleLogin = () => base44.auth.redirectToLogin();

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/30 to-accent/5" />
        <div className="relative max-w-4xl mx-auto px-6 pt-16 pb-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-1.5 text-sm font-medium mb-6">
              <PawPrint className="w-4 h-4" />
              Peace of mind while you're away
            </div>
            <h1 className="font-heading text-4xl md:text-6xl font-bold tracking-tight text-foreground leading-tight">
              Leave Perfect Instructions
              <br />
              <span className="text-primary">for Your Sitter</span>
            </h1>
            <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Just talk or type everything your sitter needs to know — feeding times, door codes, plant care, house rules, and more. We'll organize it into a beautiful PDF.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/create">
                <Button size="lg" className="text-base px-8 py-6 rounded-xl shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all">
                  <PawPrint className="w-5 h-5 mr-2" />
                  Create Your Sheet
                </Button>
              </Link>
              <Link to="/example">
                <Button size="lg" variant="outline" className="text-base px-8 py-6 rounded-xl">
                  <Eye className="w-5 h-5 mr-2" />
                  See an Example
                </Button>
              </Link>
              <Button size="lg" variant="ghost" onClick={handleLogin} className="text-base px-8 py-6 rounded-xl">
                <LogIn className="w-5 h-5 mr-2" />
                Log In / Sign Up
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Features */}
      <div className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="font-heading text-2xl md:text-3xl font-semibold text-center mb-12">
          How It Works
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i, duration: 0.5 }}
              className="bg-card rounded-2xl p-6 border border-border/60 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <f.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-heading text-lg font-semibold mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="text-center py-10 text-sm text-muted-foreground border-t border-border/50">
        Made with love for pet & home owners everywhere 🐾
      </div>
    </div>
  );
}