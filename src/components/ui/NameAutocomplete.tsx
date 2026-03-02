import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import { Input } from '@/components/ui/input';
import { AlertTriangle, Check } from 'lucide-react';

interface NameAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  field?: 'display_name' | 'display_name_ar';
  profileType?: 'journalist' | 'expert' | 'publication' | 'company' | null;
  currentProfileId?: string | null;
  required?: boolean;
  dir?: 'ltr' | 'rtl' | 'auto';
  className?: string;
}

const NameAutocomplete = ({ 
  value = '', 
  onChange, 
  placeholder,
  field = 'display_name',
  profileType = null,
  currentProfileId = null,
  required = false,
  dir = 'ltr',
  className = '',
}: NameAutocompleteProps) => {
  const { isRTL } = useLanguage();
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isDuplicate, setIsDuplicate] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  const searchProfiles = useCallback(async (query: string) => {
    if (!query || query.length < 2) {
      setSuggestions([]);
      setIsDuplicate(false);
      return;
    }

    setIsChecking(true);
    try {
      let queryBuilder = supabase
        .from('directory_profiles')
        .select('profile_id, display_name, display_name_ar, profile_type')
        .or(`display_name.ilike.%${query}%,display_name_ar.ilike.%${query}%`)
        .limit(10);

      if (profileType) {
        queryBuilder = queryBuilder.eq('profile_type', profileType);
      }

      if (currentProfileId) {
        queryBuilder = queryBuilder.neq('profile_id', currentProfileId);
      }

      const { data, error } = await queryBuilder;

      if (!error && data) {
        setSuggestions(data);
        
        const normalizedQuery = query.trim().toLowerCase();
        const hasDuplicate = data.some(p => 
          p.display_name?.toLowerCase() === normalizedQuery ||
          p.display_name_ar?.toLowerCase() === normalizedQuery
        );
        setIsDuplicate(hasDuplicate);
      }
    } catch (err) {
      console.error('Error searching profiles:', err);
    } finally {
      setIsChecking(false);
    }
  }, [profileType, currentProfileId]);

  useEffect(() => {
    const timer = setTimeout(() => {
      searchProfiles(value);
    }, 300);
    return () => clearTimeout(timer);
  }, [value, searchProfiles]);

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

  const getProfileTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      journalist: isRTL ? 'صحفي' : 'Journalist',
      expert: isRTL ? 'خبير' : 'Expert',
      publication: isRTL ? 'مؤسسة' : 'Publication',
      company: isRTL ? 'شركة' : 'Company',
    };
    return labels[type] || type;
  };

  return (
    <div className="relative">
      <div className="relative">
        <Input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setShowSuggestions(true)}
          placeholder={placeholder}
          required={required}
          dir={dir}
          className={`${isDuplicate ? 'border-amber-500 focus-visible:ring-amber-500' : ''} ${className}`}
        />
        {value && value.length >= 2 && (
          <div className={`absolute top-1/2 -translate-y-1/2 ${dir === 'rtl' ? 'left-3' : 'right-3'}`}>
            {isChecking ? (
              <div className="w-4 h-4 border-2 border-muted-foreground border-t-transparent rounded-full animate-spin" />
            ) : isDuplicate ? (
              <AlertTriangle className="w-4 h-4 text-amber-500" />
            ) : (
              <Check className="w-4 h-4 text-green-500" />
            )}
          </div>
        )}
      </div>

      {isDuplicate && (
        <p className={`text-xs text-amber-600 mt-1 ${isRTL ? 'text-right' : ''}`}>
          {isRTL 
            ? 'يوجد ملف شخصي بنفس الاسم بالفعل - تأكد من عدم التكرار'
            : 'A profile with this name already exists - please verify to avoid duplicates'}
        </p>
      )}

      {showSuggestions && suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute z-50 w-full mt-1 py-1 bg-popover border border-border rounded-md shadow-lg max-h-48 overflow-auto"
        >
          <div className={`px-3 py-1.5 text-xs text-muted-foreground border-b ${isRTL ? 'text-right' : ''}`}>
            {isRTL ? 'ملفات مشابهة موجودة:' : 'Similar profiles found:'}
          </div>
          {suggestions.map((profile) => (
            <div
              key={profile.profile_id}
              className={`px-3 py-2 text-sm hover:bg-muted flex items-center justify-between ${isRTL ? 'flex-row-reverse text-right' : ''}`}
            >
              <div>
                <span className="font-medium">{profile.display_name}</span>
                {profile.display_name_ar && (
                  <span className="text-muted-foreground mx-2">({profile.display_name_ar})</span>
                )}
              </div>
              <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">
                {getProfileTypeLabel(profile.profile_type)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NameAutocomplete;
