import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal, NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { GeneralSelectorModel } from 'src/app/components/Shared/components/general-selector/general-selector.component';
import { FilterItem } from 'src/app/components/Shared/models/FilterModel';
import { PromotionModel } from 'src/app/components/Shared/models/PromotionModel';
import { PagedResponseModel } from 'src/app/components/Shared/models/PagedResponseDTO';
import { SharedService } from 'src/app/components/Shared/services/shared.service';
import { MerchantService } from 'src/app/components/Website/services/merchant.service';

import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-manage-merchant-promotions',
  templateUrl: './manage-merchant-promotions.component.html',
  styleUrls: ['./manage-merchant-promotions.component.css']
})
export class ManageMerchantPromotionsComponent implements OnInit {
  TitleList = ['التشغيل', 'بيانات العروض'];
  itemsSelectorData: GeneralSelectorModel[] = [];
  selectedItemId: number;
  itemModel: PromotionModel = {} as PromotionModel;
  filterList: FilterItem[] = [];
  defaultImage: string = `${environment.systemUrl}${environment.defaultImage}`;

  pagedResponseModel: PagedResponseModel<PromotionModel[]> = {
    results: [],
    filterList: [],
    pageSize: 20,
    currentPage: 1,
    searchText: ''
  };
  showLoader: boolean = false;
  showAddLoader: boolean = false;
  showExportLoader: boolean = false;

  merchantId: number;
  constructor(private modalService: NgbModal, 
    private acRoute: ActivatedRoute, 
    private merchantService: MerchantService,
    private sharedService: SharedService,
    private toaster: ToastrService, private offcanvasService: NgbOffcanvas,) { }

  ngOnInit(): void {
    this.acRoute.params.subscribe((params: any) => {
      if (params.MerchantId) {
        this.merchantId = Number(params.MerchantId);
        this.loadData();
        this.loadItemsSelector();
      }
    });
  }

  loadItemsSelector() {
    this.sharedService.GetMerchantItemsSelector(this.merchantId).subscribe((data: GeneralSelectorModel[]) => {
      this.itemsSelectorData = data;
    });
  }

  loadData() {
    this.showLoader = true;
    this.merchantService.GetPromotions_Data(this.merchantId, this.pagedResponseModel).subscribe(data => {
      this.pagedResponseModel.results = data.results;
      this.pagedResponseModel.totalCount = data.totalCount;
      this.showLoader = false;
    }, err => {
      this.showLoader = false;
    }, () => {
      this.showLoader = false;
    });
  }

  pageChanged(obj: any) {
    this.pagedResponseModel.currentPage = obj.page;
    this.loadData();
  }

  filterChecked(filterItems: FilterItem[]) {
    this.pagedResponseModel.filterList = filterItems;
    this.loadData();
  }
  approvePromotionToDisplay(promotionId: any) {
    this.merchantService.ApprovePromotionToDisplay(this.merchantId,promotionId).subscribe(data => {
      if (data.isSuccess) {
        this.toaster.success(data.message);
        this.loadData();
      } else {
        this.toaster.error(data.message);
      }
      this.showAddLoader = false;
    }, err => {
      this.showAddLoader = false;
    }, () => {
      this.showAddLoader = false;
    });
  }
}
