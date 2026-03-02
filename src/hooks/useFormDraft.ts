import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Robust form draft persistence hook with lifecycle handling
 */
export interface UseFormDraftOptions<T> {
  debounceMs?: number;
  onRestore?: (data: T) => void;
  excludeFields?: string[];
  onSaveStart?: () => void;
  onSaveComplete?: (success: boolean) => void;
}

export const useFormDraft = <T extends Record<string, any>>(
  key: string,
  initialData: T,
  options: UseFormDraftOptions<T> = {}
) => {
  const { 
    debounceMs = 1000, 
    onRestore = null,
    excludeFields = [],
    onSaveStart = null,
    onSaveComplete = null,
  } = options;
  
  const [formData, setFormData] = useState<T>(initialData);
  const [hasDraft, setHasDraft] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [draftRestored, setDraftRestored] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);
  const isInitialized = useRef(false);
  const previousFormData = useRef<T | null>(null);
  const isMounted = useRef(true);

  // Track mounted state
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Load draft on mount
  useEffect(() => {
    if (isInitialized.current || key === 'no-draft') return;
    isInitialized.current = true;

    try {
      const savedDraft = localStorage.getItem(key);
      if (savedDraft) {
        const parsed = JSON.parse(savedDraft);
        if (parsed.data && parsed.timestamp) {
          // Merge with initial data to handle new fields
          const mergedData = { ...initialData, ...parsed.data };
          setFormData(mergedData);
          previousFormData.current = mergedData;
          setHasDraft(true);
          setLastSaved(new Date(parsed.timestamp));
          setDraftRestored(true);
          onRestore?.(mergedData);
        }
      }
    } catch (error) {
      console.error('Error loading draft:', error);
      localStorage.removeItem(key);
    }
  }, [key, initialData, onRestore]);

  // Save draft function
  const saveDraft = useCallback((data: T) => {
    if (key === 'no-draft') return;
    
    try {
      setSaveStatus('saving');
      onSaveStart?.();
      
      // Filter out excluded fields
      const dataToSave = { ...data };
      excludeFields.forEach(field => {
        delete dataToSave[field];
      });

      const draft = {
        data: dataToSave,
        timestamp: new Date().toISOString(),
        version: 1,
      };
      
      localStorage.setItem(key, JSON.stringify(draft));
      
      if (isMounted.current) {
        setHasDraft(true);
        setLastSaved(new Date());
        setSaveStatus('saved');
        onSaveComplete?.(true);
      }
      
      // Reset status after a delay
      setTimeout(() => {
        if (isMounted.current) {
          setSaveStatus('idle');
        }
      }, 2000);
      
    } catch (error) {
      console.error('Error saving draft:', error);
      if (isMounted.current) {
        setSaveStatus('error');
        onSaveComplete?.(false);
      }
    }
  }, [key, excludeFields, onSaveStart, onSaveComplete]);

  // Immediate save (for critical moments)
  const saveImmediately = useCallback(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
      debounceTimer.current = null;
    }
    saveDraft(formData);
  }, [formData, saveDraft]);

  // Auto-save with debounce
  useEffect(() => {
    if (!isInitialized.current || key === 'no-draft') return;
    
    // Check if data actually changed
    if (JSON.stringify(formData) === JSON.stringify(previousFormData.current)) {
      return;
    }
    previousFormData.current = formData;

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    setSaveStatus('saving');
    
    debounceTimer.current = setTimeout(() => {
      saveDraft(formData);
    }, debounceMs);

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [formData, key, debounceMs, saveDraft]);

  // Handle visibility change
  useEffect(() => {
    if (key === 'no-draft') return;

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        saveImmediately();
      }
    };

    const handleBeforeUnload = () => {
      saveImmediately();
    };

    const handlePageHide = () => {
      saveImmediately();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('pagehide', handlePageHide);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('pagehide', handlePageHide);
    };
  }, [key, saveImmediately]);

  const updateField = useCallback((field: keyof T, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const discardDraft = useCallback(() => {
    if (key === 'no-draft') return;
    
    try {
      localStorage.removeItem(key);
      setFormData(initialData);
      previousFormData.current = initialData;
      setHasDraft(false);
      setLastSaved(null);
      setDraftRestored(false);
      setSaveStatus('idle');
    } catch (error) {
      console.error('Error discarding draft:', error);
    }
  }, [key, initialData]);

  const clearDraftOnSubmit = useCallback(() => {
    if (key === 'no-draft') return;
    
    try {
      localStorage.removeItem(key);
      setHasDraft(false);
      setLastSaved(null);
      setSaveStatus('idle');
    } catch (error) {
      console.error('Error clearing draft:', error);
    }
  }, [key]);

  const shouldRestoreLocalDraft = useCallback((serverTimestamp: string | null) => {
    if (!lastSaved) return false;
    if (!serverTimestamp) return true;
    
    const serverDate = new Date(serverTimestamp);
    return lastSaved > serverDate;
  }, [lastSaved]);

  return {
    formData,
    setFormData,
    updateField,
    hasDraft,
    draftRestored,
    discardDraft,
    clearDraftOnSubmit,
    lastSaved,
    saveStatus,
    saveImmediately,
    shouldRestoreLocalDraft,
  };
};

export default useFormDraft;
