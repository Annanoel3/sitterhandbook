import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Loader2, Download, ArrowLeft, Phone, Home, PawPrint, UtensilsCrossed, Pill, Footprints, Heart, Flower2, Fish, Bird, Trash2, AlertTriangle, StickyNote } from 'lucide-react';
import { motion } from 'framer-motion';
import CategorySection from '../components/review/CategorySection';

const categoryConfig = {
  owner_contact: { icon: Phone, title: 'Owner Contact Info', color: 'bg-primary/10 text-primary' },
  house_access: { icon: Home, title: 'House Access & Entry', color: 'bg-accent/20 text-accent-foreground' },
  pets_overview: { icon: PawPrint, title: 'Meet the Pets', color: 'bg-primary/10 text-primary' },
  feeding_schedule: { icon: UtensilsCrossed, title: 'Feeding Schedule', color: 'bg-secondary text-secondary-foreground' },
  medications: { icon: Pill, title: 'Medications', color: 'bg-destructive/10 text-destructive' },
  walking_exercise: { icon: Footprints, title: 'Walking & Exercise', color: 'bg-primary/10 text-primary' },
  pet_quirks: { icon: Heart, title: 'Pet Quirks & Personality', color: 'bg-accent/20 text-accent-foreground' },
  plants_garden: { icon: Flower2, title: 'Plants & Garden', color: 'bg-primary/15 text-primary' },
  fish_aquarium: { icon: Fish, title: 'Fish & Aquarium', color: 'bg-primary/10 text-primary' },
  other_pets: { icon: Bird, title: 'Other Pets', color: 'bg-secondary text-secondary-foreground' },
  house_rules: { icon: Trash2, title: 'House Rules & Schedules', color: 'bg-muted text-muted-foreground' },
  emergency_info: { icon: AlertTriangle, title: 'Emergency Information', color: 'bg-destructive/10 text-destructive' },
  additional_notes: { icon: StickyNote, title: 'Additional Notes', color: 'bg-accent/20 text-accent-foreground' },
};

export default function ReviewSheet() {
  const [sheet, setSheet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  const urlParams = new URLSearchParams(window.location.search);
  const sheetId = urlParams.get('id');

  useEffect(() => {
    if (!sheetId) return;
    loadSheet();
  }, [sheetId]);

  const loadSheet = async () => {
    const sheets = await base44.entities.InstructionSheet.filter({ id: sheetId });
    if (sheets.length > 0) {
      setSheet(sheets[0]);
    }
    setLoading(false);
  };

  const updateCategory = async (key, value) => {
    const updatedData = { ...sheet.organized_data, [key]: value };
    await base44.entities.InstructionSheet.update(sheet.id, { organized_data: updatedData });
    setSheet(prev => ({ ...prev, organized_data: updatedData }));
  };

  const handleDownloadPDF = async () => {
    setGenerating(true);
    
    const photoSection = sheet.photo_urls?.length
      ? `\n\nPHOTOS INCLUDED:\n${sheet.photo_urls.map((url, i) => `- ${sheet.photo_labels?.[i] || `Photo ${i+1}`}: ${url}`).join('\n')}`
      : '';

    let sectionsText = '';
    const data = sheet.organized_data;
    const orderedKeys = Object.keys(categoryConfig);
    
    for (const key of orderedKeys) {
      if (data[key]) {
        const config = categoryConfig[key];
        sectionsText += `\n\n## ${config.title}\n${data[key]}`;
      }
    }

    const pdfPrompt = `Create a beautifully formatted pet sitter instruction sheet in clean markdown. 
Title: "${sheet.title}"

Content sections:
${sectionsText}
${photoSection}

Format it as a clean, well-organized document with clear headings, bullet points, and spacing. Make it professional but warm and friendly. Add a small note at the top that says "Prepared with love for our pet sitter 🐾" and the date. Include all the information provided - do not skip anything.`;

    const markdown = await base44.integrations.Core.InvokeLLM({ prompt: pdfPrompt });

    // Generate PDF using jspdf
    const { jsPDF } = await import('jspdf');
    const doc = new jsPDF({ unit: 'mm', format: 'a4' });
    
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    const maxWidth = pageWidth - margin * 2;
    let y = 20;

    const addText = (text, fontSize, isBold, color) => {
      doc.setFontSize(fontSize);
      doc.setFont('helvetica', isBold ? 'bold' : 'normal');
      if (color) doc.setTextColor(color[0], color[1], color[2]);
      else doc.setTextColor(40, 40, 40);
      
      const lines = doc.splitTextToSize(text, maxWidth);
      for (const line of lines) {
        if (y > 275) {
          doc.addPage();
          y = 20;
        }
        doc.text(line, margin, y);
        y += fontSize * 0.45;
      }
    };

    const addSpacing = (amount) => { y += amount; };

    // Title
    addText(sheet.title || 'Pet Sitter Instructions', 22, true, [46, 125, 87]);
    addSpacing(3);
    addText(`Prepared with love for our pet sitter 🐾  •  ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`, 9, false, [120, 120, 120]);
    addSpacing(2);
    
    // Line
    doc.setDrawColor(200, 200, 200);
    doc.line(margin, y, pageWidth - margin, y);
    addSpacing(6);

    // Sections
    for (const key of orderedKeys) {
      if (data[key]) {
        const config = categoryConfig[key];
        addText(config.title.toUpperCase(), 11, true, [46, 125, 87]);
        addSpacing(2);
        
        const contentLines = data[key].split('\n');
        for (const line of contentLines) {
          if (line.trim()) {
            addText(line.trim(), 10, false);
            addSpacing(1);
          }
        }
        addSpacing(4);
      }
    }

    // Photo references
    if (sheet.photo_urls?.length) {
      addText('PHOTOS REFERENCE', 11, true, [46, 125, 87]);
      addSpacing(2);
      sheet.photo_urls.forEach((url, i) => {
        const label = sheet.photo_labels?.[i] || `Photo ${i + 1}`;
        addText(`• ${label}`, 10, false);
        addSpacing(1);
      });
    }

    doc.save(`${(sheet.title || 'pet-sitter-instructions').replace(/\s+/g, '-').toLowerCase()}.pdf`);
    setGenerating(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!sheet) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">Sheet not found</p>
        <Link to="/create">
          <Button variant="outline">Create a new sheet</Button>
        </Link>
      </div>
    );
  }

  const data = sheet.organized_data || {};

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-6 py-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link to="/create" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to editor
          </Link>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="font-heading text-3xl font-bold">{sheet.title}</h1>
              <p className="text-muted-foreground mt-1">Review and edit, then download your PDF</p>
            </div>
            <Button
              size="lg"
              onClick={handleDownloadPDF}
              disabled={generating}
              className="rounded-xl shadow-lg shadow-primary/20 shrink-0"
            >
              {generating ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Download className="w-4 h-4 mr-2" />
              )}
              Download PDF
            </Button>
          </div>
        </motion.div>

        {/* Photos */}
        {sheet.photo_urls?.length > 0 && (
          <div className="mb-8">
            <h3 className="font-heading text-lg font-semibold mb-3">📸 Photos</h3>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
              {sheet.photo_urls.map((url, i) => (
                <div key={url} className="aspect-square rounded-xl overflow-hidden border border-border">
                  <img src={url} alt={sheet.photo_labels?.[i] || `Photo ${i+1}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Organized Sections */}
        <div className="space-y-4">
          {Object.keys(categoryConfig).map((key, i) => {
            const config = categoryConfig[key];
            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <CategorySection
                  icon={config.icon}
                  title={config.title}
                  color={config.color}
                  content={data[key]}
                  onUpdate={(val) => updateCategory(key, val)}
                />
              </motion.div>
            );
          })}
        </div>

        {/* Bottom actions */}
        <div className="mt-10 pb-12 flex flex-col sm:flex-row gap-4">
          <Button
            size="lg"
            onClick={handleDownloadPDF}
            disabled={generating}
            className="flex-1 rounded-xl py-6 shadow-lg shadow-primary/20"
          >
            {generating ? (
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            ) : (
              <Download className="w-5 h-5 mr-2" />
            )}
            Download PDF
          </Button>
          <Link to="/create" className="flex-1">
            <Button size="lg" variant="outline" className="w-full rounded-xl py-6">
              Create Another Sheet
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}