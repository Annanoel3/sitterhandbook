import React from "react";
import { DollarSign, Users } from "lucide-react";

export default function BillInput({ bill, setBill, people, setPeople }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-4">
      <label className="block">
        <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground font-medium">
          Bill Amount
        </span>
        <div className="mt-2 relative">
          <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="number"
            inputMode="decimal"
            min="0"
            step="0.01"
            value={bill}
            onChange={(e) => setBill(e.target.value)}
            placeholder="0.00"
            className="w-full pl-11 pr-4 py-4 text-3xl font-serif tabular-nums bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition"
          />
        </div>
      </label>

      <label className="block">
        <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground font-medium">
          Split
        </span>
        <div className="mt-2 relative">
          <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="number"
            min="1"
            step="1"
            value={people}
            onChange={(e) => setPeople(Math.max(1, parseInt(e.target.value) || 1))}
            className="w-full sm:w-28 pl-11 pr-4 py-4 text-3xl font-serif tabular-nums bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition"
          />
        </div>
      </label>
    </div>
  );
}