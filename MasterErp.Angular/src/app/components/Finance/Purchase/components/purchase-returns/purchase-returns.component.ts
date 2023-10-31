import { Component, OnInit } from '@angular/core';
import { PurchaseService } from '../../services/purchase.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-purchase-returns',
  templateUrl: './purchase-returns.component.html',
  styleUrls: ['./purchase-returns.component.css']
})
export class PurchaseReturnsComponent implements OnInit {
  PurchaseList: any[] = [];
  showLoader: boolean;

  constructor(private purchaseService: PurchaseService, private toaster: ToastrService) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.showLoader=true;

    this.purchaseService.GetPurchasesReturnsData().subscribe(data => {
      this.PurchaseList = data;
      this.showLoader=false;

    },(err)=>{
      this.showLoader=false;
    },()=>{
      this.showLoader=false;
    })
  }

  CancelPurchaseOrder(returnsId:number)
  {
    this.purchaseService.CancelPurchaseReturns(returnsId).subscribe(data => {
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
