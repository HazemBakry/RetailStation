import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SystemSettingsHomeComponent } from './components/system-settings-home/system-settings-home.component';
import { SystemSettingsLayoutComponent } from './system-settings-layout/system-settings-layout.component';
import { SystemUsersComponent } from './components/system-users/system-users.component';
import { RolesComponent } from './components/roles/roles.component';
import { DataImportersComponent } from './components/data-importers/data-importers.component';

const routes: Routes = [
  {
    path: '',
    component: SystemSettingsLayoutComponent,
    children: [

      { path: 'home', component: SystemSettingsHomeComponent },
      { path: 'system-users', component: SystemUsersComponent },
      { path: 'roles', component: RolesComponent },
      { path: 'data-importers', component: DataImportersComponent },
      { path: '', redirectTo: 'home' ,pathMatch: 'full' },
      
      
      
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SystemSettingsRoutingModule { }
