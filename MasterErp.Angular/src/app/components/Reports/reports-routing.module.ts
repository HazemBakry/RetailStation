import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TestReportComponent } from './test-report/test-report.component';

const routes: Routes = [
  { path: '', component: TestReportComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportsRoutingModule { }
