export interface RoleModel {
    roleId: string;
    roleName: string;
    roleNormalizedName: string;
    isChecked: boolean;
}

export interface AddUserRoleModel {
    userId: string;
    roles: RoleModel[];
}