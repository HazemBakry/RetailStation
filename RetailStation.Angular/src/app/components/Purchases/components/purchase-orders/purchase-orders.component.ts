
import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { PagedResponseDTO } from 'src/app/components/Shared/models/PagedResponseDTO';
import { FieldType } from 'src/app/components/Shared/Enums/FieldType';
import { DataField } from 'src/app/components/Shared/models/DataField';
import { DynamicComponentLoaderService } from 'src/app/components/Shared/services/dynamic-component-loader.service';
import { ComponentHostDirective } from 'src/app/components/Shared/directives/component-host.directive';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FilterItem, FilterModel } from 'src/app/components/Shared/models/FilterModel';
import { WebsiteService } from 'src/app/components/Main/services/website.service';
import { WebsiteOrderModel } from 'src/app/components/Website/models/WebsiteOrderModel ';


@Component({
  selector: 'app-purchase-orders',
  templateUrl: './purchase-orders.component.html',
  styleUrls: ['./purchase-orders.component.css']
})

export class PurchaseOrdersComponent implements OnInit {
  TitleList = ['المشتريات', 'طلبات الشراء'];
  showLoader: boolean;
  TotalCount: any;
  TotalPages: any;
  filterList: FilterModel[] = [];

  pagedResponseModel: PagedResponseDTO<WebsiteOrderModel[]> = {
    results: [],
    filterList: [],
    pageSize: 10,
    currentPage: 1,
    searchText: ''
  };
  selectedPurchaseOrderId: number;
  @ViewChild(ComponentHostDirective, { static: true }) detailsComponentHost!: ComponentHostDirective;
  constructor(private modalService: NgbModal,
    private websiteService: WebsiteService,
    private toaster: ToastrService, private dynamicComponentService: DynamicComponentLoaderService) { }

  ngOnInit(): void {
    this.getPurchasesOrdersData();
    this.loadFilters();
  }

  getPurchasesOrdersData() {
    this.showLoader = true;
    this.websiteService.GetOrders_Data(this.pagedResponseModel).subscribe(data => {
      this.pagedResponseModel.results = data.results;
      this.pagedResponseModel.totalCount = data.totalCount;
      this.showLoader = false;
    }, (err) => {
      this.showLoader = false;
    }, () => {
      this.showLoader = false;
    });
  }
  loadFilters() {
    // this.showLoader = true;
    this.websiteService.GetOrders_Filters(this.pagedResponseModel).subscribe(data => {
      this.filterList = data;

      // this.showLoader = false;
    }, err => {
      // this.showLoader = false;
    }, () => {
      // this.showLoader = false;
    });
  }

  filterChecked(filterItems: FilterItem[]) {
    this.pagedResponseModel.filterList = filterItems;
    this.getPurchasesOrdersData();
  }

  pageChanged(obj: any) {
    this.pagedResponseModel.currentPage = obj.page;
    this.getPurchasesOrdersData();
  }

  openDeleteModal(content: any, itemId: number) {
    this.selectedPurchaseOrderId = itemId;
    this.modalService.open(content, { centered: true, size: 'md' });
  }

  // cancelPurchaseOrder() {
  //   this.purchaseService.CancelPurchaseOrder(this.selectedPurchaseOrderId).subscribe(data => {
  //     if (data.isSuccess) {
  //       this.toaster.success('تم الغاء الطلب بنجاح');
  //       this.getPurchasesOrdersData();
  //     }
  //     else {
  //       this.toaster.error('حدث خطأ اثناء الألغاء');
  //     }
  //   }, (error) => {
  //     this.toaster.error('حدث خطأ اثناء الألغاء');
  //   })
  // }

  getStatusColor(status: boolean) {
    if (status == true)
      return "locked";
    else
      return "open";
  }

  // showOrderDetails(detailsModel: WebsiteOrderModel) {
  //   this.websiteService.GetOrderDetailsById(detailsModel.orderId).subscribe((data: OrderDetailModel[]) => {
  //     this.dynamicComponentService.loadProductDetailsSidePanel(
  //       this.detailsComponentHost.viewContainerRef,
  //       detailsModel,
  //       data,
  //       this.orderDetailsDataFields,
  //       `تفاصيل طلب #${detailsModel.serialNumber}`
  //     );

  //     this.showLoader = false;
  //   }, err => {
  //     this.showLoader = false;
  //   }, () => {
  //     this.showLoader = false;
  //   });
  // }

  orderDetailsDataFields: DataField[] = [
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
