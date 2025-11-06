import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbCarouselConfig, NgbModal, NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { PagedResponseModel } from 'src/app/components/Shared/models/PagedResponseDTO';
import { environment } from 'src/environments/environment';
import { SliderModel } from 'src/app/components/Admin/models/SliderModel';
import { WebsiteService } from '../../services/website.service';
import { MerchantItemModel } from 'src/app/components/Shared/models/MerchantItemModel';

@Component({
  selector: 'app-website-slider',
  templateUrl: './website-slider.component.html',
  styleUrls: ['./website-slider.component.css']
})
export class WebsiteSliderComponent implements OnInit {
  systemURL: string = environment.systemUrl;
  UserModel: any;
  activeOrderFilter: number;
  activeSectionsFilter: number;
  counterValue = 1;
  TotalValue = 0;
  NetValue = 0;
  DeliveryFees = 5;
  countRange = 7;
  count = 1 * this.countRange;

  mostPopular = ['الأكثر شهرة', 'الأعلى تقييماً', 'الأسرع في التوصيل'];

  showLoader: boolean = false;
  pageResponseModel: PagedResponseModel<MerchantItemModel[]> = {
    results: [],
    filterList: [],
    pageSize: 20,
    currentPage: 1,
    searchText: ''
  };
  sliderData: SliderModel[] = [];

  constructor(config: NgbCarouselConfig,
    private websiteService: WebsiteService,
    private route: ActivatedRoute
  ) {
    config.interval = 5000;
    config.wrap = true;
    config.keyboard = true;
    config.pauseOnHover = false;

    this.route.params.subscribe(params => {
      if (params['tabName']) {
      }
    });
  }
  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.showLoader = true;
    this.websiteService.GetWebsiteMainSlider().subscribe(data => {
      this.sliderData = data;
      this.showLoader = false;
    }, err => {
      this.showLoader = false;
    }, () => {
      this.showLoader = false;
    });
  }

}
