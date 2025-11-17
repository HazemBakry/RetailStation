import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { ActionsResponseModel } from '../../Shared/models/ActionsResponseModel';
import { PagedResponseModel } from '../../Shared/models/PagedResponseDTO';
import { SubscriberApplicationModel, SubscriberModel } from '../models/Subscriber';
import { AddUserRoleModel, RoleModel } from '../../Shared/models/RoleModel';
import { UserModel } from '../../Shared/models/UserModel';
import { BranchModel } from '../../Shared/models/BranchModel';
import { MerchantRegistrationModel } from '../../Shared/models/LoginResponseModel';
import { MerchantRequestModel } from '../models/MerchantRequestModel';


@Injectable({
  providedIn: 'root',
})
export class SubscriptionsService {
  URL = environment.apiURL;

  constructor(private http: HttpClient) { }


  // Create New Subscriber
  createNewSubscriber(model: FormData) {
    return this.http.post<ActionsResponseModel>(`${this.URL}ManageUsers/CreateNewSubscriber`, model);
  }

  // Edit Subscriber
  editSubscriber(subscriberId: string, model: FormData) {
    return this.http.post(`${this.URL}ManageUsers/EditSubscriber?SubscriberId=${subscriberId}`, model);
  }

  // Get All Subscribers with Pagination
  getAllSubscribersData(model: PagedResponseModel) {
    return this.http.post<PagedResponseModel<SubscriberModel[]>>(`${this.URL}ManageUsers/GetAllSubscribers_Data`, model);
  }

  // Get Subscriber By ID
  getSubscriberById(subscriberId: string) {
    return this.http.get<SubscriberModel>(`${this.URL}ManageUsers/GetSubscriberById?SubscriberId=${subscriberId}`);
  }
  deleteSubscriber(subscriberId: string) {
    return this.http.get<ActionsResponseModel>(`${this.URL}ManageUsers/deleteSubscriber?SubscriberId=${subscriberId}`);
  }

  // Get Subscriber Applications
  getSubscriberApplications(subscriberId: string) {
    return this.http.get<SubscriberApplicationModel[]>(`${this.URL}ManageUsers/GetSubscriberApplications?SubscriberId=${subscriberId}`);
  }

  // Edit Subscriber Applications
  editSubscriberApplications(subscriberId: string, applicationList: SubscriberApplicationModel[]) {
    return this.http.post<ActionsResponseModel>(`${this.URL}ManageUsers/EditSubscriberApplications?SubscriberId=${subscriberId}`, applicationList);
  }

  ///////////////////// Users //////////////////////////////////
  // Get Users For Subscriber
  getSubscriberUsers(subscriberId: string, model: any) {
    return this.http.post(`${this.URL}ManageUsers/GetSubscriberUsers?SubscriberId=${subscriberId}`, model);
  }


  getUsers(model: PagedResponseModel): Observable<PagedResponseModel<UserModel[]>> {
    return this.http.post<PagedResponseModel<UserModel[]>>(`${this.URL}ManageUsers/GetUsers`, model);
  }
  getRoles(model: PagedResponseModel): Observable<PagedResponseModel<RoleModel[]>> {
    return this.http.post<PagedResponseModel<RoleModel[]>>(`${this.URL}ManageUsers/GetRoles`, model);
  }
  addNewRole(role: string): Observable<ActionsResponseModel> {
    return this.http.get<ActionsResponseModel>(`${this.URL}ManageUsers/AddNewRole?Role=${role}`);
  }
  assignUserRole(userId: string, model: AddUserRoleModel): Observable<ActionsResponseModel> {
    return this.http.post<ActionsResponseModel>(`${this.URL}ManageUsers/AssignUserRole?UserId=${userId}`, model);
  }
  addNewUser(model: FormData) {
    return this.http.post<ActionsResponseModel>(`${this.URL}ManageUsers/AddUser?`, model);
  }
  editUser(userId: string, model: FormData) {
    return this.http.post<ActionsResponseModel>(`${this.URL}ManageUsers/EditUser?UserId= ${userId}`, model);
  }
  deleteUser(userId: string) {
    return this.http.get<ActionsResponseModel>(`${this.URL}ManageUsers/DeleteUser?UserId= ${userId}`);
  }

  getBranches(subscriberId: string, model: PagedResponseModel): Observable<PagedResponseModel<BranchModel[]>> {
    return this.http.post<PagedResponseModel<BranchModel[]>>(`${this.URL}ManageUsers/GetBranches?SubscriberId=${subscriberId}`, model);
  }
  addNewBranch(subscriberId: string, model: FormData) {
    return this.http.post<ActionsResponseModel>(`${this.URL}ManageUsers/AddBranch?SubscriberId=${subscriberId}`, model);
  }
  editBranch(subscriberId: string, branchId: number, model: FormData) {
    return this.http.post<ActionsResponseModel>(`${this.URL}ManageUsers/EditBranch?BranchId= ${branchId}&SubscriberId=${subscriberId}`, model);
  }
  deleteBranch(subscriberId: string, branchId: number) {
    return this.http.get<ActionsResponseModel>(`${this.URL}ManageUsers/DeleteBranch?BranchId= ${branchId}&SubscriberId=${subscriberId}`);
  }




  ////////////////////// MerchantRequest

  GetMerchantRequests_Data(model: PagedResponseModel<MerchantRequestModel[]>) {
    return this.http.post<PagedResponseModel<MerchantRequestModel[]>>(this.URL + 'ManageUsers/GetMerchantRequests_Data', model);
  }

  GetMerchantRequestDetailsById(MerchantRequestId: string) {
    return this.http.get<MerchantRequestModel>(this.URL + `ManageUsers/GetMerchantRequestDetailsById?MerchantRequestId=${MerchantRequestId}`);
  }
  SaveNewMerchantRequest(model: MerchantRequestModel) {
    return this.http.post<ActionsResponseModel>(this.URL + 'ManageUsers/MerchantRequest', model);
  }
  EditMerchantRequest(MerchantRequestId: string, model: MerchantRequestModel) {
    return this.http.post<ActionsResponseModel>(this.URL + `ManageUsers/EditMerchantRequest?MerchantRequestId=${MerchantRequestId}`, model);
  }
  DeleteMerchantRequest(MerchantRequestId: string) {
    return this.http.get<ActionsResponseModel>(this.URL + 'ManageUsers/DeleteMerchantRequest?MerchantRequestId=' + MerchantRequestId);
  }
  ApproveMerchantRequest(MerchantRequestId: string,model:MerchantRequestModel) {
    return this.http.post<ActionsResponseModel>(this.URL + 'ManageUsers/ApproveMerchantRequest?MerchantRequestId=' + MerchantRequestId,model);
  }
}
