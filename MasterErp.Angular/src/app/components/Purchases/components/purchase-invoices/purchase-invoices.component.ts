import { Component, OnInit } from '@angular/core';
import { PurchaseService } from '../../services/purchase.service';
import { ToastrService } from 'ngx-toastr';
import { FilterModel, SearchFilterModel } from 'src/app/components/Shared/models/FilterModel';
import { PagedResponseDTO } from 'src/app/components/Shared/models/PagedResponseDTO';
import { OrderModel } from 'src/app/components/Inventory/models/inventory';

@Component({
  selector: 'app-purchase-invoices',
  templateUrl: './purchase-invoices.component.html',
  styleUrls: ['./purchase-invoices.component.css']
})

export class PurchaseInvoicesComponent implements OnInit {
  TitleList = ['المشتريات', 'فواتير المشتريات'];
  showLoader: boolean;


  pagedResponseModel:PagedResponseDTO<OrderModel[]>={
    results:[],
    filterList:[],
    pageSize: 25,
    currentPage:1,
    searchText:''

  };
  constructor(private purchaseService: PurchaseService, private toaster: ToastrService) { }

  ngOnInit(): void {
    this.getPurchaseInvoicesData();
  }

  getPurchaseInvoicesData() {
    this.showLoader=true;
    this.purchaseService.GetPurchaseInvoices_Data(this.pagedResponseModel).subscribe((data:PagedResponseDTO<OrderModel[]>) => {
      this.pagedResponseModel.results=data.results;
      this.pagedResponseModel.totalCount=data.totalCount;
      // this.TotalCount = data && data.length > 0 && (data[0].matchCount != null || data[0].matchCount != undefined) ? data[0].matchCount : 0;
      this.showLoader=false;
    },(err)=>{
      this.showLoader=false;
    },()=>{
      this.showLoader=false;
    })
  }

  pageChanged(obj: any) {
    this.pagedResponseModel.currentPage = obj.page;
    this.getPurchaseInvoicesData();
  }

  CancelPurchaseInvoice(InvoiceId:number)
  {
    this.purchaseService.CancelPurchaseInvoice(InvoiceId).subscribe(data => {
      if (data) {
        this.toaster.success('تم الغاء الطلب بنجاح');
        this.getPurchaseInvoicesData();
      }
      else{
        this.toaster.error('حدث خطأ اثناء الألغاء');

      }
    },(error)=>{
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
