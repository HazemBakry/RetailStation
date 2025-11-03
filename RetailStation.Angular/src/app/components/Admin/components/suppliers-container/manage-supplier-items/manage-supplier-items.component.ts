import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal, NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { SalesService } from 'src/app/components/Sales/services/sales.service';
import { GeneralSelectorModel } from 'src/app/components/Shared/components/general-selector/general-selector.component';
import { FilterItem } from 'src/app/components/Shared/models/FilterModel';
import { PagedResponseModel } from 'src/app/components/Shared/models/PagedResponseDTO';
import { MerchantItemModel } from 'src/app/components/Shared/models/MerchantItemModel';
import { SharedService } from 'src/app/components/Shared/services/shared.service';

@Component({
  selector: 'app-manage-supplier-items',
  templateUrl: './manage-supplier-items.component.html',
  styleUrls: ['./manage-supplier-items.component.css']
})
export class ManageSupplierItemsComponent implements OnInit {
  TitleList = ['التشغيل', 'بيانات الأصناف'];
  itemsSelectorData: GeneralSelectorModel[] = [];
  selectedItemId: number;
  itemModel: MerchantItemModel = {} as MerchantItemModel;
  filterList: FilterItem[] = [];

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

  supplierId: number;
  constructor(private modalService: NgbModal, private acRoute: ActivatedRoute, private salesService: SalesService,
    private sharedService: SharedService,
    private toaster: ToastrService, private offcanvasService: NgbOffcanvas,) { }

  ngOnInit(): void {
    this.acRoute.params.subscribe((params: any) => {
      if (params.SupplierId) {
        this.supplierId = Number(params.SupplierId);
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
    this.salesService.GetSupplierItems_Data(this.supplierId, this.pagedResponseModel).subscribe(data => {
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

  mapSupplierItem(merchantItemId: number, itemId: number) {
    this.showLoader = true;
    this.salesService.MapSupplierItem(this.supplierId, merchantItemId, itemId).subscribe(data => {
      this.loadData();
      this.showLoader = false;
    }, err => {
      this.showLoader = false;
    }, () => {
      this.showLoader = false;
    });
  }
  MarkItemAsBestSeller(merchantItemId: any) {
    this.salesService.MarkItemAsBestSeller(merchantItemId).subscribe(data => {
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
