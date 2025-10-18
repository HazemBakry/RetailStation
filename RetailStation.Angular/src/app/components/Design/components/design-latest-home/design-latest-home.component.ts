import { Component, OnInit } from '@angular/core';
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
  selector: 'app-design-latest-home',
  templateUrl: './design-latest-home.component.html',
  styleUrls: ['./design-latest-home.component.css'],
})
export class DesignLatestHomeComponent implements OnInit {
  isFav_1 = false;
  isFav_2 = false;
  isFav_3 = true;
  isFav_4 = false;
  isFav_5 = true;
  isFav_6 = false;
  constructor() {}

  ngOnInit(): void {}
}
