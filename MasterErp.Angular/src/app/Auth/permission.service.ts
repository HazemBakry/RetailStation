import { Injectable } from '@angular/core';
import { RolesService } from './roles.service';
import { AuthService } from './auth.service';
@Injectable({
  providedIn: 'root'
})
export class PermissionService {
  constructor(private rolesService: RolesService, private authService: AuthService) { }

  haveActionPermission(action: string | string[], pageName: string): boolean {
    const userModel = this.authService.getCurrentUser();
    const allowedActions = Array.isArray(action) ? action.map(x => x.toLowerCase()) : [action.toLowerCase()];
    const isSuperRole = userModel?.roles?.some(role => role.toLowerCase() === 'superadmin');
    if (isSuperRole) return true;

    const authorizedPages = this.rolesService.getUserAuthorizedPages();
    return authorizedPages.some(page =>
      page.pageName.toLowerCase() === pageName.toLowerCase() &&
      page.actions.some(a => allowedActions.includes(a.actionName.toLowerCase()) && a.isChecked)
    );
  }
}
