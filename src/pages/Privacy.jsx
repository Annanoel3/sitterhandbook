import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, ArrowLeft } from 'lucide-react';

export default function Privacy() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-6 py-10">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <Link to="/settings" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Settings
          </Link>

          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Shield className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="font-heading text-3xl font-bold">Legal</h1>
              <p className="text-sm text-muted-foreground">Privacy Policy, Terms & Intellectual Property</p>
            </div>
          </div>

          <div className="prose prose-sm max-w-none text-muted-foreground space-y-10">

            {/* Privacy Policy */}
            <section>
              <h2 className="font-heading text-xl font-bold text-foreground mb-1">Privacy Policy</h2>
              <p className="text-xs text-muted-foreground mb-4">Last updated: May 11, 2025</p>

              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-foreground mb-1">What We Collect</h3>
                  <p>SitterHandbook collects information you voluntarily provide, including pet care instructions, contact details, and uploaded photos. This information is stored securely and used only to generate your instruction sheets.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">How We Use Your Data</h3>
                  <p>Your data is used exclusively to organize your pet sitting instructions and generate PDFs. We do not sell, share, or use your personal information for advertising or marketing purposes.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">AI Processing</h3>
                  <p>Your typed or spoken notes are processed by an AI model to organize them into a clear instruction sheet. These notes are not stored by the AI provider beyond the immediate processing request.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Photo Storage</h3>
                  <p>Photos you upload are stored securely in our cloud storage. You can delete your sheets and associated photos at any time from the My Sheets page.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Data Security</h3>
                  <p>We use industry-standard encryption and security practices to protect your data. Access is limited to your account only.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Your Rights</h3>
                  <p>You may delete your instruction sheets at any time. If you have any privacy concerns or requests, please contact us through the app.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Contact</h3>
                  <p>For any privacy-related questions, please use the feedback option within the app or email us at <a href="mailto:mediocreatbestdev@outlook.com" className="text-primary hover:underline">mediocreatbestdev@outlook.com</a>.</p>
                </div>
              </div>
            </section>

            <hr className="border-border" />

            {/* Terms & Conditions */}
            <section>
              <h2 className="font-heading text-xl font-bold text-foreground mb-1">Terms & Conditions</h2>
              <p className="text-xs text-muted-foreground mb-4">Last updated: May 11, 2025</p>

              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Acceptance of Terms</h3>
                  <p>By accessing or using SitterHandbook, you agree to be bound by these Terms & Conditions. If you do not agree, please do not use the service.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Use of the Service</h3>
                  <p>SitterHandbook is provided for personal, non-commercial use to help pet owners create instruction sheets for their pet sitters. You agree not to misuse the service, attempt to reverse-engineer it, or use it for any unlawful purpose.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">User Content</h3>
                  <p>You retain ownership of all content you submit. By submitting content, you grant SitterHandbook a limited license to process and store it solely for the purpose of providing the service to you.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Accuracy of Information</h3>
                  <p>AI-generated content may contain errors or omissions. You are responsible for reviewing all generated instruction sheets before sharing them with your pet sitter. SitterHandbook is not liable for any consequences arising from inaccurate or incomplete instructions.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Limitation of Liability</h3>
                  <p>SitterHandbook is provided "as is" without warranties of any kind. We are not liable for any damages, direct or indirect, arising from your use of the service, including but not limited to pet care outcomes.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Changes to Terms</h3>
                  <p>We reserve the right to update these Terms at any time. Continued use of the service after changes constitutes acceptance of the updated Terms.</p>
                </div>
              </div>
            </section>

            <hr className="border-border" />

            {/* Intellectual Property */}
            <section>
              <h2 className="font-heading text-xl font-bold text-foreground mb-1">Intellectual Property</h2>
              <p className="text-xs text-muted-foreground mb-4">Last updated: May 11, 2025</p>

              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Ownership</h3>
                  <p>SitterHandbook and all of its content, features, design, code, branding, and functionality are owned by <span className="font-semibold text-foreground">MediocreAtBestDev</span>. All rights reserved.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Copyright</h3>
                  <p>© {new Date().getFullYear()} MediocreAtBestDev. Unauthorized reproduction, distribution, or modification of any part of this application is strictly prohibited without prior written permission.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Trademarks</h3>
                  <p>The name "SitterHandbook" and associated logos are trademarks of MediocreAtBestDev. You may not use these marks without express written permission.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Third-Party Services</h3>
                  <p>SitterHandbook integrates third-party services including AI providers and cloud storage. Their respective intellectual property remains the property of their respective owners.</p>
                </div>
              </div>
            </section>

          </div>
        </motion.div>
      </div>
    </div>
  );
}