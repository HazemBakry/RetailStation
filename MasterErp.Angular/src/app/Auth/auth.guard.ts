import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root'
})

export class AuthGuard implements CanActivate {
    Roles: string[] = [];
    constructor(private router: Router, private authService: AuthService, private toaster: ToastrService) { }
  
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
      if(state.url!='/not-authorized')
        sessionStorage.setItem('returnUrl', state.url);
  
      if (this.authService.isAuthenticated()) {
  
        const allowedRoles: string[] = route.data["roles"];
        if (allowedRoles && allowedRoles.length > 0) {
            if (this.CheckRoles(allowedRoles)) {
            return true;
            } else {
            // this.toaster.warning('You are not authorized !')
            this.router.navigateByUrl('/not-authorized');
            return false;
            }
    
        }
        return true;
       }
      // sessionStorage.setItem('returnUrl', state.url);
      this.authService.loginRedirect();
      return false;
    }
  
  
    private CheckRoles(allowedRoles: string[]) {
      return this.authService.isInRole(allowedRoles);
    }
  
  
  }
// export class AuthGuard implements CanActivate {
//     Roles: string[] = [];
//     constructor(private authService: AuthService) { }

//     canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
//         // if (this.authService.CheckUserPermission(state)) {
//         //     return true;
//         // } else {
//         //     return false;
//         // }
//         return true;
//     }


// }
