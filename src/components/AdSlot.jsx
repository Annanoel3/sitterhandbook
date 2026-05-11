import React from "react";

/**
 * AdSlot — a placeholder for ad network scripts (e.g. Google AdSense).
 *
 * To activate real ads:
 * 1. Add your AdSense <script> tag to index.html
 * 2. Replace the inner <ins> tag below with your actual ad unit snippet.
 * 3. Remove the placeholder div.
 *
 * Until then this renders a tasteful placeholder so layout stays stable.
 */
export default function AdSlot({ className = "" }) {
  return (
    <div className={`w-full ${className}`}>
      {/* ── Swap this block for your real ad unit ── */}
      <div className="flex items-center justify-center rounded-xl border border-dashed border-border bg-secondary/40 text-muted-foreground text-xs py-4 px-6 min-h-[90px]">
        Advertisement
      </div>
      {/* ────────────────────────────────────────── */}
    </div>
  );
}