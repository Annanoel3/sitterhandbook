import React, { useState, useMemo, useEffect } from "react";
import { ChevronDown, Search, Check } from "lucide-react";
import { TIP_SCENARIOS, CATEGORIES } from "@/lib/tipScenarios";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams } from "react-router-dom";

export default function SituationSelect({ selected, onSelect, locationAdj = 0 }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();

  // Sync open with URL param
  const openInUrl = searchParams.get("picker") === "situation";

  useEffect(() => {
    if (open && !openInUrl) {
      setSearchParams((p) => { const n = new URLSearchParams(p); n.set("picker", "situation"); return n; }, { replace: true });
    } else if (!open && openInUrl) {
      setSearchParams((p) => { const n = new URLSearchParams(p); n.delete("picker"); return n; }, { replace: true });
    }
  }, [open]);

  // Close when URL param removed (Android back)
  useEffect(() => {
    if (!openInUrl && open) {
      setOpen(false);
    }
  }, [openInUrl]);

  const handleClose = () => {
    setOpen(false);
    setQuery("");
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return TIP_SCENARIOS;
    return TIP_SCENARIOS.filter(
      (s) =>
        s.label.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q)
    );
  }, [query]);

  const grouped = useMemo(() => {
    const map = {};
    filtered.forEach((s) => {
      if (!map[s.category]) map[s.category] = [];
      map[s.category].push(s);
    });
    return map;
  }, [filtered]);

  return (
    <div className="relative">
      <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground font-medium">
        Situation
      </span>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="mt-2 w-full flex items-center justify-between px-4 py-4 bg-card border border-border rounded-xl hover:border-accent/60 focus:outline-none focus:ring-2 focus:ring-accent transition text-left"
      >
        <span className={selected ? "font-serif text-xl" : "text-muted-foreground text-lg"}>
          {selected ? selected.label : "Choose a situation…"}
        </span>
        <ChevronDown
          className={`w-5 h-5 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={handleClose} />
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.15 }}
              className="absolute z-50 left-0 right-0 mt-2 bg-card border border-border rounded-xl shadow-xl overflow-hidden"
            >
              <div className="p-3 border-b border-border sticky top-0 bg-card">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    autoFocus
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search situations…"
                    className="w-full pl-9 pr-3 py-2 bg-secondary rounded-lg focus:outline-none focus:ring-1 focus:ring-accent text-sm"
                  />
                </div>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {CATEGORIES.map((cat) =>
                  grouped[cat] ? (
                    <div key={cat}>
                      <div className="px-4 pt-3 pb-1 text-[10px] uppercase tracking-[0.22em] text-muted-foreground font-semibold">
                        {cat}
                      </div>
                      {grouped[cat].map((s) => (
                        <button
                          key={s.id}
                          onClick={() => {
                            onSelect(s);
                            handleClose();
                          }}
                          className="w-full text-left px-4 py-3 hover:bg-secondary active:bg-secondary flex items-center justify-between group"
                        >
                          <div>
                            <div className="text-sm font-medium">{s.label}</div>
                            <div className="text-xs text-muted-foreground">
                              {s.type === "flat"
                                ? `$${s.min}–$${s.max} typical`
                                : `${Math.max(0, s.min + locationAdj)}–${Math.max(0, s.max + locationAdj)}% typical`}
                            </div>
                          </div>
                          {selected?.id === s.id && (
                            <Check className="w-4 h-4 text-accent" />
                          )}
                        </button>
                      ))}
                    </div>
                  ) : null
                )}
                {filtered.length === 0 && (
                  <div className="px-4 py-6 text-sm text-muted-foreground text-center">
                    No matches
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}