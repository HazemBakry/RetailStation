export interface ChangePasswordModel {
    email?: string;
    username: string;
    oldPassword: string;
    newPassword: string;
    confirmNewPassword: string;
}