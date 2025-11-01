export interface MerchantRequestModel {
    merchantRequestId: string;
    merchantId: string;
    merchantName: string;
    brandName: string;
    email: string;
    phoneNumber: string;
    isApproved: boolean | null;
    subscriptionUsersType: number | null;
    merchantTypeId: number;
    workflowStatusId: number;
    workflowStatusNameEN: string;
    workflowStatusNameAR: string;
    requestDate: string;
    commercialRegister: string;
    taxNumber: string;
    bankAccountNumber: string;
    address: string;
    userName: string;
    totalCount: number | null;
}