
// export interface LoginResponseModel {
//     token: string;
//     userModel: ApplicationUserModel;
//     statusCode: number | null;
// }
export interface LoginUserModel {
    message: string;
    isAuthenticated: boolean;
    userName: string;
    userId: string;
    fullNameAr : string;
    fullNameEn: string;
    branchNameAr: string;
    branchNameEn: string;
    phoneNumber: string;
    email: string;
    token: string;
    refreshToken: string;
    expireOn: string;
    employeeId?:number |null;
    fullName: string;
    branchNameAR: string;
    branchNameEN: string;
    imageUrl: string;
    subscriberId: string;
    subscriberName: string;
    roles: string[];
    authorizedPages?:PagePermissionModel[];
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