import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '../Shared/shared.module';
import { UserLayoutComponent } from './user-layout/user-layout.component';
import { MyOrdersComponent } from '../Website/components/my-orders/my-orders.component';
import { UserDashboardComponent } from './components/user-dashboard/user-dashboard.component';
import { UserProfileComponent } from '../Website/components/user-profile/user-profile.component';
import { UserRoutingModule } from './user-routing.module';
import { RouterModule } from '@angular/router';
import { UserHomeComponent } from './components/user-home/user-home.component';

@NgModule({
  declarations: [
    UserLayoutComponent,
    // MyOrdersComponent,
    UserDashboardComponent,
    // UserProfileComponent,
    UserHomeComponent
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    FormsModule,
    NgbModule,
    SharedModule,
    ReactiveFormsModule
  ]
})
export class UserModule { }
