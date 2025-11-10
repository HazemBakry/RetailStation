import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal, NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { GeneralSelectorModel } from 'src/app/components/Shared/components/general-selector/general-selector.component';
import { FilterItem } from 'src/app/components/Shared/models/FilterModel';
import { MerchantItemModel } from 'src/app/components/Shared/models/MerchantItemModel';
import { PagedResponseModel } from 'src/app/components/Shared/models/PagedResponseDTO';
import { SharedService } from 'src/app/components/Shared/services/shared.service';
import { MerchantManagementService } from 'src/app/components/Website/services/merchant-management.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-manage-merchant-items',
  templateUrl: './manage-merchant-items.component.html',
  styleUrls: ['./manage-merchant-items.component.css']
})
export class ManageMerchantItemsComponent implements OnInit {
  TitleList = ['التشغيل', 'بيانات الأصناف'];
  itemsSelectorData: GeneralSelectorModel[] = [];
  selectedItemId: number;
  itemModel: MerchantItemModel = {} as MerchantItemModel;
  filterList: FilterItem[] = [];
  defaultImage: string = `${environment.systemUrl}${environment.defaultImage}`;

  pagedResponseModel: PagedResponseModel<MerchantItemModel[]> = {
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
    private merchantManagementService: MerchantManagementService,
    private sharedService: SharedService,
    private toaster: ToastrService, private offcanvasService: NgbOffcanvas,) { }

  ngOnInit(): void {
    this.acRoute.params.subscribe((params: any) => {
      if (params.MerchantId) {
        this.merchantId = Number(params.MerchantId);
        this.loadData();
      }
    });
    this.loadItemsSelector();
  }

  loadItemsSelector() {
    this.sharedService.GetItemsSelector().subscribe((data: GeneralSelectorModel[]) => {
      this.itemsSelectorData = data;
    });
  }

  loadData() {
    this.showLoader = true;
    this.merchantManagementService.GetMerchantItems_Data(this.merchantId, this.pagedResponseModel).subscribe(data => {
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

  mapMerchantItem(merchantItemId: number, itemId: number) {
    this.showLoader = true;
    this.merchantManagementService.MapMerchantItem(this.merchantId, merchantItemId, itemId).subscribe(data => {
      this.loadData();
      this.showLoader = false;
    }, err => {
      this.showLoader = false;
    }, () => {
      this.showLoader = false;
    });
  }
  MarkItemAsBestSeller(merchantItemId: any) {
    this.merchantManagementService.MarkItemAsBestSeller(merchantItemId).subscribe(data => {
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
