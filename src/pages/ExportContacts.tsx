import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Download, FileText, FileSpreadsheet, Search, X, Filter, ChevronDown, AlertCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import usePermissions, { PERMISSIONS } from '@/hooks/usePermissions';
import { getCountryName, countries } from '@/data/countries';
import { downloadExportCsv, getExporterExportableFields, profileToExportRow } from '@/lib/csv-import';
import jsPDF from 'jspdf';

const PROFILE_TYPES = [
  { value: 'journalist', label: 'Journalists', labelAr: 'صحفيين' },
  { value: 'expert', label: 'Experts', labelAr: 'خبراء' },
  { value: 'company', label: 'Companies', labelAr: 'شركات' },
  { value: 'publication', label: 'Publications', labelAr: 'منشورات' },
];

const APPROVAL_STATUSES = [
  { value: 'approved', label: 'Approved', labelAr: 'معتمد' },
  { value: 'pending', label: 'Pending', labelAr: 'قيد الانتظار' },
  { value: 'denied', label: 'Denied', labelAr: 'مرفوض' },
];

const ExportContacts = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { isRTL } = useLanguage();
  const { can, loading: permLoading, isAdmin: isAdminRole } = usePermissions();

  const [profiles, setProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [profileTypeFilter, setProfileTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('approved');
  const [countryFilter, setCountryFilter] = useState('all');
  const [selectedIds, setSelectedIds] = useState(new Set<string>());

  const canExport = can(PERMISSIONS.CAN_EXPORT_DATA);

  useEffect(() => {
    if (!authLoading && !permLoading && !canExport) {
      toast.error(isRTL ? 'غير مصرح لك بالوصول إلى هذه الصفحة' : 'You are not authorized to access this page');
      navigate('/');
    }
  }, [authLoading, permLoading, canExport, navigate, isRTL]);

  useEffect(() => {
    if (!canExport || authLoading || permLoading) return;
    fetchProfiles();
  }, [canExport, authLoading, permLoading]);

  const fetchProfiles = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('directory_profiles')
        .select('*, journalist_profiles(*), expert_profiles(*)')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setProfiles(data || []);
    } catch {
      toast.error(isRTL ? 'فشل في جلب الملفات الشخصية' : 'Failed to fetch profiles');
    } finally {
      setLoading(false);
    }
  };

  const filteredProfiles = useMemo(() => {
    return profiles.filter(p => {
      if (profileTypeFilter !== 'all' && p.profile_type !== profileTypeFilter) return false;
      if (statusFilter !== 'all' && p.approval_status !== statusFilter) return false;
      if (countryFilter !== 'all' && p.country_code !== countryFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const fields = [p.display_name, p.display_name_ar, p.headline, p.outlet_name, p.city].filter(Boolean).map(s => s.toLowerCase());
        if (!fields.some(f => f.includes(q))) return false;
      }
      return true;
    });
  }, [profiles, profileTypeFilter, statusFilter, countryFilter, searchQuery]);

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredProfiles.length) setSelectedIds(new Set());
    else setSelectedIds(new Set(filteredProfiles.map(p => p.profile_id)));
  };

  const getExportProfiles = (exportAll = false) => exportAll ? filteredProfiles : filteredProfiles.filter(p => selectedIds.has(p.profile_id));

  const normalizeForExport = (profile: any) => {
    const base = { ...profile };
    if (profile.journalist_profiles) Object.assign(base, profile.journalist_profiles);
    if (profile.expert_profiles) Object.assign(base, profile.expert_profiles);
    return base;
  };

  const getFileName = (format: string) => {
    const date = new Date().toISOString().split('T')[0];
    const typeLabel = profileTypeFilter !== 'all' ? profileTypeFilter : 'all_profiles';
    return `publishme_export_${typeLabel}_${date}.${format}`;
  };

  const exportCSV = (exportAll = false) => {
    const toExport = getExportProfiles(exportAll);
    if (toExport.length === 0) { toast.error(isRTL ? 'لا توجد ملفات للتصدير' : 'No profiles to export'); return; }
    setExporting(true);
    try {
      const effectiveType = profileTypeFilter !== 'all' ? profileTypeFilter : 'journalist';
      const normalized = toExport.map(normalizeForExport);
      downloadExportCsv(normalized, effectiveType, { accessLevel: isAdminRole ? 'admin' : 'subscriber', includeAdminFields: isAdminRole, includeBom: true }, getFileName('csv'));
      toast.success(isRTL ? `تم تصدير ${toExport.length} ملف شخصي` : `Exported ${toExport.length} profiles`);
    } catch { toast.error(isRTL ? 'فشل تصدير CSV' : 'Failed to export CSV'); }
    finally { setExporting(false); }
  };

  const exportPDF = (exportAll = false) => {
    const toExport = getExportProfiles(exportAll);
    if (toExport.length === 0) { toast.error(isRTL ? 'لا توجد ملفات للتصدير' : 'No profiles to export'); return; }
    setExporting(true);
    try {
      const doc = new jsPDF();
      const effectiveType = profileTypeFilter !== 'all' ? profileTypeFilter : 'journalist';
      doc.setFontSize(18);
      doc.text('PublishMe Contact Export', 14, 22);
      doc.setFontSize(10);
      doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 30);
      doc.text(`Total Records: ${toExport.length}`, 14, 36);
      let y = 46;
      toExport.forEach((profile, index) => {
        if (y > 260) { doc.addPage(); y = 20; }
        const normalized = normalizeForExport(profile);
        const row = profileToExportRow(normalized, effectiveType, { accessLevel: isAdminRole ? 'admin' : 'subscriber', isRTL });
        doc.setFontSize(11); doc.setFont(undefined as any, 'bold');
        doc.text(`${index + 1}. ${profile.display_name || 'Unnamed'}`, 14, y); y += 5;
        doc.setFontSize(9); doc.setFont(undefined as any, 'normal');
        const fields = getExporterExportableFields(effectiveType, { accessLevel: isAdminRole ? 'admin' : 'subscriber', includeAdminFields: isAdminRole });
        fields.forEach(field => {
          const value = row[field.key];
          if (value && field.key !== 'display_name') {
            const lines = doc.splitTextToSize(`${field.label}: ${value}`, 180);
            lines.forEach((line: string) => { if (y > 280) { doc.addPage(); y = 20; } doc.text(line, 18, y); y += 4; });
          }
        });
        y += 4;
      });
      doc.save(getFileName('pdf'));
      toast.success(isRTL ? `تم تصدير ${toExport.length} ملف شخصي` : `Exported ${toExport.length} profiles`);
    } catch { toast.error(isRTL ? 'فشل تصدير PDF' : 'Failed to export PDF'); }
    finally { setExporting(false); }
  };

  if (authLoading || permLoading) return <Layout><div className="container py-8 flex items-center justify-center min-h-[400px]"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div></Layout>;
  if (!canExport) return null;

  const isAllSelected = filteredProfiles.length > 0 && selectedIds.size === filteredProfiles.length;
  const isSomeSelected = selectedIds.size > 0;

  return (
    <Layout>
      <div className="container py-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Download className="h-5 w-5" />{isRTL ? 'تصدير جهات الاتصال' : 'Export Contacts'}</CardTitle>
            <CardDescription>{isRTL ? 'اختر الملفات الشخصية للتصدير أو صدّر جميع النتائج المصفاة' : 'Select profiles to export or export all filtered results'}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Filters */}
            <div className="flex flex-wrap gap-4 items-end">
              <div className="flex-1 min-w-[200px]">
                <label className="text-sm font-medium mb-1.5 block">{isRTL ? 'بحث' : 'Search'}</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder={isRTL ? 'اسم، مؤسسة، مدينة...' : 'Name, outlet, city...'} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9" />
                  {searchQuery && <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2"><X className="h-4 w-4 text-muted-foreground hover:text-foreground" /></button>}
                </div>
              </div>
              <div className="w-[180px]">
                <label className="text-sm font-medium mb-1.5 block">{isRTL ? 'نوع الملف الشخصي' : 'Profile Type'}</label>
                <Select value={profileTypeFilter} onValueChange={setProfileTypeFilter}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{isRTL ? 'الكل' : 'All Types'}</SelectItem>
                    {PROFILE_TYPES.map(type => <SelectItem key={type.value} value={type.value}>{isRTL ? type.labelAr : type.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="w-[150px]">
                <label className="text-sm font-medium mb-1.5 block">{isRTL ? 'الحالة' : 'Status'}</label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{isRTL ? 'الكل' : 'All'}</SelectItem>
                    {APPROVAL_STATUSES.map(s => <SelectItem key={s.value} value={s.value}>{isRTL ? s.labelAr : s.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="w-[180px]">
                <label className="text-sm font-medium mb-1.5 block">{isRTL ? 'البلد' : 'Country'}</label>
                <Select value={countryFilter} onValueChange={setCountryFilter}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent className="max-h-[300px]">
                    <SelectItem value="all">{isRTL ? 'جميع البلدان' : 'All Countries'}</SelectItem>
                    {countries.map(c => <SelectItem key={c.code} value={c.code}>{isRTL ? c.nameAr : c.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Selection + Export bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 py-3 px-4 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Checkbox checked={isAllSelected} onCheckedChange={toggleSelectAll} disabled={filteredProfiles.length === 0} />
                  <span className="text-sm font-medium">{isRTL ? 'تحديد الكل' : 'Select All'}</span>
                </div>
                {isSomeSelected && <Button variant="ghost" size="sm" onClick={() => setSelectedIds(new Set())}><X className="h-4 w-4 mr-1" />{isRTL ? 'مسح' : 'Clear'}</Button>}
                <Badge variant="secondary">{isRTL ? `محدد: ${selectedIds.size} من ${filteredProfiles.length}` : `Selected: ${selectedIds.size} of ${filteredProfiles.length}`}</Badge>
              </div>
              <div className="flex items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button disabled={selectedIds.size === 0 || exporting}><Download className="h-4 w-4 mr-2" />{isRTL ? 'تصدير المحدد' : 'Export Selected'}<ChevronDown className="h-4 w-4 ml-2" /></Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => exportCSV(false)}><FileSpreadsheet className="h-4 w-4 mr-2" />CSV</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => exportPDF(false)}><FileText className="h-4 w-4 mr-2" />PDF</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" disabled={filteredProfiles.length === 0 || exporting}><Filter className="h-4 w-4 mr-2" />{isRTL ? 'تصدير كل المصفى' : 'Export All Filtered'}<ChevronDown className="h-4 w-4 ml-2" /></Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => exportCSV(true)}><FileSpreadsheet className="h-4 w-4 mr-2" />CSV ({filteredProfiles.length})</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => exportPDF(true)}><FileText className="h-4 w-4 mr-2" />PDF ({filteredProfiles.length})</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {selectedIds.size === 0 && filteredProfiles.length > 0 && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 p-3 rounded-md">
                <AlertCircle className="h-4 w-4 text-amber-600" />
                {isRTL ? 'حدد الملفات الشخصية للتصدير أو استخدم "تصدير كل المصفى"' : 'Select profiles to export or use "Export All Filtered"'}
              </div>
            )}

            {/* Table */}
            <div className="border rounded-lg overflow-hidden">
              {loading ? (
                <div className="p-8 text-center"><Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" /></div>
              ) : filteredProfiles.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">{isRTL ? 'لا توجد ملفات شخصية مطابقة' : 'No matching profiles'}</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]"><Checkbox checked={isAllSelected} onCheckedChange={toggleSelectAll} /></TableHead>
                      <TableHead>{isRTL ? 'الاسم' : 'Name'}</TableHead>
                      <TableHead>{isRTL ? 'النوع' : 'Type'}</TableHead>
                      <TableHead>{isRTL ? 'المسمى' : 'Headline'}</TableHead>
                      <TableHead>{isRTL ? 'الموقع' : 'Location'}</TableHead>
                      <TableHead>{isRTL ? 'الحالة' : 'Status'}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProfiles.slice(0, 100).map(profile => (
                      <TableRow key={profile.profile_id} className={selectedIds.has(profile.profile_id) ? 'bg-primary/5' : ''}>
                        <TableCell><Checkbox checked={selectedIds.has(profile.profile_id)} onCheckedChange={() => toggleSelect(profile.profile_id)} /></TableCell>
                        <TableCell className="font-medium">
                          {profile.display_name}
                          {profile.display_name_ar && <span className="text-xs text-muted-foreground ml-2">({profile.display_name_ar})</span>}
                        </TableCell>
                        <TableCell><Badge variant="outline">{PROFILE_TYPES.find(t => t.value === profile.profile_type)?.[isRTL ? 'labelAr' : 'label'] || profile.profile_type}</Badge></TableCell>
                        <TableCell className="max-w-[200px] truncate">{profile.headline || '-'}</TableCell>
                        <TableCell>{[profile.city, getCountryName(profile.country_code, isRTL ? 'ar' : 'en')].filter(Boolean).join(', ') || '-'}</TableCell>
                        <TableCell>
                          <Badge variant={profile.approval_status === 'approved' ? 'default' : profile.approval_status === 'pending' ? 'secondary' : 'destructive'}>
                            {APPROVAL_STATUSES.find(s => s.value === profile.approval_status)?.[isRTL ? 'labelAr' : 'label'] || profile.approval_status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
              {filteredProfiles.length > 100 && (
                <div className="p-3 text-center text-sm text-muted-foreground border-t">
                  {isRTL ? `عرض 100 من ${filteredProfiles.length} ملف شخصي.` : `Showing 100 of ${filteredProfiles.length} profiles.`}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default ExportContacts;
