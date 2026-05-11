import React from "react";
import { VENUE_TIERS } from "@/lib/tipScenarios";

export default function VenueTier({ venueTier, setVenueTier }) {
  return (
    <div>
      <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground font-medium">
        Venue / Setting
      </span>
      <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2">
        {VENUE_TIERS.map((tier) => {
          const active = venueTier === tier.id;
          return (
            <button
              key={tier.id}
              type="button"
              onClick={() => setVenueTier(tier.id)}
              className={`text-left px-3 py-3 rounded-xl border transition-all ${
                active
                  ? "border-foreground bg-foreground text-background"
                  : "border-border hover:border-foreground/40 bg-card"
              }`}
            >
              <div className={`font-serif text-base leading-tight ${active ? "text-background" : ""}`}>
                {tier.label}
              </div>
              <div className={`text-[11px] mt-1 leading-snug ${active ? "text-background/70" : "text-muted-foreground"}`}>
                {tier.description}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}