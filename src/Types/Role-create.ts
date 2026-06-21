export interface PermissionRow {
  create: boolean;
  edit: boolean;
  view: boolean;
  delete: boolean;
}

export interface RoleCreate {
  roleName: string;
  roleCode: string;
  description?: string;
  permissions: {
    [module: string]: PermissionRow;
  };
}