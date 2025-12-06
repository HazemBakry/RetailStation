import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { FieldType } from 'src/app/components/Shared/Enums/FieldType';
import { DataField } from 'src/app/components/Shared/models/DataField';
import { DynamicComponentLoaderService } from 'src/app/components/Shared/services/dynamic-component-loader.service';
import { ComponentHostDirective } from 'src/app/components/Shared/directives/component-host.directive';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FilterItem, FilterModel } from 'src/app/components/Shared/models/FilterModel';
import { PagedResponseModel } from 'src/app/components/Shared/models/PagedResponseDTO';
import { WebsiteOrderModel } from 'src/app/components/Website/models/WebsiteOrderModel ';
import { OrderService } from 'src/app/components/Website/services/order.service';
import { WebsiteService } from 'src/app/components/Website/services/website.service';
import { MerchantManagementService } from 'src/app/components/Website/services/merchant-management.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';



@Component({
  selector: 'app-merchant-orders',
  templateUrl: './merchant-orders.component.html',
  styleUrls: ['./merchant-orders.component.css']
})
export class MerchantOrdersComponent implements OnInit {
  TitleList = ['Merchant', 'Orders'];
  showLoader: boolean = false;
  showCancelLoader: boolean = false;
  TotalCount: any;
  TotalPages: any;
  filterList: FilterModel[] = [];
  WorkflowStatusId: number;
  pagedResponseModel: PagedResponseModel<WebsiteOrderModel[]> = {
    results: [],
    filterList: [],
    pageSize: 10,
    currentPage: 1,
    searchText: ''
  };
  selectedOrderId: number;
  @ViewChild(ComponentHostDirective, { static: true }) detailsComponentHost!: ComponentHostDirective;
  constructor(
    private merchantManagementService: MerchantManagementService,
    private modalService: NgbModal,
    private acRoute: ActivatedRoute,
    private toaster: ToastrService,
    private location: Location,
    private dynamicComponentService: DynamicComponentLoaderService) { }

  ngOnInit(): void {
    // this.acRoute.queryParams.subscribe((params: any) => {
    //   if (params.WorkflowStatusId) {
    //     this.WorkflowStatusId = params.WorkflowStatusId;
    //   }
    // });
    this.checkEnteralFilters();
    this.getsOrdersData();
    this.loadFilters();
  }

    checkEnteralFilters() {
    const locationHis = this.location.getState() as any;
    if (locationHis?.filterList) {
      locationHis?.filterList.map(c => {
        c.isChecked = true;
        if (!this.pagedResponseModel.filterList.find(fl => fl === c)) {
          this.pagedResponseModel.filterList.push(c);
        }
      });
    }
  }

  getsOrdersData() {
    this.showLoader = true;
    this.merchantManagementService.GetOrders_Data(this.pagedResponseModel).subscribe(data => {
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
    this.merchantManagementService.GetOrders_Filters(this.pagedResponseModel).subscribe(data => {
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
    this.getsOrdersData();
  }
  pageChanged(obj: any) {
    this.pagedResponseModel.currentPage = obj.page;
    this.getsOrdersData();
  }
  openDeleteModal(content: any, itemId: number) {
    this.selectedOrderId = itemId;
    this.modalService.open(content, { centered: true, size: 'md' });
  }

  cancelOrder() {
    this.showCancelLoader = true;
    this.merchantManagementService.CancelOrder(this.selectedOrderId).subscribe(data => {
      if (data.isSuccess) {
        this.toaster.success(data.message);
        this.getsOrdersData();
        this.loadFilters();
        this.modalService?.dismissAll();
      }
      else {
        this.toaster.error(data.message);
      }
      this.showCancelLoader = false;
    }, (error) => {
      this.showCancelLoader = false;
      this.toaster.error('error');
    })
  }
  showOrderDetails(detailsModel: any) {

    // this.showLoader = true;
    this.merchantManagementService.GetOrder_Items(detailsModel.orderId).subscribe((data: any[]) => {
      this.dynamicComponentService.loadProductDetailsSidePanel(
        this.detailsComponentHost.viewContainerRef,
        detailsModel,
        data,
        this.orderDetailsDataFields,
        ` طلب رقم ${detailsModel.orderNumber}`,
        true
      );

      this.showLoader = false;
    }, err => {
      this.showLoader = false;
    }, () => {
      this.showLoader = false;
    });


  }
  orderDetailsDataFields: DataField[] = [
    {
      fieldName: 'nameAR',
      fieldType: FieldType.Text,
      displayName: 'اسم الصنف',
    },
    // {
    //   fieldName: 'nameEN',
    //   fieldType: FieldType.Text,
    //   displayName: 'الاسم (إنجليزي)',
    // },
    {
      fieldName: 'merchantNameAR',
      fieldType: FieldType.Text,
      displayName: 'اسم التاجر',
    },
    {
      fieldName: 'unitName',
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
      displayName: 'القيمة الإجمالية',
    }
  ];


}
