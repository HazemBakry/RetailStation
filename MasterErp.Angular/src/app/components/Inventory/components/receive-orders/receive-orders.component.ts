import { Component, OnInit } from '@angular/core';
import { InventoryService } from '../../services/inventory.service';
import { ToastrService } from 'ngx-toastr';
import { PagedResponseDTO } from 'src/app/components/Shared/models/PagedResponseDTO';
import { OrderModel } from '../../models/inventory';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FilterItem, FilterModel } from 'src/app/components/Shared/models/FilterModel';




@Component({
  selector: 'app-receive-orders',
  templateUrl: './receive-orders.component.html',
  styleUrls: ['./receive-orders.component.css']
})

export class ReceiveOrdersComponent implements OnInit {
  TitleList = ['المخازن', 'أذونات الإضافة'];
  showLoader: boolean;
  OrderId: number;
  pagedResponseModel: PagedResponseDTO<OrderModel[]> = {
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
    this.getReceiveOrdersSummary();
    this.getReceiveOrders_Filters();
  }

  getReceiveOrdersSummary() {
    this.showLoader = true;
    this.inventoryService.GetReceiveOrders_Data(this.pagedResponseModel).subscribe(data => {
      this.pagedResponseModel.results = data.results;
      this.pagedResponseModel.totalCount = data.totalCount;
      this.showLoader = false;
    }, (err) => {
      this.showLoader = false;
    }, () => {
      this.showLoader = false;
    })
  }
  getReceiveOrders_Filters() {
    // this.showLoader = true;
    this.inventoryService.GetReceiveOrders_Filters(this.pagedResponseModel).subscribe((data: FilterModel[]) => {
      this.filterList = data;

    }, (err) => {
      // this.showLoader = false;
    }, () => {
      // this.showLoader = false;
    })
  }
  filterChecked(filterItems: FilterItem[]) {
    this.pagedResponseModel.filterList = filterItems;
    this.getReceiveOrdersSummary();
    // this.getReceiveOrders_Filters();
  }

  pageChanged(obj: any) {
    this.pagedResponseModel.currentPage = obj.page;
    this.getReceiveOrdersSummary();
  }

  openDeleteModal(content: any, itemId: number) {
    this.OrderId = itemId;
    this.modalService.open(content, { centered: true, size: 'md' });
  }

  cancelOrder() {
    this.inventoryService.CancelReceiveOrder(this.OrderId).subscribe(data => {
      if (data?.isSuccess) {
        this.modalService?.dismissAll();
        this.getReceiveOrdersSummary();
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
