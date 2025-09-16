import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbCarouselConfig, NgbModal, NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { MenuSidebarItem } from 'src/app/components/Shared/models/MenuSidebarItem';
import { PagedResponseModel } from 'src/app/components/Shared/models/PagedResponseDTO';
import { SharedService } from 'src/app/components/Shared/services/shared.service';
import { environment } from 'src/environments/environment';
import { SupplierItemModel } from '../../../models/SupplierItemModel';
import { WebsiteService } from '../../../services/website.service';

@Component({
  selector: 'app-website-promotion-items',
  templateUrl: './website-promotion-items.component.html',
  styleUrls: ['./website-promotion-items.component.css']
})
export class WebsitePromotionItemsComponent  implements OnInit {
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
  pageResponseModel: PagedResponseModel<SupplierItemModel[]> = {
    results: [],
    filterList: [],
    pageSize: 20,
    currentPage: 1,
    searchText: ''
  };
  suppliersData: SupplierItemModel[] = [];
  constructor(config: NgbCarouselConfig, private websiteService: WebsiteService,
    private sharedService: SharedService, private modalService: NgbModal,
    private offcanvasService: NgbOffcanvas, private toaster: ToastrService,
    private route: ActivatedRoute,
    private datePipe: DatePipe,) {
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

  }
}
