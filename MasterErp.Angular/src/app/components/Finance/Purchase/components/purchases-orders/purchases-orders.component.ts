
import { Component, OnInit } from '@angular/core';
import { PurchaseService } from '../../services/purchase.service';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-purchases-orders',
  templateUrl: './purchases-orders.component.html',
  styleUrls: ['./purchases-orders.component.css']
})

export class PurchasesOrdersComponent implements OnInit {
  PurchaseList: any[] = [];
  showLoader: boolean;

  constructor(private purchaseService: PurchaseService, private toaster: ToastrService) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.purchaseService.GetPurchasesOrdersData().subscribe(data => {
      this.PurchaseList = data;
    })
  }

  CancelPurchaseOrder(orderId:number)
  {
    this.purchaseService.CancelPurchaseOrder(orderId).subscribe(data => {
      if (data) {
        this.toaster.success('تم الغاء الطلب بنجاح');
        this.loadData();
      }
      else{
        this.toaster.error('حدث خطأ اثناء الألغاء');

      }
    },(error)=>{
      this.toaster.error('حدث خطأ اثناء الألغاء');

    })


  }

}
