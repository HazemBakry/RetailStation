import { Component, OnInit } from '@angular/core';
import { InventoryService } from '../../services/inventory.service';
import { ToastrService } from 'ngx-toastr';
import { OrderModel } from '../../models/inventory';
import { PagedResponseDTO } from 'src/app/components/Shared/models/PagedResponseDTO';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-delivery-orders',
  templateUrl: './delivery-orders.component.html',
  styleUrls: ['./delivery-orders.component.css']
})

export class DeliveryOrdersComponent implements OnInit {
  TitleList = ['المخازن', 'أذونات الصرف'];
  showLoader: boolean;
  OrderId: number;
  pagedResponseModel: PagedResponseDTO<OrderModel[]> = {
    results: [],
    filterList: [],
    pageSize: 25,
    currentPage: 1,
    searchText: ''
  };

  constructor(private inventoryService: InventoryService, private modalService: NgbModal, private toaster: ToastrService) { }

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

  openDeleteModal(content: any, itemId: number) {
    this.OrderId = itemId;
    this.modalService.open(content, { centered: true, size: 'md' });
  }

  cancelOrder() {
    this.inventoryService.CancelDeliveryOrder(this.OrderId).subscribe(data => {
      if (data?.isSuccess) {
        this.modalService?.dismissAll();
        this.getDeliveryOrders_Data();
        this.toaster.success(data?.message);
      }
      else {
        this.toaster.error(data?.message);
      }
      this.showLoader = false;
    }, err => {
      this.showLoader = false;
    }, () => {
      this.showLoader = false;
    });
  }


}
