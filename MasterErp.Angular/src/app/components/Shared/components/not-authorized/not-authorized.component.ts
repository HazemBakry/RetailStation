import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/Auth/auth.service';

@Component({
  selector: 'app-not-authorized',
  templateUrl: './not-authorized.component.html',
  styleUrls: ['./not-authorized.component.css']
})
export class NotAuthorizedComponent implements OnInit {

  constructor(private authService: AuthService, private router: Router) { }
  returnUrl:string='';
  ngOnInit(): void {
    this.returnUrl=sessionStorage.getItem('returnUrl');
  }
  login() {
    this.authService.loginRedirect();
  }
}
