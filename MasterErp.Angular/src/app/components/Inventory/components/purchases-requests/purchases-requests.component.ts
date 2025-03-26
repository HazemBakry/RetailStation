import { Component, OnInit } from '@angular/core';
import { PagedResponseDTO } from 'src/app/components/Shared/models/PagedResponseDTO';
import { ToastrService } from 'ngx-toastr';
import { OrderModel } from '../../models/inventory';
import { InventoryService } from '../../services/inventory.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MaterialRequestModel } from '../../models/MaterialRequestModel ';

@Component({
  selector: 'app-purchases-requests',
  templateUrl: './purchases-requests.component.html',
  styleUrls: ['./purchases-requests.component.css']
})

export class PurchasesRequestsComponent implements OnInit {
  TitleList = ['المخازن', 'طلبات الشراء'];
  showLoader: boolean;
  OrderId: number;
  pagedResponseModel:PagedResponseDTO<MaterialRequestModel[]>={
    results:[],
    filterList:[],
    pageSize: 25,
    currentPage:1,
    searchText:''
  };

  constructor(private inventoryService: InventoryService,  
    private modalService: NgbModal,
    private toaster: ToastrService) { }

  ngOnInit(): void {
    this.getPurchasesRequestsData();
  }

  getPurchasesRequestsData() {
    this.showLoader = true;
    this.inventoryService.GetMaterialRequests_Data(this.pagedResponseModel).subscribe(data => {
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
    this.getPurchasesRequestsData();
  }

  openDeleteModal(content: any, itemId: number) {
    this.OrderId = itemId;
    this.modalService.open(content, { centered: true, size: 'md' });
  }

  cancelOrder() {
    this.inventoryService.CancelMaterialRequest(this.OrderId).subscribe(data => {
      if (data?.isSuccess) {
        this.modalService?.dismissAll();
        this.getPurchasesRequestsData();
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

  getStatusColor(status: boolean) {
    if (status == true)
      return "cancelled";
    else
      return "open";
  }

}
