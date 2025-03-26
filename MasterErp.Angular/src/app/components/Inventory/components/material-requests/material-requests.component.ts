import { Component, OnInit, ViewChild } from '@angular/core';
import { InventoryService } from '../../services/inventory.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { PagedResponseDTO } from 'src/app/components/Shared/models/PagedResponseDTO';
import { MaterialRequestModel } from '../../models/MaterialRequestModel ';
import { ComponentHostDirective } from 'src/app/components/Shared/directives/component-host.directive';
import { DynamicComponentLoaderService } from 'src/app/components/Shared/services/dynamic-component-loader.service';
import { FieldType } from 'src/app/components/Shared/Enums/FieldType';
import { DataField } from 'src/app/components/Shared/models/DataField';
import { OrderModel } from '../../models/inventory';
import { GeneralOrderDetailsModel } from '../../models/GeneralOrderModel ';

@Component({
  selector: 'app-material-requests',
  templateUrl: './material-requests.component.html',
  styleUrls: ['./material-requests.component.css']
})
export class MaterialRequestsComponent implements OnInit {

  TitleList = ['المخازن', 'طلبات الشراء'];
  showLoader: boolean;
  materialRequestId: number;
  pagedResponseModel:PagedResponseDTO<MaterialRequestModel[]>={
    results:[],
    filterList:[],
    pageSize: 25,
    currentPage:1,
    searchText:''
  };
  @ViewChild(ComponentHostDirective, { static: true }) detailsComponentHost!: ComponentHostDirective;

  constructor(private inventoryService: InventoryService,  
    private modalService: NgbModal,
    private toaster: ToastrService,private dynamicComponentService:DynamicComponentLoaderService) { }

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
    this.materialRequestId = itemId;
    this.modalService.open(content, { centered: true, size: 'md' });
  }

  cancelOrder() {
    this.inventoryService.CancelMaterialRequest(this.materialRequestId).subscribe(data => {
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
  showMaterialRequestDetails(materialRequestModel:MaterialRequestModel) {
    var orderModel:OrderModel ={
      orderNumber: materialRequestModel.orderNumber,
      docNumber: materialRequestModel.docNumber,
      orderDate: materialRequestModel.orderDate,
      dueDate: materialRequestModel.dueDate
    }
    // this.showLoader = true;
    this.inventoryService.GetMaterialRequestProducts_Data([materialRequestModel.materialRequestId]).subscribe((data: GeneralOrderDetailsModel[]) => {
      this.dynamicComponentService.loadProductDetailsSidePanel(
        this.detailsComponentHost.viewContainerRef,
        orderModel,
        data,
        this.materialRequestDetailsDataFields,
        `تفاصيل طلب الشراء ${materialRequestModel.orderNumber}#`
      );
      
      this.showLoader = false;
    }, err => {
      this.showLoader = false;
    }, () => {
      this.showLoader = false;
    });


  }
  materialRequestDetailsDataFields :DataField[] = [
    {
      fieldName: 'itemNameAR', 
      fieldType: FieldType.Text, 
      displayName: 'الاسم (AR)', 
    },
    {
      fieldName: 'itemNameEN', 
      fieldType: FieldType.Text, 
      displayName: 'الاسم (EN)', 
    },
    {
      fieldName: 'unitNameAR', 
      fieldType: FieldType.Text, 
      displayName: 'الوحدة', 
    },
    {
      fieldName: 'price', 
      fieldType: FieldType.Text, 
      displayName: 'السعر', 
    },
    {
      fieldName: 'quantity', 
      fieldType: FieldType.Text, 
      displayName: 'الكمية', 
    },
    {
      fieldName: 'totalValue', 
      fieldType: FieldType.Text, 
      displayName: 'الاجمالي', 
    },
  ];

}
