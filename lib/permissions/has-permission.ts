import { SupabaseClient } from '@supabase/supabase-js';

import { Database } from '../database.types';
import { PERMISSIONS, Permission } from './permissions-map';

/**
 * Returns a matching length array of booleans if the user has the listed permissions
 */
export const hasPermission = async (supabase: SupabaseClient<Database>, permissions: Permission[]) => {
  const userPermissions = await supabase.from('role_assignment').select(`
    roles ( id, name )
    `);

  return permissions.map((requestedPermission) =>
    Boolean(
      userPermissions.data?.find(({ roles }) => {
        if (roles) {
          if ('length' in roles) {
            return roles.find((role) => {
              return role.id === PERMISSIONS[requestedPermission];
            });
          }

          return roles.id === PERMISSIONS[requestedPermission];
        }

        return false;
      })
    )
  );
};
