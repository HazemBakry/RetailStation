import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})

export class AuthGuard implements CanActivate {
  Roles: string[] = [];
  constructor(private router: Router, private authService: AuthService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (state.url !== '/unauthorized') {
      sessionStorage.setItem('returnUrl', state.url);
    }

    if (this.authService.isAuthenticated()) {

      const allowedRoles: string[] = route.data["roles"];
      if (allowedRoles && allowedRoles.length > 0) {
        if (this.CheckRoles(allowedRoles)) {
          return true;
        } else {
          this.router.navigateByUrl('/unauthorized');
          return false;
        }

      }
      return true;
    }
    this.authService.loginRedirect();
    return false;
  }


  private CheckRoles(allowedRoles: string[]) {
    return this.authService.isInRole(allowedRoles);
  }


}

