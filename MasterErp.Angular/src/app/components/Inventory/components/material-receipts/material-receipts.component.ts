import { Component, OnInit } from '@angular/core';
import { InventoryService } from '../../services/inventory.service';
import { ToastrService } from 'ngx-toastr';
import { PagedResponseDTO } from 'src/app/components/Shared/models/PagedResponseDTO';
import { OrderModel } from '../../models/inventory';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FilterItem, FilterModel } from 'src/app/components/Shared/models/FilterModel';
import { MaterialReceiptModel } from '../../models/MaterialReceiptModel';




@Component({
  selector: 'app-material-receipts',
  templateUrl: './material-receipts.component.html',
  styleUrls: ['./material-receipts.component.css']
})

export class MaterialReceiptsComponent implements OnInit {
  TitleList = ['المخازن', 'أذونات الإضافة'];
  showLoader: boolean;
  OrderId: number;
  pagedResponseModel: PagedResponseDTO<MaterialReceiptModel[]> = {
    results: [],
    filterList: [],
    pageSize: 25,
    currentPage: 1,
    searchText: ''
  };
  filterList: FilterModel[] = [];

  constructor(private inventoryService: InventoryService,
    private modalService: NgbModal,
    private toaster: ToastrService) { }

  ngOnInit(): void {
    this.getMaterialReceipts_Data();
    this.getMaterialReceipts_Filters();
  }

  getMaterialReceipts_Data() {
    this.showLoader = true;
    this.inventoryService.GetMaterialReceipts_Data(this.pagedResponseModel).subscribe(data => {
      this.pagedResponseModel.results = data.results;
      this.pagedResponseModel.totalCount = data.totalCount;
      this.showLoader = false;
    }, (err) => {
      this.showLoader = false;
    }, () => {
      this.showLoader = false;
    })
  }
  getMaterialReceipts_Filters() {
    // this.showLoader = true;
    this.inventoryService.GetMaterialReceipts_Filters(this.pagedResponseModel).subscribe((data: FilterModel[]) => {
      this.filterList = data;

    }, (err) => {
      // this.showLoader = false;
    }, () => {
      // this.showLoader = false;
    })
  }
  filterChecked(filterItems: FilterItem[]) {
    this.pagedResponseModel.filterList = filterItems;
    this.getMaterialReceipts_Data();
    // this.getMaterialReceipts_Filters();
  }

  pageChanged(obj: any) {
    this.pagedResponseModel.currentPage = obj.page;
    this.getMaterialReceipts_Data();
  }

  openDeleteModal(content: any, itemId: number) {
    this.OrderId = itemId;
    this.modalService.open(content, { centered: true, size: 'md' });
  }

  cancelOrder() {
    this.inventoryService.CancelMaterialReceipt(this.OrderId).subscribe(data => {
      if (data?.isSuccess) {
        this.modalService?.dismissAll();
        this.getMaterialReceipts_Data();
        this.toaster.success(data?.message);
      }
      else {
        this.toaster.error(data?.message);
      }
      this.showLoader = false;
    }, err => {
      this.showLoader = false;
    }, () => {
      this.showLoader = false;
    });
  }

  getStatusColor(status: boolean) {
    if (status == true)
      return "cancelled";
    else
      return "open";
  }

}
