import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Trash2, Mail, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

export default function DataPrivacy() {
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
                <CardTitle className="text-base flex items-center gap-2">
                  <Mail className="w-4 h-4 text-primary" />
                  Delete Specific Data
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Request deletion of specific data — such as your household info, instruction sheets, or uploaded photos — while keeping your account active.
                </p>
                <p className="text-xs text-muted-foreground bg-muted rounded-lg px-3 py-2">
                  Examples: "Please delete all my instruction sheets" or "Please delete my household info and photos."
                </p>
                <a
                  href="mailto:mediocreatbestdev@outlook.com?subject=Data%20Deletion%20Request&body=Hi%2C%20I%20would%20like%20to%20request%20deletion%20of%20the%20following%20data%20from%20my%20SitterHandbook%20account%3A%0A%0A(Please%20describe%20what%20you%27d%20like%20deleted)%0A%0AMy%20account%20email%3A%20"
                  className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                >
                  <Mail className="w-4 h-4" /> Send data deletion request
                </a>
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
                  Request permanent deletion of your account and <strong>all</strong> associated data, including instruction sheets, household info, photos, and trips. This cannot be undone.
                </p>
                <a
                  href="mailto:mediocreatbestdev@outlook.com?subject=Account%20Deletion%20Request&body=Hi%2C%20I%20would%20like%20to%20permanently%20delete%20my%20SitterHandbook%20account%20and%20all%20associated%20data.%0A%0AMy%20account%20email%3A%20"
                  className="inline-flex items-center gap-2 text-sm font-medium text-destructive hover:underline"
                >
                  <Trash2 className="w-4 h-4" /> Send account deletion request
                </a>
              </CardContent>
            </Card>

            <p className="text-xs text-muted-foreground pt-2">
              Need help? You can also reach us directly at{' '}
              <a href="mailto:mediocreatbestdev@outlook.com" className="underline hover:text-foreground">
                mediocreatbestdev@outlook.com
              </a>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}