import React from "react";
import { motion } from "framer-motion";

function fmt(n, currency) {
  const safeN = isFinite(n) ? n : 0;
  if (currency) {
    // Format in local currency
    const converted = safeN * currency.rate;
    const isLargeRate = currency.rate >= 100;
    return `${currency.symbol}${converted.toLocaleString("en-US", {
      minimumFractionDigits: isLargeRate ? 0 : 2,
      maximumFractionDigits: isLargeRate ? 0 : 2,
    })}`;
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(safeN);
}

export default function TipDisplay({ result, scenario, people, localCurrency }) {
  const { tipAmount, totalAmount, perPerson, effectivePercent, isFlat } = result;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="bg-foreground text-background rounded-2xl p-8 md:p-10 relative overflow-hidden"
    >
      <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-accent/20 blur-3xl" />

      <div className="relative">
        <div className="text-xs uppercase tracking-[0.22em] text-background/60 font-medium">
          Suggested Tip
        </div>
        <div className="mt-3 flex items-baseline gap-3 flex-wrap">
          <div className="font-serif text-6xl md:text-7xl tabular-nums leading-none">
            {fmt(tipAmount, localCurrency)}
          </div>
          <div className="text-background/70 font-serif text-xl tabular-nums">
            {effectivePercent > 0 ? `${effectivePercent.toFixed(1)}%` : ""}
            {isFlat ? " · flat" : ""}
          </div>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-6 pt-6 border-t border-background/15">
          <div>
            <div className="text-xs uppercase tracking-[0.18em] text-background/60">
              Total
            </div>
            <div className="mt-1 font-serif text-3xl tabular-nums">
              {fmt(totalAmount, localCurrency)}
            </div>
          </div>
          {people > 1 && (
            <div>
              <div className="text-xs uppercase tracking-[0.18em] text-background/60">
                Per Person ({people})
              </div>
              <div className="mt-1 font-serif text-3xl tabular-nums">
                {fmt(perPerson, localCurrency)}
              </div>
            </div>
          )}
        </div>

        {scenario?.note && (
          <div className="mt-6 text-sm text-background/70 italic">
            {scenario.note}
          </div>
        )}
      </div>
    </motion.div>
  );
}