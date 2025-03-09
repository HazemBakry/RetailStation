import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router, RouterStateSnapshot } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, map, Subject, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LoginUserModel } from '../components/Shared/models/LoginResponseModel';
import { UserModel } from '../components/Shared/models/UserModel';
import { ActionsResponseModel } from '../components/Shared/models/ActionsResponseModel';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  URL = environment.apiURL;
  authApi = environment.authApi+'Auth';
  centralizedLoginUrl = environment.authServerUrl;
  hasPermission = true;
  loggedInUser: LoginUserModel;
  isAuthenticatedSubject = new BehaviorSubject<boolean>(this.isAuthenticated());

  private readonly JWT_TOKEN = 'JWT_TOKEN';
  private readonly REFRESH_TOKEN = 'REFRESH_TOKEN';
  private readonly USER_MODEL = 'USER_MODEL';
  public readonly VIEW_ACTION_NAME: string = 'View';
  constructor(private http: HttpClient, private toaster: ToastrService, private router: Router) 
  {
  }
  loginRedirect(logout:boolean=false):void
  {
    if(this.isAuthenticated())
    {
      this.router.navigateByUrl('/');
      return;
    }
    var logoutQuery = logout ? 'logout=true' : '';
    const appReturnUrl = encodeURIComponent(window.location.origin + '/auth-callback');
    window.location.href = `${this.centralizedLoginUrl}/login?returnUrl=${appReturnUrl}&${logoutQuery}`;
  }

  login(model: any) {
    return this.http.post<LoginUserModel>(this.authApi + '/Login', model).pipe(tap((data: LoginUserModel) => {
      if (data?.isAuthenticated) {
        this.loggedInUser = data;
        this.isAuthenticatedSubject.next(true);
        this.storeUser(data);
      }
      if (data?.token) {
        this.storeTokens(data.token, data.refreshToken);
      }
    }));
  }
  storeTokens(token: string, refreshToken: string): void {
    localStorage.setItem(this.JWT_TOKEN, token);
    localStorage.setItem(this.REFRESH_TOKEN, refreshToken);
  }

  private storeUser(user: any): void {
    localStorage.setItem(this.USER_MODEL, JSON.stringify(user));
  }

  logout(): void {
    this.clearStorage();
    this.isAuthenticatedSubject.next(false);
    this.loginRedirect(true);
  }
  refreshToken() {
    return this.http
      .post<any>(`${this.authApi}/refresh-token`, {
        refreshToken: this.refresh_Token,
      })
      .pipe(
        tap((response) => {
          if (response?.token) {
            this.storeTokens(response.token, response.refreshToken);
          }
        })
      );
  }
  get access_Token(): string | null {
    return localStorage.getItem(this.JWT_TOKEN);
  }
  get refresh_Token(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN);
  }
  clearStorage(): void {
    localStorage.removeItem(this.JWT_TOKEN);
    localStorage.removeItem(this.REFRESH_TOKEN);
    localStorage.removeItem(this.USER_MODEL);
    localStorage.clear();
  }

  getCurrentUser(): LoginUserModel {
    const user = localStorage.getItem(this.USER_MODEL);
    return user ? JSON.parse(user) : null;
  }


  isAuthenticated(): boolean {
    const token = this.access_Token;
    if (!token) return false;
    return !this.isTokenExpired(token);
  }


  private isTokenExpired(token: string): boolean {
    const decodedToken: any = jwtDecode(token);
    if (!decodedToken.exp) return true;
    const expirationDate = decodedToken.exp * 1000;
    return Date.now() > expirationDate;
  }
  GetLoggedInUserAsync()
  {
    return this.http.get<LoginUserModel>(`${this.authApi}/GetLoggedInUser`);
  }

  async completeAuthentication() {
    const token = this.access_Token;
    if (token) {
      try {
        const user = await this.GetLoggedInUserAsync().toPromise();
        if (user?.isAuthenticated) {
          this.storeUser(user);
        } else {
          this.logout();
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        this.logout(); // Logout in case of error
      }
    }
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
