import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HrEmployeesComponent } from './hr-employees/hr-employees.component';
import { HrVacationComponent } from './hr-vacation/hr-vacation.component';

const routes: Routes = [
  {
    path:'HrVacation',
    component:HrVacationComponent
  },
  {
    path:'HrEmployees',
    component:HrEmployeesComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HrRoutingModule { }
