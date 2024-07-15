import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SystemSettingsRoutingModule } from './system-settings-routing.module';
import { SystemSettingsLayoutComponent } from './system-settings-layout.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '../Shared/shared.module';


@NgModule({
  declarations: [
    SystemSettingsLayoutComponent
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
