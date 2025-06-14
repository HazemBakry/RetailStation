import { Component, OnInit, ViewChild } from '@angular/core';
import { InventoryService } from '../../services/inventory.service';
import { ToastrService } from 'ngx-toastr';
import { PagedResponseDTO } from 'src/app/components/Shared/models/PagedResponseDTO';
import { OrderModel } from '../../models/inventory';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FilterItem, FilterModel } from 'src/app/components/Shared/models/FilterModel';
import { MaterialReceiptModel } from '../../models/MaterialReceiptModel';
import { ComponentHostDirective } from 'src/app/components/Shared/directives/component-host.directive';
import { DynamicComponentLoaderService } from 'src/app/components/Shared/services/dynamic-component-loader.service';
import { GeneralOrderDetailsModel } from '../../models/GeneralOrderModel ';
import { FieldType } from 'src/app/components/Shared/Enums/FieldType';
import { DataField } from 'src/app/components/Shared/models/DataField';




@Component({
  selector: 'app-material-receipts',
  templateUrl: './material-receipts.component.html',
  styleUrls: ['./material-receipts.component.css']
})

export class MaterialReceiptsComponent implements OnInit {
  TitleList = ['المخازن', 'أذونات الإنشاء'];
  showLoader: boolean;
  OrderId: number;
  pagedResponseModel: PagedResponseDTO<MaterialReceiptModel[]> = {
    results: [],
    filterList: [],
    pageSize: 10,
    currentPage: 1,
    searchText: ''
  };
  filterList: FilterModel[] = [];
  @ViewChild(ComponentHostDirective, { static: true }) detailsComponentHost!: ComponentHostDirective;

  constructor(private inventoryService: InventoryService,
    private modalService: NgbModal,
    private dynamicComponentService:DynamicComponentLoaderService,
    private toaster: ToastrService) { }

  ngOnInit(): void {
    this.getMaterialReceipts_Data();
    this.getMaterialReceipts_Filters();
  }

  getMaterialReceipts_Data() {
    this.showLoader = true;
    this.inventoryService.GetMaterialReceipts_Data(this.pagedResponseModel).subscribe(data => {
      this.pagedResponseModel.results = data.results;
      this.pagedResponseModel.totalCount = data.totalCount;
      this.showLoader = false;
    }, (err) => {
      this.showLoader = false;
    }, () => {
      this.showLoader = false;
    })
  }
  getMaterialReceipts_Filters() {
    // this.showLoader = true;
    this.inventoryService.GetMaterialReceipts_Filters(this.pagedResponseModel).subscribe((data: FilterModel[]) => {
      this.filterList = data;

    }, (err) => {
      // this.showLoader = false;
    }, () => {
      // this.showLoader = false;
    })
  }
  filterChecked(filterItems: FilterItem[]) {
    this.pagedResponseModel.filterList = filterItems;
    this.getMaterialReceipts_Data();
    // this.getMaterialReceipts_Filters();
  }

  pageChanged(obj: any) {
    this.pagedResponseModel.currentPage = obj.page;
    this.getMaterialReceipts_Data();
  }

  openDeleteModal(content: any, itemId: number) {
    this.OrderId = itemId;
    this.modalService.open(content, { centered: true, size: 'md' });
  }

  cancelOrder() {
    this.inventoryService.CancelMaterialReceipt(this.OrderId).subscribe(data => {
      if (data?.isSuccess) {
        this.modalService?.dismissAll();
        this.getMaterialReceipts_Data();
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


  showMaterialReceiptDetails(materialReceiptModel: MaterialReceiptModel) {
    var orderModel: OrderModel = {
      orderNumber: materialReceiptModel.orderNumber,
      docNumber: materialReceiptModel.docNumber,
      orderDate: materialReceiptModel.orderDate,
      dueDate: materialReceiptModel.dueDate,
      storeNameAR: materialReceiptModel.storeNameAR,
      storeNameEN: materialReceiptModel.storeNameEN,
      supplierNameAR: materialReceiptModel.supplierNameAR,
      supplierNameEN: materialReceiptModel.supplierNameEN,
    }
    this.showLoader = true;
    this.inventoryService.GetMaterialReceiptProducts_Data([materialReceiptModel.materialReceiptId]).subscribe((data: GeneralOrderDetailsModel[]) => {
      this.dynamicComponentService.loadProductDetailsSidePanel(
        this.detailsComponentHost.viewContainerRef,
        orderModel,
        data,
        this.materialReceiptDetailsDataFields,
        `تفاصيل طلب #${materialReceiptModel.serialNumber}`
      );

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
  materialReceiptDetailsDataFields :DataField[] = [
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
