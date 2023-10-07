import { Component, OnInit } from '@angular/core';
import { PurchaseService } from '../../services/purchase.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-purchases-invoices',
  templateUrl: './purchases-invoices.component.html',
  styleUrls: ['./purchases-invoices.component.css']
})

export class PurchasesInvoicesComponent implements OnInit {
  PurchaseList: any[] = [];
  showLoader: boolean;

  constructor(private purchaseService: PurchaseService, private toaster: ToastrService) { }

  ngOnInit(): void {
    this.GetPurchaseInvoiceData();
  }

  GetPurchaseInvoiceData() {
    this.purchaseService.GetPurchaseInvoiceData().subscribe(data => {
      this.PurchaseList = data;
    })
  }

  CancelPurchaseInvoice(InvoiceId:number)
  {
    this.purchaseService.CancelPurchaseInvoice(InvoiceId).subscribe(data => {
      if (data) {
        this.toaster.success('تم الغاء الطلب بنجاح');
        this.GetPurchaseInvoiceData();
      }
      else{
        this.toaster.error('حدث خطأ اثناء الألغاء');

      }
    },(error)=>{
      this.toaster.error('حدث خطأ اثناء الألغاء');

    })


  }

}
