import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ErpHomeComponent } from '../Shared/components/erp-home/erp-home.component';
import { EmployeeProfileLayoutComponent } from './employee-profile-layout/employee-profile-layout.component';
import { EmployeeVacationComponent } from './components/employee-vacation/employee-vacation.component';
import { EmployeeLoansComponent } from './components/employee-loans/employee-loans.component';
import { TeamWorkComponent } from './components/team-work/team-work.component';
import { TeamWorkLoansComponent } from './components/team-work-loans/team-work-loans.component';
import { TeamWorkVacationsComponent } from './components/team-work-vacations/team-work-vacations.component';

const routes: Routes = [

  {
    path: '',
    component: EmployeeProfileLayoutComponent,
    children: [
      {
        path: '',
        component: ErpHomeComponent
      },
      {
        path: 'profile/vacation',
        component: EmployeeVacationComponent
      },
      {
        path: 'profile/loans',
        component: EmployeeLoansComponent
      },
      {
        path: 'management/team-work',
        component: TeamWorkComponent
      },
      {
        path: 'management/loans',
        component: TeamWorkLoansComponent
      },
      {
        path: 'management/vacations',
        component: TeamWorkVacationsComponent
      },
      { path: '', redirectTo: '' ,pathMatch: 'full' },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeeProfileRoutingModule { }
