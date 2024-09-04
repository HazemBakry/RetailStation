
import { Component, ComponentFactoryResolver, OnInit, ViewChild } from '@angular/core';
import { PurchaseService } from '../../services/purchase.service';
import { ToastrService } from 'ngx-toastr';
import { FilterModel, SearchFilterModel } from 'src/app/components/Shared/models/FilterModel';
import { PagedResponseDTO } from 'src/app/components/Shared/models/PagedResponseDTO';
import { OrderModel, OrderProductModel } from 'src/app/components/Inventory/models/inventory';
import { ComponentHostDirective } from 'src/app/components/Shared/directives/component-host.directive';
import { ProductsDetailsSidePanelComponent } from 'src/app/components/Shared/components/sidepanel/products-details-side-panel/products-details-side-panel.component';
import { DataField } from 'src/app/components/Shared/models/DataField';
import { DynamicComponentLoaderService } from 'src/app/components/Shared/services/dynamic-component-loader.service';
import { FieldType } from 'src/app/components/Shared/Enums/FieldType';
import { PurchaseQuotationDetailsModel, PurchaseQuotationModel } from '../../models/PurchaseQuotationModel';

@Component({
  selector: 'app-purchase-quotations',
  templateUrl: './purchase-quotations.component.html',
  styleUrls: ['./purchase-quotations.component.css']
})

export class PurchaseQuotationsComponent implements OnInit {
  TitleList = ['المشتريات', 'عرض المشتريات'];
  showLoader: boolean;


  pagedResponseModel:PagedResponseDTO<PurchaseQuotationModel[]>={
    results:[],
    filterList:[],
    pageSize: 25,
    currentPage:1,
    searchText:''

  };
  @ViewChild(ComponentHostDirective, { static: true }) detailsComponentHost!: ComponentHostDirective;

  constructor(private purchaseService: PurchaseService, private toaster: ToastrService,private dynamicComponentService:DynamicComponentLoaderService ) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.showLoader=true;
    this.purchaseService.GetPurchaseQuotations_Data(this.pagedResponseModel).subscribe((data:PagedResponseDTO<PurchaseQuotationModel[]>) => {
      this.pagedResponseModel.results=data.results;
      this.pagedResponseModel.totalCount=data.totalCount;
      this.showLoader=false;
    },(err)=>{
      this.showLoader=false;
    },()=>{
      this.showLoader=false;
    })
  }

  pageChanged(obj: any) {
    this.pagedResponseModel.currentPage = obj.page;
    this.loadData();
  }


  showQuotationDetails(detailsModel: PurchaseQuotationModel) {

    // this.showLoader = true;
    this.purchaseService.GetPurchaseQuotationProducts_Data(detailsModel.purchaseQuotationId).subscribe((data: any[]) => {
      this.dynamicComponentService.loadProductDetailsSidePanel(
        this.detailsComponentHost.viewContainerRef,
        null,
        data,
        this.quotationDetailsDataFields,
        `تفاصيل العرض ${detailsModel.quotationNumber}#`
      );
      
      this.showLoader = false;
    }, err => {
      this.showLoader = false;
    }, () => {
      this.showLoader = false;
    });


  }
  quotationDetailsDataFields :DataField[] = [
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
      fieldName: 'supplierNameAR', 
      fieldType: FieldType.Text, 
      displayName: 'المورد', 
    }
  ];

}
