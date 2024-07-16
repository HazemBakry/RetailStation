export interface UserModel {
    userId: string;
    firstName: string;
    lastName: string;
    fullName: string;
    userName: string;
    email: string;
    imageUrl: string;
    phoneNumber: string;
    status: number | null;
    createdDate: string;
    updatedDate: string | null;
    totalCount: number | null;
}