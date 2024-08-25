import { Component, OnInit } from '@angular/core';
import { InventoryService } from '../../services/inventory.service';
import { ToastrService } from 'ngx-toastr';
import { FilterModel } from 'src/app/components/Shared/models/FilterModel';




@Component({
  selector: 'app-receive-orders',
  templateUrl: './receive-orders.component.html',
  styleUrls: ['./receive-orders.component.css']
})

export class ReceiveOrdersComponent implements OnInit {
  OrderList: any[] = [];
  showLoader: boolean;
  TotalCount: any;
  TotalPages: any;
  FilterModel: FilterModel = {
    currentPage: 1,
    pageSize: 25
  };

  constructor(private inventoryService: InventoryService, private toaster: ToastrService) { }

  ngOnInit(): void {
    this.getReceiveOrdersSummary();
  }

  getReceiveOrdersSummary() {
    this.showLoader = true;
    this.inventoryService.GetReceiveOrders_Data(this.FilterModel).subscribe(data => {
      this.OrderList = data.results;
      this.TotalCount = data.totalCount;// && data.length > 0 && (data[0].matchCount != null || data[0].matchCount != undefined) ? data[0].matchCount : 0;
      this.showLoader = false;
    }, (err) => {
      this.showLoader = false;
    }, () => {
      this.showLoader = false;
    })
  }

  pageChanged(obj: any) {
    this.FilterModel.currentPage = obj.page;
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
