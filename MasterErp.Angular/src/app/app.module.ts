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
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
@NgModule({
  declarations: [
    AppComponent,
    ErpLoginComponent,
    HeaderComponent,
    SidebarComponent,
    DashboardComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      preventDuplicates: true
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
