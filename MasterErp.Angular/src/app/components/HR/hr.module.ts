import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HrRoutingModule } from './hr-routing.module';
import { HrComponent } from './hr.component';
import { HrVacationComponent } from './hr-vacation/hr-vacation.component';


@NgModule({
  declarations: [
    HrComponent,
    HrVacationComponent
  ],
  imports: [
    CommonModule,
    HrRoutingModule
  ]
})
export class HrModule { }
