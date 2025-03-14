import { Component, OnInit } from '@angular/core';
import { InventoryService } from '../../services/inventory.service';
import { ToastrService } from 'ngx-toastr';
import { OrderModel } from '../../models/inventory';
import { PagedResponseDTO } from 'src/app/components/Shared/models/PagedResponseDTO';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FilterItem, FilterModel } from 'src/app/components/Shared/models/FilterModel';

@Component({
  selector: 'app-delivery-notes',
  templateUrl: './delivery-notes.component.html',
  styleUrls: ['./delivery-notes.component.css']
})

export class DeliveryNotesComponent implements OnInit {
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
  filterList: FilterModel[] = [];

  constructor(private inventoryService: InventoryService, private modalService: NgbModal, private toaster: ToastrService) { }

  ngOnInit(): void {
    this.getDeliveryNotes_Data();
    this.getDeliveryNotes_Filters();
  }

  getDeliveryNotes_Data() {
    this.showLoader = true;
    this.inventoryService.GetDeliveryNotes_Data(this.pagedResponseModel).subscribe(data => {
      this.pagedResponseModel.results = data.results;
      this.pagedResponseModel.totalCount = data.totalCount;
      this.showLoader = false;
    }, (err) => {
      this.showLoader = false;
    }, () => {
      this.showLoader = false;
    })
  }

  getDeliveryNotes_Filters() {
    // this.showLoader = true;
    this.inventoryService.GetDeliveryNotes_Filters(this.pagedResponseModel).subscribe((data: FilterModel[]) => {
      this.filterList = data;

    }, (err) => {
      // this.showLoader = false;
    }, () => {
      // this.showLoader = false;
    })
  }

  filterChecked(filterItems: FilterItem[]) {
    this.pagedResponseModel.filterList = filterItems;
    this.getDeliveryNotes_Data();
    // this.getReceiveOrders_Filters();
  }

  pageChanged(obj: any) {
    this.pagedResponseModel.currentPage = obj.page;
    this.getDeliveryNotes_Data();
  }

  cancelDeliveryNote(InvoiceId: number) {
    this.inventoryService.CancelDeliveryNote(InvoiceId).subscribe(data => {
      if (data) {
        this.toaster.success('تم الغاء الطلب بنجاح');
        this.getDeliveryNotes_Data();
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
    this.inventoryService.CancelDeliveryNote(this.OrderId).subscribe(data => {
      if (data?.isSuccess) {
        this.modalService?.dismissAll();
        this.getDeliveryNotes_Data();
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
