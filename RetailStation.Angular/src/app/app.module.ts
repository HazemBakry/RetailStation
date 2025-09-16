import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { DashboardComponent } from './components/Shared/components/dashboard/dashboard.component';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedModule } from './components/Shared/shared.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ErpLoginComponent } from './components/Shared/components/erp-login/erp-login.component';
import { SigninComponent } from './components/Shared/components/signin/signin.component';
import { AuthCallbackComponent } from './auth-callback/auth-callback.component';
import { RolesService } from './Auth/roles.service';
import { LoginComponent } from './Auth/login/login.component';
import { RegisterComponent } from './Auth/register/register.component';

@NgModule({
  declarations: [
    AppComponent,
    ErpLoginComponent,
    LoginComponent,
    DashboardComponent,
    SigninComponent,
    AuthCallbackComponent,
  ],
  providers: [
    DatePipe,
    {
      provide: APP_INITIALIZER,
      useFactory: fetchPermissionsOnStart,
      deps: [RolesService],
      multi: true,
    },
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
      preventDuplicates: true,
    }),
    SharedModule,
  ],
})
export class AppModule {}

export function fetchPermissionsOnStart(rolesService: RolesService) {
  // if (authService.isAuthenticated()) {
  return () => {
    return rolesService
      .fetchUserAuthorizedPages()
      .toPromise()
      .then((permissions) => {
        rolesService.setPermissions(permissions);
      })
      .catch((error) => {
        console.error('Unhandled error during permission fetching:', error);
        rolesService.setPermissions([]);
      });
  };
  // }
  console.warn(
    'User is not authenticated. Authorized Pages will not be fetched.'
  );
  rolesService.setPermissions([]);
}
