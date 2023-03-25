import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HrRoutingModule } from './hr-routing.module';
import { HrComponent } from './hr.component';
import { HrVacationComponent } from './hr-vacation/hr-vacation.component';
import { HrEmployeesComponent } from './hr-employees/hr-employees.component';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    HrComponent,
    HrVacationComponent,
    HrEmployeesComponent
  ],
  imports: [
    HrRoutingModule,
    CommonModule,
  ]
})
export class HrModule { }
