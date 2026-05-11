import React, { useState, useMemo, useEffect, useRef } from "react";
import { Settings } from "lucide-react";
import BillInput from "@/components/tip/BillInput";
import SituationSelect from "@/components/tip/SituationSelect";
import ServiceRating from "@/components/tip/ServiceRating";
import ModeToggle from "@/components/tip/ModeToggle";
import TipDisplay from "@/components/tip/TipDisplay";
import VenueTier from "@/components/tip/VenueTier";
import SettingsPanel from "@/components/tip/SettingsPanel";
import InternationalInsight from "@/components/tip/InternationalInsight";
import CurrencyToggle, { getCurrencyForCountry } from "@/components/tip/CurrencyToggle";
import AdSlot from "@/components/AdSlot";
import PullToRefresh from "@/components/PullToRefresh";
import { computeTip } from "@/lib/tipScenarios";
import { useSettings, BUDGET_MODE_MULT, getLocationAdj, getLocationLabel, getCountryAdj } from "@/lib/SettingsContext";

export default function Home() {
  const [bill, setBill] = useState("");
  const [people, setPeople] = useState(1);
  const [scenario, setScenario] = useState(null);
  const [rating, setRating] = useState(3);
  const [mode, setMode] = useState("rating"); // "rating" | "custom"
  const [customPercent, setCustomPercent] = useState(18);
  const [venueTier, setVenueTier] = useState("mid");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [intlCalculatorOpen, setIntlCalculatorOpen] = useState(false);
  const [useLocalCurrency, setUseLocalCurrency] = useState(false);

  const { budgetMode, stateId, cityId, notInUS, country } = useSettings();
  const calcRef = useRef(null);
  const hasScrolledRef = useRef(false);

  // Reset calculator when country changes
  useEffect(() => {
    setIntlCalculatorOpen(false);
    setUseLocalCurrency(false);
  }, [country]);

  // Auto-scroll to calculator on first user scroll (resets on every page visit)
  useEffect(() => {
    hasScrolledRef.current = false;
    const handleScroll = () => {
      if (hasScrolledRef.current) return;
      hasScrolledRef.current = true;
      window.removeEventListener("scroll", handleScroll);
      setTimeout(() => {
        if (calcRef.current) {
          const top = calcRef.current.getBoundingClientRect().top + window.scrollY - 16;
          window.scrollTo({ top, behavior: "smooth" });
        }
      }, 150);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const billNum = parseFloat(bill) || 0;
  const locationAdj = notInUS ? 0 : getLocationAdj(stateId, cityId);
  const budgetMult = budgetMode ? BUDGET_MODE_MULT : 1;
  const locationLabel = getLocationLabel(stateId, cityId);

  const result = useMemo(
    () =>
      computeTip({
        scenario,
        bill: billNum,
        rating,
        mode,
        customPercent,
        people,
        venueTier,
        budgetMult,
        locationAdj,
      }),
    [scenario, billNum, rating, mode, customPercent, people, venueTier, budgetMult, locationAdj]
  );

  const showResult = !notInUS && billNum > 0 && (mode === "custom" || scenario);

  const handleRefresh = () => {
    setScenario(null);
    setBill("");
    setPeople(1);
    setRating(3);
    setMode("rating");
    setCustomPercent(18);
    setVenueTier("mid");
    return new Promise((r) => setTimeout(r, 600));
  };

  return (
    <PullToRefresh onRefresh={handleRefresh}>
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-5 py-6 md:py-10" style={{ paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 24px)" }}>

        {/* Settings button */}
        <div className="flex justify-end mb-2">
          <button
            onClick={() => setSettingsOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition"
          >
            <Settings className="w-4 h-4" />
            Settings
            {(budgetMode || locationLabel || notInUS) && (
              <span className="ml-1 w-2 h-2 rounded-full bg-accent inline-block" />
            )}
          </button>
        </div>

        <SettingsPanel open={settingsOpen} onClose={() => setSettingsOpen(false)} />

        {/* Header */}
        <header className="text-center mb-6">
          <div className="inline-block text-[10px] uppercase tracking-[0.3em] text-accent font-semibold mb-4">
            TipHelper
          </div>
          <h1 className="font-serif text-5xl md:text-6xl leading-[1.05] tracking-tight">
            {notInUS && country.trim() ? (
              <>Tipping in<br /><span className="italic text-accent">{country.trim()}</span></>
            ) : (
              <>How much<br /><span className="italic text-accent">should you tip?</span></>
            )}
          </h1>
          <p className="mt-5 text-muted-foreground max-w-md mx-auto">
            {notInUS
              ? "Tipping customs vary wildly around the world — here's what you need to know."
              : "Research-backed tipping guidance for every situation — from sit-down dinners to lawn care."}
          </p>
          {(budgetMode || (!notInUS && locationLabel)) && (
            <div className="mt-3 flex items-center justify-center gap-2 flex-wrap">
              {budgetMode && (
                <span className="inline-flex items-center gap-1 text-xs bg-accent/15 text-accent rounded-full px-3 py-1 font-medium">
                  Budget Mode on
                </span>
              )}
              {!notInUS && locationLabel && (
                <span className="inline-flex items-center gap-1 text-xs bg-secondary text-muted-foreground rounded-full px-3 py-1">
                  📍 {locationLabel}
                </span>
              )}
            </div>
          )}
        </header>

        {notInUS ? (
          /* International mode */
          <div className="mt-2" ref={calcRef}>
            {country.trim() ? (
              <>
                <InternationalInsight
                  country={country}
                  onReadyToCalculate={() => setIntlCalculatorOpen(true)}
                />
                {intlCalculatorOpen && (
                  <div className="bg-card border border-border rounded-2xl p-6 md:p-8 space-y-7 shadow-sm">
                    <CurrencyToggle
                      country={country}
                      useLocalCurrency={useLocalCurrency}
                      setUseLocalCurrency={setUseLocalCurrency}
                    />
                    <BillInput bill={bill} setBill={setBill} people={people} setPeople={setPeople} />
                    <SituationSelect selected={scenario} onSelect={setScenario} locationAdj={locationAdj} />
                    <ModeToggle mode={mode} setMode={setMode} customPercent={customPercent} setCustomPercent={setCustomPercent} />
                    {mode === "rating" && scenario?.venueAware && (
                      <VenueTier venueTier={venueTier} setVenueTier={setVenueTier} />
                    )}
                    {mode === "rating" && scenario && (
                      <ServiceRating rating={rating} setRating={setRating} />
                    )}
                    <div className="mt-2">
                      {billNum > 0 && (mode === "custom" || scenario) ? (
                        <TipDisplay
                          result={result}
                          scenario={scenario}
                          people={people}
                          localCurrency={useLocalCurrency ? getCurrencyForCountry(country) : null}
                        />
                      ) : (
                        <div className="text-center text-sm text-muted-foreground py-4">
                          Enter a bill amount{mode === "rating" && " and pick a situation"} to see your tip.
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center text-sm text-muted-foreground py-8 bg-card border border-border rounded-2xl">
                Enter your country in Settings to get local tipping culture and customs.
              </div>
            )}
          </div>
        ) : (
          <>
            {/* Card */}
            <div ref={calcRef} className="bg-card border border-border rounded-2xl p-6 md:p-8 space-y-7 shadow-sm">
              <BillInput bill={bill} setBill={setBill} people={people} setPeople={setPeople} />
              <SituationSelect selected={scenario} onSelect={setScenario} locationAdj={locationAdj} />
              <ModeToggle mode={mode} setMode={setMode} customPercent={customPercent} setCustomPercent={setCustomPercent} />
              {mode === "rating" && scenario?.venueAware && (
                <VenueTier venueTier={venueTier} setVenueTier={setVenueTier} />
              )}
              {mode === "rating" && scenario && (
                <ServiceRating rating={rating} setRating={setRating} />
              )}
            </div>

            {/* Result */}
            <div className="mt-3">
              {showResult ? (
                <TipDisplay result={result} scenario={scenario} people={people} />
              ) : (
                <div className="text-center text-sm text-muted-foreground py-2">
                  Enter a bill amount{mode === "rating" && " and pick a situation"} to see your tip.
                </div>
              )}
            </div>
          </>
        )}

        <footer className="mt-2 text-center text-xs text-muted-foreground space-y-0.5">
          {notInUS ? (
            <>
              <p>Tipping customs sourced from cultural research.</p>
              <p className="text-muted-foreground/60">Responses generated by AI — always use your own judgment.</p>
            </>
          ) : (
            <p>Guidelines based on standard US tipping customs. Adjust to taste.</p>
          )}
        </footer>

        <AdSlot className="mt-3" />
      </div>
    </div>
    </PullToRefresh>
  );
}