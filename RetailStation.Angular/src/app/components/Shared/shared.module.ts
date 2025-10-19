import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { AccountsTreeComponent } from './components/accounts-tree/accounts-tree.component';
import { StatsCardComponent } from './components/stats-card/stats-card.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ngxLoadingAnimationTypes, NgxLoadingModule } from 'ngx-loading';
import { SearchArryPipe } from './Pipes/search-arry.pipe';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CostCentersTreeComponent } from './components/cost-center-tree/cost-centers-tree.component';
import { ErpSelectorComponent } from './components/selectors/erp-selector/erp-selector.component';
import { ErpSelectorWithSearchComponent } from './components/selectors/erp-selector-with-search/erp-selector-with-search.component';
import { ErpSelectorWithCheckboxComponent } from './components/selectors/erp-selector-with-checkbox/erp-selector-with-checkbox.component';
import {
  ErpPaginationComponent,
  PaginationComponent,
} from './components/erp-pagination/erp-pagination.component';
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
import { WelcomePageComponent } from './components/welcome-page/welcome-page.component';
import { SwiperModule } from 'swiper/angular';
import { NotAuthorizedComponent } from './components/not-authorized/not-authorized.component';
import { RoleCheckerDirective } from './directives/role-checker.directive';

import { RouterModule } from '@angular/router';
import { DropDownFormControlComponent } from './components/drop-down-form-control/drop-down-form-control.component';
import { BusinessCoreLayoutComponent } from './components/business-core-layout/business-core-layout.component';
import { GeneralOrderProductsComponent } from './components/general-order-products/general-order-products.component';
import { MaterialReceiptSidePanelComponent } from './components/sidepanel/material-receipt-side-panel/material-receipt-side-panel.component';
import { ProductsDetailsSidePanelComponent } from './components/sidepanel/products-details-side-panel/products-details-side-panel.component';
import { RenderComponent } from './components/render/render.component';
import { ComponentHostDirective } from './directives/component-host.directive';
import { EnglishToArabicNumbersDirective } from './directives/english-to-arabic-numbers.directive';
import { UploadImporterFileComponent } from '../SystemSettings/components/upload-importer-file/upload-importer-file.component';
import { ErpSpinnerComponentComponent } from './components/erp-spinner-component/erp-spinner-component.component';
import { GeneralSelectorComponent } from './components/general-selector/general-selector.component';
import { AccountsReportSearchComponent } from './components/accounts-report-search/accounts-report-search.component';
import { OrderItemsComponent } from './components/order-items/order-items.component';
import { MaterialRequestsSidePanelComponent } from './components/material-requests-side-panel/material-requests-side-panel.component';
import { WorkflowStatusDirective } from './directives/workflow-status.directive';
import { AddEditAccountTreeComponent } from '../GeneralAccounts/components/add-edit-account-tree/add-edit-account-tree.component';
import { GoToAccountReportDirective } from './directives/go-to-account-report.directive';
import { NextPreviousComponent } from './components/tools/next-previous/next-previous.component';
import { ERPSidebarComponent } from './components/erp-sidebar/erp-sidebar.component';
import { GoogleChartsModule } from 'angular-google-charts';
import { StatusSelectorComponent } from './components/status-selector/status-selector.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { HeaderComponent } from './components/header/header.component';
import { RetailHomeComponent } from './components/retail-home/retail-home.component';
import { RegisterComponent } from 'src/app/Auth/register/register.component';
import { WebsiteHeaderComponent } from './components/website-header/website-header.component';
import { WebsiteSearchComponent } from './components/website-search/website-search.component';
import { RateComponent } from './components/rate/rate.component';
import { CompareComponent } from './components/sidepanel/compare/compare.component';
import { ChangeQuantityComponent } from './components/change-quantity/change-quantity.component';
import { HomeComponent } from './components/home/home.component';

@NgModule({
  declarations: [
    SidebarComponent,
    HeaderComponent,
    HomeComponent,
    AccountsTreeComponent,
    StatsCardComponent,
    SearchArryPipe,
    CostCentersTreeComponent,
    ErpSelectorComponent,
    ErpSelectorWithSearchComponent,
    ErpSelectorWithCheckboxComponent,
    ErpPaginationComponent,
    PaginationComponent,
    ErpFiltersComponent,
    EmptyDataComponent,
    OrderProductsComponent,
    OrderItemsComponent,
    AppBreadcrumbComponent,
    AccountsReportHeaderComponent,
    AccountTreeV2Component,
    AccountTreeItemComponent,
    AddEditAccountTreeComponent,
    //Basic Information Components
    CurrencyComponent,
    FeaturedComponent,
    FiscalYearComponent,
    ReceiptBooksComponent,
    OverviewCardComponent,
    ColorWithStatusDirective,
    WorkflowStatusDirective,
    ComponentHostDirective,
    CustomFormDropdownComponent,
    WelcomePageComponent,
    NotAuthorizedComponent,
    DropDownFormControlComponent,
    RoleCheckerDirective,
    BusinessCoreLayoutComponent,
    GeneralOrderProductsComponent,
    MaterialReceiptSidePanelComponent,
    ProductsDetailsSidePanelComponent,
    RenderComponent,
    EnglishToArabicNumbersDirective,
    UploadImporterFileComponent,
    ErpSpinnerComponentComponent,
    GeneralSelectorComponent,
    AccountsReportSearchComponent,
    MaterialRequestsSidePanelComponent,
    GoToAccountReportDirective,
    NextPreviousComponent,
    ERPSidebarComponent,
    StatusSelectorComponent,
    RetailHomeComponent,
    RegisterComponent,
    WebsiteHeaderComponent,
    WebsiteSearchComponent,
    RateComponent,
    CompareComponent,
    ChangeQuantityComponent,
  ],

  imports: [
    CommonModule,
    NgbModule,
    FormsModule,
    RouterModule,
    PaginationModule.forRoot(),
    SwiperModule,
    ReactiveFormsModule,
    GoogleChartsModule,
    NgxLoadingModule.forRoot({
      animationType: ngxLoadingAnimationTypes.threeBounce,
      backdropBackgroundColour: 'rgba(0, 18, 59, 0.6)',
      backdropBorderRadius: '3px',
      primaryColour: '#337AB7',
      secondaryColour: 'silver',
      tertiaryColour: '#ffffff',
      fullScreenBackdrop: true,
    }),
  ],

  exports: [
    RouterModule,
    SwiperModule,
    SidebarComponent,
    HeaderComponent,
    HomeComponent,
    AccountsTreeComponent,
    CostCentersTreeComponent,
    NgxLoadingModule,
    NgbModule,
    SearchArryPipe,
    ErpSpinnerComponentComponent,
    ErpSelectorComponent,
    ErpSelectorWithSearchComponent,
    ErpSelectorWithCheckboxComponent,
    ErpPaginationComponent,
    PaginationComponent,
    ErpFiltersComponent,
    EmptyDataComponent,
    OrderProductsComponent,
    OrderItemsComponent,
    GeneralOrderProductsComponent,
    AppBreadcrumbComponent,
    AccountsReportHeaderComponent,
    AccountTreeV2Component,
    AccountTreeItemComponent,
    AddEditAccountTreeComponent,
    StatsCardComponent,
    OverviewCardComponent,
    ColorWithStatusDirective,
    WorkflowStatusDirective,
    ComponentHostDirective,
    CustomFormDropdownComponent,
    WelcomePageComponent,
    NotAuthorizedComponent,
    DropDownFormControlComponent,
    RoleCheckerDirective,
    EnglishToArabicNumbersDirective,
    MaterialReceiptSidePanelComponent,
    ProductsDetailsSidePanelComponent,
    RenderComponent,
    UploadImporterFileComponent,
    GeneralSelectorComponent,
    AccountsReportSearchComponent,
    MaterialRequestsSidePanelComponent,
    GoToAccountReportDirective,
    NextPreviousComponent,
    ERPSidebarComponent,
    GoogleChartsModule,
    StatusSelectorComponent,
    RegisterComponent,
    WebsiteHeaderComponent,
    WebsiteSearchComponent,
    RateComponent,
    CompareComponent,
    ChangeQuantityComponent
  ],
  providers: [
    DatePipe,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpConfigInterceptor,
      multi: true,
    },
  ],
})
export class SharedModule {}
