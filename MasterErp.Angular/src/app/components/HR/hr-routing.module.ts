import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HrVacationComponent } from './hr-vacation/hr-vacation.component';

const routes: Routes = [
  {
    path:'hrVacation',
    component:HrVacationComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HrRoutingModule { }
