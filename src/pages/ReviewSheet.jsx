import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Download, ArrowLeft, Phone, Home, PawPrint, UtensilsCrossed, Pill, Footprints, Heart, Flower2, Fish, Bird, Trash2, AlertTriangle, StickyNote, User, UserCheck, DollarSign, Lock } from 'lucide-react';
import { motion } from 'framer-motion';
import AiChecklist from '../components/review/AiChecklist';
import DraggableSections from '../components/review/DraggableSections';
import AiEditor from '../components/review/AiEditor';
import PhotoCaptionEditor from '../components/review/PhotoCaptionEditor';
import AddSectionButton from '../components/review/AddSectionButton';

export const categoryConfig = {
  owner_contact: { icon: Phone, title: 'Owner Contact Info', color: 'bg-primary/10 text-primary' },
  house_access: { icon: Home, title: 'House Access & Entry', color: 'bg-accent/20 text-accent-foreground' },
  pets_overview: { icon: PawPrint, title: 'Meet the Pets', color: 'bg-primary/10 text-primary' },
  feeding_schedule: { icon: UtensilsCrossed, title: 'Feeding Schedule', color: 'bg-secondary text-secondary-foreground' },
  medications: { icon: Pill, title: 'Medications', color: 'bg-destructive/10 text-destructive' },
  walking_exercise: { icon: Footprints, title: 'Walking & Exercise', color: 'bg-primary/10 text-primary' },
  pet_quirks: { icon: Heart, title: 'Pet Quirks & Personality', color: 'bg-accent/20 text-accent-foreground' },
  plants_garden: { icon: Flower2, title: 'Plants & Garden', color: 'bg-primary/10 text-primary' },
  fish_aquarium: { icon: Fish, title: 'Fish & Aquarium', color: 'bg-primary/10 text-primary' },
  other_pets: { icon: Bird, title: 'Other Pets', color: 'bg-secondary text-secondary-foreground' },
  house_rules: { icon: Trash2, title: 'House Rules & Schedules', color: 'bg-muted text-muted-foreground' },
  emergency_info: { icon: AlertTriangle, title: 'Emergency Information', color: 'bg-destructive/10 text-destructive' },
  additional_notes: { icon: StickyNote, title: 'Additional Notes', color: 'bg-accent/20 text-accent-foreground' },
};

const SECTION_KEYS = Object.keys(categoryConfig);

function flattenOrganizedData(raw) {
  if (!raw) return {};
  let resolved = raw;
  if (raw.response !== undefined) {
    resolved = raw.response;
    if (typeof resolved === 'string') {
      try { resolved = JSON.parse(resolved); } catch { resolved = {}; }
    }
  }
  return {
    ...resolved,
    _owner: raw._owner || resolved._owner,
    _sitter: raw._sitter || resolved._sitter,
    _pay: raw._pay || resolved._pay,
  };
}

export default function ReviewSheet() {
  const [sheet, setSheet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [sectionOrder, setSectionOrder] = useState(SECTION_KEYS);
  const [newKey, setNewKey] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // data is the canonical flat organized_data we show and edit
  const [data, setData] = useState({});

  const urlParams = new URLSearchParams(window.location.search);
  const sheetId = urlParams.get('id');

  useEffect(() => {
    base44.auth.isAuthenticated().then(setIsLoggedIn);
  }, []);

  useEffect(() => {
    if (!sheetId) return;
    loadSheet();
  }, [sheetId]);

  const loadSheet = async () => {
    // Try session storage first (guest sheets and freshly created sheets)
    const cached = sessionStorage.getItem(`guest_sheet_${sheetId}`);
    if (cached) {
      const parsed = JSON.parse(cached);
      setSheet(parsed);
      setData(flattenOrganizedData(parsed.organized_data));
      setLoading(false);
      return;
    }
    // Fallback: fetch from DB (logged-in users loading old sheets)
    const isAuthed = await base44.auth.isAuthenticated();
    if (isAuthed) {
      const results = await base44.entities.InstructionSheet.list();
      const found = results.find(s => s.id === sheetId);
      if (found) {
        setSheet(found);
        setData(flattenOrganizedData(found.organized_data));
      }
    }
    setLoading(false);
  };

  const updateCategory = async (key, value) => {
    const updatedData = { ...data, [key]: value };
    setData(updatedData);
    if (sheetId && !sheetId.startsWith('guest-')) {
      await base44.entities.InstructionSheet.update(sheetId, { organized_data: updatedData });
    }
  };

  const loadImageAsDataUrl = (url) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL('image/jpeg', 0.85));
      };
      img.onerror = () => resolve(null);
      img.src = url;
    });
  };

  const handleDownloadPDF = async () => {
    setGenerating(true);

    const { jsPDF } = await import('jspdf');
    const doc = new jsPDF({ unit: 'mm', format: 'a4' });

    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 18;
    const maxWidth = pageWidth - margin * 2;
    let y = 15;

    const checkPage = (needed = 10) => {
      if (y + needed > 280) { doc.addPage(); y = 15; }
    };

    const addText = (txt, fontSize, isBold, color, xOverride) => {
      doc.setFontSize(fontSize);
      doc.setFont('helvetica', isBold ? 'bold' : 'normal');
      doc.setTextColor(...(color || [40, 40, 40]));
      const lines = doc.splitTextToSize(String(txt), maxWidth);
      lines.forEach(line => {
        checkPage(fontSize * 0.45 + 1);
        doc.text(line, xOverride !== undefined ? xOverride : margin, y);
        y += fontSize * 0.42;
      });
    };

    const addSpacing = (n) => { y += n; };

    const owner = data._owner || {};
    const sitter = data._sitter || {};
    const pay = data._pay || '';

    // ── HEADER BANNER ──
    doc.setFillColor(46, 125, 87);
    doc.rect(0, 0, pageWidth, 38, 'F');

    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    doc.text('HOME OWNER', margin, 10);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    if (owner.name) doc.text(owner.name, margin, 16);
    if (owner.phone) doc.text(owner.phone, margin, 22);
    if (owner.email) doc.text(owner.email, margin, 28);

    const rightX = pageWidth - margin;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(255, 255, 255);
    doc.text('PET SITTER', rightX, 10, { align: 'right' });
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    if (sitter.name) doc.text(sitter.name, rightX, 16, { align: 'right' });
    if (sitter.phone) doc.text(sitter.phone, rightX, 22, { align: 'right' });

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(255, 255, 255);
    doc.text(sheet.title || 'Pet Sitter Instructions', pageWidth / 2, 18, { align: 'center' });
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(200, 240, 220);
    doc.text(`Prepared with love  •  ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`, pageWidth / 2, 26, { align: 'center' });

    // "Made with SitterHandbook" watermark line beneath header
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(180, 220, 200);
    doc.textWithLink('Made with SitterHandbook • sitterhandbook.com', pageWidth / 2, 36, { align: 'center', url: 'https://sitterhandbook.com' });

    if (pay) {
      doc.setFillColor(255, 255, 255);
      doc.roundedRect(pageWidth / 2 - 28, 30, 56, 7, 2, 2, 'F');
      doc.setFontSize(8);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(46, 125, 87);
      doc.text(`Agreed Rate: ${pay}`, pageWidth / 2, 35, { align: 'center' });
    }

    y = 46;

    // ── SECTIONS ──
    for (const key of sectionOrder) {
      if (data[key] && typeof data[key] === 'string') {
        checkPage(18);
        const config = categoryConfig[key];
        doc.setFillColor(240, 250, 244);
        doc.roundedRect(margin - 3, y - 4, maxWidth + 6, 9, 1.5, 1.5, 'F');
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(46, 125, 87);
        doc.text(config.title.toUpperCase(), margin, y + 2);
        y += 8;

        const contentLines = data[key].split('\n');
        for (const line of contentLines) {
          const trimmed = line.trim();
          if (trimmed) {
            checkPage(7);
            addText(trimmed, 10, false, [50, 50, 50]);
            addSpacing(1);
          }
        }
        addSpacing(5);
      }
    }

    // ── PHOTOS ──
    if (sheet.photo_urls?.length) {
      checkPage(18);
      doc.setFillColor(240, 250, 244);
      doc.roundedRect(margin - 3, y - 4, maxWidth + 6, 9, 1.5, 1.5, 'F');
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(46, 125, 87);
      doc.text('PHOTO REFERENCE GUIDE', margin, y + 2);
      y += 10;

      for (let i = 0; i < sheet.photo_urls.length; i++) {
        const url = sheet.photo_urls[i];
        const label = sheet.photo_labels?.[i] || `Photo ${i + 1}`;
        const caption = sheet.photo_captions?.[i] || '';

        const maxImgWidth = 60;
        const maxImgHeight = 50;

        const dataUrl = await loadImageAsDataUrl(url);
        if (dataUrl) {
          // Create a temp image to get natural dimensions for aspect ratio
          const tempImg = new Image();
          await new Promise(resolve => { tempImg.src = dataUrl; tempImg.onload = resolve; });
          const ratio = tempImg.naturalWidth / tempImg.naturalHeight;
          let imgWidth = maxImgWidth;
          let imgHeight = imgWidth / ratio;
          if (imgHeight > maxImgHeight) {
            imgHeight = maxImgHeight;
            imgWidth = imgHeight * ratio;
          }

          checkPage(imgHeight + 18);
          doc.addImage(dataUrl, 'JPEG', margin, y, imgWidth, imgHeight);
          const textX = margin + imgWidth + 5;
          const textMaxW = maxWidth - imgWidth - 5;
          doc.setFontSize(10);
          doc.setFont('helvetica', 'bold');
          doc.setTextColor(40, 40, 40);
          doc.text(label, textX, y + 8);
          if (caption) {
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(9);
            doc.setTextColor(90, 90, 90);
            const capLines = doc.splitTextToSize(caption, textMaxW);
            capLines.forEach((line, li) => doc.text(line, textX, y + 16 + li * 5));
          }
          y += Math.max(imgHeight, 20) + 6;
        } else {
          addText(`• ${label}`, 10, true, [50, 50, 50]);
          if (caption) addText(`  ${caption}`, 9, false, [90, 90, 90]);
        }
        addSpacing(3);
      }
    }

    const fileName = `${(sheet.title || 'pet-sitter-instructions').replace(/\s+/g, '-').toLowerCase()}.pdf`;
    doc.save(fileName);
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
        <Link to="/create"><Button variant="outline">Create a new sheet</Button></Link>
      </div>
    );
  }

  const owner = data._owner || {};
  const sitter = data._sitter || {};
  const pay = data._pay || '';

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-6 py-10">
        {/* Locked banner */}
        {!isLoggedIn && (
          <div className="sticky top-0 z-40 -mx-6 px-6 py-3 bg-primary text-primary-foreground flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Lock className="w-4 h-4 shrink-0" />
              <span>Sign in to unlock the full preview, edit sections, and download your PDF.</span>
            </div>
            <Button
              size="sm"
              variant="secondary"
              className="rounded-lg shrink-0 font-semibold"
              onClick={() => base44.auth.redirectToLogin(window.location.href)}
            >
              Sign in to unlock
            </Button>
          </div>
        )}

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8 mt-6">
          <Link to="/create" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to editor
          </Link>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="font-heading text-3xl font-bold">{sheet.title}</h1>
              <p className="text-muted-foreground mt-1">
                {isLoggedIn ? 'Review and edit each section, then download your PDF' : 'Sign in to edit sections and download your PDF'}
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              {isLoggedIn && <AiEditor sheetId={sheetId} data={data} onUpdated={setData} />}
              <Button
                size="lg"
                onClick={isLoggedIn ? handleDownloadPDF : () => base44.auth.redirectToLogin(window.location.href)}
                disabled={generating}
                className="rounded-xl shadow-lg shadow-primary/20"
              >
                {generating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : isLoggedIn ? <Download className="w-4 h-4 mr-2" /> : <Lock className="w-4 h-4 mr-2" />}
                {isLoggedIn ? 'Download PDF' : 'Sign in to Download'}
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Owner / Sitter / Pay summary bar */}
        <Card className="mb-8 border-primary/20 bg-primary/5 overflow-hidden">
          <CardContent className="p-0">
            <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-border/50">
              <div className="p-4 flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <User className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-primary uppercase tracking-wide mb-0.5">Home Owner</p>
                  <p className="text-sm font-medium">{owner.name || '—'}</p>
                  {owner.phone && <p className="text-xs text-muted-foreground">{owner.phone}</p>}
                  {owner.email && <p className="text-xs text-muted-foreground">{owner.email}</p>}
                </div>
              </div>
              <div className="p-4 flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center shrink-0">
                  <UserCheck className="w-4 h-4 text-accent-foreground" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-accent-foreground uppercase tracking-wide mb-0.5">Pet Sitter</p>
                  <p className="text-sm font-medium">{sitter.name || '—'}</p>
                  {sitter.phone && <p className="text-xs text-muted-foreground">{sitter.phone}</p>}
                </div>
              </div>
              <div className="p-4 flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                  <DollarSign className="w-4 h-4 text-secondary-foreground" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide mb-0.5 text-secondary-foreground">Agreed Rate</p>
                  <p className="text-sm font-medium">{pay || '—'}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* AI Completeness Checker */}
        {isLoggedIn && <AiChecklist organizedData={data} rawText={sheet.raw_text} />}

        {/* Organized Sections — draggable + editable */}
        {isLoggedIn && (
          <p className="text-xs text-muted-foreground mb-3 flex items-center gap-1.5">
            <span>⠿</span> Drag sections to reorder how they appear in the PDF
          </p>
        )}
        <DraggableSections
          orderedKeys={sectionOrder}
          categoryConfig={categoryConfig}
          data={data}
          onUpdate={updateCategory}
          onReorder={setSectionOrder}
          newKey={newKey}
          locked={!isLoggedIn}
        />
        {isLoggedIn && (
          <AddSectionButton
            categoryConfig={categoryConfig}
            data={data}
            onAdd={(key) => {
              if (!sectionOrder.includes(key)) setSectionOrder(prev => [...prev, key]);
              setNewKey(key);
              updateCategory(key, ' ');
            }}
          />
        )}

        {/* Photos */}
        {sheet.photo_urls?.length > 0 && (
          <PhotoCaptionEditor sheet={sheet} setSheet={setSheet} sheetId={sheetId} />
        )}

        {/* Bottom actions */}
        <div className="mt-10 pb-12 flex flex-col sm:flex-row gap-4">
          {isLoggedIn ? (
            <Button size="lg" onClick={handleDownloadPDF} disabled={generating} className="flex-1 rounded-xl py-6 shadow-lg shadow-primary/20">
              {generating ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Download className="w-5 h-5 mr-2" />}
              Download PDF
            </Button>
          ) : (
            <Button size="lg" onClick={() => base44.auth.redirectToLogin(window.location.href)} className="flex-1 rounded-xl py-6 shadow-lg shadow-primary/20">
              <Lock className="w-5 h-5 mr-2" />
              Sign in to Download PDF
            </Button>
          )}
          <Link to="/create" className="flex-1">
            <Button size="lg" variant="outline" className="w-full rounded-xl py-6">Create Another Sheet</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}