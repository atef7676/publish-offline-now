export const PERMISSIONS = {
  CAN_VIEW_DIRECTORY: 'can_view_directory',
  CAN_USE_FILTERS: 'can_use_filters',
  CAN_VIEW_CONTACT_DETAILS: 'can_view_contact_details',
  CAN_UNLOCK_PROFILES: 'can_unlock_profiles',
  CAN_SEND_MESSAGES: 'can_send_messages',
  CAN_RECEIVE_MESSAGES: 'can_receive_messages',
  CAN_CREATE_PROFILE: 'can_create_profile',
  CAN_EDIT_OWN_PROFILE: 'can_edit_own_profile',
  CAN_EDIT_ANY_PROFILE: 'can_edit_any_profile',
  CAN_DELETE_OWN_PROFILE: 'can_delete_own_profile',
  CAN_DELETE_ANY_PROFILE: 'can_delete_any_profile',
  CAN_APPROVE_LISTINGS: 'can_approve_listings',
  CAN_REJECT_LISTINGS: 'can_reject_listings',
  CAN_MANAGE_USERS: 'can_manage_users',
  CAN_MANAGE_ROLES: 'can_manage_roles',
  CAN_VIEW_AUDIT_LOGS: 'can_view_audit_logs',
  CAN_IMPORT_DATA: 'can_import_data',
  CAN_EXPORT_DATA: 'can_export_data',
  CAN_MANAGE_CLAIMS: 'can_manage_claims',
  CAN_TRANSFER_OWNERSHIP: 'can_transfer_ownership',
  CAN_GRANT_COINS: 'can_grant_coins',
  BYPASS_COINS: 'bypass_coins',
  CAN_VIEW_COIN_BALANCE: 'can_view_coin_balance',
  CAN_ACCESS_WALLET: 'can_access_wallet',
  CAN_OVERRIDE_LIMITS: 'can_override_limits',
  CAN_VIEW_ALL_CONTACTS: 'can_view_all_contacts',
};

export const ROLE_HIERARCHY: Record<string, number> = {
  anonymous: 0, user: 1, expert: 2, journalist_pr: 2, subscriber: 3,
  content_sub_admin: 4, general_sub_admin: 5, sub_admin: 5, admin: 10,
};

const makePerms = (overrides: Record<string, boolean> = {}): Record<string, boolean> => {
  const base: Record<string, boolean> = {};
  Object.values(PERMISSIONS).forEach(p => { base[p] = false; });
  return { ...base, ...overrides };
};

export const PERMISSION_MATRIX: Record<string, Record<string, boolean>> = {
  anonymous: makePerms({ [PERMISSIONS.CAN_VIEW_DIRECTORY]: true }),
  user: makePerms({
    [PERMISSIONS.CAN_VIEW_DIRECTORY]: true, [PERMISSIONS.CAN_USE_FILTERS]: true,
    [PERMISSIONS.CAN_UNLOCK_PROFILES]: true, [PERMISSIONS.CAN_SEND_MESSAGES]: true,
    [PERMISSIONS.CAN_RECEIVE_MESSAGES]: true, [PERMISSIONS.CAN_CREATE_PROFILE]: true,
    [PERMISSIONS.CAN_EDIT_OWN_PROFILE]: true, [PERMISSIONS.CAN_DELETE_OWN_PROFILE]: true,
    [PERMISSIONS.CAN_VIEW_COIN_BALANCE]: true, [PERMISSIONS.CAN_ACCESS_WALLET]: true,
  }),
  subscriber: makePerms({
    [PERMISSIONS.CAN_VIEW_DIRECTORY]: true, [PERMISSIONS.CAN_USE_FILTERS]: true,
    [PERMISSIONS.CAN_VIEW_CONTACT_DETAILS]: true, [PERMISSIONS.CAN_UNLOCK_PROFILES]: true,
    [PERMISSIONS.CAN_SEND_MESSAGES]: true, [PERMISSIONS.CAN_RECEIVE_MESSAGES]: true,
    [PERMISSIONS.CAN_CREATE_PROFILE]: true, [PERMISSIONS.CAN_EDIT_OWN_PROFILE]: true,
    [PERMISSIONS.CAN_DELETE_OWN_PROFILE]: true,
    [PERMISSIONS.CAN_VIEW_COIN_BALANCE]: true, [PERMISSIONS.CAN_ACCESS_WALLET]: true,
  }),
  admin: makePerms(Object.fromEntries(
    Object.values(PERMISSIONS).filter(p => p !== PERMISSIONS.CAN_VIEW_COIN_BALANCE && p !== PERMISSIONS.CAN_ACCESS_WALLET).map(p => [p, true])
  )),
};

export function getEffectiveRole(roles: string[]): string {
  if (!roles || roles.length === 0) return 'anonymous';
  let highestRole = 'user';
  let highestLevel = ROLE_HIERARCHY.user;
  for (const role of roles) {
    const level = ROLE_HIERARCHY[role] ?? 0;
    if (level > highestLevel) { highestLevel = level; highestRole = role; }
  }
  return highestRole;
}

export function hasPermission(roles: string[], permission: string, overrides: Record<string, boolean> = {}): boolean {
  if (overrides[permission] !== undefined) return overrides[permission];
  const effectiveRole = getEffectiveRole(roles);
  const rolePermissions = PERMISSION_MATRIX[effectiveRole];
  if (!rolePermissions) return PERMISSION_MATRIX.anonymous[permission] ?? false;
  return rolePermissions[permission] ?? false;
}

export function getAllPermissions(roles: string[], overrides: Record<string, boolean> = {}): Record<string, boolean> {
  const effectiveRole = getEffectiveRole(roles);
  const basePermissions = { ...PERMISSION_MATRIX[effectiveRole] };
  Object.keys(overrides).forEach(key => {
    if (overrides[key] !== undefined) basePermissions[key] = overrides[key];
  });
  return basePermissions;
}

export function isAnyAdmin(roles: string[]): boolean {
  return roles?.some(r => ['admin', 'sub_admin', 'general_sub_admin', 'content_sub_admin'].includes(r)) ?? false;
}

export function isFullAdmin(roles: string[]): boolean {
  return roles?.includes('admin') ?? false;
}