import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../Auth/auth.service';

@Component({
  selector: 'app-auth-callback',
  templateUrl: './auth-callback.component.html',
  styleUrls: ['./auth-callback.component.css']
})
export class AuthCallbackComponent implements OnInit {
  constructor(private acRoute: ActivatedRoute, private authService: AuthService, private router: Router) {
    this.acRoute.queryParams.subscribe(async params => {
      const token = params['access_token'];
      if (token) {
        this.authService.storeTokens(token,'');

        //complete authentication ( get loggedIn user data to save it in local storage)
        await this.authService.completeAuthentication();

        const returnUrl = sessionStorage.getItem("returnUrl");
        if (returnUrl) {
          this.router.navigateByUrl(returnUrl);
        } else {
          this.router.navigate(['/']);
        }
      } 
      else {
        this.router.navigate(['/']);
        // If no token is found, redirect to an unauthorized page
        //this.router.navigate(['/unauthorized']);
      }
    });
  }


  ngOnInit(): void {
  }

}
