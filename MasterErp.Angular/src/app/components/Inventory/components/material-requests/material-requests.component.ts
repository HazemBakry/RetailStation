import { Component, OnInit } from '@angular/core';
import { InventoryService } from '../../services/inventory.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { OrderModel } from '../../models/inventory';
import { PagedResponseDTO } from 'src/app/components/Shared/models/PagedResponseDTO';

@Component({
  selector: 'app-material-requests',
  templateUrl: './material-requests.component.html',
  styleUrls: ['./material-requests.component.css']
})
export class MaterialRequestsComponent implements OnInit {

  TitleList = ['المخازن', 'طلبات الشراء'];
  showLoader: boolean;
  OrderId: number;
  pagedResponseModel:PagedResponseDTO<OrderModel[]>={
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
    this.inventoryService.CancelReceiveOrder(this.OrderId).subscribe(data => {
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
