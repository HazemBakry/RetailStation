import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ErpHomeComponent } from '../Shared/components/erp-home/erp-home.component';
import { EmployeeProfileLayoutComponent } from './employee-profile-layout/employee-profile-layout.component';
import { EmployeeVacationComponent } from './components/employee-vacation/employee-vacation.component';

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
      { path: '', redirectTo: '' ,pathMatch: 'full' },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeeProfileRoutingModule { }
