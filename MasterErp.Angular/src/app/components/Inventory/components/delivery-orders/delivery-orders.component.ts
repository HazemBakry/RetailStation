import { Component, OnInit } from '@angular/core';
import { InventoryService } from '../../services/inventory.service';
import { ToastrService } from 'ngx-toastr';
import { OrderModel } from '../../models/inventory';
import { PagedResponseDTO } from 'src/app/components/Shared/models/PagedResponseDTO';




@Component({
  selector: 'app-delivery-orders',
  templateUrl: './delivery-orders.component.html',
  styleUrls: ['./delivery-orders.component.css']
})

export class DeliveryOrdersComponent implements OnInit {
  TitleList = ['المخازن', 'أذونات الصرف'];
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
    this.getDeliveryOrders_Data();
  }

  getDeliveryOrders_Data() {
    this.showLoader = true;
    this.inventoryService.GetDeliveryOrders_Data(this.pagedResponseModel).subscribe(data => {
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
    this.getDeliveryOrders_Data();
  }

  cancelDeliveryOrder(InvoiceId: number) {
    this.inventoryService.CancelDeliveryOrder(InvoiceId).subscribe(data => {
      if (data) {
        this.toaster.success('تم الغاء الطلب بنجاح');
        this.getDeliveryOrders_Data();
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
