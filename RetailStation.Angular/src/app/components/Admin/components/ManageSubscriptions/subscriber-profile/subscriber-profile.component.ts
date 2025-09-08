import { Component } from '@angular/core';
import { AuthService } from 'src/app/Auth/auth.service';
import { LoginUserModel } from 'src/app/components/Shared/models/LoginResponseModel';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-subscriber-profile',
  templateUrl: './subscriber-profile.component.html',
  styleUrls: ['./subscriber-profile.component.css']
})
export class SubscriberProfileComponent {
  isLeftSideMenuShowed: boolean = false;
  toggler = false;
  systemUrl: string = environment.systemUrl
  loggedInUser: LoginUserModel;
  defaultImage = `${this.systemUrl}assets/images/default-image.png`;
  constructor(private authService: AuthService) {
    this.loggedInUser = this.authService.getCurrentUser();
  }
  ngOnInit(): void {
    this.createClock();
  }

  intervalClock;
  time = new Date();
  clock: string;
  createClock() {
    this.intervalClock = setInterval(() => {
      this.time = new Date();
      this.clock = this.time.getHours() + ':' + (this.time.getMinutes() < 10 ? '0' : '') + this.time.getMinutes()
    }, 1000);
  }
  onToggler() {
    this.toggler = !this.toggler;
  }
  toggleMenu(menu: HTMLElement) {
    menu.classList.toggle('show');
  }
}
