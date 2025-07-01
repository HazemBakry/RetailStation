import { Component, OnInit } from '@angular/core';
import { RolesService } from './Auth/roles.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  // constructor(private rolesService:RolesService)
  // {

  // }
  ngOnInit(): void {
    // this.rolesService.fetchUserAuthorizedPages().subscribe(permissions=>{
    //   console.log("🚀 ~ AppComponent ~ this.rolesService.fetchUserAuthorizedPages ~ data:", data)
    //this.rolesService.setPermissions(permissions);
    // });
  }
  toggler = false;
  onToggler() {
    this.toggler = !this.toggler;
    console.log(this.toggler);
  }
}
