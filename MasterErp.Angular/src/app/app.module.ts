import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ErpLoginComponent } from './erp-login/erp-login.component';
import { DashboardComponent } from './components/Main/dashboard/dashboard.component';
import { HeaderComponent } from './components/Main/header/header.component';
import { SidebarComponent } from './components/Main/sidebar/sidebar.component';
import { StatsCardComponent } from './components/shared/stats-card/stats-card.component';
@NgModule({
  declarations: [
    AppComponent,
    ErpLoginComponent,
    HeaderComponent,
    SidebarComponent,
    DashboardComponent,
    StatsCardComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
