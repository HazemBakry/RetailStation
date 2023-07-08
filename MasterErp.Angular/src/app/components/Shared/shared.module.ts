import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { AccountsTreeComponent } from './components/accounts-tree/accounts-tree.component';
import { StatsCardComponent } from './components/stats-card/stats-card.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ngxLoadingAnimationTypes, NgxLoadingModule } from "ngx-loading";
import { SearchArryPipe } from './Pipes/search-arry.pipe';
import { FormsModule } from '@angular/forms';
import { CostCentersTreeComponent } from './components/cost-center-tree/cost-centers-tree.component';
import { ErpSelectorComponent } from './components/selectors/erp-selector/erp-selector.component';
import { ErpSelectorWithSearchComponent } from './components/selectors/erp-selector-with-search/erp-selector-with-search.component';
import { ErpSelectorWithCheckboxComponent } from './components/selectors/erp-selector-with-checkbox/erp-selector-with-checkbox.component';
import { ErpPaginationComponent } from './components/erp-pagination/erp-pagination.component';
import { ErpFiltersComponent } from './components/erp-filters/erp-filters.component';



@NgModule({
  declarations: [
    AccountsTreeComponent,
    StatsCardComponent,
    SearchArryPipe,
    CostCentersTreeComponent,
    ErpSelectorComponent,
    ErpSelectorWithSearchComponent,
    ErpSelectorWithCheckboxComponent,
    ErpPaginationComponent,
    ErpFiltersComponent
  ],

  imports: [
    CommonModule,
    NgbModule,
    FormsModule,
    PaginationModule.forRoot(),
    NgxLoadingModule.forRoot({
      animationType: ngxLoadingAnimationTypes.threeBounce,
      backdropBackgroundColour: 'rgba(0, 18, 59, 0.6)',
      backdropBorderRadius: '3px',
      primaryColour: '#337AB7',
      secondaryColour: 'silver',
      tertiaryColour: '#ffffff',
      fullScreenBackdrop: true
    })
  ],

  exports: [
    AccountsTreeComponent,
    CostCentersTreeComponent,
    NgxLoadingModule,
    SearchArryPipe,
    ErpSelectorComponent,
    ErpSelectorWithSearchComponent,
    ErpSelectorWithCheckboxComponent,
    ErpPaginationComponent,
    ErpFiltersComponent
  ]
})
export class SharedModule { }
