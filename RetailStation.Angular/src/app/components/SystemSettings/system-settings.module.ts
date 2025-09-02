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
import { DataImportersComponent } from './components/data-importers/data-importers.component';
import { CreateImporterComponent } from './components/create-importer/create-importer.component';
// import { UploadImporterFileComponent } from './components/upload-importer-file/upload-importer-file.component';


@NgModule({
  declarations: [
    SystemSettingsLayoutComponent,
    SystemSettingsHomeComponent,
    SystemUsersComponent,
    RolesComponent,
    DataImportersComponent,
    CreateImporterComponent,
    // UploadImporterFileComponent
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
