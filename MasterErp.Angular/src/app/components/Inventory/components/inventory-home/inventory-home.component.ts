import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { PaymentService } from 'src/app/components/GeneralAccounts/services/payment.service';
import { HrService } from 'src/app/components/HR/services/hr.service';
import { FilterModel, SearchFilterModel } from 'src/app/components/Shared/models/FilterModel';
import { InventoryService } from '../../services/inventory.service';
import { PurchaseService } from 'src/app/components/Purchases/services/purchase.service';

@Component({
  selector: 'app-inventory-home',
  templateUrl: './inventory-home.component.html',
  styleUrls: ['./inventory-home.component.css']
})
export class InventoryHomeComponent implements OnInit {

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
  deliveryOrders: any[] = [];
  suppliersList: any[] = [];
  FilterModel: FilterModel = {
    currentPage: 1,
    pageSize: 25
  };

  constructor(private modalService: NgbModal,
    private inventoryService: InventoryService,
    private purchaseService: PurchaseService,
    private toaster: ToastrService) { }

  ngOnInit(): void {
    this.getInventoryStatistics();
    this.getTopReceiveOrders();
    this.getTopDeliveryOrders();
    this.getSuppliersList();
    // this.GetDailyJournalEntriesSummary();
    // this.GetPurchaseInvoicesSummary();
    // this.GetPaymentReceiptsSummary();
    // this.GetReceiveReceiptsSummary();
  }

  getInventoryStatistics() {
    this.inventoryService.GetInventoryStatistics().subscribe(data => {
      this.overviewList = data;
    });
  }

  getTopReceiveOrders() {
    this.showLoader = true;
    this.inventoryService.GetReceiveOrdersSummary(this.FilterModel).subscribe(data => {
      this.receiveOrders = data.results;
      this.showLoader = false;
    }, err => {
      this.showLoader = false;
    }, () => {
      this.showLoader = false;
    });
  }

  getTopDeliveryOrders() {
    this.showLoader = true;
    this.inventoryService.GetDeliveryOrdersSummary(this.FilterModel).subscribe(data => {
      this.deliveryOrders = data.results;
      this.showLoader = false;
    }, err => {
      this.showLoader = false;
    }, () => {
      this.showLoader = false;
    });
  }

  getSuppliersList() {
    this.showLoader = true;
    this.purchaseService.GetSuppliersData(this.FilterModel).subscribe(data => {
      this.suppliersList = data;
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

