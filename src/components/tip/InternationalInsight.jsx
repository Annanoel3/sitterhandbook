import React, { useState, useEffect, useRef } from "react";
import { base44 } from "@/api/base44Client";
import { Globe, Loader2, ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function InternationalInsight({ country, onReadyToCalculate }) {
  const [insight, setInsight] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const lastCountry = useRef("");

  // Reset dismissed state when country changes
  useEffect(() => {
    setDismissed(false);
  }, [country]);

  useEffect(() => {
    const trimmed = country.trim();
    if (!trimmed || trimmed.toLowerCase() === lastCountry.current.toLowerCase()) return;

    const timer = setTimeout(async () => {
      lastCountry.current = trimmed.toLowerCase();
      setLoading(true);
      setInsight(null);
      setDismissed(false);
      const res = await base44.integrations.Core.InvokeLLM({
        prompt: `The user is in ${trimmed}. In 2–4 sentences, explain:
1. Whether tipping is customary, optional, or considered rude/offensive in ${trimmed}.
2. The cultural philosophy behind it — why does tipping work (or not work) that way there? Be warm, curious, and illuminating, not preachy. If tipping is rare or discouraged, celebrate the dignity of that system. If it's common, give the local norms (typical %, cash vs. card, etc.).
Keep it conversational and insightful. No bullet points — flowing prose only.`,
        response_json_schema: {
          type: "object",
          properties: {
            headline: { type: "string" },
            body: { type: "string" },
            tip_norm: { type: "string", enum: ["none", "optional", "expected"] },
          },
        },
      });
      setInsight(res);
      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [country]);

  if (!country.trim()) return null;

  const bgColor = insight
    ? insight.tip_norm === "none"
      ? "bg-emerald-50 border-emerald-200 dark:bg-emerald-950/30 dark:border-emerald-800"
      : insight.tip_norm === "optional"
      ? "bg-amber-50 border-amber-200 dark:bg-amber-950/30 dark:border-amber-800"
      : "bg-blue-50 border-blue-200 dark:bg-blue-950/30 dark:border-blue-800"
    : "bg-secondary border-border";

  const canCalculate = insight && (insight.tip_norm === "optional" || insight.tip_norm === "expected");

  const handleDismiss = () => {
    setDismissed(true);
    if (onReadyToCalculate) onReadyToCalculate();
  };

  // When dismissed, show a compact summary chip
  if (dismissed && insight) {
    return (
      <div
        className={`rounded-xl border px-4 py-3 flex items-center justify-between gap-3 mb-6 ${bgColor} transition-colors duration-500`}
      >
        <div className="flex items-center gap-2 text-sm">
          <Globe className="w-4 h-4 shrink-0 text-muted-foreground" />
          <span className="font-medium">{insight.headline}</span>
          {insight.tip_norm === "optional" && (
            <span className="text-xs bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200 rounded-full px-2 py-0.5">Optional</span>
          )}
          {insight.tip_norm === "expected" && (
            <span className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full px-2 py-0.5">Expected</span>
          )}
        </div>
        <button
          onClick={() => setDismissed(false)}
          className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 shrink-0"
        >
          <ChevronDown className="w-3.5 h-3.5" /> More
        </button>
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={country}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.35 }}
        className={`rounded-2xl border p-6 mb-6 ${bgColor} transition-colors duration-500`}
      >
        {loading ? (
          <div className="flex items-center gap-3 text-muted-foreground">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm">Looking up tipping culture for {country.trim()}…</span>
          </div>
        ) : insight ? (
          <div>
            <div className="flex items-start gap-3">
              <Globe className="w-5 h-5 mt-0.5 shrink-0 text-muted-foreground" />
              <div className="flex-1">
                <div className="font-serif text-xl leading-snug mb-2">{insight.headline}</div>
                <p className="text-sm text-muted-foreground leading-relaxed">{insight.body}</p>
                <div className="mt-3 flex items-center justify-between flex-wrap gap-3">
                  <div>
                    {insight.tip_norm === "none" && (
                      <span className="inline-block text-xs bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200 rounded-full px-3 py-1 font-medium">
                        Tipping not customary
                      </span>
                    )}
                    {insight.tip_norm === "optional" && (
                      <span className="inline-block text-xs bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200 rounded-full px-3 py-1 font-medium">
                        Tipping optional
                      </span>
                    )}
                    {insight.tip_norm === "expected" && (
                      <span className="inline-block text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full px-3 py-1 font-medium">
                        Tipping expected
                      </span>
                    )}
                  </div>
                  {canCalculate && (
                    <button
                      onClick={handleDismiss}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-foreground text-background text-sm font-medium hover:opacity-90 transition"
                    >
                      Calculate my tip <ChevronUp className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </motion.div>
    </AnimatePresence>
  );
}