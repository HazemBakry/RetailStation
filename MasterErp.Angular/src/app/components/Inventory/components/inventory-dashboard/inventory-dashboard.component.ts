import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { PurchaseService } from 'src/app/components/Purchases/services/purchase.service';
import { FilterModel } from 'src/app/components/Shared/models/FilterModel';
import { PagedResponseDTO } from 'src/app/components/Shared/models/PagedResponseDTO';
import { OrderModel } from '../../models/inventory';
import { InventoryService } from '../../services/inventory.service';

@Component({
  selector: 'app-inventory-dashboard',
  templateUrl: './inventory-dashboard.component.html',
  styleUrls: ['./inventory-dashboard.component.css']
})


export class InventoryDashboardComponent implements OnInit {

  overviewList: any;
  dashboardFilterList = ['الأكثر شهرة', 'الأعلى تقييماً', 'الأسرع في التوصيل'];
  activeFilter: number;
  branchId = 0;
  showLoader: boolean = false;
  // VacationsTotalCount: any;
  // LoansTotalCount: any;
  // VacationsList: any[] = [];
  // LoansList: any[] = [];
  receiveOrders: any[] = [];
  deliveryNotes: any[] = [];
  suppliersList: any[] = [];
  FilterModel: FilterModel = {
    currentPage: 1,
    pageSize: 25
  };
  pagedResponseModel:PagedResponseDTO<OrderModel[]>={
    results:[],
    filterList:[],
    pageSize: 25,
    currentPage:1,
    searchText:''

  };
  constructor(private modalService: NgbModal,
    private inventoryService: InventoryService,
    private purchaseService: PurchaseService,
    private toaster: ToastrService) { }

  ngOnInit(): void {
    this.getInventoryStatistics();
    this.getTopMaterialReceipt();
    this.getTopDeliveryNotes();
    this.getSuppliersList();
  }

  getInventoryStatistics() {
    this.inventoryService.GetInventoryStatistics().subscribe(data => {
      this.overviewList = data;
    });
  }

  getTopMaterialReceipt() {
    this.showLoader = true;
    this.inventoryService.GetMaterialReceipts_Data(this.FilterModel).subscribe(data => {
      this.receiveOrders = data.results;
      this.showLoader = false;
    }, err => {
      this.showLoader = false;
    }, () => {
      this.showLoader = false;
    });
  }

  getTopDeliveryNotes() {
    this.showLoader = true;
    this.inventoryService.GetDeliveryNotes_Data(this.pagedResponseModel).subscribe(data => {
      this.deliveryNotes = data.results;
      this.showLoader = false;
    }, err => {
      this.showLoader = false;
    }, () => {
      this.showLoader = false;
    });
  }

  getSuppliersList() {
    this.showLoader = true;
    this.FilterModel.currentPage = 1;
    this.FilterModel.pageSize = 10;
    this.purchaseService.GetSuppliersData(this.FilterModel).subscribe(data => {
      this.suppliersList = data.results;
      this.showLoader = false;
    }, err => {
      this.showLoader = false;
    }, () => {
      this.showLoader = false;
    });
  }

  getStatusColor(status: boolean) {
    if (status == true)
      return "locked";
    else
      return "open";
  }
}
