import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DesignRoutingModule } from './design-routing.module';
import { DesignLayoutComponent } from './design-layout/design-layout.component';
import { DesignHomeComponent } from './components/design-home/design-home.component';
import { AccountTreeComponent } from './components/account-tree/account-tree.component';
import { OpeningBalanceComponent } from './components/opening-balance/opening-balance.component';
import { ReceiptsComponent } from './components/receipts/receipts.component';
import { DesignEmployeeDetailsComponent } from './components/design-employee-details/design-employee-details.component';
import { DesignTableComponent } from './components/design-table/design-table.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { InputsAreaComponent } from './components/inputs-area/inputs-area.component';
import { FormsModule } from '@angular/forms';
import { NwHeaderComponent } from './components/nw-header/nw-header.component';
import { GeneralAccountsComponent } from './components/general-accounts/general-accounts.component';
import { NwSidebarComponent } from './components/nw-sidebar/nw-sidebar.component';
import { GoogleChartsModule } from 'angular-google-charts';
import { NewHomeComponent } from './components/new-home/new-home.component';
import { SharedModule } from '../Shared/shared.module';

@NgModule({
  declarations: [
    DesignLayoutComponent,
    DesignHomeComponent,
    AccountTreeComponent,
    OpeningBalanceComponent,
    ReceiptsComponent,
    DesignEmployeeDetailsComponent,
    DesignTableComponent,
    InputsAreaComponent,
    NwHeaderComponent,
    GeneralAccountsComponent,
    NwSidebarComponent,
    NewHomeComponent,
  ],
  imports: [
    CommonModule,
    DesignRoutingModule,
    NgbModule,
    FormsModule,
    SharedModule,
    GoogleChartsModule,
  ],
})
export class DesignModule {}
