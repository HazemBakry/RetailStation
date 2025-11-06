import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { StatsCardComponent } from './components/stats-card/stats-card.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ngxLoadingAnimationTypes, NgxLoadingModule } from 'ngx-loading';
import { SearchArryPipe } from './Pipes/search-arry.pipe';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ErpSelectorComponent } from './components/selectors/erp-selector/erp-selector.component';
import { ErpSelectorWithSearchComponent } from './components/selectors/erp-selector-with-search/erp-selector-with-search.component';
import { ErpSelectorWithCheckboxComponent } from './components/selectors/erp-selector-with-checkbox/erp-selector-with-checkbox.component';
import { ErpFiltersComponent } from './components/erp-filters/erp-filters.component';
import { EmptyDataComponent } from './components/empty-data/empty-data.component';
import { AppBreadcrumbComponent } from './components/app-breadcrumb/app-breadcrumb.component';
import { OverviewCardComponent } from './components/overview-card/overview-card.component';
import { ColorWithStatusDirective } from './directives/color-with-status.directive';
import { CustomFormDropdownComponent } from './components/custom-form-dropdown/custom-form-dropdown.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpConfigInterceptor } from './security/interceptor/http-config.interceptor';
import { WelcomePageComponent } from './components/welcome-page/welcome-page.component';
import { SwiperModule } from 'swiper/angular';
import { NotAuthorizedComponent } from './components/not-authorized/not-authorized.component';
import { RoleCheckerDirective } from './directives/role-checker.directive';

import { RouterModule } from '@angular/router';
import { DropDownFormControlComponent } from './components/drop-down-form-control/drop-down-form-control.component';
import { ProductsDetailsSidePanelComponent } from './components/sidepanel/products-details-side-panel/products-details-side-panel.component';
import { RenderComponent } from './components/render/render.component';
import { ComponentHostDirective } from './directives/component-host.directive';
import { EnglishToArabicNumbersDirective } from './directives/english-to-arabic-numbers.directive';
import { UploadImporterFileComponent } from '../SystemSettings/components/upload-importer-file/upload-importer-file.component';
import { ErpSpinnerComponentComponent } from './components/erp-spinner-component/erp-spinner-component.component';
import { GeneralSelectorComponent } from './components/general-selector/general-selector.component';
import { WorkflowStatusDirective } from './directives/workflow-status.directive';
import { GoToAccountReportDirective } from './directives/go-to-account-report.directive';
import { NextPreviousComponent } from './components/tools/next-previous/next-previous.component';
import { ERPSidebarComponent } from './components/erp-sidebar/erp-sidebar.component';
import { GoogleChartsModule } from 'angular-google-charts';
import { StatusSelectorComponent } from './components/status-selector/status-selector.component';
import { HeaderComponent } from './components/header/header.component';
import { RetailHomeComponent } from './components/retail-home/retail-home.component';
import { RegisterComponent } from 'src/app/Auth/register/register.component';
import { RateComponent } from './components/rate/rate.component';
import { CompareComponent } from './components/sidepanel/compare/compare.component';
import { ChangeQuantityComponent } from './components/change-quantity/change-quantity.component';
import { AppPaginationComponent } from './components/app-pagination/app-pagination.component';
import { AppFiltersComponent } from './components/app-filters/app-filters.component';
import { FloatLoginComponent } from 'src/app/Auth/float-login/float-login.component';
import { WebsiteApplyMerchantRequestComponent } from '../Website/components/website-subscribe/website-apply-merchant-request.component';

@NgModule({
  declarations: [
    FloatLoginComponent,
    WebsiteApplyMerchantRequestComponent,
    HeaderComponent,
    StatsCardComponent,
    SearchArryPipe,
    ErpSelectorComponent,
    ErpSelectorWithSearchComponent,
    ErpSelectorWithCheckboxComponent,
    AppPaginationComponent,
    AppPaginationComponent,
    ErpFiltersComponent,
    EmptyDataComponent,
    AppBreadcrumbComponent,
    OverviewCardComponent,
    ColorWithStatusDirective,
    WorkflowStatusDirective,
    ComponentHostDirective,
    CustomFormDropdownComponent,
    WelcomePageComponent,
    NotAuthorizedComponent,
    DropDownFormControlComponent,
    RoleCheckerDirective,
    ProductsDetailsSidePanelComponent,
    RenderComponent,
    EnglishToArabicNumbersDirective,
    UploadImporterFileComponent,
    ErpSpinnerComponentComponent,
    GeneralSelectorComponent,
    GoToAccountReportDirective,
    NextPreviousComponent,
    ERPSidebarComponent,
    StatusSelectorComponent,
    RetailHomeComponent,
    RegisterComponent,
    RateComponent,
    CompareComponent,
    ChangeQuantityComponent,
    AppFiltersComponent
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
    HeaderComponent,
    NgxLoadingModule,
    NgbModule,
    SearchArryPipe,
    FloatLoginComponent,
    WebsiteApplyMerchantRequestComponent,
    ErpSpinnerComponentComponent,
    ErpSelectorComponent,
    ErpSelectorWithSearchComponent,
    ErpSelectorWithCheckboxComponent,
    AppPaginationComponent,
    ErpFiltersComponent,
    EmptyDataComponent,
    AppBreadcrumbComponent,
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
    ProductsDetailsSidePanelComponent,
    RenderComponent,
    UploadImporterFileComponent,
    GeneralSelectorComponent,
    GoToAccountReportDirective,
    NextPreviousComponent,
    ERPSidebarComponent,
    GoogleChartsModule,
    StatusSelectorComponent,
    RegisterComponent,
    RateComponent,
    CompareComponent,
    ChangeQuantityComponent,
    AppFiltersComponent
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
