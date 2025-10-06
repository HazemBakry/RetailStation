import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/Auth/auth.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'src/environments/environment';
import { LoginUserModel } from 'src/app/components/Shared/models/LoginResponseModel';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  keyboardNumbers: any[] = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
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
  systemURL: string = environment.systemUrl;
  constructor(private authService: AuthService, private acRouter: ActivatedRoute, 
    private router: Router, private toaster: ToastrService, 
    private modalService: NgbModal) {
    this.returnUrl = this.acRouter.snapshot.queryParamMap.get('returnUrl'); //|| '/';
    console.log("this.returnUrl", this.returnUrl);

    this.appId = this.acRouter.snapshot.queryParamMap.get('appId') || '';
    this.logout = this.acRouter.snapshot.queryParamMap.get('logout') === 'true';
    if (this.logout) {
      this.authService.logout();
    } else if (this.authService.isAuthenticated()) {
      this.redirectToDesiredApp();
    }
  }

  ngOnInit(): void {
    this.lang = localStorage.getItem('lang') ?? 'en';
    if (!this.isValidAppId(this.appId)) {
      //alert('Unauthorized application!');
      //this.router.navigate(['/unauthorized']);

    }
  }
  Login() {
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

        this.redirectToDesiredApp();

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

  private redirectToDesiredApp(): void {
    // this.returnUrl=sessionStorage.getItem('returnUrl');
    // if (this.returnUrl) 
    //   this.router.navigateByUrl(this.returnUrl);
    // else 
    // this.router.navigateByUrl('/');
    //const redirectUrl = `${this.returnUrl}?access_token=${encodeURIComponent(this.authService.access_Token)}`;

    let redirectUrl = this.returnUrl;
    if (this.returnUrl && !this.returnUrl.startsWith('/')) {
      const hasParams = this.returnUrl.includes('?');
      if (hasParams) {
        // If there are existing query parameters, append the access_token with '&'
        redirectUrl = `${this.returnUrl}&access_token=${encodeURIComponent(this.authService.access_Token)}`;
      } else {
        // If there are no query parameters, append the access_token with '?'
        redirectUrl = `${this.returnUrl}?access_token=${encodeURIComponent(this.authService.access_Token)}`;
      }
    }
    else {
      redirectUrl = './home'
    }

    window.location.href = redirectUrl;

  }
  private isValidAppId(appId: string): boolean {
    const validAppIds = ['e5b35f76-bdd3-4e93-8038-89668f4ff4bc', 'other-app-id'];
    return validAppIds.includes(appId);
  }




  numberKeyClicked(number) {
    if (this.type == 'UserName') {
      this.userName = this.userName + number;
    }
    else if (this.type == 'Password') {
      this.password = this.password + number;
    }
  }

  packInputNumber() {
    if (this.type == 'UserName') {
      this.userName = this.userName.slice(0, -1);
    }
    else if (this.type == 'Password') {
      this.password = this.password.slice(0, -1);
    }
  }

  clearInputNumber() {
    if (this.type == 'UserName') {
      this.userName = '';
    }
    else if (this.type == 'Password') {
      this.password = '';
    }
  }


  InputFocus(type: any) {
    this.type = type;
  }

}
