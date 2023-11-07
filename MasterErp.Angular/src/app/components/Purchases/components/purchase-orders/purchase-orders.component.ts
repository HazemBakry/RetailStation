
import { Component, OnInit } from '@angular/core';
import { PurchaseService } from '../../services/purchase.service';
import { ToastrService } from 'ngx-toastr';
import { FilterModel } from 'src/app/components/Shared/models/FilterModel';


@Component({
  selector: 'app-purchase-orders',
  templateUrl: './purchase-orders.component.html',
  styleUrls: ['./purchase-orders.component.css']
})

export class PurchaseOrdersComponent implements OnInit {
  PurchaseList: any[] = [];
  showLoader: boolean;
  TotalCount: any;
  TotalPages: any;
  FilterModel: FilterModel = {
    currentPage: 1,
    pageSize: 25
  };

  constructor(private purchaseService: PurchaseService, private toaster: ToastrService) { }

  ngOnInit(): void {
    this.GetPurchasesOrdersData();
  }

  GetPurchasesOrdersData() {
    this.showLoader = true;
    this.purchaseService.GetPurchasesOrdersData(this.FilterModel).subscribe(data => {
      this.PurchaseList = data;
      this.TotalCount = data && data.length > 0 && (data[0].matchCount != null || data[0].matchCount != undefined) ? data[0].matchCount : 0;
      this.showLoader = false;
    }, (err) => {
      this.showLoader = false;
    }, () => {
      this.showLoader = false;
    })
  }

  pageChanged(obj: any) {
    this.FilterModel.currentPage = obj.page;
    this.GetPurchasesOrdersData();
  }

  CancelPurchaseOrder(orderId: number) {
    this.purchaseService.CancelPurchaseOrder(orderId).subscribe(data => {
      if (data) {
        this.toaster.success('تم الغاء الطلب بنجاح');
        this.GetPurchasesOrdersData();
      }
      else {
        this.toaster.error('حدث خطأ اثناء الألغاء');

      }
    }, (error) => {
      this.toaster.error('حدث خطأ اثناء الألغاء');

    })


  }

}
