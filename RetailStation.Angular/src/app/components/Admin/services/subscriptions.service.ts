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
import { SubscribeRequestModel } from '../models/SubscribeRequestModel';
import { SubscriberRegistrationModel } from '../../Shared/models/LoginResponseModel';


@Injectable({
  providedIn: 'root',
})
export class SubscriptionsService {
  URL = environment.apiURL;

  constructor(private http: HttpClient) { }


  // Create New Subscriber
  createNewSubscriber(model: FormData) {
    return this.http.post<ActionsResponseModel>(`${this.URL}ManageSubscribers/CreateNewSubscriber`, model);
  }

  // Edit Subscriber
  editSubscriber(subscriberId: string, model: FormData) {
    return this.http.post(`${this.URL}ManageSubscribers/EditSubscriber?SubscriberId=${subscriberId}`, model);
  }

  // Get All Subscribers with Pagination
  getAllSubscribersData(model: PagedResponseModel) {
    return this.http.post<PagedResponseModel<SubscriberModel[]>>(`${this.URL}ManageSubscribers/GetAllSubscribers_Data`, model);
  }

  // Get Subscriber By ID
  getSubscriberById(subscriberId: string) {
    return this.http.get<SubscriberModel>(`${this.URL}ManageSubscribers/GetSubscriberById?SubscriberId=${subscriberId}`);
  }
  deleteSubscriber(subscriberId: string) {
    return this.http.get<ActionsResponseModel>(`${this.URL}ManageSubscribers/deleteSubscriber?SubscriberId=${subscriberId}`);
  }

  // Get Subscriber Applications
  getSubscriberApplications(subscriberId: string) {
    return this.http.get<SubscriberApplicationModel[]>(`${this.URL}ManageSubscribers/GetSubscriberApplications?SubscriberId=${subscriberId}`);
  }

  // Edit Subscriber Applications
  editSubscriberApplications(subscriberId: string, applicationList: SubscriberApplicationModel[]) {
    return this.http.post<ActionsResponseModel>(`${this.URL}ManageSubscribers/EditSubscriberApplications?SubscriberId=${subscriberId}`, applicationList);
  }

  ///////////////////// Users //////////////////////////////////
  // Get Users For Subscriber
  getSubscriberUsers(subscriberId: string, model: any) {
    return this.http.post(`${this.URL}ManageSubscribers/GetSubscriberUsers?SubscriberId=${subscriberId}`, model);
  }


  getUsers(subscriberId: string, model: PagedResponseModel): Observable<PagedResponseModel<UserModel[]>> {
    return this.http.post<PagedResponseModel<UserModel[]>>(`${this.URL}ManageSubscribers/GetUsers?SubscriberId=${subscriberId}`, model);
  }
  getRoles(model: PagedResponseModel): Observable<PagedResponseModel<RoleModel[]>> {
    return this.http.post<PagedResponseModel<RoleModel[]>>(`${this.URL}ManageSubscribers/GetRoles`, model);
  }
  addNewRole(role: string): Observable<ActionsResponseModel> {
    return this.http.get<ActionsResponseModel>(`${this.URL}ManageSubscribers/AddNewRole?Role=${role}`);
  }
  assignUserRole(subscriberId: string, userId: string, model: AddUserRoleModel): Observable<ActionsResponseModel> {
    return this.http.post<ActionsResponseModel>(`${this.URL}ManageSubscribers/AssignUserRole?SubscriberId=${subscriberId}&UserId=${userId}`, model);
  }
  addNewUser(subscriberId: string, model: FormData) {
    return this.http.post<ActionsResponseModel>(`${this.URL}ManageSubscribers/AddUser?SubscriberId=${subscriberId}`, model);
  }
  editUser(subscriberId: string, userId: string, model: FormData) {
    return this.http.post<ActionsResponseModel>(`${this.URL}ManageSubscribers/EditUser?UserId= ${userId}&SubscriberId=${subscriberId}`, model);
  }
  deleteUser(subscriberId: string, userId: string) {
    return this.http.get<ActionsResponseModel>(`${this.URL}ManageSubscribers/DeleteUser?UserId= ${userId}&SubscriberId=${subscriberId}`);
  }

  getBranches(subscriberId: string, model: PagedResponseModel): Observable<PagedResponseModel<BranchModel[]>> {
    return this.http.post<PagedResponseModel<BranchModel[]>>(`${this.URL}ManageSubscribers/GetBranches?SubscriberId=${subscriberId}`, model);
  }
  addNewBranch(subscriberId: string, model: FormData) {
    return this.http.post<ActionsResponseModel>(`${this.URL}ManageSubscribers/AddBranch?SubscriberId=${subscriberId}`, model);
  }
  editBranch(subscriberId: string, branchId: number, model: FormData) {
    return this.http.post<ActionsResponseModel>(`${this.URL}ManageSubscribers/EditBranch?BranchId= ${branchId}&SubscriberId=${subscriberId}`, model);
  }
  deleteBranch(subscriberId: string, branchId: number) {
    return this.http.get<ActionsResponseModel>(`${this.URL}ManageSubscribers/DeleteBranch?BranchId= ${branchId}&SubscriberId=${subscriberId}`);
  }




  ////////////////////// SubscribeRequest

  GetSubscribeRequests_Data(model: PagedResponseModel<SubscribeRequestModel[]>) {
    return this.http.post<PagedResponseModel<SubscribeRequestModel[]>>(this.URL + 'ManageSubscribers/GetSubscribeRequests_Data', model);
  }

  GetSubscribeRequestDetailsById(SubscribeRequestId: string) {
    return this.http.get<SubscribeRequestModel>(this.URL + `ManageSubscribers/GetSubscribeRequestDetailsById?SubscribeRequestId=${SubscribeRequestId}`);
  }
  SaveNewSubscribeRequest(model: SubscribeRequestModel) {
    return this.http.post<ActionsResponseModel>(this.URL + 'ManageSubscribers/SubscribeRequest', model);
  }
  EditSubscribeRequest(SubscribeRequestId: string, model: SubscribeRequestModel) {
    return this.http.post<ActionsResponseModel>(this.URL + `ManageSubscribers/EditSubscribeRequest?SubscribeRequestId=${SubscribeRequestId}`, model);
  }
  DeleteSubscribeRequest(SubscribeRequestId: string) {
    return this.http.get<ActionsResponseModel>(this.URL + 'ManageSubscribers/DeleteSubscribeRequest?SubscribeRequestId=' + SubscribeRequestId);
  }
  ApproveSubscribeRequest(SubscribeRequestId: string,model:SubscriberRegistrationModel) {
    return this.http.post<ActionsResponseModel>(this.URL + 'ManageSubscribers/ApproveSubscribeRequest?SubscribeRequestId=' + SubscribeRequestId,model);
  }
}
