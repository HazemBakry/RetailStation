
import { Component, OnInit, ViewChild } from '@angular/core';
import { PurchaseService } from '../../services/purchase.service';
import { ToastrService } from 'ngx-toastr';
import { PagedResponseDTO } from 'src/app/components/Shared/models/PagedResponseDTO';
import { OrderModel, OrderProductModel } from 'src/app/components/Inventory/models/inventory';
import { FieldType } from 'src/app/components/Shared/Enums/FieldType';
import { DataField } from 'src/app/components/Shared/models/DataField';
import { DynamicComponentLoaderService } from 'src/app/components/Shared/services/dynamic-component-loader.service';
import { ComponentHostDirective } from 'src/app/components/Shared/directives/component-host.directive';


@Component({
  selector: 'app-purchase-orders',
  templateUrl: './purchase-orders.component.html',
  styleUrls: ['./purchase-orders.component.css']
})

export class PurchaseOrdersComponent implements OnInit {
  TitleList = ['المشتريات', 'أوامر المشتريات'];
  showLoader: boolean;
  TotalCount: any;
  TotalPages: any;
  pagedResponseModel: PagedResponseDTO<OrderModel[]> = {
    results: [],
    filterList: [],
    pageSize: 25,
    currentPage: 1,
    searchText: ''
  };

  @ViewChild(ComponentHostDirective, { static: true }) detailsComponentHost!: ComponentHostDirective;
  constructor(private purchaseService: PurchaseService, private toaster: ToastrService,private dynamicComponentService:DynamicComponentLoaderService ) { }

  ngOnInit(): void {
    this.getPurchasesOrdersData();
  }

  getPurchasesOrdersData() {
    this.showLoader = true;
    this.purchaseService.GetPurchaseOrders_Data(this.pagedResponseModel).subscribe(data => {
      this.pagedResponseModel.results=data.results;
      this.pagedResponseModel.totalCount=data.totalCount;
      this.showLoader=false;
    },(err)=>{
      this.showLoader=false;
    },()=>{
      this.showLoader=false;
    });
  }

  pageChanged(obj: any) {
    this.pagedResponseModel.currentPage = obj.page;
    this.getPurchasesOrdersData();
  }

  cancelPurchaseOrder(orderId: number) {
    this.purchaseService.CancelPurchaseOrder(orderId).subscribe(data => {
      if (data.isSuccess) {
        this.toaster.success('تم الغاء الطلب بنجاح');
        this.getPurchasesOrdersData();
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
  showOrderDetails(detailsModel: OrderModel) {

    // this.showLoader = true;
    this.purchaseService.GetPurchaseOrderProducts_Data(detailsModel.orderId).subscribe((data: OrderProductModel[]) => {
      this.dynamicComponentService.loadProductDetailsSidePanel(
        this.detailsComponentHost.viewContainerRef,
        detailsModel,
        data,
        this.orderDetailsDataFields,
        `تفاصيل طلب المشترايات ${detailsModel.orderNumber}#`
      );
      
      this.showLoader = false;
    }, err => {
      this.showLoader = false;
    }, () => {
      this.showLoader = false;
    });


  }
  orderDetailsDataFields :DataField[] = [
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
    }
  ];

}
