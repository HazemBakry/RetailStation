import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { PurchaseService } from 'src/app/components/Purchases/services/purchase.service';
import { PagedResponseDTO, PagedResponseModel } from 'src/app/components/Shared/models/PagedResponseDTO';
import { SharedService } from 'src/app/components/Shared/services/shared.service';
import { InventoryService } from 'src/app/components/Inventory/services/inventory.service';
import { GeneralSelectorModel } from '../../general-selector/general-selector.component';
import { MaterialReceiptModel } from 'src/app/components/Inventory/models/MaterialReceiptModel';
import { WebsiteService } from 'src/app/components/Main/services/website.service';
import { SupplierItemModel } from 'src/app/components/Main/models/SupplierItemModel';
import { CompareService, ItemCompareModel } from '../../../services/comapre.service';

@Component({
  selector: 'app-compare',
  templateUrl: './compare.component.html',
  styleUrls: ['./compare.component.css'],
  encapsulation: ViewEncapsulation.None,

})
export class CompareComponent implements OnInit {
  @Input() selectedSupplierId: any;

  @Output() selectedOrder = new EventEmitter<MaterialReceiptModel[]>()
  OrdersList: any[] = [];
  showLoader: boolean;

  selectAll: boolean = false;
  orderNumber: string = '';
  orderDate: string;
  pageResponseModel: PagedResponseModel<SupplierItemModel[]> = {
    results: [],
    filterList: [],
    pageSize: 20,
    currentPage: 1,
    searchText: ''
  };
  suppliersSelectorData: GeneralSelectorModel[] = [];
  compareCount$: number = 0;

  constructor(private offcanvasService: NgbOffcanvas,
    private sharedService: SharedService,
    private compareService: CompareService,
    private toaster: ToastrService, private websiteService: WebsiteService,
  ) { }


  ngOnInit(): void {
    this.compareService.itemCount$.subscribe(count => {
      this.compareCount$ = count || 0;
    });
  }


  loadData() {
    this.mapFilters();
    if (this.pageResponseModel.filterList.length == 0) {
      this.toaster.warning('لا يوجد أصناف ');
      return;
    }

    this.showLoader = true;
    this.websiteService.GetWebsiteItems_Data(this.pageResponseModel).subscribe(data => {
      this.pageResponseModel.results = data.results;
      // this.suppliersData = this.suppliersData.concat([...data.results]);
      this.pageResponseModel.totalCount = data.totalCount;

      this.showLoader = false;
    }, err => {
      this.showLoader = false;
    }, () => {
      this.showLoader = false;
    });
  }
  pageChanged(obj: any) {
    this.pageResponseModel.currentPage = obj.page;
    this.loadData();
  }
  mapFilters() {
    const compareList: ItemCompareModel[] = this.compareService.getCurrentList();
    this.pageResponseModel.pageSize = compareList.length;
    this.pageResponseModel.results = [];
    this.pageResponseModel.filterList = [];
    compareList.forEach(item => {
      if (item.supplierItemId) {
        this.pageResponseModel.filterList.push({ categoryName: 'SupplierItemId', itemFlag: item.supplierItemId.toString() })
      }
    });
  }
  OpenSidePanel(content: any) {
    this.pageResponseModel.results = [];
    this.loadData();
    this.offcanvasService.open(content, { panelClass: 'details-panel', position: 'end' });
  }
  remove(item: SupplierItemModel): void {
    this.compareService.removeItem(item.supplierItemId, item.itemId);
    this.loadData();
  }

}


