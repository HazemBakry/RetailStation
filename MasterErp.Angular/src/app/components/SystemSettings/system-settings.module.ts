import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SystemSettingsRoutingModule } from './system-settings-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '../Shared/shared.module';
import { SystemSettingsHomeComponent } from './components/system-settings-home/system-settings-home.component';
import { SystemUsersComponent } from './components/system-users/system-users.component';
import { SystemSettingsLayoutComponent } from './system-settings-layout/system-settings-layout.component';
import { RolesComponent } from './components/roles/roles.component';


@NgModule({
  declarations: [
    SystemSettingsLayoutComponent,
    SystemSettingsHomeComponent,
    SystemUsersComponent,
    RolesComponent
  ],
  imports: [
    CommonModule,
    SystemSettingsRoutingModule,
    FormsModule,
    NgbModule,
    SharedModule,
    ReactiveFormsModule,
  ]
})
export class SystemSettingsModule { }
