import React from "react";

export default function ModeToggle({ mode, setMode, customPercent, setCustomPercent }) {
  return (
    <div>
      <div className="inline-flex p-1 bg-secondary rounded-full">
        <button
          onClick={() => setMode("rating")}
          className={`px-4 py-1.5 text-sm rounded-full transition-all ${
            mode === "rating"
              ? "bg-card shadow-sm text-foreground font-medium"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          By Service Rating
        </button>
        <button
          onClick={() => setMode("custom")}
          className={`px-4 py-1.5 text-sm rounded-full transition-all ${
            mode === "custom"
              ? "bg-card shadow-sm text-foreground font-medium"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Custom %
        </button>
      </div>

      {mode === "custom" && (
        <div className="mt-4">
          <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground font-medium">
            Tip Percentage
          </span>
          <div className="mt-2 flex items-center gap-3">
            <div className="flex gap-2 flex-wrap">
              {[10, 15, 18, 20, 25].map((p) => (
                <button
                  key={p}
                  onClick={() => setCustomPercent(p)}
                  className={`px-3 py-1.5 rounded-full text-sm border transition-all ${
                    Number(customPercent) === p
                      ? "bg-foreground text-background border-foreground"
                      : "border-border hover:border-foreground/50"
                  }`}
                >
                  {p}%
                </button>
              ))}
            </div>
            <div className="relative flex-1 min-w-[120px]">
              <input
                type="number"
                min="0"
                max="100"
                step="1"
                value={customPercent}
                onChange={(e) => setCustomPercent(e.target.value)}
                className="w-full px-4 py-2 pr-8 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent font-serif tabular-nums text-lg"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">%</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}