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
import { EmptyDataComponent } from './components/empty-data/empty-data.component';
import { AppBreadcrumbComponent } from './components/app-breadcrumb/app-breadcrumb.component';
import { AccountsReportHeaderComponent } from './components/accounts-report-header/accounts-report-header.component';
import { OrderProductsComponent } from './components/order-products/order-products.component';
import { CurrencyComponent } from './components/BasicInformation/currency/currency.component';
import { FeaturedComponent } from './components/BasicInformation/featured/featured.component';
import { FiscalYearComponent } from './components/BasicInformation/fiscal-year/fiscal-year.component';
import { ReceiptBooksComponent } from './components/BasicInformation/receipt-books/receipt-books.component';
import { OverviewCardComponent } from './components/overview-card/overview-card.component';
import { ColorWithStatusDirective } from './directives/color-with-status.directive';
import { AccountTreeV2Component } from './components/account-tree-v2/account-tree-v2.component';
import { AccountTreeItemComponent } from './components/account-tree-item/account-tree-item.component';
import { CustomFormDropdownComponent } from './components/custom-form-dropdown/custom-form-dropdown.component';

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
    ErpFiltersComponent,
    EmptyDataComponent,
    OrderProductsComponent,
    AppBreadcrumbComponent,
    AccountsReportHeaderComponent,
    AccountTreeV2Component,
    AccountTreeItemComponent,
    //Basic Information Components
    CurrencyComponent,
    FeaturedComponent,
    FiscalYearComponent,
    ReceiptBooksComponent,
    OverviewCardComponent,
    ColorWithStatusDirective,
    CustomFormDropdownComponent

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
    ErpFiltersComponent,
    EmptyDataComponent,
    OrderProductsComponent,
    AppBreadcrumbComponent,
    AccountsReportHeaderComponent,
    AccountTreeV2Component,
    AccountTreeItemComponent,
    StatsCardComponent,
    OverviewCardComponent,
    ColorWithStatusDirective,
    CustomFormDropdownComponent
  ]
})
export class SharedModule { }
