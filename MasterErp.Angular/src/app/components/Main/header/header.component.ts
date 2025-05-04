import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { AuthService } from 'src/app/Auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  @Input() showToggler: boolean = true;
  @Output() toggler = new EventEmitter<boolean>();
  collapsed = true;

  constructor(private authService:AuthService) { }

  ngOnInit(): void {
  }

  onToggler() {
    this.toggler.emit();
    console.log(this.toggler);
  }
  logout() {
    this.authService.logout();
  }



}
