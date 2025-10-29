import { Component, OnInit, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CartService } from 'src/app/components/Shared/services/cart.service';
import { FormService } from 'src/app/components/Shared/services/form.service';
import { MenuService } from 'src/app/components/Shared/services/menu.service';
import { AuthService } from '../auth.service';
import { environment } from 'src/environments/environment';
import { LoginUserModel } from 'src/app/components/Shared/models/LoginResponseModel';

@Component({
  selector: 'app-float-login',
  templateUrl: './float-login.component.html',
  styleUrls: ['./float-login.component.css']
})
export class FloatLoginComponent implements OnInit {
  loggingMode = true;
  email: string = '';
  userName: string = '';
  password: string = '';
  lang = 'en';
  type = '';
  returnUrl: string = '';
  appId: string = '';
  logout: boolean = false;
  showLoader: boolean = false;
  isLoginMode = true;

  systemURL: string = environment.systemUrl;
  constructor(private authService: AuthService,
    private router: Router,
    private toaster: ToastrService,
    private modalService: NgbModal,
    private formService: FormService,) { }

  ngOnInit(): void {
  }
  openLoginRegisterModal(content: TemplateRef<any>) {
    this.isLoginMode = true;
    this.modalService.open(content, {
      size: 'md',
      centered: true,
      scrollable: true,
    });
  }

  login() {
    if (!this.userName || !this.password) {
      this.toaster.warning('Please enter a valid username and password!');
      return;
    }
    let model = {
      Email: this.email,
      userName: this.userName,
      Password: this.password
    }
    this.showLoader = true;
    this.authService.login(model).subscribe((data: LoginUserModel) => {
      if (this.authService.isAuthenticated()) {
        localStorage.setItem('lang', 'en');

        // this.redirectToDesiredApp();
        setTimeout(() => {
          window.location.reload();
        }, 50);
      } else {
        this.toaster.error(data.message);
      }
      this.showLoader = false;
    }, (error) => {
      this.showLoader = false;

    }, () => {
      this.showLoader = false;
    });
  }

}
