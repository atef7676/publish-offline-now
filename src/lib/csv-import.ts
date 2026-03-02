// Simplified CSV Import/Export Library
// This is a simplified version of the full engine for the current migration step.

export interface ExportOptions {
  accessLevel: 'admin' | 'subscriber' | 'public';
  includeAdminFields?: boolean;
  includeBom?: boolean;
  isRTL?: boolean;
}

export const getExporterExportableFields = (profileType: string, options: ExportOptions) => {
  // Basic fields available for all types
  const fields = [
    { key: 'display_name', label: 'Display Name' },
    { key: 'display_name_ar', label: 'Arabic Name' },
    { key: 'headline', label: 'Headline' },
    { key: 'email', label: 'Email' },
    { key: 'phone_number', label: 'Phone' },
    { key: 'whatsapp_number', label: 'WhatsApp' },
    { key: 'country_code', label: 'Country' },
    { key: 'city', label: 'City' },
    { key: 'website_url', label: 'Website' },
    { key: 'twitter_handle', label: 'Twitter' },
    { key: 'linkedin_url', label: 'LinkedIn' },
  ];

  if (profileType === 'journalist') {
    fields.push(
      { key: 'job_title', label: 'Job Title' },
      { key: 'outlet_name', label: 'Publication' }
    );
  }

  if (options.includeAdminFields) {
    fields.push(
      { key: 'created_at', label: 'Created At' },
      { key: 'notes', label: 'Notes' },
      { key: 'creator_email', label: 'Creator Email' }
    );
  }

  return fields;
};

export const profileToExportRow = (profile: any, profileType: string, options: ExportOptions) => {
  // Flatten and normalize for CSV row
  const row: Record<string, string> = {
    display_name: profile.display_name || '',
    display_name_ar: profile.display_name_ar || '',
    headline: profile.headline || '',
    email: profile.email || '',
    phone_number: profile.phone_number || '',
    whatsapp_number: profile.whatsapp_number || '',
    country_code: profile.country_code || '',
    city: profile.city || '',
    website_url: profile.website_url || '',
    twitter_handle: profile.twitter_handle || '',
    linkedin_url: profile.linkedin_url || '',
  };

  if (profileType === 'journalist') {
    row.job_title = profile.job_title || profile.headline || '';
    row.outlet_name = profile.outlet_name || '';
  }

  if (options.includeAdminFields) {
    row.created_at = profile.created_at || '';
    row.notes = profile.notes || '';
    row.creator_email = profile.creator_email || '';
  }

  return row;
};

export const downloadExportCsv = (profiles: any[], profileType: string, options: ExportOptions, filename: string) => {
  const fields = getExporterExportableFields(profileType, options);
  const headers = fields.map(f => f.label).join(',');
  
  const rows = profiles.map(p => {
    const row = profileToExportRow(p, profileType, options);
    return fields.map(f => {
      const val = row[f.key] || '';
      // Escape CSV values
      if (val.includes(',') || val.includes('"') || val.includes('\n')) {
        return `"${val.replace(/"/g, '""')}"`;
      }
      return val;
    }).join(',');
  });

  const csvContent = [headers, ...rows].join('\n');
  
  // Add BOM for Excel compatibility with UTF-8
  const bom = options.includeBom ? '\uFEFF' : '';
  const blob = new Blob([bom + csvContent], { type: 'text/csv;charset=utf-8;' });
  
  const link = document.createElement('a');
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};
