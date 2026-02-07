import { useState, useMemo, useCallback, memo } from "react";
import { Search, MapPin, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { countryLanguageMap } from "@/lib/countryLanguages";

interface CountrySearchProps {
  onCountrySelect: (countryData: { country: string; language: string; code: string; flag: string }) => void;
  className?: string;
}

const countries = Object.entries(countryLanguageMap).map(([country, data]) => ({
  country,
  ...data,
}));

const CountryItem = memo(({
  country,
  language,
  flag,
  onSelect,
}: {
  country: string;
  language: string;
  flag: string;
  onSelect: () => void;
}) => (
  <button
    onClick={onSelect}
    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-accent/10 transition-colors text-left rounded-lg group"
  >
    <span className="text-2xl group-hover:scale-110 transition-transform">{flag}</span>
    <div className="flex flex-col min-w-0 flex-1">
      <span className="font-medium text-sm text-foreground truncate">{country}</span>
      <span className="text-xs text-muted-foreground">{language}</span>
    </div>
    <MapPin className="h-3.5 w-3.5 text-muted-foreground/50 opacity-0 group-hover:opacity-100 transition-opacity" />
  </button>
));
CountryItem.displayName = "CountryItem";

export const CountrySearch = memo(function CountrySearch({ onCountrySelect, className }: CountrySearchProps) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);

  const filtered = useMemo(() => {
    if (!query.trim()) return countries;
    const q = query.toLowerCase();
    return countries.filter(
      (c) =>
        c.country.toLowerCase().includes(q) ||
        c.language.toLowerCase().includes(q) ||
        c.code.toLowerCase().includes(q)
    );
  }, [query]);

  const handleSelect = useCallback(
    (item: typeof countries[0]) => {
      setSelectedCountry(item.country);
      setQuery("");
      setIsOpen(false);
      onCountrySelect(item);
    },
    [onCountrySelect]
  );

  const handleClear = useCallback(() => {
    setSelectedCountry(null);
    setQuery("");
    setIsOpen(false);
  }, []);

  return (
    <div className={cn("relative w-full", className)}>
      {/* Selected country badge */}
      {selectedCountry && (
        <div className="flex items-center gap-2 mb-2">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/15 border border-accent/30 text-sm">
            <span>{countryLanguageMap[selectedCountry]?.flag}</span>
            <span className="font-medium text-foreground">{selectedCountry}</span>
            <span className="text-muted-foreground">·</span>
            <span className="text-muted-foreground">{countryLanguageMap[selectedCountry]?.language}</span>
            <button onClick={handleClear} className="ml-1 hover:text-destructive transition-colors">
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Search input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        <Input
          placeholder="Search your country to translate..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          className="pl-10 pr-4 h-12 rounded-xl bg-card border-border/50 shadow-soft text-base placeholder:text-muted-foreground/60 focus-visible:ring-accent/50"
        />
        {query && (
          <button
            onClick={() => { setQuery(""); setIsOpen(false); }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Dropdown results */}
      {isOpen && (
        <div className="absolute z-50 top-full mt-2 w-full max-h-80 overflow-y-auto rounded-xl border border-border/50 bg-card shadow-lg animate-fade-in">
          {filtered.length === 0 ? (
            <div className="px-4 py-8 text-center text-muted-foreground text-sm">
              No country found for "{query}"
            </div>
          ) : (
            <div className="p-1">
              {filtered.map((item) => (
                <CountryItem
                  key={item.country}
                  country={item.country}
                  language={item.language}
                  flag={item.flag}
                  onSelect={() => handleSelect(item)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Backdrop to close dropdown */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
});
