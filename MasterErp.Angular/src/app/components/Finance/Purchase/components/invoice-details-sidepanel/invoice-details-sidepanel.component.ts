import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { PurchaseService } from '../../services/purchase.service';
import { ToastrService } from 'ngx-toastr';




@Component({
  selector: 'app-invoice-details-sidepanel',
  templateUrl: './invoice-details-sidepanel.component.html',
  styleUrls: ['./invoice-details-sidepanel.component.css'],
  encapsulation: ViewEncapsulation.None,

})
export class InvoiceDetailsSidepanelComponent implements OnInit {
  @Input() invoiceId :number;

  invoiceData: any;
  showLoader: boolean;


  constructor(private offcanvasService: NgbOffcanvas,private purchaseService: PurchaseService, private toaster: ToastrService) { }


  ngOnInit(): void {
  }


  loadData()
  {
    if (!this.invoiceId) {
      this.toaster.warning('حدث خطأ');
      return;
    }

    this.showLoader=true;
    this.purchaseService.GetInvoiceDetailsById(this.invoiceId).subscribe(data => {
      // console.log("data",data);
      if (data) {
        this.invoiceData=data;
      }
      this.showLoader=false;

    },(err)=>{
      this.showLoader=false;
    },()=>{
      this.showLoader=false;
    });
    
    
  }
  OpenSidePanel(content: any) {
    this.loadData()
    this.offcanvasService.open(content, {panelClass: 'details-panel', position: 'end' });
  }

}
