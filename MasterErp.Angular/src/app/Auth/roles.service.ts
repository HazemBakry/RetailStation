import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

import { catchError, Observable, of, retry } from 'rxjs';
import { ApplicationPageModel, PagePermissionModel } from '../components/Shared/models/LoginResponseModel';
import { ActionsResponseModel } from '../components/Shared/models/ActionsResponseModel';
@Injectable({
  providedIn: 'root'
})
export class RolesService {
  // URL = environment.apiURL + 'Roles/';
  URL = environment.authApi+ 'Roles/';
  centralizedLoginUrl = environment.authServerUrl;

  constructor(private http: HttpClient) {
  }
  // Get Applications
  // getUserApplications() {
  //   return this.http.get<SubscriberApplicationModel[]>(`${this.URL}GetUserApplications`);
  // }



  ////////////////////////////////////////// roles //////////////////////////////////

  private userAuthorizedPages: PagePermissionModel[] = [];

  setPermissions(userAuthorizedPages: PagePermissionModel[]): void {
    this.userAuthorizedPages = userAuthorizedPages;
  }

  getUserAuthorizedPages(): PagePermissionModel[] {
    return this.userAuthorizedPages;
  }

  // getUserAuthorizedPages() {
  //   return this.http.get<PagePermissionModel[]>(this.URL + 'GetUserAuthorizedPages');
  // }
  getSubscriberRolePages(roleId: string) {
    return this.http.get<ApplicationPageModel[]>(this.URL + `GetSubscriberRolePages?RoleId=${roleId}`);
  }

  saveSubscriberRolePages(roleId: string, pageActionIds: number[]) {
    return this.http.post<ActionsResponseModel>(this.URL + `SaveSubscriberRolePages?RoleId=${roleId}`, pageActionIds);

  }
  fetchUserAuthorizedPages(): Observable<PagePermissionModel[]> {
    return this.http.get<PagePermissionModel[]>(this.URL + 'GetUserAuthorizedPages').pipe(
      retry(3),
      catchError(error => {
        console.error('Error fetching permissions:', error);
        return of([]);
      })
    );
  }
}


