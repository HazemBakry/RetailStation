import { Component, ComponentFactoryResolver, OnInit, ViewChild } from '@angular/core';
import { PurchaseService } from '../../services/purchase.service';
import { ToastrService } from 'ngx-toastr';
import { FilterModel, SearchFilterModel } from 'src/app/components/Shared/models/FilterModel';
import { PagedResponseDTO } from 'src/app/components/Shared/models/PagedResponseDTO';
import { OrderModel } from 'src/app/components/Inventory/models/inventory';
import { ComponentHostDirective } from 'src/app/components/Shared/directives/component-host.directive';
import { ProductsDetailsSidePanelComponent } from 'src/app/components/Shared/components/sidepanel/products-details-side-panel/products-details-side-panel.component';
import { DataField } from 'src/app/components/Shared/models/DataField';
import { DynamicComponentLoaderService } from 'src/app/components/Shared/services/dynamic-component-loader.service';
import { FieldType } from 'src/app/components/Shared/Enums/FieldType';
import { GeneralOrderDetailsModel } from 'src/app/components/Inventory/models/GeneralOrderModel ';
import { PurchaseInvoiceModel } from '../../models/PurchaseInvoiceModel';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FinanceWorkflowStatus } from 'src/app/components/Shared/Enums/FinanceWorkflowStatus';

@Component({
  selector: 'app-purchase-invoices',
  templateUrl: './purchase-invoices.component.html',
  styleUrls: ['./purchase-invoices.component.css']
})

export class PurchaseInvoicesComponent implements OnInit {
  TitleList = ['المشتريات', 'فواتير المشتريات'];
  showLoader: boolean;
  selectedInvoiceId: number;
  public wfStatus=FinanceWorkflowStatus;
  pagedResponseModel:PagedResponseDTO<OrderModel[]>={
    results:[],
    filterList:[],
    pageSize: 25,
    currentPage:1,
    searchText:''

  };
  @ViewChild(ComponentHostDirective, { static: true }) detailsComponentHost!: ComponentHostDirective;

  constructor(private purchaseService: PurchaseService,  private modalService: NgbModal, private toaster: ToastrService,private dynamicComponentService:DynamicComponentLoaderService ) { }

  ngOnInit(): void {
    this.getPurchaseInvoicesData();
  }

  getPurchaseInvoicesData() {
    this.showLoader=true;
    this.purchaseService.GetPurchaseInvoices_Data(this.pagedResponseModel).subscribe((data:PagedResponseDTO<OrderModel[]>) => {
      this.pagedResponseModel.results=data.results;
      this.pagedResponseModel.totalCount=data.totalCount;
      // this.TotalCount = data && data.length > 0 && (data[0].matchCount != null || data[0].matchCount != undefined) ? data[0].matchCount : 0;
      this.showLoader=false;
    },(err)=>{
      this.showLoader=false;
    },()=>{
      this.showLoader=false;
    })
  }

  pageChanged(obj: any) {
    this.pagedResponseModel.currentPage = obj.page;
    this.getPurchaseInvoicesData();
  }
  openDeleteModal(content: any, itemId: number) {
    this.selectedInvoiceId = itemId;
    this.modalService.open(content, { centered: true, size: 'md' });
  }
  cancelPurchaseInvoice()
  {
    this.purchaseService.CancelPurchaseInvoice(this.selectedInvoiceId).subscribe(data => {
      if (data?.isSuccess) {
        this.toaster.success(data.message);
        this.getPurchaseInvoicesData();
      }
      else{
        this.toaster.error(data.message);

      }
    },(error)=>{
      this.toaster.error('error');

    })
  }

  getStatusColor(status: boolean) {
    if (status == true)
      return "locked";
    else
      return "open";
  }
  showInvoiceDetails(detailsModel: PurchaseInvoiceModel) {

    this.showLoader = true;
    this.purchaseService.GetPurchaseInvoiceProducts_Data(detailsModel.purchaseInvoiceId).subscribe((data: GeneralOrderDetailsModel[]) => {
      this.dynamicComponentService.loadProductDetailsSidePanel(
        this.detailsComponentHost.viewContainerRef,
        detailsModel,
        data,
        this.invoiceDetailsDataFields,
        `تفاصيل الفاتورة #${detailsModel.serialNumber}`
      );
      
      this.showLoader = false;
    }, err => {
      this.showLoader = false;
    }, () => {
      this.showLoader = false;
    });


  }
  invoiceDetailsDataFields :DataField[] = [
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
