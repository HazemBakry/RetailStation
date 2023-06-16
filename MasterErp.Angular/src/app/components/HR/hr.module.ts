import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { HrRoutingModule } from './hr-routing.module';
import { HrComponent } from './hr.component';
import { HrVacationComponent } from './hr-vacation/hr-vacation.component';
import { HrEmployeesComponent } from './hr-employees/hr-employees.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HrAttendanceComponent } from './hr-attendance/hr-attendance.component';
import { HrOverTimeComponent } from './hr-over-time/hr-over-time.component';
import { HrPenaltyComponent } from './hr-penalty/hr-penalty.component';
import { HrSickLeaveComponent } from './hr-sick-leave/hr-sick-leave.component';
import { HrSalaryComponent } from './hr-salary/hr-salary.component';


@NgModule({
  declarations: [
    HrComponent,
    HrVacationComponent,
    HrEmployeesComponent,
    HrAttendanceComponent,
    HrOverTimeComponent,
    HrPenaltyComponent,
    HrSickLeaveComponent,
    HrSalaryComponent
  ],
  imports: [
    HrRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
  ],
  providers:[DatePipe]
})
export class HrModule { }
