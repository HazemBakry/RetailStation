import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/Auth/auth.service';
import { environment } from 'src/environments/environment';
import { LoginUserModel } from '../../models/LoginResponseModel';

@Component({
  selector: 'app-erp-home',
  templateUrl: './erp-home.component.html',
  styleUrls: ['./erp-home.component.css']
})
export class ErpHomeComponent implements OnInit {
  Lang = 'en';
  UserModel: LoginUserModel;
  // customerApplications: CustomerApplicationModel[] = [];
  customerApplications: any[] = [];
  systemURL: string=environment.systemUrl;
  breakpoints:any={
    '0': {
      slidesPerView: 1
    },
    '575': {
      slidesPerView: 2
    },
    '767': {
      slidesPerView: 3
    },
    '1024': {
      slidesPerView: 4
    },
    '1200': {
      slidesPerView: 5
    }
  };
  constructor(private router: Router, private authService: AuthService) { }
  ngOnInit(): void {
    this.UserModel = this.authService.getCurrentUser();
    
  }

  // ngOnInit(): void {
  //   this.UserModel = JSON.parse(localStorage.getItem('UserModel'));
  //   this.Lang = localStorage.getItem('lang') ?? 'en';
  //   this.getCustomerApplications();

  // }

  GoToProductModule(App: any) {
    this.router.navigateByUrl(App.redirectUri);
  }

  // getCustomerApplications() {
  //   this._MainService.getCustomerApplications().subscribe((data: CustomerApplicationModel[]) => {
  //     this.customerApplications = data;
  //   }, (error) => {
  //   }, () => {

  //   })
  // }
}
