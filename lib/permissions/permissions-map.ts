export const PERMISSIONS = {
  ADMIN: 1,
} as const;

export type Permission = keyof typeof PERMISSIONS;
