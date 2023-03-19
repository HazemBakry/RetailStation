import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HrRoutingModule } from './hr-routing.module';
import { HrComponent } from './hr.component';
import { HrVacationComponent } from './hr-vacation/hr-vacation.component';
import { HrEmployeesComponent } from './hr-employees/hr-employees.component';


@NgModule({
  declarations: [
    HrComponent,
    HrVacationComponent,
    HrEmployeesComponent
  ],
  imports: [
    CommonModule,
    HrRoutingModule
  ]
})
export class HrModule { }
