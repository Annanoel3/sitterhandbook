import React from "react";
import { DollarSign } from "lucide-react";

// Maps common country names → { code, symbol, approxRate (to USD) }
// Rates are approximate and for display/conversion only — not financial advice.
const COUNTRY_CURRENCIES = {
  "united kingdom": { code: "GBP", symbol: "£", rate: 0.79 },
  "uk": { code: "GBP", symbol: "£", rate: 0.79 },
  "england": { code: "GBP", symbol: "£", rate: 0.79 },
  "britain": { code: "GBP", symbol: "£", rate: 0.79 },
  "france": { code: "EUR", symbol: "€", rate: 0.92 },
  "germany": { code: "EUR", symbol: "€", rate: 0.92 },
  "italy": { code: "EUR", symbol: "€", rate: 0.92 },
  "spain": { code: "EUR", symbol: "€", rate: 0.92 },
  "portugal": { code: "EUR", symbol: "€", rate: 0.92 },
  "netherlands": { code: "EUR", symbol: "€", rate: 0.92 },
  "holland": { code: "EUR", symbol: "€", rate: 0.92 },
  "belgium": { code: "EUR", symbol: "€", rate: 0.92 },
  "austria": { code: "EUR", symbol: "€", rate: 0.92 },
  "greece": { code: "EUR", symbol: "€", rate: 0.92 },
  "ireland": { code: "EUR", symbol: "€", rate: 0.92 },
  "finland": { code: "EUR", symbol: "€", rate: 0.92 },
  "switzerland": { code: "CHF", symbol: "CHF", rate: 0.89 },
  "sweden": { code: "SEK", symbol: "kr", rate: 10.4 },
  "norway": { code: "NOK", symbol: "kr", rate: 10.6 },
  "denmark": { code: "DKK", symbol: "kr", rate: 6.9 },
  "poland": { code: "PLN", symbol: "zł", rate: 3.9 },
  "czech republic": { code: "CZK", symbol: "Kč", rate: 23.1 },
  "czechia": { code: "CZK", symbol: "Kč", rate: 23.1 },
  "canada": { code: "CAD", symbol: "CA$", rate: 1.37 },
  "mexico": { code: "MXN", symbol: "MX$", rate: 17.2 },
  "brazil": { code: "BRL", symbol: "R$", rate: 5.1 },
  "argentina": { code: "ARS", symbol: "$", rate: 900 },
  "colombia": { code: "COP", symbol: "$", rate: 3900 },
  "australia": { code: "AUD", symbol: "A$", rate: 1.53 },
  "new zealand": { code: "NZD", symbol: "NZ$", rate: 1.63 },
  "singapore": { code: "SGD", symbol: "S$", rate: 1.34 },
  "hong kong": { code: "HKD", symbol: "HK$", rate: 7.82 },
  "india": { code: "INR", symbol: "₹", rate: 83.5 },
  "thailand": { code: "THB", symbol: "฿", rate: 35.1 },
  "indonesia": { code: "IDR", symbol: "Rp", rate: 15800 },
  "malaysia": { code: "MYR", symbol: "RM", rate: 4.7 },
  "philippines": { code: "PHP", symbol: "₱", rate: 56.5 },
  "vietnam": { code: "VND", symbol: "₫", rate: 25000 },
  "uae": { code: "AED", symbol: "AED", rate: 3.67 },
  "united arab emirates": { code: "AED", symbol: "AED", rate: 3.67 },
  "dubai": { code: "AED", symbol: "AED", rate: 3.67 },
  "israel": { code: "ILS", symbol: "₪", rate: 3.75 },
  "turkey": { code: "TRY", symbol: "₺", rate: 32.0 },
  "south africa": { code: "ZAR", symbol: "R", rate: 18.8 },
  "egypt": { code: "EGP", symbol: "E£", rate: 48.5 },
  "kenya": { code: "KES", symbol: "KSh", rate: 130 },
  "japan": { code: "JPY", symbol: "¥", rate: 150 },
  "china": { code: "CNY", symbol: "¥", rate: 7.25 },
  "south korea": { code: "KRW", symbol: "₩", rate: 1340 },
  "korea": { code: "KRW", symbol: "₩", rate: 1340 },
};

export function getCurrencyForCountry(country) {
  if (!country) return null;
  return COUNTRY_CURRENCIES[country.trim().toLowerCase()] || null;
}

export default function CurrencyToggle({ country, useLocalCurrency, setUseLocalCurrency }) {
  const currency = getCurrencyForCountry(country);
  if (!currency) return null;

  return (
    <div className="flex items-center justify-between rounded-xl border border-border bg-card px-4 py-3">
      <div className="flex items-center gap-2 text-sm">
        <DollarSign className="w-4 h-4 text-muted-foreground" />
        <span className="text-muted-foreground">Show amounts in</span>
      </div>
      <div className="inline-flex p-0.5 bg-secondary rounded-full">
        <button
          onClick={() => setUseLocalCurrency(false)}
          className={`px-3 py-1 text-sm rounded-full transition-all ${
            !useLocalCurrency
              ? "bg-card shadow-sm text-foreground font-medium"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          USD
        </button>
        <button
          onClick={() => setUseLocalCurrency(true)}
          className={`px-3 py-1 text-sm rounded-full transition-all ${
            useLocalCurrency
              ? "bg-card shadow-sm text-foreground font-medium"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {currency.code}
        </button>
      </div>
    </div>
  );
}