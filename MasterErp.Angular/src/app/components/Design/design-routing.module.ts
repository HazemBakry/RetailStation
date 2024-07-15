import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DesignHomeComponent } from './components/design-home/design-home.component';
import { DesignLayoutComponent } from './design-layout/design-layout.component';
import { AccountTreeComponent } from './components/account-tree/account-tree.component';
import { OpeningBalanceComponent } from './components/opening-balance/opening-balance.component';
import { ReceiptsComponent } from './components/receipts/receipts.component';

const routes: Routes = [
  {
    path: '',
    component: DesignLayoutComponent,
    children: [
      { path: 'home', component: DesignHomeComponent },
      { path: 'account-tree', component: AccountTreeComponent },
      { path: 'opening-balance', component: OpeningBalanceComponent },
      { path: 'receipts', component: ReceiptsComponent },
      { path: '', redirectTo: 'home', pathMatch: 'full' },

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DesignRoutingModule { }
