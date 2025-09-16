import { Component, OnInit, Input } from '@angular/core';
// import Swiper core and required modules
import SwiperCore, {
  Autoplay,
  Navigation,
  Pagination,
  Scrollbar,
  A11y,
} from 'swiper';

// install Swiper modules
SwiperCore.use([Autoplay, Navigation, Pagination, Scrollbar, A11y]);

@Component({
  selector: 'app-new-home',
  templateUrl: './new-home.component.html',
  styleUrls: ['./new-home.component.css'],
})
export class NewHomeComponent implements OnInit {
  CartItemsList: any;
  isMenuOpen = false;
  UserModelStr: any;
  UserModel: any;

  isUserDropdown = false;

  scrollWidth: number = 0;

  isSearchDropdown = false;

  @Input() placeholderText: string = 'بحث...';

  onClickedOutside() {
    this.isSearchDropdown = false;
  }

  constructor() {}

  ngOnInit(): void {}

  activeContent = 'home';
  onSwitchContent(index: number) {
    if (index === 1) {
      this.activeContent = 'home';
    } else if (index === 2) {
      this.activeContent = 'subscribe';
    }
  }
}
