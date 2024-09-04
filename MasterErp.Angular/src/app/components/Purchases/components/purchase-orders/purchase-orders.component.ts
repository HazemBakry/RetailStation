
import { Component, OnInit } from '@angular/core';
import { PurchaseService } from '../../services/purchase.service';
import { ToastrService } from 'ngx-toastr';
import { PagedResponseDTO } from 'src/app/components/Shared/models/PagedResponseDTO';
import { OrderModel } from 'src/app/components/Inventory/models/inventory';


@Component({
  selector: 'app-purchase-orders',
  templateUrl: './purchase-orders.component.html',
  styleUrls: ['./purchase-orders.component.css']
})

export class PurchaseOrdersComponent implements OnInit {
  TitleList = ['المشتريات', 'أوامر المشتريات'];
  showLoader: boolean;
  TotalCount: any;
  TotalPages: any;
  pagedResponseModel: PagedResponseDTO<OrderModel[]> = {
    results: [],
    filterList: [],
    pageSize: 25,
    currentPage: 1,
    searchText: ''
  };

  constructor(private purchaseService: PurchaseService, private toaster: ToastrService) { }

  ngOnInit(): void {
    this.getPurchasesOrdersData();
  }

  getPurchasesOrdersData() {
    this.showLoader = true;
    this.purchaseService.GetPurchaseOrders_Data(this.pagedResponseModel).subscribe(data => {
      this.pagedResponseModel.results=data.results;
      this.pagedResponseModel.totalCount=data.totalCount;
      this.showLoader=false;
    },(err)=>{
      this.showLoader=false;
    },()=>{
      this.showLoader=false;
    });
  }

  pageChanged(obj: any) {
    this.pagedResponseModel.currentPage = obj.page;
    this.getPurchasesOrdersData();
  }

  cancelPurchaseOrder(orderId: number) {
    this.purchaseService.CancelPurchaseOrder(orderId).subscribe(data => {
      if (data.isSuccess) {
        this.toaster.success('تم الغاء الطلب بنجاح');
        this.getPurchasesOrdersData();
      }
      else {
        this.toaster.error('حدث خطأ اثناء الألغاء');
      }
    }, (error) => {
      this.toaster.error('حدث خطأ اثناء الألغاء');
    })
  }

  getStatusColor(status: boolean) {
    if (status == true)
      return "locked";
    else
      return "open";
  }

}
