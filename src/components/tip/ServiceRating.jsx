import React from "react";
import { Star } from "lucide-react";
import { RATING_MULTIPLIERS } from "@/lib/tipScenarios";

export default function ServiceRating({ rating, setRating }) {
  const info = RATING_MULTIPLIERS[rating];

  return (
    <div>
      <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground font-medium">
        How was the service?
      </span>
      <div className="mt-3 flex items-center gap-2">
        {[1, 2, 3, 4, 5].map((n) => {
          const active = n <= rating;
          return (
            <button
              key={n}
              type="button"
              onClick={() => setRating(n)}
              className="p-2 rounded-full hover:bg-secondary transition-all active:scale-90"
              aria-label={`Rate ${n} star${n > 1 ? "s" : ""}`}
            >
              <Star
                className={`w-8 h-8 transition-all ${
                  active
                    ? "fill-accent text-accent"
                    : "text-muted-foreground/40"
                }`}
              />
            </button>
          );
        })}
      </div>
      {info && (
        <div className="mt-2 flex items-baseline gap-2">
          <span className="font-serif text-lg">{info.label}</span>
          <span className="text-sm text-muted-foreground">— {info.description}</span>
        </div>
      )}
    </div>
  );
}