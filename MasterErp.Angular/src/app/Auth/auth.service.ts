import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router, RouterStateSnapshot } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, map, Subject, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LoginUserModel } from '../components/Shared/models/LoginResponseModel';
import { UserModel } from '../components/Shared/models/UserModel';
import { ActionsResponseModel } from '../components/Shared/models/CreateModifyReturnsModel';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  URL = environment.apiURL;
  hasPermission = true;
  loggedInUser:LoginUserModel ;
  isAuthenticatedSubject=new BehaviorSubject<boolean>(false);
  private readonly JWT_TOKEN:string='JWT_TOKEN';
  private readonly User_Model:string='User_Model';
  public readonly VIEW_ACTION_NAME:string='View';
  constructor(private http: HttpClient, private toaster: ToastrService, private router: Router) 
  {
  }
  loginRedirect():void
  {
    this.router.navigateByUrl('/login');
  }
  login(model: any) {
    return this.http.post<LoginUserModel>(this.URL + 'Auth/Login', model).pipe(tap((data:LoginUserModel)=>{
      if(data?.isAuthenticated)
      {
        this.loggedInUser=data;
        this.isAuthenticatedSubject.next(true); 
        localStorage.setItem(this.User_Model, JSON.stringify(data));
      }
      if(data?.token)
      {
        this.storeJwtToken(data.token);
      }
    }));
  }
  
  logout()
  {
    localStorage.removeItem(this.JWT_TOKEN);
    localStorage.clear();
    this.loginRedirect();
    this.isAuthenticatedSubject.next(false);
  }

  getCurrentUser(): LoginUserModel {
    const user = localStorage.getItem(this.User_Model);
    return user ? JSON.parse(user) : null;
  }


  isAuthenticated(): boolean {
    let currentUser = this.getCurrentUser();
    if (!currentUser ||this.isTokenExpired())
      return false;
    
    return true;
  }
  isTokenExpired(): boolean {
    let access_token = this.authorizationAccess_Token;
    if (!access_token)
      return true;
    const decode=jwtDecode(access_token);
    if(!decode.exp)
      return true;
    const expirationDate=decode.exp*1000;
    const now =new Date().getTime();
    return expirationDate<now ;
  }
  refreshToken()
  {
    return this.http.post<any>(this.URL + 'User/AdminLogin',{}).pipe(tap((tokens:any)=>this.storeJwtToken(tokens.access_token)))
  }
  storeJwtToken(token:string)
  {
    localStorage.setItem(this.JWT_TOKEN,token);
  }
  get authorizationAccess_Token(): string {
    let currentToken = localStorage.getItem(this.JWT_TOKEN);
    if (!currentToken)
      return undefined;
    return currentToken;
  }

  isInRole(roles: string|string[]): boolean {
    const allowedRoles = Array.isArray(roles) ? [...roles, 'SuperAdmin'].map(x => x.toLowerCase())
      : [roles, 'SuperAdmin'].map(x => x.toLowerCase());

    let userModel = this.getCurrentUser();
    if (!userModel)
      return false;
    // return userModel?.role?.includes(roleName);
    return userModel?.roles?.some(role => allowedRoles.includes(role.toLowerCase()));
  }

  haveActionPermission(action: string|string[], pageName: string): boolean {
    const fixedRoles = ['SuperAdmin'].map(x => x.toLowerCase());

    const allowedActions = Array.isArray(action) ? action.map(x => x.toLowerCase()) : [action.toLowerCase()];
    const userModel = this.getCurrentUser();
    const isSuperRole=userModel?.roles?.some(role => fixedRoles.includes(role.toLowerCase()));
    // const superRole=false;
    if (isSuperRole) 
      return true;
    if (!userModel || !userModel.authorizedPages) {
      return false;
    }
  
    return userModel.authorizedPages.some(page => {
      if (page.pageName.toLowerCase() === pageName.toLowerCase()) {
        return page.actions.some(act => allowedActions.includes(act.actionName.toLowerCase()));
      }
      return false;
    });
  }
}
