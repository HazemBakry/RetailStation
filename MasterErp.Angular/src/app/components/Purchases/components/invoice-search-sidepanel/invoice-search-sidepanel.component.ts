import { Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { PurchaseService } from '../../services/purchase.service';
import { ToastrService } from 'ngx-toastr';
import { FormDropdownModel } from 'src/app/components/Shared/components/drop-down-form-control/drop-down-form-control.component';
import { SharedService } from 'src/app/components/Shared/services/shared.service';
import { PagedResponseDTO } from 'src/app/components/Shared/models/PagedResponseDTO';
import { OrderModel } from 'src/app/components/Inventory/models/inventory';

@Component({
  selector: 'app-invoice-search-sidepanel',
  templateUrl: './invoice-search-sidepanel.component.html',
  styleUrls: ['./invoice-search-sidepanel.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class InvoiceSearchSidepanelComponent implements OnInit {
  @Input() selectedSupplierId: any;

  @Output() selectedInvoice = new EventEmitter<any>()
  PurchaseList: any[] = [];
  showLoader: boolean;

  invoiceNumber: string = '';
  invoiceDate: string;

  pagedResponseModel: PagedResponseDTO<OrderModel[]> = {
    results: [],
    filterList: [],
    pageSize: 25,
    currentPage: 1,
    searchText: ''

  };
  suppliersSelectorData: FormDropdownModel[] = [];
  @ViewChild('InvoiceSearchSidepanel', { static: true }) InvoiceSearchSidepanel: TemplateRef<any>;

  constructor(private offcanvasService: NgbOffcanvas, private sharedService: SharedService, private purchaseService: PurchaseService, private toaster: ToastrService) { }


  ngOnInit(): void {

  }
  openSidePanel(content: any) {
    this.getSuppliersSelectorData();
    this.offcanvasService.open(content, { panelClass: 'details-panel', position: 'end' });
  }
  getSuppliersSelectorData() {
    this.sharedService.GetSuppliersSelector().subscribe(data => {
      this.suppliersSelectorData = data;
    });
  }

  // loadData() {
  //   if (!this.invoiceDate && !this.selectedSupplierId && !this.invoiceNumber) {
  //     this.toaster.warning('لا يمكن البحث ');
  //     return;
  //   }

  //   this.showLoader = true;

  //   this.purchaseService.GetInvoicesSearchData(this.selectedSupplierId, this.invoiceNumber, this.invoiceDate).subscribe(data => {
  //     // console.log("data",data);
  //     this.PurchaseList = data;
  //     this.showLoader = false;
  //   }, (err) => {
  //     this.showLoader = false;
  //   }, () => {
  //     this.showLoader = false;
  //   });


  // }

  loadData() {
    if (!this.invoiceDate && !this.selectedSupplierId && !this.invoiceNumber) {
      this.toaster.warning('لا يمكن البحث ');
      return;
    }
    this.mapFilters();
    this.showLoader = true;
    this.purchaseService.GetPurchaseInvoices_Data(this.pagedResponseModel).subscribe((data: PagedResponseDTO<OrderModel[]>) => {
      this.pagedResponseModel.results = data.results;
      this.pagedResponseModel.totalCount = data.totalCount;
      // this.checkResult();
      this.showLoader = false;
    }, (err) => {
      this.showLoader = false;
    }, () => {
      this.showLoader = false;
    })
  }
  checkResult()
  {
    if (this.pagedResponseModel.results.length == 1) {
      this.selectedInvoice.emit(this.pagedResponseModel.results[0])
    } 
    else {
      this.openSidePanel(this.InvoiceSearchSidepanel);
    }
  }

  mapFilters() {
    this.pagedResponseModel.filterList = [];
    if (this.invoiceDate) {
      this.pagedResponseModel.filterList.push({ categoryName: 'InvoiceDate', itemFlag: this.invoiceDate })
    }
    if (this.invoiceNumber) {
      this.pagedResponseModel.filterList.push({ categoryName: 'InvoiceNumber', itemFlag: this.invoiceNumber })
    }
    if (this.selectedSupplierId) {
      this.pagedResponseModel.filterList.push({categoryName:'SupplierId',itemFlag:this.selectedSupplierId})
    }
  }

  SelectInvoice(inv) {

    this.offcanvasService.dismiss();

    this.selectedInvoice.emit(inv);
  }
}
