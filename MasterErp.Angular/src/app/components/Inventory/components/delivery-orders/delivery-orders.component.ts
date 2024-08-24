import { Component, OnInit } from '@angular/core';
import { InventoryService } from '../../services/inventory.service';
import { ToastrService } from 'ngx-toastr';
import { FilterModel } from 'src/app/components/Shared/models/FilterModel';




@Component({
  selector: 'app-delivery-orders',
  templateUrl: './delivery-orders.component.html',
  styleUrls: ['./delivery-orders.component.css']
})

export class DeliveryOrdersComponent implements OnInit {
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
    this.getDeliveryOrdersSummary();
  }

  getDeliveryOrdersSummary() {
    this.showLoader = true;
    this.inventoryService.GetDeliveryOrdersSummary(this.FilterModel).subscribe(data => {
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
    this.getDeliveryOrdersSummary();
  }

  cancelDeliveryOrder(InvoiceId: number) {
    this.inventoryService.CancelDeliveryOrder(InvoiceId).subscribe(data => {
      if (data) {
        this.toaster.success('تم الغاء الطلب بنجاح');
        this.getDeliveryOrdersSummary();
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
