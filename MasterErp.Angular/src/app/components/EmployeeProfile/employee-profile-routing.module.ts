import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
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
        path: 'vacation',
        component: EmployeeVacationComponent
      },
      {
        path: 'loans',
        component: EmployeeLoansComponent
      },
      {
        path: 'team-work',
        component: TeamWorkComponent
      },
      {
        path: 'loans',
        component: TeamWorkLoansComponent
      },
      {
        path: 'vacations',
        component: TeamWorkVacationsComponent
      },
      { path: '', redirectTo: 'vacation' ,pathMatch: 'full' },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeeProfileRoutingModule { }
