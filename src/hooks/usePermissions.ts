import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { PERMISSIONS, hasPermission, getAllPermissions, getEffectiveRole, isAnyAdmin, isFullAdmin } from '@/lib/permissions';

export { PERMISSIONS };

export function usePermissions() {
  const { user } = useAuth();
  const [roles, setRoles] = useState<string[]>([]);
  const [overrides, setOverrides] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPermissions = async () => {
      if (!user) { setRoles([]); setOverrides({}); setLoading(false); return; }
      try {
        const { data, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id);
        if (error) throw error;
        setRoles(data?.map((r: any) => r.role) || []);
      } catch (error) {
        console.error('Error fetching permissions:', error);
        setRoles([]);
      } finally {
        setLoading(false);
      }
    };
    fetchPermissions();
  }, [user]);

  const can = useCallback((permission: string) => {
    if (!user) return hasPermission([], permission, {});
    return hasPermission(roles, permission, overrides);
  }, [user, roles, overrides]);

  const isAdmin = useMemo(() => isFullAdmin(roles), [roles]);
  const isAdminOrSubAdmin = useMemo(() => isAnyAdmin(roles), [roles]);
  const canReview = useMemo(() => can(PERMISSIONS.CAN_APPROVE_LISTINGS), [can]);
  const canImportExport = useMemo(() => can(PERMISSIONS.CAN_IMPORT_DATA) && can(PERMISSIONS.CAN_EXPORT_DATA), [can]);

  return {
    can, loading, roles,
    effectiveRole: useMemo(() => getEffectiveRole(roles), [roles]),
    isAdmin, isAdminOrSubAdmin, canReview, canImportExport,
  };
}

export default usePermissions;