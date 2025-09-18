export interface SubscribeRequestModel {
    subscribeRequestId: string;
    subscriberId: string;
    subscriberName: string;
    email: string;
    phoneNumber: string;
    isApproved: boolean | null;
    subscriptionUsersType: number | null;
    subscriberTypeId: number;
    workflowStatusId: number;
    workflowStatusNameEN: string;
    workflowStatusNameAR: string;
    requestDate: string;
    commercialRegister: string;
    totalCount: number | null;
}