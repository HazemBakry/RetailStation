import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HrEmployeesComponent } from './hr-employees/hr-employees.component';
import { HrVacationComponent } from './hr-vacation/hr-vacation.component';
import { HrAttendanceComponent } from './hr-attendance/hr-attendance.component';
import { HrOverTimeComponent } from './hr-over-time/hr-over-time.component';
import { HrSickLeaveComponent } from './hr-sick-leave/hr-sick-leave.component';
import { HrPenaltyComponent } from './hr-penalty/hr-penalty.component';
import { HrSalaryComponent } from './hr-salary/hr-salary.component';

const routes: Routes = [
  {
    path: 'HrEmployees',
    component: HrEmployeesComponent
  },
  {
    path: 'HrVacation',
    component: HrVacationComponent
  },
  {
    path: 'HrAttendance',
    component: HrAttendanceComponent
  },
  {
    path: 'HrSickLeave',
    component: HrSickLeaveComponent
  },
  {
    path: 'HrOverTime',
    component: HrOverTimeComponent
  },
  {
    path: 'HrPenalty',
    component: HrPenaltyComponent
  },
  {
    path: 'HrSalary',
    component: HrSalaryComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HrRoutingModule { }
