import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import { X } from 'lucide-react';

interface TagInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  maxTags?: number;
}

const TagInput = ({ value = [], onChange, placeholder, maxTags = 10 }: TagInputProps) => {
  const { isRTL } = useLanguage();
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [tagArMap, setTagArMap] = useState<Record<string, string>>({});
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  const normalizeTag = (tag: string) => tag.trim().replace(/\s+/g, ' ');

  const tagExists = useCallback((tag: string) => {
    const normalized = normalizeTag(tag).toLowerCase();
    return value.some(t => t.toLowerCase() === normalized);
  }, [value]);

  // Fetch Arabic names for current tags
  useEffect(() => {
    if (!value.length) return;
    const fetchArNames = async () => {
      try {
        const { data } = await supabase
          .from('tags')
          .select('name, name_ar')
          .in('name', value);
        if (data) {
          const map: Record<string, string> = {};
          data.forEach(t => { if (t.name_ar) map[t.name] = t.name_ar; });
          setTagArMap(prev => ({ ...prev, ...map }));
        }
      } catch (err) { /* ignore */ }
    };
    fetchArNames();
  }, [value]);

  const fetchSuggestions = useCallback(async (query: string) => {
    if (!query || query.length < 2) {
      setSuggestions([]);
      return;
    }
    try {
      const { data, error } = await supabase.rpc('search_tags' as any, {
        p_query: query,
        p_limit: 8
      });
      if (!error && data) {
        const filtered = (data as any[]).filter(t => !tagExists(t.name));
        setSuggestions(filtered);
      }
    } catch (err) {
      console.error('Error fetching tag suggestions:', err);
    }
  }, [tagExists]);

  useEffect(() => {
    const timer = setTimeout(() => fetchSuggestions(inputValue), 200);
    return () => clearTimeout(timer);
  }, [inputValue, fetchSuggestions]);

  const addTag = (tag: string, nameAr?: string) => {
    const normalized = normalizeTag(tag);
    if (!normalized || tagExists(normalized) || value.length >= maxTags) return;
    if (nameAr) setTagArMap(prev => ({ ...prev, [normalized]: nameAr }));
    onChange([...value, normalized]);
    setInputValue('');
    setSuggestions([]);
    setShowSuggestions(false);
    setSelectedIndex(-1);
  };

  const removeTag = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      if (selectedIndex >= 0 && suggestions[selectedIndex]) {
        const s = suggestions[selectedIndex];
        addTag(s.name, s.name_ar);
      } else if (inputValue.trim()) {
        const arabicMatch = suggestions.find(s => s.name_ar && s.name_ar === inputValue.trim());
        if (arabicMatch) {
          addTag(arabicMatch.name, arabicMatch.name_ar);
        } else {
          addTag(inputValue);
        }
      }
    } else if (e.key === 'Backspace' && !inputValue && value.length > 0) {
      removeTag(value.length - 1);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => Math.min(prev + 1, suggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => Math.max(prev - 1, -1));
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
      setSelectedIndex(-1);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        inputRef.current && !inputRef.current.contains(e.target as Node) &&
        suggestionsRef.current && !suggestionsRef.current.contains(e.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getTagDisplay = (tag: string) => {
    const arName = tagArMap[tag];
    if (isRTL && arName) return arName;
    if (!isRTL && arName) return `${tag} / ${arName}`;
    return tag;
  };

  return (
    <div className="relative">
      <div 
        className={`flex flex-wrap gap-2 p-2 min-h-[42px] border border-input rounded-md bg-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 ${isRTL ? 'flex-row-reverse' : ''}`}
        onClick={() => inputRef.current?.focus()}
      >
        {value.map((tag, index) => (
          <span 
            key={index} 
            className={`inline-flex items-center gap-1 px-2 py-1 text-sm bg-primary/10 text-primary rounded-md ${isRTL ? 'flex-row-reverse' : ''}`}
          >
            {getTagDisplay(tag)}
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); removeTag(index); }}
              className="hover:bg-primary/20 rounded-full p-0.5"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
        
        {value.length < maxTags && (
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              setShowSuggestions(true);
              setSelectedIndex(-1);
            }}
            onFocus={() => setShowSuggestions(true)}
            onKeyDown={handleKeyDown}
            placeholder={value.length === 0 ? (placeholder || (isRTL ? 'اكتب وسم بالعربية أو الإنجليزية...' : 'Type a tag in English or Arabic...')) : ''}
            className={`flex-1 min-w-[120px] bg-transparent border-none outline-none text-sm placeholder:text-muted-foreground ${isRTL ? 'text-right' : ''}`}
            dir="auto"
          />
        )}
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute z-50 w-full mt-1 py-1 bg-popover border border-border rounded-md shadow-lg max-h-48 overflow-auto"
        >
          {suggestions.map((suggestion, index) => (
            <button
              key={suggestion.id}
              type="button"
              onClick={() => addTag(suggestion.name, suggestion.name_ar)}
              className={`w-full px-3 py-2 text-sm text-left hover:bg-muted flex items-center justify-between ${
                index === selectedIndex ? 'bg-muted' : ''
              } ${isRTL ? 'flex-row-reverse text-right' : ''}`}
            >
              <span>
                {isRTL ? (
                  <>
                    {suggestion.name_ar || suggestion.name}
                    {suggestion.name_ar && (
                      <span className="text-muted-foreground ms-2">({suggestion.name})</span>
                    )}
                  </>
                ) : (
                  <>
                    {suggestion.name}
                    {suggestion.name_ar && (
                      <span className="text-muted-foreground ms-2">({suggestion.name_ar})</span>
                    )}
                  </>
                )}
              </span>
              <span className="text-xs text-muted-foreground">
                {suggestion.usage_count} {isRTL ? 'استخدام' : 'uses'}
              </span>
            </button>
          ))}
        </div>
      )}

      <p className={`text-xs text-muted-foreground mt-1 ${isRTL ? 'text-right' : ''}`}>
        {isRTL 
          ? 'اكتب بالعربية أو الإنجليزية واضغط Enter للإضافة'
          : 'Type in English or Arabic, press Enter to add'}
      </p>
    </div>
  );
};

export default TagInput;
