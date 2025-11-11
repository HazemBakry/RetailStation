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



@Component({
  selector: 'app-my-orders',
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.css']
})
export class MyOrdersComponent implements OnInit {
  TitleList = ['Purchases', 'MY Orders'];
  showLoader: boolean=false;
  showCancelLoader: boolean=false;
  TotalCount: any;
  TotalPages: any;
  filterList: FilterModel[] = [];

  pagedResponseModel: PagedResponseModel<WebsiteOrderModel[]> = {
    results: [],
    filterList: [],
    pageSize: 10,
    currentPage: 1,
    searchText: ''
  };
  selectedOrderId: number;
  @ViewChild(ComponentHostDirective, { static: true }) detailsComponentHost!: ComponentHostDirective;
  constructor(private orderService: OrderService,
    private websiteService: WebsiteService,
    private modalService: NgbModal,
    private toaster: ToastrService, private dynamicComponentService: DynamicComponentLoaderService) { }

  ngOnInit(): void {
    this.getsOrdersData();
    this.loadFilters();
  }

  getsOrdersData() {
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
    this.orderService.CancelOrder(this.selectedOrderId).subscribe(data => {
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
    this.orderService.GetOrder_Items(detailsModel.orderId).subscribe((data: any[]) => {
      this.dynamicComponentService.loadProductDetailsSidePanel(
        this.detailsComponentHost.viewContainerRef,
        detailsModel,
        data,
        this.orderDetailsDataFields,
        ` طلب رقم ${detailsModel.orderNumber}`
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
