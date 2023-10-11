import { Component, EventEmitter, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { PurchaseService } from '../../services/purchase.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-invoice-search-sidepanel',
  templateUrl: './invoice-search-sidepanel.component.html',
  styleUrls: ['./invoice-search-sidepanel.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class InvoiceSearchSidepanelComponent implements OnInit {

  @Output() selectedInvoice=new EventEmitter<any>()
  PurchaseList: any[] = [];
  showLoader: boolean;


  SuppliersList: any[] = [];
  SupplierId: any;
  SupplierName = 'الموردين';
  invoiceNumber:string = '';
  invoiceDate:string ;

  constructor(private offcanvasService: NgbOffcanvas,private purchaseService: PurchaseService, private toaster: ToastrService) { }


  ngOnInit(): void {
    this.GetSuppliersData();
  }
  GetSuppliersData() {
    this.purchaseService.GetSuppliersData().subscribe(data => {
      this.SuppliersList = data;
    });
  }
  GetSelectedSupplier(item: any) {
    this.SupplierId = item.supplierID;
  }

  loadData()
  {
    if (!this.invoiceDate&&!this.SupplierId&&!this.invoiceNumber) {
      this.toaster.warning('لا يمكن البحث ');
      return;
    }

    this.purchaseService.GetInvoicesSearchData(this.SupplierId,this.invoiceNumber,this.invoiceDate).subscribe(data => {
      console.log("data",data);
      this.PurchaseList=data;
    });
    
    
  }
  OpenSidePanel(content: any) {
    this.offcanvasService.open(content, {panelClass: 'details-panel', position: 'end' });
  }


  SelectInvoice(inv)
  {

    this.offcanvasService.dismiss();

    this.selectedInvoice.emit(inv);
  }
}
