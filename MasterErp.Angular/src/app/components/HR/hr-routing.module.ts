import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HrEmployeesComponent } from './components/hr-employees/hr-employees.component';
import { HrVacationComponent } from './components/hr-vacation/hr-vacation.component';
import { HrAttendanceComponent } from './components/hr-attendance/hr-attendance.component';
import { HrOverTimeComponent } from './components/hr-over-time/hr-over-time.component';
import { HrSickLeaveComponent } from './components/hr-sick-leave/hr-sick-leave.component';
import { HrPenaltyComponent } from './components/hr-penalty/hr-penalty.component';
import { HrSalaryComponent } from './components/hr-salary/hr-salary.component';
import { HrEmployeeDetailsComponent } from './components/hr-employee-details/hr-employee-details.component';
import { HrHomeComponent } from './components/hr-home/hr-home.component';
import { HrLayoutComponent } from './hr-layout/hr-layout.component';
import { HrCareersComponent } from './components/hr-careers/hr-careers.component';
import { HrDeductsComponent } from './components/hr-deducts/hr-deducts.component';

const routes: Routes = [
  {
    path: '',
    component: HrLayoutComponent,
    children: [
      {
        path: 'home',
        component: HrHomeComponent
      },
      {
        path: 'employees',
        component: HrEmployeesComponent
      },
      {
        path: 'employee-details',
        component: HrEmployeeDetailsComponent
      },
      {
        path: 'vacations',
        component: HrVacationComponent
      },
      {
        path: 'careers',
        component: HrCareersComponent
      },
      {
        path: 'deducts',
        component: HrDeductsComponent
      },
      {
        path: 'attendance',
        component: HrAttendanceComponent
      },
      {
        path: 'sick-leaves',
        component: HrSickLeaveComponent
      },
      {
        path: 'over-time',
        component: HrOverTimeComponent
      },
      {
        path: 'penalty',
        component: HrPenaltyComponent
      },
      {
        path: 'salary',
        component: HrSalaryComponent
      },
      { path: '', redirectTo: 'home' ,pathMatch: 'full' },
    ]
  }
  

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HrRoutingModule { }
