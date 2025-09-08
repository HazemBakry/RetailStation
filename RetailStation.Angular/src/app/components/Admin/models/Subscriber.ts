import { CreatorModel } from "../../Shared/models/CreatorModel";


export interface SubscriberModel extends CreatorModel {
    subscriberId: string;
    subscriberName: string;
    email: string;
    parentId: string;
    domainName: string;
    isSSO: boolean | null;
    isDeleted: boolean | null;
    isActive: boolean | null;
    isApproved: boolean | null;
    subscriptionUsersType: number | null;
    subscriberTypeId:number;
    sendNotificationMail: boolean | null;
    totalCount: number | null;
    subscriberFiles: File[];
}


export interface SubscriberApplicationModel {
    subscriberApplicationId: number;
    subscriberId: string;
    subscriberName: string;
    applicationId: string;
    startDate: string | null;
    endDate: string | null;
    subscriberStatusId: number | null;
    subscriberCategoryId: number | null;
    applicationName: string;
    applicationLogo: string;
    applicationCode: string;
    applicationColor: string;
    applicationStyle: string;
    applicationUrl: string;
    displayOrder: number | null;
    isDisplay: boolean | null;
    isActive: boolean | null;
}

export interface SubscriberProductModel
{

}