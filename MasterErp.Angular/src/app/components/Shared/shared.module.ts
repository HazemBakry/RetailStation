import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { AccountsTreeComponent } from './components/accounts-tree/accounts-tree.component';
import { StatsCardComponent } from './components/stats-card/stats-card.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ngxLoadingAnimationTypes, NgxLoadingModule } from "ngx-loading";
import { SearchArryPipe } from './Pipes/search-arry.pipe';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpConfigInterceptor } from './security/interceptor/http-config.interceptor';
import { ErpHomeComponent } from './components/erp-home/erp-home.component';
import { SwiperModule } from 'swiper/angular';
import { NotAuthorizedComponent } from './components/not-authorized/not-authorized.component';
import { RoleCheckerDirective } from './directives/role-checker.directive';
import { SidebarComponent } from '../Main/sidebar/sidebar.component';
import { HeaderComponent } from '../Main/header/header.component';
import { RouterModule } from '@angular/router';
import { DropDownFormControlComponent } from './components/drop-down-form-control/drop-down-form-control.component';
import { BusinessCoreLayoutComponent } from './components/business-core-layout/business-core-layout.component';
import { GeneralOrderProductsComponent } from './components/general-order-products/general-order-products.component';
import { ReceiveOrdersSidePanelComponent } from './components/sidepanel/receive-orders-side-panel/receive-orders-side-panel.component';
import { ProductsDetailsSidePanelComponent } from './components/sidepanel/products-details-side-panel/products-details-side-panel.component';
import { RenderComponent } from './components/render/render.component';
import { ComponentHostDirective } from './directives/component-host.directive';
import { EnglishToArabicNumbersDirective } from './directives/english-to-arabic-numbers.directive';
import { UploadImporterFileComponent } from '../SystemSettings/components/upload-importer-file/upload-importer-file.component';
import { ErpSpinnerComponentComponent } from './components/erp-spinner-component/erp-spinner-component.component';

@NgModule({
  declarations: [
    SidebarComponent,
    HeaderComponent,
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
    ComponentHostDirective,
    CustomFormDropdownComponent,
    ErpHomeComponent,
    NotAuthorizedComponent,
    DropDownFormControlComponent,
    RoleCheckerDirective,
    BusinessCoreLayoutComponent,
    GeneralOrderProductsComponent,
    ReceiveOrdersSidePanelComponent,
    ProductsDetailsSidePanelComponent,
    RenderComponent,
    EnglishToArabicNumbersDirective,
    UploadImporterFileComponent,
    ErpSpinnerComponentComponent
  ],


  imports: [
    CommonModule,
    NgbModule,
    FormsModule,
    RouterModule,
    PaginationModule.forRoot(),
    SwiperModule,
    ReactiveFormsModule ,
    NgxLoadingModule.forRoot({
      animationType: ngxLoadingAnimationTypes.threeBounce,
      backdropBackgroundColour: 'rgba(0, 18, 59, 0.6)',
      backdropBorderRadius: '3px',
      primaryColour: '#337AB7',
      secondaryColour: 'silver',
      tertiaryColour: '#ffffff',
      fullScreenBackdrop: true
    }),
    
  ],

  exports: [
    RouterModule,
    SwiperModule,
    SidebarComponent,
    HeaderComponent,
    AccountsTreeComponent,
    CostCentersTreeComponent,
    NgxLoadingModule,
    SearchArryPipe,
    ErpSpinnerComponentComponent,
    ErpSelectorComponent,
    ErpSelectorWithSearchComponent,
    ErpSelectorWithCheckboxComponent,
    ErpPaginationComponent,
    ErpFiltersComponent,
    EmptyDataComponent,
    OrderProductsComponent,
    GeneralOrderProductsComponent,
    AppBreadcrumbComponent,
    AccountsReportHeaderComponent,
    AccountTreeV2Component,
    AccountTreeItemComponent,
    StatsCardComponent,
    OverviewCardComponent,
    ColorWithStatusDirective,
    ComponentHostDirective,
    CustomFormDropdownComponent,
    ErpHomeComponent,
    NotAuthorizedComponent,
    DropDownFormControlComponent,
    RoleCheckerDirective,
    EnglishToArabicNumbersDirective,

    ReceiveOrdersSidePanelComponent,
    ProductsDetailsSidePanelComponent,
    RenderComponent,
    UploadImporterFileComponent,
    
  ],
  providers: [
    DatePipe,
    { provide: HTTP_INTERCEPTORS, useClass: HttpConfigInterceptor, multi: true }
  ]
})
export class SharedModule { }
