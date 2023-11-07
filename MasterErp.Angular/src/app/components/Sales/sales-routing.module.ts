import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SalesLayoutComponent } from './sales-layout/sales-layout.component';

const routes: Routes = [
  {
    path: '',
    component: SalesLayoutComponent,
    children: [
      // { path: '', component:  },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SalesRoutingModule { }
