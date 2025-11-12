import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  NgbCarouselConfig,
  NgbModal,
  NgbOffcanvas,
} from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { PagedResponseModel } from 'src/app/components/Shared/models/PagedResponseDTO';
import { environment } from 'src/environments/environment';
import { WebsiteService } from '../../services/website.service';
import { TotalValuePromotionModel } from 'src/app/components/Admin/models/TotalValuePromotion';

@Component({
  selector: 'app-website-total-value-promotions',
  templateUrl: './website-total-value-promotions.component.html',
  styleUrls: ['./website-total-value-promotions.component.scss']
})
export class WebsiteTotalValuePromotionsComponent implements OnInit {
  systemURL: string = environment.systemUrl;
  defaultImage: string = `${environment.systemUrl}${environment.defaultImage}`;


  showLoader: boolean = false;

  pageResponseModel: PagedResponseModel<TotalValuePromotionModel[]> = {
    results: [],
    filterList: [],
    pageSize: 20,
    currentPage: 1,
    searchText: '',
  };
  promotions: TotalValuePromotionModel[] = [];
  constructor(
    config: NgbCarouselConfig,
    private websiteService: WebsiteService,
    private route: ActivatedRoute
  ) {
    config.interval = 5000;
    config.wrap = true;
    config.keyboard = true;
    config.pauseOnHover = false;

    this.route.params.subscribe((params) => {
      if (params['tabName']) {
      }
    });
  }
  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.showLoader = true;
    this.websiteService
      .GetWebsiteTotalValuePromotions(this.pageResponseModel)
      .subscribe(
        (data) => {
          this.pageResponseModel.results = data.results;
          this.promotions = data.results;
          this.pageResponseModel.totalCount = data.totalCount;
          this.showLoader = false;
        },
        (err) => {
          this.showLoader = false;
        },
        () => {
          this.showLoader = false;
        }
      );
  }


  formatDiscountValue(promo: TotalValuePromotionModel): string {
    const value = promo.discountValue;
    return promo.valueType === 'FIXED_AMOUNT' ? `${value} ريال` : `${value}%`;
  }

  formatDiscountText(promo: TotalValuePromotionModel): string {
    return promo.valueType === 'FIXED_AMOUNT' ? 'خصم ثابت' : 'خصم مئوي';
  }

  formatMinValue(minValue: number | null): string {
    if (minValue === null) {
      return 'لا يوجد حد أدنى';
    }
    return `الحد الأدنى: ${minValue} ريال`;
  }

  formatEndDate(dateString: Date | string): string {
    const date = new Date(dateString);
    // Uses 'ar-EG' locale for Arabic formatting
    return date.toLocaleDateString('ar-EG', { year: 'numeric', month: '2-digit', day: '2-digit' });
  }
  copyCode(code: string | null): void {
    if (code) {
      navigator.clipboard.writeText(code);
      alert(`تم نسخ الكود: ${code}`);
    }
  }

}
