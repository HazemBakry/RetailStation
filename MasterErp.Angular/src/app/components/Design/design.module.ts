import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DesignRoutingModule } from './design-routing.module';
import { DesignLayoutComponent } from './design-layout/design-layout.component';
import { DesignHomeComponent } from './components/design-home/design-home.component';
import { AccountTreeComponent } from './components/account-tree/account-tree.component';
import { OpeningBalanceComponent } from './components/opening-balance/opening-balance.component';
import { ReceiptsComponent } from './components/receipts/receipts.component';
import { DesignEmployeeDetailsComponent } from './components/design-employee-details/design-employee-details.component';


@NgModule({
  declarations: [
    DesignLayoutComponent,
    DesignHomeComponent,
    AccountTreeComponent,
    OpeningBalanceComponent,
    ReceiptsComponent,
    DesignEmployeeDetailsComponent
  ],
  imports: [
    CommonModule,
    DesignRoutingModule
  ]
})
export class DesignModule { }
