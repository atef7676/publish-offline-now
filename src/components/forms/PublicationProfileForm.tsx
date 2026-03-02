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
import DraftNotice from '@/components/forms/DraftNotice';
import AIAutoCompleteButton from '@/components/forms/AIAutoCompleteButton';
import ProfileIdentifierFields from '@/components/forms/ProfileIdentifierFields';
import { useAuditLog } from '@/hooks/useAuditLog';
import { Upload, X, Building2, Plus, Trash2 } from 'lucide-react';
import { z } from 'zod';
import { isValidWebsiteUrl, normalizeProfileUrls } from '@/utils/urlValidation';

const publicationSchema = z.object({
  display_name: z.string().trim().min(1, 'Publication name is required').max(200),
  display_name_ar: z.string().trim().max(200).optional(),
  email: z.string().trim().email().optional().or(z.literal('')),
  bio: z.string().trim().max(2000).optional(),
  city: z.string().trim().max(100).optional(),
  phone_number: z.string().trim().max(20).optional(),
  whatsapp_number: z.string().trim().max(20).optional(),
  website_url: z.string().optional(),
  linkedin_url: z.string().trim().max(200).optional(),
  twitter_handle: z.string().trim().max(100).optional(),
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

interface PublicationProfileFormProps {
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

const PublicationProfileForm = ({
  profile = null,
  userId,
  onSave,
  onCancel,
  isEditing = false,
  mode = 'user',
  showMetadata = false,
  compact = false,
  aiPrefill = null,
  aiFieldKeys = new Set<string>(),
}: PublicationProfileFormProps) => {
  const { isRTL } = useLanguage();
  const { logEvent } = useAuditLog();
  const { sectors, loading: taxonomyLoading, getLabel } = useTaxonomies();

  const [saving, setSaving] = useState(false);
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

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  const initialFormData = {
    display_name: '', display_name_ar: '', category: '',
    country_code: '', city: '', sector_ids: [] as string[],
    languages: [] as string[], tags: [] as string[],
    bio: '', bio_ar: '', email: '',
    phone_number: '', whatsapp_number: '',
    website_url: '', twitter_handle: '', linkedin_url: '',
    facebook_url: '', instagram_url: '', youtube_url: '', tumblr_url: '',
    notes: '', data_source: '', is_top_listing: false, influence_score: '',
    slug: '', username: '',
    contacts: [] as any[],
  };

  const draftKey = userId && !isEditing ? `publication-draft-${userId}` : 'no-draft';
  const {
    formData, setFormData, updateField,
    lastSaved, saveStatus, discardDraft, draftRestored, clearDraftOnSubmit,
  } = useFormDraft(draftKey, initialFormData);

  useEffect(() => {
    if (profile && isEditing) {
      const sectorIds: string[] = [];
      if (profile.sector_id) sectorIds.push(profile.sector_id);
      setFormData({
        ...initialFormData,
        display_name: profile.display_name || '',
        display_name_ar: profile.display_name_ar || '',
        category: profile.category || '',
        country_code: profile.country_code || '',
        city: profile.city || '',
        sector_ids: sectorIds,
        languages: profile.languages || [],
        tags: profile.tags || [],
        bio: profile.bio || '',
        bio_ar: profile.bio_ar || '',
        phone_number: profile.phone_number || '',
        whatsapp_number: profile.whatsapp_number || '',
        website_url: profile.website_url || '',
        twitter_handle: profile.twitter_handle || '',
        linkedin_url: profile.linkedin_url || '',
        facebook_url: profile.facebook_url || '',
        instagram_url: profile.instagram_url || '',
        youtube_url: profile.youtube_url || '',
        tumblr_url: profile.tumblr_url || '',
        notes: profile.notes || '',
        data_source: profile.data_source || '',
        is_top_listing: profile.is_top_listing || false,
        influence_score: profile.influence_score ?? '',
        slug: profile.slug || '',
        username: profile.username || '',
      });
      if (profile.avatar_url) setLogoPreview(profile.avatar_url);
    }
  }, [profile, isEditing]);

  useEffect(() => {
    if (!aiPrefill || isEditing) return;
    const mapped: any = {};
    const directFields = [
      'display_name', 'display_name_ar', 'bio', 'bio_ar', 'category',
      'country_code', 'city', 'email', 'phone_number', 'whatsapp_number',
      'website_url', 'twitter_handle', 'linkedin_url', 'facebook_url',
      'instagram_url', 'youtube_url', 'tumblr_url', 'notes', 'data_source',
    ];
    for (const key of directFields) {
      if (aiPrefill[key]) mapped[key] = aiPrefill[key];
    }
    if (aiPrefill.tags) mapped.tags = aiPrefill.tags.split(';').map((s: string) => s.trim()).filter(Boolean);
    if (aiPrefill.languages) mapped.languages = aiPrefill.languages.split(';').map((s: string) => s.trim().toLowerCase()).filter(Boolean);
    setFormData((prev: any) => ({ ...prev, ...mapped }));
  }, [aiPrefill, isEditing]);

  const toggleArrayItem = (field: string, value: string) => {
    const current = (formData as any)[field] || [];
    if (current.includes(value)) {
      updateField(field, current.filter((v: string) => v !== value));
    } else {
      updateField(field, [...current, value]);
    }
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      toast.error(isRTL ? 'يرجى اختيار صورة بصيغة JPG أو PNG أو WEBP' : 'Please select a JPG, PNG, or WEBP image'); return;
    }
    if (file.size > MAX_FILE_SIZE) {
      toast.error(isRTL ? 'حجم الملف يجب أن لا يتجاوز 2 ميجابايت' : 'File size must be less than 2MB'); return;
    }
    setLogoFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setLogoPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const removeLogo = () => {
    setLogoFile(null);
    setLogoPreview(profile?.avatar_url || null);
    if (logoInputRef.current) logoInputRef.current.value = '';
  };

  const uploadLogo = async () => {
    if (!logoFile || !userId) return null;
    const fileExt = logoFile.name.split('.').pop();
    const fileName = `${userId}/${Date.now()}.${fileExt}`;
    const { error } = await supabase.storage.from('publications').upload(fileName, logoFile, { cacheControl: '3600', upsert: true });
    if (error) throw error;
    const { data: publicUrl } = supabase.storage.from('publications').getPublicUrl(fileName);
    return publicUrl.publicUrl;
  };

  // Contact persons
  const addContact = () => {
    updateField('contacts', [...(formData.contacts || []), { id: `temp-${Date.now()}`, name: '', job_title: '', email: '', phone: '', whatsapp: '', other_details: '' }]);
  };
  const updateContact = (index: number, field: string, value: string) => {
    const updated = [...formData.contacts];
    updated[index] = { ...updated[index], [field]: value };
    updateField('contacts', updated);
  };
  const removeContact = (index: number) => {
    updateField('contacts', formData.contacts.filter((_: any, i: number) => i !== index));
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const validation = publicationSchema.safeParse({
      display_name: formData.display_name,
      display_name_ar: formData.display_name_ar || undefined,
      email: formData.email || undefined,
      bio: formData.bio || undefined,
      city: formData.city || undefined,
      phone_number: formData.phone_number || undefined,
      whatsapp_number: formData.whatsapp_number || undefined,
      website_url: formData.website_url || undefined,
      linkedin_url: formData.linkedin_url || undefined,
      twitter_handle: formData.twitter_handle || undefined,
      facebook_url: formData.facebook_url || undefined,
      instagram_url: formData.instagram_url || undefined,
      youtube_url: formData.youtube_url || undefined,
      tumblr_url: formData.tumblr_url || undefined,
    });
    if (!validation.success) { toast.error(validation.error.errors[0].message); return; }
    if (formData.website_url && !isValidWebsiteUrl(formData.website_url)) {
      toast.error(isRTL ? 'يرجى إدخال رابط موقع صالح' : 'Please enter a valid website URL'); return;
    }

    setSaving(true);
    try {
      let avatarUrl = profile?.avatar_url || null;
      if (logoFile) avatarUrl = await uploadLogo();

      const primarySectorId = formData.sector_ids.length > 0 ? formData.sector_ids[0] : null;
      const normalizedUrls = normalizeProfileUrls(formData);

      const profileData: any = {
        display_name: formData.display_name.trim(),
        display_name_ar: formData.display_name_ar?.trim() || null,
        category: formData.category || null,
        country_code: formData.country_code || null,
        city: formData.city?.trim() || null,
        sector_id: primarySectorId,
        languages: formData.languages,
        tags: formData.tags,
        bio: formData.bio?.trim() || null,
        bio_ar: formData.bio_ar?.trim() || null,
        phone_number: formData.phone_number?.trim() || null,
        whatsapp_number: formData.whatsapp_number?.trim() || null,
        avatar_url: avatarUrl,
        website_url: normalizedUrls.website_url || null,
        twitter_handle: normalizedUrls.x_url || normalizedUrls.twitter_handle || null,
        linkedin_url: normalizedUrls.linkedin_url || null,
        facebook_url: normalizedUrls.facebook_url || null,
        instagram_url: normalizedUrls.instagram_url || null,
        youtube_url: normalizedUrls.youtube_url || null,
        tumblr_url: normalizedUrls.tumblr_url || null,
        notes: formData.notes?.trim() || null,
        data_source: formData.data_source?.trim() || null,
        is_top_listing: formData.is_top_listing || false,
        influence_score: formData.influence_score !== '' ? parseInt(formData.influence_score, 10) || null : null,
        username: formData.username?.trim() || null,
      };

      if (isEditing && formData.slug && formData.slug !== profile?.slug) {
        profileData.slug = formData.slug;
      }

      let profileId: string;

      if (isEditing && profile) {
        const updatePayload = { ...profileData };
        if (profile.approval_status === 'rejected') updatePayload.approval_status = 'pending';
        const { error } = await supabase.from('directory_profiles').update(updatePayload).eq('profile_id', profile.profile_id);
        if (error) throw error;
        profileId = profile.profile_id;
        toast.success(isRTL ? 'تم تحديث المنشور' : 'Publication updated!');
        logEvent('listing.update', { targetType: 'publication', targetId: profile.profile_id, skipThrottle: true });
      } else {
        const slug = generateSlug(formData.display_name);
        const { data: newProfile, error } = await supabase.from('directory_profiles').insert({
          ...profileData, owner_user_id: userId, slug,
          profile_type: 'publication', profile_complete: true,
          approval_status: 'pending', is_public: true, is_listed: true,
          allow_subscribers_contact: true,
        }).select().single();
        if (error) throw error;
        profileId = newProfile.profile_id;
        toast.success(isRTL ? 'تم إنشاء المنشور' : 'Publication created!');
        logEvent('listing.create', { targetType: 'publication', targetId: newProfile?.profile_id, skipThrottle: true });
      }

      if (draftKey !== 'no-draft') clearDraftOnSubmit();
      onSave?.({ profile_id: profileId, display_name: formData.display_name });
    } catch (error) {
      console.error('Error saving publication:', error);
      toast.error(isRTL ? 'حدث خطأ أثناء الحفظ' : 'Error saving publication');
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
          <AIAutoCompleteButton formData={formData} profileType="publication" onComplete={handleAIComplete} />
        </div>
      )}

      {/* Identity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            {isRTL ? 'معلومات المنشور' : 'Publication Information'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>{isRTL ? 'الشعار' : 'Logo'}</Label>
            <div className="flex items-center gap-4 mt-2">
              <div className="w-20 h-20 rounded-lg border-2 border-dashed border-border flex items-center justify-center overflow-hidden bg-muted">
                {logoPreview ? <img src={logoPreview} alt="Logo" className="w-full h-full object-cover" /> : <Building2 className="w-8 h-8 text-muted-foreground" />}
              </div>
              <div className="flex gap-2">
                <Button type="button" variant="outline" size="sm" onClick={() => logoInputRef.current?.click()}>
                  <Upload className="w-4 h-4 mr-2" />{isRTL ? 'رفع' : 'Upload'}
                </Button>
                {logoPreview && <Button type="button" variant="ghost" size="sm" onClick={removeLogo}><X className="w-4 h-4" /></Button>}
              </div>
              <input ref={logoInputRef} type="file" accept="image/*" className="hidden" onChange={handleLogoChange} />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label>{isRTL ? 'اسم المنشور *' : 'Publication Name *'}</Label>
              <Input value={formData.display_name} onChange={(e) => updateField('display_name', e.target.value)} required className={aiRing('display_name')} />
            </div>
            <div>
              <Label>{isRTL ? 'الاسم بالعربية' : 'Arabic Name'}</Label>
              <Input value={formData.display_name_ar} onChange={(e) => updateField('display_name_ar', e.target.value)} dir="rtl" className={aiRing('display_name_ar')} />
            </div>
          </div>

          <ProfileIdentifierFields slug={formData.slug} username={formData.username} onSlugChange={(v) => updateField('slug', v)} onUsernameChange={(v) => updateField('username', v)} profileId={profile?.profile_id} mode={mode} />

          <div>
            <Label>{isRTL ? 'التصنيف' : 'Category'}</Label>
            <Input value={formData.category} onChange={(e) => updateField('category', e.target.value)} className={aiRing('category')} />
          </div>
        </CardContent>
      </Card>

      {/* Location & Coverage */}
      <Card>
        <CardHeader><CardTitle>{isRTL ? 'الموقع والتغطية' : 'Location & Coverage'}</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label>{isRTL ? 'الدولة' : 'Country'}</Label>
              <Select value={formData.country_code} onValueChange={(v) => updateField('country_code', v)}>
                <SelectTrigger><SelectValue placeholder={isRTL ? 'اختر الدولة' : 'Select country'} /></SelectTrigger>
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

          <div>
            <Label className="mb-2 block">{isRTL ? 'القطاعات' : 'Sectors'}</Label>
            <div className="grid grid-cols-2 gap-2">
              {sectors.map(sector => (
                <div key={sector.id} className="flex items-center space-x-2 rtl:space-x-reverse">
                  <Checkbox id={`pub-sector-${sector.id}`} checked={formData.sector_ids?.includes(sector.id)} onCheckedChange={() => toggleArrayItem('sector_ids', sector.id)} />
                  <label htmlFor={`pub-sector-${sector.id}`} className="text-sm cursor-pointer">{getLabel(sector)}</label>
                </div>
              ))}
            </div>
          </div>

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

          <div>
            <Label className="mb-2 block">{isRTL ? 'الوسوم' : 'Tags'}</Label>
            <TagInput value={formData.tags || []} onChange={(tags) => updateField('tags', tags)} placeholder={isRTL ? 'اكتب واضغط Enter...' : 'Type and press Enter...'} maxTags={10} />
          </div>
        </CardContent>
      </Card>

      {/* About */}
      <Card>
        <CardHeader><CardTitle>{isRTL ? 'عن المنشور' : 'About'}</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>{isRTL ? 'نبذة' : 'Description'}</Label>
            <Textarea value={formData.bio} onChange={(e) => updateField('bio', e.target.value)} rows={4} className={aiRing('bio')} />
          </div>
          <div>
            <Label>{isRTL ? 'الوصف بالعربية' : 'Description (Arabic)'}</Label>
            <Textarea value={formData.bio_ar} onChange={(e) => updateField('bio_ar', e.target.value)} rows={4} dir="rtl" className={aiRing('bio_ar')} />
          </div>
        </CardContent>
      </Card>

      {/* Contact */}
      <Card>
        <CardHeader><CardTitle>{isRTL ? 'معلومات الاتصال' : 'Contact Information'}</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div><Label>{isRTL ? 'البريد الإلكتروني' : 'Email'}</Label><Input type="email" value={formData.email} onChange={(e) => updateField('email', e.target.value)} className={aiRing('email')} /></div>
            <div><Label>{isRTL ? 'الموقع الإلكتروني' : 'Website'}</Label><Input value={formData.website_url} onChange={(e) => updateField('website_url', e.target.value)} placeholder="https://..." className={aiRing('website_url')} /></div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div><Label>{isRTL ? 'رقم الهاتف' : 'Phone'}</Label><Input value={formData.phone_number} onChange={(e) => updateField('phone_number', e.target.value)} /></div>
            <div><Label>{isRTL ? 'واتساب' : 'WhatsApp'}</Label><Input value={formData.whatsapp_number} onChange={(e) => updateField('whatsapp_number', e.target.value)} /></div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div><Label>Twitter / X</Label><Input value={formData.twitter_handle} onChange={(e) => updateField('twitter_handle', e.target.value)} className={aiRing('twitter_handle')} /></div>
            <div><Label>LinkedIn</Label><Input value={formData.linkedin_url} onChange={(e) => updateField('linkedin_url', e.target.value)} className={aiRing('linkedin_url')} /></div>
          </div>

          {/* Contact Persons */}
          <div className="space-y-3 pt-4 border-t">
            <div className="flex items-center justify-between">
              <Label className="text-base font-semibold">{isRTL ? 'جهات الاتصال' : 'Contact Persons'}</Label>
              <Button type="button" variant="outline" size="sm" onClick={addContact}><Plus className="w-4 h-4 mr-1" />{isRTL ? 'إضافة' : 'Add'}</Button>
            </div>
            {formData.contacts?.map((contact: any, idx: number) => (
              <div key={contact.id || idx} className="grid sm:grid-cols-3 gap-2 p-3 border rounded-lg relative">
                <Input placeholder={isRTL ? 'الاسم' : 'Name'} value={contact.name} onChange={(e) => updateContact(idx, 'name', e.target.value)} />
                <Input placeholder={isRTL ? 'المسمى' : 'Title'} value={contact.job_title} onChange={(e) => updateContact(idx, 'job_title', e.target.value)} />
                <Input placeholder={isRTL ? 'البريد' : 'Email'} value={contact.email} onChange={(e) => updateContact(idx, 'email', e.target.value)} />
                <Input placeholder={isRTL ? 'الهاتف' : 'Phone'} value={contact.phone} onChange={(e) => updateContact(idx, 'phone', e.target.value)} />
                <div className="flex items-end">
                  <Button type="button" variant="ghost" size="sm" onClick={() => removeContact(idx)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                </div>
              </div>
            ))}
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

export default PublicationProfileForm;
