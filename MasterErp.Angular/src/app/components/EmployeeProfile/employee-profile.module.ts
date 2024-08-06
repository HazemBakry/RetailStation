import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmployeeProfileRoutingModule } from './employee-profile-routing.module';
import { EmployeeProfileLayoutComponent } from './employee-profile-layout/employee-profile-layout.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../Shared/shared.module';
import { EmployeeVacationComponent } from './components/employee-vacation/employee-vacation.component';


@NgModule({
  declarations: [
    EmployeeProfileLayoutComponent,
    EmployeeVacationComponent
  ],
  imports: [
    CommonModule,
    EmployeeProfileRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule
  ]
})
export class EmployeeProfileModule { }
