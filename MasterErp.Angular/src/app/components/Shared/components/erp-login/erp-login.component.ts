import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/Auth/auth.service';
import { LoginUserModel } from '../../models/LoginResponseModel';

@Component({
  selector: 'app-erp-login',
  templateUrl: './erp-login.component.html',
  styleUrls: ['./erp-login.component.css']
})
export class ErpLoginComponent implements OnInit {
  loggingMode = true;
  Email: string;
  Password: string;
  constructor(private authService:AuthService, private router: Router, private toaster: ToastrService, private modalService: NgbModal) { }

  ngOnInit(): void {
  }




  Lang = 'en';

  type = '';
  returnUrl:string='';




  Login() {
    if(!this.Email||!this.Password)
    {
      this.toaster.warning('Please enter a valid email and password!'); 
      return;
    }
    let model = {
      Email: this.Email,
      Password: this.Password
    }

    this.authService.login(model).subscribe((data:LoginUserModel) => {
      if (data.isAuthenticated) {
        localStorage.setItem('lang', 'en');
        // this.returnUrl=sessionStorage.getItem('returnUrl');
        // if (this.returnUrl) 
        //   this.router.navigateByUrl(this.returnUrl);
        // else 
          this.router.navigateByUrl('/');
          
      } else {
        this.toaster.error(data.message);
      }
    });
  }



}
