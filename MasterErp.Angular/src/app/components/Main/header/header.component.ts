import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { AuthService } from 'src/app/Auth/auth.service';
import { environment } from 'src/environments/environment';
import { LoginUserModel } from '../../Shared/models/LoginResponseModel';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  @Input() showToggler: boolean = true;
  @Output() toggler = new EventEmitter<boolean>();
  collapsed = true;
  showMenu: boolean = false;
  systemUrl:string=environment.systemUrl;
  UserModel: LoginUserModel;
  
  constructor(private authService:AuthService) { 
    this.UserModel = this.authService.getCurrentUser();
  }

  ngOnInit(): void {
  }

  onToggler() {
    this.showMenu = !this.showMenu;
    // this.toggler.emit();
    console.log(this.toggler);
  }
  logout() {
    this.authService.logout();
  }



}
