import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})

export class AuthPageGuard implements CanActivate {
  constructor(
    private router: Router, 
    private authService: AuthService, 
    private toaster: ToastrService
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (state.url !== '/unauthorized') {
      sessionStorage.setItem('returnUrl', state.url);
    }

    if (!this.authService.isAuthenticated()) {
      this.authService.loginRedirect();
      return false;
    }

    const pageName: string = route.data["pageName"];
    if (!pageName || !this.authService.haveActionPermission(this.authService.VIEW_ACTION_NAME, pageName)) {
      this.router.navigateByUrl('/unauthorized');
      return false;
    }

    return true;
  }
}