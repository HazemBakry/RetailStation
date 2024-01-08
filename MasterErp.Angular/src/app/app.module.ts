import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { ErpLoginComponent } from './components/Shared/components/erp-login/erp-login.component';
import { DashboardComponent } from './components/Main/dashboard/dashboard.component';
import { HeaderComponent } from './components/Main/header/header.component';
import { SidebarComponent } from './components/Main/sidebar/sidebar.component';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedModule } from "./components/Shared/shared.module";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ReviewsComponent } from './components/Main/reviews/reviews.component';
import { SigninComponent } from './components/signin/signin.component';
import { AccountTreeComponent } from './components/design/account-tree/account-tree.component';
import { OpeningBalanceComponent } from './components/design/opening-balance/opening-balance.component';
import { ReceiptsComponent } from './components/design/receipts/receipts.component';
@NgModule({
  declarations: [
    AppComponent,
    ErpLoginComponent,
    HeaderComponent,
    SidebarComponent,
    DashboardComponent,
    ReviewsComponent,
    SigninComponent,
    AccountTreeComponent,
    OpeningBalanceComponent,
    ReceiptsComponent
  ],
  providers: [
    DatePipe,
  ],
  bootstrap: [AppComponent],
  imports: [
    CommonModule,
    FormsModule,
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    NgbModule,
    ToastrModule.forRoot({
      preventDuplicates: true
    }),
    SharedModule
  ]
})
export class AppModule { }
