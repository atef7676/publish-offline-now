import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import useTaxonomies from '@/hooks/useTaxonomies';
import useFormDraft from '@/hooks/useFormDraft';
import { countries } from '@/data/countries';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import TagInput from '@/components/ui/TagInput';
import NameAutocomplete from '@/components/ui/NameAutocomplete';
import DraftNotice from '@/components/forms/DraftNotice';
import AIAutoCompleteButton from '@/components/forms/AIAutoCompleteButton';
import ProfileIdentifierFields from '@/components/forms/ProfileIdentifierFields';
import { useAuditLog } from '@/hooks/useAuditLog';
import { Upload, X, User } from 'lucide-react';
import { z } from 'zod';
import { isValidWebsiteUrl, isValidLinkedInUrl, normalizeProfileUrls } from '@/utils/urlValidation';

const journalistSchema = z.object({
  display_name: z.string().trim().min(1, 'Name is required').max(100),
  display_name_ar: z.string().trim().max(100).optional(),
  email: z.string().trim().email().optional().or(z.literal('')),
  headline: z.string().trim().max(200).optional(),
  bio: z.string().trim().max(2000).optional(),
  city: z.string().trim().max(100).optional(),
  phone_number: z.string().trim().max(20).optional(),
  whatsapp_number: z.string().trim().max(20).optional(),
  website_url: z.string().optional(),
  twitter_handle: z.string().trim().max(100).optional(),
  linkedin_url: z.string().optional(),
  facebook_url: z.string().trim().max(200).optional(),
  instagram_url: z.string().trim().max(200).optional(),
  youtube_url: z.string().trim().max(200).optional(),
  tumblr_url: z.string().trim().max(200).optional(),
});

const ALLOWED_LANGUAGES = [
  { key: 'english', name: 'English', name_ar: 'الإنجليزية' },
  { key: 'arabic', name: 'Arabic', name_ar: 'العربية' },
  { key: 'french', name: 'French', name_ar: 'الفرنسية' },
];

const MAX_FILE_SIZE = 2 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

const generateSlug = (name: string) => {
  return name.toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim() + '-' + Date.now().toString(36);
};

const TITLE_OPTIONS = [
  { key: 'Mr', label: 'Mr', label_ar: 'السيد' },
  { key: 'Ms', label: 'Ms', label_ar: 'السيدة' },
  { key: 'Mx', label: 'Mx', label_ar: 'السيد/ة' },
];

interface JournalistProfileFormProps {
  profile?: any;
  userId?: string;
  onSave?: (data?: any) => void;
  onCancel?: () => void;
  isEditing?: boolean;
  mode?: 'register' | 'user' | 'admin';
  showMetadata?: boolean;
  compact?: boolean;
  aiPrefill?: any;
  aiFieldKeys?: Set<string>;
}

const JournalistProfileForm = ({
  profile = null,
  userId,
  onSave,
  onCancel,
  isEditing = false,
  mode = 'user',
  showMetadata = true,
  compact = false,
  aiPrefill = null,
  aiFieldKeys = new Set<string>(),
}: JournalistProfileFormProps) => {
  const { isRTL } = useLanguage();
  const { logEvent } = useAuditLog();
  const { sectors, mediaRoles, employmentStatus, loading: taxonomyLoading, getLabel } = useTaxonomies();

  const [localAiFieldKeys, setLocalAiFieldKeys] = useState(new Set(aiFieldKeys));
  const aiRing = (fieldKey: string) =>
    localAiFieldKeys.has(fieldKey) ? 'ring-2 ring-amber-400/60 ring-offset-1' : '';

  const handleAIComplete = (aiData: any, filledKeys: Set<string>) => {
    const updates: any = {};
    for (const [key, value] of Object.entries(aiData)) {
      if (key === 'tags' && typeof value === 'string') {
        updates.tags = value.split(';').map((s: string) => s.trim()).filter(Boolean);
      } else if (key === 'languages' && typeof value === 'string') {
        updates.languages = value.split(';').map((s: string) => s.trim().toLowerCase()).filter(Boolean);
      } else {
        updates[key] = value;
      }
    }
    setFormData((prev: any) => ({ ...prev, ...updates }));
    setLocalAiFieldKeys(new Set([...localAiFieldKeys, ...filledKeys]));
  };

  const [saving, setSaving] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const initialFormData = {
    title: '', first_name: '', last_name: '',
    display_name: '', display_name_ar: '', email: '',
    headline: '', headline_ar: '', bio: '',
    country_code: '', city: '', languages: [] as string[],
    sector_ids: [] as string[], media_role: '', employment_status: '',
    outlet_name: '', phone_number: '', whatsapp_number: '',
    show_email_to_subscribers: false, show_phone_to_subscribers: false,
    show_whatsapp_to_subscribers: false,
    website_url: '', twitter_handle: '', linkedin_url: '',
    facebook_url: '', instagram_url: '', youtube_url: '', tumblr_url: '',
    tags: [] as string[], notes: '', data_source: '',
    is_top_listing: false, influence_score: '',
    slug: '', username: '',
  };

  const draftKey = userId && !isEditing ? `journalist-draft-${userId}` : 'no-draft';
  const {
    formData, setFormData, updateField: draftUpdateField,
    hasDraft, draftRestored, discardDraft, clearDraftOnSubmit,
    lastSaved, saveStatus,
  } = useFormDraft(draftKey, initialFormData, { debounceMs: 1000, excludeFields: [] });

  useEffect(() => {
    if (profile) {
      const sectorIds: string[] = [];
      if (profile.sector_id) sectorIds.push(profile.sector_id);
      setFormData({
        ...initialFormData,
        title: profile.title || '',
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        display_name: profile.display_name || '',
        display_name_ar: profile.display_name_ar || '',
        headline: profile.headline || '',
        headline_ar: profile.journalist_profile?.job_title_ar || '',
        bio: profile.bio || '',
        country_code: profile.country_code || '',
        city: profile.city || '',
        languages: profile.languages || [],
        sector_ids: sectorIds,
        media_role: profile.media_role || '',
        employment_status: profile.employment_status || '',
        outlet_name: profile.outlet_name || '',
        phone_number: profile.phone_number || '',
        whatsapp_number: profile.whatsapp_number || '',
        show_email_to_subscribers: profile.show_email_to_subscribers || false,
        show_phone_to_subscribers: profile.show_phone_to_subscribers || false,
        show_whatsapp_to_subscribers: profile.show_whatsapp_to_subscribers || false,
        website_url: profile.website_url || '',
        twitter_handle: profile.twitter_handle || '',
        linkedin_url: profile.linkedin_url || '',
        facebook_url: profile.facebook_url || '',
        instagram_url: profile.instagram_url || '',
        youtube_url: profile.youtube_url || '',
        tumblr_url: profile.tumblr_url || '',
        tags: profile.tags || [],
        notes: profile.notes || '',
        data_source: profile.data_source || '',
        is_top_listing: profile.is_top_listing || false,
        influence_score: profile.influence_score ?? '',
        slug: profile.slug || '',
        username: profile.username || '',
      });
      if (profile.avatar_url) setAvatarPreview(profile.avatar_url);
    }
  }, [profile]);

  useEffect(() => {
    if (!aiPrefill || isEditing) return;
    const mapped: any = {};
    const directFields = [
      'title', 'first_name', 'last_name', 'display_name', 'display_name_ar',
      'headline', 'headline_ar', 'bio', 'country_code', 'city',
      'media_role', 'employment_status', 'outlet_name',
      'email', 'phone_number', 'whatsapp_number',
      'website_url', 'twitter_handle', 'linkedin_url',
      'facebook_url', 'instagram_url', 'youtube_url', 'tumblr_url',
      'notes', 'data_source',
    ];
    for (const key of directFields) {
      if (aiPrefill[key]) mapped[key] = aiPrefill[key];
    }
    if (aiPrefill.tags) mapped.tags = aiPrefill.tags.split(';').map((s: string) => s.trim()).filter(Boolean);
    if (aiPrefill.languages) mapped.languages = aiPrefill.languages.split(';').map((s: string) => s.trim().toLowerCase()).filter(Boolean);
    setFormData((prev: any) => ({ ...prev, ...mapped }));
  }, [aiPrefill, isEditing]);

  useEffect(() => {
    const fetchUserEmail = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.email && !formData.email) {
        setFormData((prev: any) => ({ ...prev, email: user.email }));
      }
    };
    fetchUserEmail();
  }, []);

  const updateField = (field: string, value: any) => draftUpdateField(field, value);

  const toggleArrayItem = (field: string, item: string) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: prev[field].includes(item)
        ? prev[field].filter((i: string) => i !== item)
        : [...prev[field], item]
    }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      toast.error(isRTL ? 'يرجى اختيار صورة بصيغة JPG أو PNG أو WEBP' : 'Please select a JPG, PNG, or WEBP image');
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      toast.error(isRTL ? 'حجم الملف يجب أن لا يتجاوز 2 ميجابايت' : 'File size must be less than 2MB');
      return;
    }
    setAvatarFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setAvatarPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const removeAvatar = () => {
    setAvatarFile(null);
    setAvatarPreview(profile?.avatar_url || null);
    if (avatarInputRef.current) avatarInputRef.current.value = '';
  };

  const uploadAvatar = async () => {
    if (!avatarFile || !userId) return null;
    const fileExt = avatarFile.name.split('.').pop();
    const fileName = `${userId}/${Date.now()}.${fileExt}`;
    const { error } = await supabase.storage
      .from('avatars')
      .upload(fileName, avatarFile, { cacheControl: '3600', upsert: true });
    if (error) throw error;
    const { data: publicUrl } = supabase.storage.from('avatars').getPublicUrl(fileName);
    return publicUrl.publicUrl;
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const validation = journalistSchema.safeParse({
      display_name: formData.display_name,
      display_name_ar: formData.display_name_ar || undefined,
      email: formData.email || undefined,
      headline: formData.headline || undefined,
      bio: formData.bio || undefined,
      city: formData.city || undefined,
      phone_number: formData.phone_number || undefined,
      whatsapp_number: formData.whatsapp_number || undefined,
      website_url: formData.website_url || undefined,
      twitter_handle: formData.twitter_handle || undefined,
      linkedin_url: formData.linkedin_url || undefined,
      facebook_url: formData.facebook_url || undefined,
      instagram_url: formData.instagram_url || undefined,
      youtube_url: formData.youtube_url || undefined,
      tumblr_url: formData.tumblr_url || undefined,
    });
    if (!validation.success) { toast.error(validation.error.errors[0].message); return; }
    if (formData.website_url && !isValidWebsiteUrl(formData.website_url)) {
      toast.error(isRTL ? 'يرجى إدخال رابط موقع صالح' : 'Please enter a valid website URL'); return;
    }
    if (formData.linkedin_url && !isValidLinkedInUrl(formData.linkedin_url)) {
      toast.error(isRTL ? 'يرجى إدخال رابط LinkedIn كامل' : 'Please enter a full LinkedIn URL'); return;
    }
    if (formData.languages.length === 0) {
      toast.error(isRTL ? 'يرجى اختيار لغة واحدة على الأقل' : 'Please select at least one language'); return;
    }

    setSaving(true);
    try {
      let avatarUrl = profile?.avatar_url || null;
      if (avatarFile) avatarUrl = await uploadAvatar();

      const normalizedUrls = normalizeProfileUrls(formData);
      const primarySectorId = formData.sector_ids.length > 0 ? formData.sector_ids[0] : null;

      const profileData: any = {
        title: formData.title || null,
        first_name: formData.first_name?.trim() || null,
        last_name: formData.last_name?.trim() || null,
        display_name: formData.display_name.trim(),
        display_name_ar: formData.display_name_ar?.trim() || null,
        headline: formData.headline?.trim() || null,
        bio: formData.bio?.trim() || null,
        country_code: formData.country_code || null,
        city: formData.city?.trim() || null,
        languages: formData.languages,
        sector_id: primarySectorId,
        media_role: formData.media_role || null,
        employment_status: formData.employment_status || null,
        outlet_name: formData.outlet_name?.trim() || null,
        phone_number: formData.phone_number?.trim() || null,
        whatsapp_number: formData.whatsapp_number?.trim() || null,
        show_email_to_subscribers: formData.show_email_to_subscribers,
        show_phone_to_subscribers: formData.show_phone_to_subscribers,
        show_whatsapp_to_subscribers: formData.show_whatsapp_to_subscribers,
        avatar_url: avatarUrl,
        website_url: normalizedUrls.website_url || null,
        twitter_handle: normalizedUrls.x_url || normalizedUrls.twitter_handle || null,
        linkedin_url: normalizedUrls.linkedin_url || null,
        facebook_url: normalizedUrls.facebook_url || null,
        instagram_url: normalizedUrls.instagram_url || null,
        youtube_url: normalizedUrls.youtube_url || null,
        tumblr_url: normalizedUrls.tumblr_url || null,
        tags: formData.tags,
        notes: formData.notes?.trim() || null,
        data_source: formData.data_source?.trim() || null,
        is_top_listing: formData.is_top_listing || false,
        influence_score: formData.influence_score !== '' ? parseInt(formData.influence_score, 10) || null : null,
        username: formData.username?.trim() || null,
      };

      if (isEditing && formData.slug && formData.slug !== profile?.slug) {
        profileData.slug = formData.slug;
      }

      if (isEditing && profile) {
        const updatePayload = { ...profileData };
        if (profile.approval_status === 'rejected') updatePayload.approval_status = 'pending';
        const { error } = await supabase
          .from('directory_profiles')
          .update(updatePayload)
          .eq('profile_id', profile.profile_id);
        if (error) throw error;

        await supabase
          .from('journalist_profiles')
          .upsert({ directory_profile_id: profile.profile_id, job_title_ar: formData.headline_ar?.trim() || null }, { onConflict: 'directory_profile_id' });

        toast.success(isRTL ? 'تم تحديث الملف الشخصي' : 'Profile updated!');
        logEvent('listing.update', { targetType: 'journalist', targetId: profile.profile_id, skipThrottle: true });
      } else {
        const slug = generateSlug(formData.display_name);
        const { data: newProfile, error } = await supabase
          .from('directory_profiles')
          .insert({
            ...profileData, owner_user_id: userId, slug,
            profile_type: 'journalist', profile_complete: true,
            approval_status: 'pending', is_public: true, is_listed: true,
            allow_subscribers_contact: true,
          })
          .select()
          .single();
        if (error) throw error;
        if (newProfile) {
          await supabase.from('journalist_profiles').insert({
            directory_profile_id: newProfile.profile_id,
            job_title_ar: formData.headline_ar?.trim() || null,
          });
        }
        toast.success(isRTL ? 'تم إنشاء الملف الشخصي' : 'Profile created!');
        logEvent('listing.create', { targetType: 'journalist', targetId: newProfile?.profile_id, skipThrottle: true });
      }

      if (draftKey !== 'no-draft') clearDraftOnSubmit();
      onSave?.();
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error(isRTL ? 'حدث خطأ أثناء الحفظ' : 'Error saving profile');
    } finally {
      setSaving(false);
    }
  };

  if (taxonomyLoading) return <LoadingSpinner className="py-8" />;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {(draftRestored || saveStatus !== 'idle') && !isEditing && (
        <DraftNotice lastSaved={lastSaved} onDiscard={discardDraft} saveStatus={saveStatus} />
      )}

      {isEditing && (
        <div className="flex justify-end">
          <AIAutoCompleteButton formData={formData} profileType="journalist" onComplete={handleAIComplete} />
        </div>
      )}

      {/* Basic Info */}
      <Card>
        <CardHeader><CardTitle>{isRTL ? 'المعلومات الأساسية' : 'Basic Information'}</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {/* Avatar */}
          <div>
            <Label className="mb-2 block">{isRTL ? 'صورة الملف الشخصي' : 'Profile Photo'}</Label>
            <div className="flex items-center gap-4">
              <div className="relative w-20 h-20 rounded-full bg-muted flex items-center justify-center overflow-hidden border-2 border-border">
                {avatarPreview ? (
                  <>
                    <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                    <button type="button" onClick={removeAvatar} className="absolute top-0 right-0 bg-destructive text-destructive-foreground rounded-full p-1"><X className="w-3 h-3" /></button>
                  </>
                ) : (<User className="w-8 h-8 text-muted-foreground" />)}
              </div>
              <div>
                <input ref={avatarInputRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={handleAvatarChange} className="hidden" />
                <Button type="button" variant="outline" size="sm" onClick={() => avatarInputRef.current?.click()}>
                  <Upload className="w-4 h-4 mr-2" />{isRTL ? 'رفع صورة' : 'Upload'}
                </Button>
                <p className="text-xs text-muted-foreground mt-1">{isRTL ? 'JPG, PNG - حد أقصى 2MB' : 'JPG, PNG - Max 2MB'}</p>
              </div>
            </div>
          </div>

          {/* Title */}
          <div>
            <Label>{isRTL ? 'اللقب' : 'Title'}</Label>
            <Select value={formData.title} onValueChange={(v) => updateField('title', v)}>
              <SelectTrigger className={aiRing('title')}><SelectValue placeholder={isRTL ? 'اختر اللقب' : 'Select title'} /></SelectTrigger>
              <SelectContent>
                {TITLE_OPTIONS.map(t => <SelectItem key={t.key} value={t.key}>{isRTL ? t.label_ar : t.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          {/* Name fields */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label>{isRTL ? 'الاسم الأول' : 'First Name'}</Label>
              <Input className={aiRing('first_name')} value={formData.first_name} onChange={(e) => updateField('first_name', e.target.value)} />
            </div>
            <div>
              <Label>{isRTL ? 'اسم العائلة' : 'Last Name'}</Label>
              <Input className={aiRing('last_name')} value={formData.last_name} onChange={(e) => updateField('last_name', e.target.value)} />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label>{isRTL ? 'الاسم (بالإنجليزية) *' : 'Display Name (English) *'}</Label>
              <NameAutocomplete value={formData.display_name} onChange={(v) => updateField('display_name', v)} placeholder={isRTL ? 'الاسم الكامل بالإنجليزية' : 'Full name in English'} profileType="journalist" currentProfileId={profile?.profile_id} required />
            </div>
            <div>
              <Label>{isRTL ? 'الاسم (بالعربية)' : 'Display Name (Arabic)'}</Label>
              <NameAutocomplete value={formData.display_name_ar} onChange={(v) => updateField('display_name_ar', v)} placeholder="الاسم الكامل بالعربية" field="display_name_ar" profileType="journalist" currentProfileId={profile?.profile_id} dir="rtl" />
            </div>
          </div>

          <ProfileIdentifierFields slug={formData.slug} username={formData.username} onSlugChange={(v) => updateField('slug', v)} onUsernameChange={(v) => updateField('username', v)} profileId={profile?.profile_id} mode={mode} />

          {/* Job Title */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label>{isRTL ? 'المسمى الوظيفي (بالإنجليزية)' : 'Job Title (English)'}</Label>
              <Input className={aiRing('headline')} value={formData.headline} onChange={(e) => updateField('headline', e.target.value)} placeholder={isRTL ? 'مثال: Senior Editor' : 'e.g., Senior Editor'} />
            </div>
            <div>
              <Label>{isRTL ? 'المسمى الوظيفي (بالعربية)' : 'Job Title (Arabic)'}</Label>
              <Input className={aiRing('headline_ar')} value={formData.headline_ar} onChange={(e) => updateField('headline_ar', e.target.value)} placeholder="مثال: محرر أول" dir="rtl" />
            </div>
          </div>

          {/* Bio */}
          <div>
            <Label>{isRTL ? 'نبذة عنك' : 'Bio'}</Label>
            <Textarea className={aiRing('bio')} value={formData.bio} onChange={(e) => updateField('bio', e.target.value)} rows={3} />
          </div>

          {/* Location */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label>{isRTL ? 'الدولة' : 'Country'}</Label>
              <Select value={formData.country_code} onValueChange={(v) => updateField('country_code', v)}>
                <SelectTrigger className={aiRing('country_code')}><SelectValue placeholder={isRTL ? 'اختر الدولة' : 'Select country'} /></SelectTrigger>
                <SelectContent className="max-h-[300px]">
                  {countries.map(c => <SelectItem key={c.code} value={c.code}>{isRTL ? c.nameAr : c.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>{isRTL ? 'المدينة' : 'City'}</Label>
              <Input value={formData.city} onChange={(e) => updateField('city', e.target.value)} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Professional Info */}
      <Card>
        <CardHeader><CardTitle>{isRTL ? 'المعلومات المهنية' : 'Professional Information'}</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label>{isRTL ? 'الدور الإعلامي' : 'Media Role'}</Label>
              <Select value={formData.media_role} onValueChange={(v) => updateField('media_role', v)}>
                <SelectTrigger><SelectValue placeholder={isRTL ? 'اختر الدور' : 'Select role'} /></SelectTrigger>
                <SelectContent>{mediaRoles.map(r => <SelectItem key={r.key} value={r.key}>{getLabel(r)}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <Label>{isRTL ? 'حالة التوظيف' : 'Employment Status'}</Label>
              <Select value={formData.employment_status} onValueChange={(v) => updateField('employment_status', v)}>
                <SelectTrigger><SelectValue placeholder={isRTL ? 'اختر الحالة' : 'Select status'} /></SelectTrigger>
                <SelectContent>{employmentStatus.map(s => <SelectItem key={s.key} value={s.key}>{getLabel(s)}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label>{isRTL ? 'المؤسسة الإعلامية' : 'Publication / Outlet'}</Label>
            <Input className={aiRing('outlet_name')} value={formData.outlet_name} onChange={(e) => updateField('outlet_name', e.target.value)} placeholder={isRTL ? 'مثال: الجزيرة' : 'e.g., Al Jazeera'} />
          </div>

          {/* Sectors */}
          <div>
            <Label className="mb-2 block">{isRTL ? 'القطاعات / المواضيع' : 'Sectors / Topics'}</Label>
            <div className="grid grid-cols-2 gap-2">
              {sectors.map(sector => (
                <div key={sector.id} className="flex items-center space-x-2 rtl:space-x-reverse">
                  <Checkbox id={`sector-${sector.id}`} checked={formData.sector_ids?.includes(sector.id)} onCheckedChange={() => toggleArrayItem('sector_ids', sector.id)} />
                  <label htmlFor={`sector-${sector.id}`} className="text-sm cursor-pointer">{getLabel(sector)}</label>
                </div>
              ))}
            </div>
          </div>

          {/* Languages */}
          <div>
            <Label className="mb-2 block">{isRTL ? 'اللغات' : 'Languages'}</Label>
            <div className="flex flex-wrap gap-2">
              {ALLOWED_LANGUAGES.map(lang => (
                <button key={lang.key} type="button" onClick={() => toggleArrayItem('languages', lang.key)}
                  className={`px-3 py-1 text-sm rounded-full border transition-colors ${formData.languages?.includes(lang.key) ? 'bg-primary text-primary-foreground border-primary' : 'bg-background border-border hover:border-primary'}`}
                >{isRTL ? lang.name_ar : lang.name}</button>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div>
            <Label className="mb-2 block">{isRTL ? 'الوسوم' : 'Tags'}</Label>
            <TagInput value={formData.tags || []} onChange={(tags) => updateField('tags', tags)} placeholder={isRTL ? 'اكتب واضغط Enter...' : 'Type and press Enter...'} maxTags={10} />
          </div>
        </CardContent>
      </Card>

      {/* Contact Info */}
      <Card>
        <CardHeader><CardTitle>{isRTL ? 'معلومات الاتصال' : 'Contact Information'}</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label>{isRTL ? 'البريد الإلكتروني' : 'Email'}</Label>
              <Input type="email" value={formData.email} onChange={(e) => updateField('email', e.target.value)} className={aiRing('email')} />
            </div>
            <div>
              <Label>{isRTL ? 'الموقع الإلكتروني' : 'Website'}</Label>
              <Input value={formData.website_url} onChange={(e) => updateField('website_url', e.target.value)} placeholder="https://..." className={aiRing('website_url')} />
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label>{isRTL ? 'رقم الهاتف' : 'Phone'}</Label>
              <Input value={formData.phone_number} onChange={(e) => updateField('phone_number', e.target.value)} className={aiRing('phone_number')} />
            </div>
            <div>
              <Label>{isRTL ? 'واتساب' : 'WhatsApp'}</Label>
              <Input value={formData.whatsapp_number} onChange={(e) => updateField('whatsapp_number', e.target.value)} className={aiRing('whatsapp_number')} />
            </div>
          </div>

          {/* Social Media */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div><Label>Twitter / X</Label><Input value={formData.twitter_handle} onChange={(e) => updateField('twitter_handle', e.target.value)} placeholder="@handle" className={aiRing('twitter_handle')} /></div>
            <div><Label>LinkedIn</Label><Input value={formData.linkedin_url} onChange={(e) => updateField('linkedin_url', e.target.value)} placeholder="https://linkedin.com/in/..." className={aiRing('linkedin_url')} /></div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div><Label>Facebook</Label><Input value={formData.facebook_url} onChange={(e) => updateField('facebook_url', e.target.value)} className={aiRing('facebook_url')} /></div>
            <div><Label>Instagram</Label><Input value={formData.instagram_url} onChange={(e) => updateField('instagram_url', e.target.value)} className={aiRing('instagram_url')} /></div>
          </div>
        </CardContent>
      </Card>

      {/* Admin Metadata */}
      {showMetadata && mode === 'admin' && (
        <Card>
          <CardHeader><CardTitle>{isRTL ? 'بيانات إدارية' : 'Admin Metadata'}</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div><Label>{isRTL ? 'ملاحظات' : 'Notes'}</Label><Textarea value={formData.notes} onChange={(e) => updateField('notes', e.target.value)} rows={2} /></div>
            <div><Label>{isRTL ? 'مصدر البيانات' : 'Data Source'}</Label><Input value={formData.data_source} onChange={(e) => updateField('data_source', e.target.value)} /></div>
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      <div className="flex justify-end gap-3">
        {onCancel && <Button type="button" variant="outline" onClick={onCancel}>{isRTL ? 'إلغاء' : 'Cancel'}</Button>}
        <Button type="submit" disabled={saving}>
          {saving ? (isRTL ? 'جارٍ الحفظ...' : 'Saving...') : (isRTL ? 'حفظ' : 'Save')}
        </Button>
      </div>
    </form>
  );
};

export default JournalistProfileForm;
