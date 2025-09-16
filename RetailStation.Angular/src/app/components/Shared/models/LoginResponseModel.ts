
// export interface LoginResponseModel {
//     token: string;
//     userModel: ApplicationUserModel;
//     statusCode: number | null;

import { SubscriberType } from "../Enums/SubscriptionTypeEnum";

// }
export interface LoginUserModel {
    message: string;
    isAuthenticated: boolean;
    userName: string;
    userId: string;
    fullName: string;
    fullNameAr: string;
    fullNameEn: string;
    branchId: number;
    supplierId: number;
    branchNameAR: string;
    branchNameEN: string;
    phoneNumber: string;
    email: string;
    token: string;
    refreshToken: string;
    expireOn: string;
    employeeId?: number | null;
    imageUrl: string;
    subscriberId: string;
    subscriberName: string;
    roles: string[];
    authorizedPages?: PagePermissionModel[];
}

export interface SubscriberRegistrationModel {
    firstName: string;
    lastName: string;
    userName: string;
    email: string;
    phoneNumber: string;
    subscriberTypeId: SubscriberType;
    address: string;
    subscriberName: string;
    subscriberEmail: string;
}


export interface PagePermissionModel {
    pageId: number | null;
    parentId: number | null;
    displayOrder: number | null;
    actionId: number | null;
    pageActionId: number | null;
    hasChild: boolean;
    isActive: boolean;
    isChecked: boolean;
    displayNameAr: string;
    displayNameEn: string;
    pageName: string;
    parentName: string;
    icon: string;
    route: string;
    groupName: string;
    actionName: string;
    actions: PageActionModel[];
}

export interface PageActionModel {
    actionId: number | null;
    pageActionId: number | null;
    isChecked: boolean;
    actionName: string;
}
export interface ApplicationPageModel {
    applicationId: string;
    applicationName: string;
    pages:PagePermissionModel[];
}