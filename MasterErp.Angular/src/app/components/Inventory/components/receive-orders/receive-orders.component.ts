import { Component, OnInit } from '@angular/core';
import { InventoryService } from '../../services/inventory.service';
import { ToastrService } from 'ngx-toastr';
import { PagedResponseDTO } from 'src/app/components/Shared/models/PagedResponseDTO';
import { OrderModel } from '../../models/inventory';




@Component({
  selector: 'app-receive-orders',
  templateUrl: './receive-orders.component.html',
  styleUrls: ['./receive-orders.component.css']
})

export class ReceiveOrdersComponent implements OnInit {
  TitleList = ['المخازن', 'أذونات الإضافة'];
  showLoader: boolean;
  
  pagedResponseModel:PagedResponseDTO<OrderModel[]>={
    results:[],
    filterList:[],
    pageSize: 25,
    currentPage:1,
    searchText:''
  };

  constructor(private inventoryService: InventoryService, private toaster: ToastrService) { }

  ngOnInit(): void {
    this.getReceiveOrdersSummary();
  }

  getReceiveOrdersSummary() {
    this.showLoader = true;
    this.inventoryService.GetReceiveOrders_Data(this.pagedResponseModel).subscribe(data => {
      this.pagedResponseModel.results = data.results;
      this.pagedResponseModel.totalCount = data.totalCount;
      this.showLoader = false;
    }, (err) => {
      this.showLoader = false;
    }, () => {
      this.showLoader = false;
    })
  }

  pageChanged(obj: any) {
    this.pagedResponseModel.currentPage = obj.page;
    this.getReceiveOrdersSummary();
  }

  cancelReceiveOrder(InvoiceId: number) {
    this.inventoryService.CancelReceiveOrder(InvoiceId).subscribe(data => {
      if (data) {
        this.toaster.success('تم الغاء الطلب بنجاح');
        this.getReceiveOrdersSummary();
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
