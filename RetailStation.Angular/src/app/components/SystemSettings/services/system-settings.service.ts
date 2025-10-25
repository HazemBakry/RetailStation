import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { FilterModel, SearchFilterModel } from '../../Shared/models/FilterModel';
import { UserModel } from '../../Shared/models/UserModel';
import { Observable } from 'rxjs';
import { PagedResponseDTO } from '../../Shared/models/PagedResponseDTO';
import { ActionsResponseModel } from '../../Shared/models/ActionsResponseModel';
import { AddUserRoleModel, RoleModel } from '../../Shared/models/RoleModel';

@Injectable({
  providedIn: 'root'
})
export class SystemSettingsService {
  URL = environment.apiURL;
  constructor(private http: HttpClient) {
  }


  // ================================== Users Authentications ==================================

  getUsers(model: PagedResponseDTO): Observable<PagedResponseDTO<UserModel[]>> {
    return this.http.post<PagedResponseDTO<UserModel[]>>(this.URL + 'Auth/GetUsers', model);
  }

  getRoles(model: PagedResponseDTO): Observable<PagedResponseDTO<RoleModel[]>> {
    return this.http.post<PagedResponseDTO<RoleModel[]>>(this.URL + 'Auth/GetRoles', model);
  }

  addNewRole(role: string): Observable<ActionsResponseModel> {
    return this.http.get<ActionsResponseModel>(this.URL + 'Auth/AddNewRole?Role=' + role);
  }

  assignUserRole(model: AddUserRoleModel): Observable<ActionsResponseModel> {
    return this.http.post<ActionsResponseModel>(this.URL + 'Auth/AssignUserRole', model);
  }

  addNewUser(model: FormData) {
    return this.http.post<ActionsResponseModel>(this.URL + 'Auth/AddUser', model);
  }

  editUser(model: FormData) {
    return this.http.post<ActionsResponseModel>(this.URL + 'Auth/EditUser', model);
  }

  deleteUser(userId: string) {
    return this.http.get<ActionsResponseModel>(this.URL + 'Auth/DeleteUser?UserId=' + userId);
  }

}
