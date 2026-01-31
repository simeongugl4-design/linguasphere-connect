import { useState, useMemo } from "react";
import { Check, ChevronDown, Search, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { languages, popularLanguages, Language, groupedByRegion } from "@/lib/languages";

interface LanguageSelectorProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  showAutoDetect?: boolean;
  className?: string;
}

export function LanguageSelector({
  value,
  onChange,
  label,
  showAutoDetect = false,
  className,
}: LanguageSelectorProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const selectedLanguage = useMemo(() => {
    if (value === "auto") return null;
    return languages.find(lang => lang.code === value);
  }, [value]);

  const filteredLanguages = useMemo(() => {
    if (!searchQuery) return null;
    const query = searchQuery.toLowerCase();
    return languages.filter(
      lang =>
        lang.name.toLowerCase().includes(query) ||
        lang.nativeName.toLowerCase().includes(query) ||
        lang.code.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  return (
    <div className={cn("flex flex-col gap-1", className)}>
      {label && (
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          {label}
        </span>
      )}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="justify-between h-12 px-4 bg-card hover:bg-secondary/50 border-border/50 shadow-soft transition-all"
          >
            <div className="flex items-center gap-3">
              {value === "auto" ? (
                <>
                  <Globe className="h-5 w-5 text-accent" />
                  <span className="font-medium">Detect Language</span>
                </>
              ) : selectedLanguage ? (
                <>
                  <span className="text-xl">{selectedLanguage.flag}</span>
                  <div className="flex flex-col items-start">
                    <span className="font-medium">{selectedLanguage.name}</span>
                    <span className="text-xs text-muted-foreground">{selectedLanguage.nativeName}</span>
                  </div>
                </>
              ) : (
                <span className="text-muted-foreground">Select language...</span>
              )}
            </div>
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-0" align="start">
          <Command>
            <CommandInput 
              placeholder="Search languages..." 
              value={searchQuery}
              onValueChange={setSearchQuery}
            />
            <CommandList className="max-h-80">
              <CommandEmpty>No language found.</CommandEmpty>
              
              {showAutoDetect && !searchQuery && (
                <CommandGroup heading="Auto">
                  <CommandItem
                    value="auto-detect"
                    onSelect={() => {
                      onChange("auto");
                      setOpen(false);
                      setSearchQuery("");
                    }}
                    className="flex items-center gap-3 py-3"
                  >
                    <Globe className="h-5 w-5 text-accent" />
                    <div className="flex flex-col">
                      <span className="font-medium">Detect Language</span>
                      <span className="text-xs text-muted-foreground">Automatically detect</span>
                    </div>
                    <Check
                      className={cn(
                        "ml-auto h-4 w-4",
                        value === "auto" ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                </CommandGroup>
              )}

              {filteredLanguages ? (
                <CommandGroup heading="Search Results">
                  {filteredLanguages.map((lang) => (
                    <LanguageItem
                      key={lang.code}
                      language={lang}
                      isSelected={value === lang.code}
                      onSelect={() => {
                        onChange(lang.code);
                        setOpen(false);
                        setSearchQuery("");
                      }}
                    />
                  ))}
                </CommandGroup>
              ) : (
                <>
                  <CommandGroup heading="Popular">
                    {popularLanguages.map((lang) => (
                      <LanguageItem
                        key={lang.code}
                        language={lang}
                        isSelected={value === lang.code}
                        onSelect={() => {
                          onChange(lang.code);
                          setOpen(false);
                        }}
                      />
                    ))}
                  </CommandGroup>
                  
                  {Object.entries(groupedByRegion).map(([region, langs]) => (
                    <CommandGroup key={region} heading={region}>
                      {langs.map((lang) => (
                        <LanguageItem
                          key={lang.code}
                          language={lang}
                          isSelected={value === lang.code}
                          onSelect={() => {
                            onChange(lang.code);
                            setOpen(false);
                          }}
                        />
                      ))}
                    </CommandGroup>
                  ))}
                </>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}

function LanguageItem({
  language,
  isSelected,
  onSelect,
}: {
  language: Language;
  isSelected: boolean;
  onSelect: () => void;
}) {
  return (
    <CommandItem
      value={`${language.code}-${language.name}-${language.nativeName}`}
      onSelect={onSelect}
      className="flex items-center gap-3 py-2.5"
    >
      <span className="text-lg">{language.flag}</span>
      <div className="flex flex-col">
        <span className="font-medium">{language.name}</span>
        <span className="text-xs text-muted-foreground">{language.nativeName}</span>
      </div>
      <Check
        className={cn(
          "ml-auto h-4 w-4",
          isSelected ? "opacity-100" : "opacity-0"
        )}
      />
    </CommandItem>
  );
}
