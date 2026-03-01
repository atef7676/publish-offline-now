import usePermissions from '@/hooks/usePermissions';

export const useUserRole = () => {
  const perms = usePermissions();
  const hasRole = (role: string) => perms.roles.includes(role);

  return {
    ...perms,
    hasRole,
    isSubscriber: hasRole('pr_paid'),
    isSubAdmin: hasRole('sub_admin'),
    isGeneralSubAdmin: hasRole('general_sub_admin'),
    isContentSubAdmin: hasRole('content_sub_admin'),
    isJournalistPR: hasRole('journalist'),
    isExpert: hasRole('expert'),
    canManage: perms.isAdmin,
    canManageUsers: perms.isAdmin,
    canManageContent: perms.isAdminOrSubAdmin,
    bypassCoins: perms.isAdmin,
    canViewAllContacts: perms.isAdmin,
    canOverrideLimits: perms.isAdmin,
    canBypassCoins: perms.isAdmin,
  };
};

export default useUserRole;
