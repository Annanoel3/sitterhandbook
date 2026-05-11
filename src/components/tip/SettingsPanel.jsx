import React, { useEffect, useRef, useState } from "react";
import { Moon, Sun, Wallet, MapPin, X, Monitor, Check, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSettings, STATES, getLocationNote } from "@/lib/SettingsContext";
import { useSearchParams } from "react-router-dom";

// Touch-friendly list picker rendered inline
function ListPicker({ value, onChange, options, grouped }) {
  return (
    <div className="rounded-xl border border-border overflow-hidden divide-y divide-border">
      {grouped
        ? grouped.map(({ label, items }) => (
            <div key={label}>
              <div className="px-3 py-1.5 text-[10px] uppercase tracking-widest text-muted-foreground bg-secondary/60 font-semibold">
                {label}
              </div>
              {items.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => onChange(opt.value)}
                  className="w-full flex items-center justify-between px-4 py-3 text-sm bg-card hover:bg-secondary active:bg-secondary transition text-left"
                >
                  <span className={value === opt.value ? "font-medium text-foreground" : "text-foreground/80"}>
                    {opt.label}
                  </span>
                  {value === opt.value && <Check className="w-4 h-4 text-accent shrink-0" />}
                </button>
              ))}
            </div>
          ))
        : options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(opt.value)}
              className="w-full flex items-center justify-between px-4 py-3 text-sm bg-card hover:bg-secondary active:bg-secondary transition text-left"
            >
              <span className={value === opt.value ? "font-medium text-foreground" : "text-foreground/80"}>
                {opt.label}
              </span>
              {value === opt.value && <Check className="w-4 h-4 text-accent shrink-0" />}
            </button>
          ))}
    </div>
  );
}

export default function SettingsPanel({ open, onClose }) {
  const {
    theme, setTheme,
    darkMode, setDarkMode,
    budgetMode, setBudgetMode,
    stateId, setStateId,
    cityId, setCityId,
    notInUS, setNotInUS,
    country, setCountry,
  } = useSettings();

  const [searchParams, setSearchParams] = useSearchParams();

  // Sync open state with URL query param for Android back button
  useEffect(() => {
    if (open) {
      setSearchParams((p) => { const n = new URLSearchParams(p); n.set("settings", "1"); return n; }, { replace: true });
    } else {
      setSearchParams((p) => { const n = new URLSearchParams(p); n.delete("settings"); return n; }, { replace: true });
    }
  }, [open]);

  // Close when URL param is removed (Android back button)
  useEffect(() => {
    if (!searchParams.get("settings") && open) {
      onClose();
    }
  }, [searchParams]);

  const selectedState = STATES.find((s) => s.id === stateId);
  const hasCities = !notInUS && selectedState?.cities?.length > 0;
  const note = !notInUS ? getLocationNote(stateId, cityId) : null;

  const stateOptions = STATES.filter((s) => !s.cities || s.cities.length === 0 || s.id === "national").map((s) => ({ value: s.id, label: s.label }));
  const statesWithCities = STATES.filter((s) => s.cities && s.cities.length > 0 && s.id !== "national").map((s) => ({ value: s.id, label: s.label }));
  const groupedStates = [
    { label: "General", items: stateOptions },
    { label: "States with city variation", items: statesWithCities },
  ];

  const cityOptions = hasCities
    ? [{ value: "", label: "— Statewide average —" }, ...selectedState.cities.map((c) => ({ value: c.id, label: c.label }))]
    : [];

  const themeOptions = [
    { value: "light", label: "Light", icon: <Sun className="w-4 h-4" /> },
    { value: "dark", label: "Dark", icon: <Moon className="w-4 h-4" /> },
    { value: "system", label: "System", icon: <Monitor className="w-4 h-4" /> },
  ];

  return (
    <AnimatePresence>
      {open && (
        <>
          <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm" onClick={onClose} />

          {/* Bottom-sheet on mobile, dropdown on md+ */}
          <motion.div
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed z-50 bottom-0 left-0 right-0 bg-card rounded-t-3xl shadow-2xl md:hidden"
            style={{ paddingBottom: "env(safe-area-inset-bottom, 16px)", maxHeight: "90dvh" }}
          >
            <SheetHandle />
            <PanelContent
              theme={theme} setTheme={setTheme}
              darkMode={darkMode} setDarkMode={setDarkMode}
              budgetMode={budgetMode} setBudgetMode={setBudgetMode}
              notInUS={notInUS} setNotInUS={setNotInUS}
              country={country} setCountry={setCountry}
              stateId={stateId} setStateId={setStateId}
              cityId={cityId} setCityId={setCityId}
              hasCities={hasCities} note={note}
              groupedStates={groupedStates} cityOptions={cityOptions}
              themeOptions={themeOptions}
              onClose={onClose}
            />
          </motion.div>

          {/* Desktop dropdown */}
          <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.97 }}
            transition={{ duration: 0.18 }}
            className="fixed z-50 top-16 right-4 md:right-8 w-80 bg-card border border-border rounded-2xl shadow-2xl overflow-hidden hidden md:block"
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <span className="font-serif text-lg">Settings</span>
              <button onClick={onClose} className="p-1.5 rounded-full hover:bg-secondary transition">
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
            <PanelContent
              theme={theme} setTheme={setTheme}
              darkMode={darkMode} setDarkMode={setDarkMode}
              budgetMode={budgetMode} setBudgetMode={setBudgetMode}
              notInUS={notInUS} setNotInUS={setNotInUS}
              country={country} setCountry={setCountry}
              stateId={stateId} setStateId={setStateId}
              cityId={cityId} setCityId={setCityId}
              hasCities={hasCities} note={note}
              groupedStates={groupedStates} cityOptions={cityOptions}
              themeOptions={themeOptions}
              onClose={onClose}
              desktopNativeSelect
            />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function SheetHandle() {
  return (
    <div className="flex justify-center pt-3 pb-1">
      <div className="w-10 h-1 rounded-full bg-border" />
    </div>
  );
}

function PanelContent({
  theme, setTheme, darkMode, setDarkMode,
  budgetMode, setBudgetMode,
  notInUS, setNotInUS, country, setCountry,
  stateId, setStateId, cityId, setCityId,
  hasCities, note,
  groupedStates, cityOptions, themeOptions,
  onClose, desktopNativeSelect,
}) {
  return (
    <div className="p-5 space-y-5 overflow-y-auto" style={{ maxHeight: "80dvh" }}>

      {/* Theme */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          {darkMode ? <Moon className="w-4 h-4 text-accent" /> : <Sun className="w-4 h-4 text-accent" />}
          <div className="text-sm font-medium">Appearance</div>
        </div>
        <div className="inline-flex p-1 bg-secondary rounded-full w-full">
          {[
            { value: "light", label: "Light", icon: <Sun className="w-3.5 h-3.5" /> },
            { value: "dark", label: "Dark", icon: <Moon className="w-3.5 h-3.5" /> },
            { value: "system", label: "System", icon: <Monitor className="w-3.5 h-3.5" /> },
          ].map((t) => (
            <button
              key={t.value}
              type="button"
              onClick={() => setTheme(t.value)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-sm rounded-full transition-all ${
                theme === t.value
                  ? "bg-card shadow-sm text-foreground font-medium"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t.icon}
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="border-t border-border" />

      {/* Budget Mode */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <Wallet className="w-4 h-4 text-accent mt-0.5 shrink-0" />
          <div>
            <div className="text-sm font-medium">Budget Mode</div>
            <div className="text-xs text-muted-foreground leading-relaxed">
              Shifts suggestions toward the lower-but-still-polite end of each range.
            </div>
          </div>
        </div>
        <Toggle on={budgetMode} onToggle={() => setBudgetMode(!budgetMode)} />
      </div>

      {budgetMode && (
        <div className="bg-accent/10 text-accent rounded-lg px-3 py-2 text-xs leading-relaxed -mt-2">
          Tips reflect the minimum considered polite — servers will notice, but won't be stiffed.
        </div>
      )}

      <div className="border-t border-border" />

      {/* Location */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <MapPin className="w-4 h-4 text-accent" />
          <div>
            <div className="text-sm font-medium">Location <span className="text-muted-foreground font-normal">(optional)</span></div>
            <div className="text-xs text-muted-foreground">Tipping norms vary by state and city.</div>
          </div>
        </div>

        <label className="flex items-center gap-2 mb-3 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={notInUS}
            onChange={(e) => {
              setNotInUS(e.target.checked);
              if (!e.target.checked) setCountry("");
            }}
            className="w-4 h-4 rounded cursor-pointer"
          />
          <span className="text-sm">I'm not in the US</span>
        </label>

        {notInUS ? (
          <div>
            <input
              type="text"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              placeholder="e.g. Japan, Germany, Australia…"
              className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent"
            />
            <div className="mt-2 flex items-center justify-between gap-2">
              {country.trim() ? (
                <div className="text-xs text-muted-foreground italic">
                  We'll share tipping customs and philosophy for {country.trim()}.
                </div>
              ) : <div />}
              <button
                onClick={onClose}
                className="shrink-0 text-xs px-3 py-1 rounded-full bg-foreground text-background hover:opacity-80 transition"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <>
            {desktopNativeSelect ? (
              <>
                <select
                  value={stateId}
                  onChange={(e) => setStateId(e.target.value)}
                  className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                >
                  {groupedStates[0].items.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                  <optgroup label="States with city variation">
                    {groupedStates[1].items.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                  </optgroup>
                </select>
                {hasCities && (
                  <div className="mt-3">
                    <div className="text-xs text-muted-foreground mb-1.5">Which part of {STATES.find(s => s.id === stateId)?.label}?</div>
                    <select
                      value={cityId}
                      onChange={(e) => setCityId(e.target.value)}
                      className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                    >
                      {cityOptions.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                    </select>
                  </div>
                )}
              </>
            ) : (
              <>
                <div className="text-xs text-muted-foreground mb-2">Select your state</div>
                <ListPicker value={stateId} onChange={setStateId} grouped={groupedStates} />
                {hasCities && (
                  <div className="mt-4">
                    <div className="text-xs text-muted-foreground mb-2">Which part of {STATES.find(s => s.id === stateId)?.label}?</div>
                    <ListPicker value={cityId} onChange={setCityId} options={cityOptions} />
                  </div>
                )}
              </>
            )}
            {note && <div className="mt-2 text-xs text-muted-foreground italic">{note}</div>}
          </>
        )}
      </div>

      <div className="border-t border-border" />

      {/* Privacy */}
      <div>
        <div className="text-sm font-medium mb-2">Privacy</div>
        <div className="text-xs text-muted-foreground leading-relaxed space-y-2">
          <p>
            <span className="font-medium text-foreground">We don't collect any personal data.</span> TipHelper stores your preferences (dark mode, location, budget mode) only in your browser's local storage — nothing is sent to any server.
          </p>
          <p>
            When you use the international tipping feature, a prompt describing your country is sent to an AI language model to generate a cultural insight. No personally identifiable information is included in that request.
          </p>
          <p>
            We don't use analytics, tracking pixels, or third-party data brokers. What happens in the app stays in the app.
          </p>
          <p className="pt-1">
            If you have questions about this policy, contact us at{" "}
            <a href="mailto:mediocreatbestdev@outlook.com" className="text-accent hover:underline">
              mediocreatbestdev@outlook.com
            </a>
          </p>
        </div>
      </div>

      <div className="border-t border-border" />

      {/* Clear Data */}
      <ClearDataSection onClose={onClose} />

      <div className="border-t border-border" />

      {/* Copyright & Intellectual Property */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg">©</span>
          <div className="text-sm font-medium">Copyright & Intellectual Property</div>
        </div>
        <div className="text-xs text-muted-foreground leading-relaxed space-y-3">
          <p>
            <span className="font-medium text-foreground">© 2026 TipHelper. All rights reserved.</span>
          </p>
          <div>
            <p className="font-medium text-foreground mb-1">Restrictions</p>
            <p>
              You may not copy, reproduce, distribute, modify, or create derivative works from any part of the TipHelper application without prior written consent. Unauthorized use may violate copyright and applicable laws.
            </p>
          </div>
          <p>
            For licensing inquiries, contact{" "}
            <a href="mailto:mediocreatbestdev@outlook.com" className="text-accent hover:underline">
              mediocreatbestdev@outlook.com
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}

function ClearDataSection({ onClose }) {
  const [confirming, setConfirming] = useState(false);

  const handleClear = () => {
    const keys = ["tiphelper_theme", "tiphelper_budget", "tiphelper_state", "tiphelper_city", "tiphelper_notinus", "tiphelper_country", "appOpenCount"];
    keys.forEach((k) => localStorage.removeItem(k));
    window.location.reload();
  };

  if (confirming) {
    return (
      <div className="rounded-xl border border-destructive/40 bg-destructive/5 p-4 space-y-3">
        <div className="text-sm font-medium text-destructive">Clear all app data?</div>
        <div className="text-xs text-muted-foreground">This will reset all your preferences (theme, location, budget mode) back to defaults.</div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleClear}
            className="flex-1 py-2 rounded-lg bg-destructive text-destructive-foreground text-sm font-medium hover:opacity-90 transition"
          >
            Yes, clear everything
          </button>
          <button
            type="button"
            onClick={() => setConfirming(false)}
            className="flex-1 py-2 rounded-lg bg-secondary text-foreground text-sm hover:bg-border transition"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setConfirming(true)}
      className="w-full flex items-center gap-2 text-sm text-destructive hover:opacity-80 transition py-1"
    >
      <Trash2 className="w-4 h-4 shrink-0" />
      Clear all app data
    </button>
  );
}

function Toggle({ on, onToggle }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`relative shrink-0 w-10 h-6 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-accent ${on ? "bg-foreground" : "bg-border"}`}
    >
      <span
        className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-background transition-transform duration-200 ${on ? "translate-x-4" : "translate-x-0"}`}
      />
    </button>
  );
}