import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Moon, Sun, Shield, MessageSquare, Code2, Mail, Loader2, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { base44 } from '@/api/base44Client';

export default function Settings() {
  const [feedback, setFeedback] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSendFeedback = async () => {
    if (!feedback.trim()) return;
    setSending(true);
    await base44.functions.invoke('sendFeedback', { message: feedback });
    setSent(true);
    setFeedback('');
    setSending(false);
  };

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('pawnotes-dark') === 'true' ||
      window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('pawnotes-dark', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('pawnotes-dark', 'false');
    }
  }, [darkMode]);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-6 py-10">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-heading text-3xl font-bold mb-8">Settings</h1>

          {/* Appearance */}
          <Card className="border-border/60 mb-6">
            <CardHeader className="pb-3">
              <CardTitle className="font-heading text-lg flex items-center gap-2">
                {darkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                Appearance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base font-medium">Dark Mode</Label>
                  <p className="text-sm text-muted-foreground mt-0.5">Switch to a dark color theme</p>
                </div>
                <Switch
                  checked={darkMode}
                  onCheckedChange={setDarkMode}
                />
              </div>
            </CardContent>
          </Card>

          {/* Feedback */}
          <Card className="border-border/60 mb-6">
            <CardHeader className="pb-3">
              <CardTitle className="font-heading text-lg flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Send Feedback
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">Have a suggestion, bug report, or just want to say hi? We'd love to hear from you.</p>
              {sent ? (
                <div className="flex items-center gap-2 text-primary text-sm font-medium">
                  <CheckCircle2 className="w-4 h-4" /> Thanks for your feedback!
                </div>
              ) : (
                <>
                  <Textarea
                    placeholder="Tell us what you think..."
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    className="min-h-[100px] rounded-xl resize-none"
                  />
                  <div className="flex items-center justify-between gap-4 flex-wrap">
                    <Button onClick={handleSendFeedback} disabled={!feedback.trim() || sending} className="rounded-xl">
                      {sending ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Sending...</> : <><Mail className="w-4 h-4 mr-2" />Send Feedback</>}
                    </Button>
                    <a
                      href="mailto:mediocreatbestdev@outlook.com"
                      className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1.5 transition-colors"
                    >
                      <Mail className="w-4 h-4" />
                      mediocreatbestdev@outlook.com
                    </a>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* About */}
          <Card className="border-border/60 mb-6">
            <CardHeader className="pb-3">
              <CardTitle className="font-heading text-lg flex items-center gap-2">
                <Code2 className="w-5 h-5" />
                About
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-2">
              <p>SitterHandbook was created by <span className="font-semibold text-foreground">MediocreAtBestDev</span>.</p>
              <p>All intellectual property, including the design, code, and brand, is owned by <span className="font-semibold text-foreground">MediocreAtBestDev</span>. All rights reserved.</p>
            </CardContent>
          </Card>

          {/* Privacy Policy */}
          <Card className="border-border/60">
            <CardHeader className="pb-3">
              <CardTitle className="font-heading text-lg flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Privacy Policy
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none text-muted-foreground space-y-4">
              <p className="font-medium text-foreground">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

              <div>
                <h3 className="font-heading text-base font-semibold text-foreground mb-1">What We Collect</h3>
                <p>SitterHandbook collects information you voluntarily provide, including pet care instructions, contact details, and uploaded photos. This information is stored securely and used only to generate your instruction sheets.</p>
              </div>

              <div>
                <h3 className="font-heading text-base font-semibold text-foreground mb-1">How We Use Your Data</h3>
                <p>Your data is used exclusively to organize your pet sitting instructions and generate PDFs. We do not sell, share, or use your personal information for advertising or marketing purposes.</p>
              </div>

              <div>
                <h3 className="font-heading text-base font-semibold text-foreground mb-1">AI Processing</h3>
                <p>Your typed or spoken notes are processed by an AI model to organize them into a clear instruction sheet. These notes are not stored by the AI provider beyond the immediate processing request.</p>
              </div>

              <div>
                <h3 className="font-heading text-base font-semibold text-foreground mb-1">Photo Storage</h3>
                <p>Photos you upload are stored securely in our cloud storage. You can delete your sheets and associated photos at any time from the My Sheets page.</p>
              </div>

              <div>
                <h3 className="font-heading text-base font-semibold text-foreground mb-1">Data Security</h3>
                <p>We use industry-standard encryption and security practices to protect your data. Access is limited to your account only.</p>
              </div>

              <div>
                <h3 className="font-heading text-base font-semibold text-foreground mb-1">Your Rights</h3>
                <p>You may delete your instruction sheets at any time. If you have any privacy concerns or requests, please contact us through the app.</p>
              </div>

              <div>
                <h3 className="font-heading text-base font-semibold text-foreground mb-1">Contact</h3>
                <p>For any privacy-related questions, please use the feedback option within the app.</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}