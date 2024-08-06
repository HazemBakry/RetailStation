import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HrAttendanceComponent } from './components/hr-attendance/hr-attendance.component';
import { HrOverTimeComponent } from './components/hr-over-time/hr-over-time.component';
import { HrPenaltyComponent } from './components/hr-penalty/hr-penalty.component';
import { HrSickLeaveComponent } from './components/hr-sick-leave/hr-sick-leave.component';
import { HrSalaryComponent } from './components/hr-salary/hr-salary.component';
import { HrVacationComponent } from './components/hr-vacation/hr-vacation.component';
import { HrRoutingModule } from './hr-routing.module';
import { HrEmployeeDetailsComponent } from './components/hr-employee-details/hr-employee-details.component';
import { HrEmployeesComponent } from './components/hr-employees/hr-employees.component';
import { SharedModule } from "../Shared/shared.module";
import { HrHomeComponent } from './components/hr-home/hr-home.component';
import { HrLayoutComponent } from './hr-layout/hr-layout.component';
import { HrCareersComponent } from './components/hr-careers/hr-careers.component';
import { HrDeductsComponent } from './components/hr-deducts/hr-deducts.component';
import { HrLoansComponent } from './components/hr-loans/hr-loans.component';


@NgModule({
  declarations: [
    HrVacationComponent,
    HrAttendanceComponent,
    HrOverTimeComponent,
    HrPenaltyComponent,
    HrSickLeaveComponent,
    HrSalaryComponent,
    HrEmployeesComponent,
    HrEmployeeDetailsComponent,
    HrHomeComponent,
    HrLayoutComponent,
    HrCareersComponent,
    HrDeductsComponent,
    HrLoansComponent
  ],
  imports: [
    HrRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    SharedModule
],
  providers:[DatePipe]
})
export class HrModule { }
