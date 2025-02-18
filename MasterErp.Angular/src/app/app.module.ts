import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { DashboardComponent } from './components/Main/dashboard/dashboard.component';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedModule } from './components/Shared/shared.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ReviewsComponent } from './components/Main/reviews/reviews.component';
import { ErpLoginComponent } from './components/Shared/components/erp-login/erp-login.component';
import { SigninComponent } from './components/Shared/components/signin/signin.component';
import { AuthCallbackComponent } from './auth-callback/auth-callback.component';

@NgModule({
  declarations: [
    AppComponent,
    ErpLoginComponent,

    DashboardComponent,
    ReviewsComponent,
    SigninComponent,
    AuthCallbackComponent,
  ],
  providers: [DatePipe],
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
      preventDuplicates: true,
    }),
    SharedModule,
  ],
})
export class AppModule {}
