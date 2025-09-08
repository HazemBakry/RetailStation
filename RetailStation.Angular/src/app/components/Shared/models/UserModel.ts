export interface UserModel {
    userId: string;
    firstName: string;
    lastName: string;
    fullName: string;
    userName: string;
    email: string;
    imageUrl: string;
    phoneNumber: string;
    employeeId?: number | null;
    branchId?: number | null;
    roles: string[];
    status: number | null;
    createdDate: string;
    updatedDate: string | null;
    totalCount: number | null; 
    code:number;
    subscriberId?: string | null;
    startDate: string | null;
    endDate: string | null;
    isActive: boolean | null;
}