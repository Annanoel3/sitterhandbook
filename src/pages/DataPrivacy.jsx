import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Trash2, Shield, Loader2, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { base44 } from '@/api/base44Client';

export default function DataPrivacy() {
  const [dataRequest, setDataRequest] = useState('');
  const [accountRequest, setAccountRequest] = useState('');
  const [sendingData, setSendingData] = useState(false);
  const [sendingAccount, setSendingAccount] = useState(false);
  const [sentData, setSentData] = useState(false);
  const [sentAccount, setSentAccount] = useState(false);

  const handleDataRequest = async () => {
    if (!dataRequest.trim()) return;
    setSendingData(true);
    await base44.functions.invoke('sendFeedback', { message: `[DATA DELETION REQUEST] ${dataRequest}` });
    setSentData(true);
    setDataRequest('');
    setSendingData(false);
  };

  const handleAccountRequest = async () => {
    if (!accountRequest.trim()) return;
    setSendingAccount(true);
    await base44.functions.invoke('sendFeedback', { message: `[ACCOUNT DELETION REQUEST] ${accountRequest}` });
    setSentAccount(true);
    setAccountRequest('');
    setSendingAccount(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-6 py-10">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <Link to="/settings" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Settings
          </Link>

          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="font-heading text-3xl font-bold">Data & Privacy</h1>
              <p className="text-muted-foreground text-sm mt-0.5">Manage your data and deletion requests</p>
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              You have full control over your data. Use the options below to request deletion of specific data or your entire account. All requests are processed within 7 days.
            </p>

            {/* Specific data deletion */}
            <Card className="border-border/60">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Delete Specific Data</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Request deletion of specific data — such as your instruction sheets, household info, or uploaded photos — while keeping your account active.
                </p>
                {sentData ? (
                  <div className="flex items-center gap-2 text-primary text-sm font-medium">
                    <CheckCircle2 className="w-4 h-4" /> Request received! We'll process it within 7 days.
                  </div>
                ) : (
                  <>
                    <Textarea
                      placeholder="Describe what you'd like deleted, e.g. 'Please delete all my instruction sheets and photos.'"
                      value={dataRequest}
                      onChange={(e) => setDataRequest(e.target.value)}
                      className="min-h-[90px] rounded-xl resize-none"
                    />
                    <Button onClick={handleDataRequest} disabled={!dataRequest.trim() || sendingData} className="rounded-xl">
                      {sendingData ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Sending...</> : 'Send Request'}
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Full account deletion */}
            <Card className="border-destructive/30 bg-destructive/5">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2 text-destructive">
                  <Trash2 className="w-4 h-4" />
                  Delete My Account
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Request permanent deletion of your account and <strong>all</strong> associated data. This cannot be undone.
                </p>
                {sentAccount ? (
                  <div className="flex items-center gap-2 text-primary text-sm font-medium">
                    <CheckCircle2 className="w-4 h-4" /> Request received! We'll process it within 7 days.
                  </div>
                ) : (
                  <>
                    <Textarea
                      placeholder="Confirm your request, e.g. 'Please permanently delete my account and all my data.'"
                      value={accountRequest}
                      onChange={(e) => setAccountRequest(e.target.value)}
                      className="min-h-[90px] rounded-xl resize-none"
                    />
                    <Button
                      variant="destructive"
                      onClick={handleAccountRequest}
                      disabled={!accountRequest.trim() || sendingAccount}
                      className="rounded-xl"
                    >
                      {sendingAccount ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Sending...</> : 'Send Deletion Request'}
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
    </div>
  );
}