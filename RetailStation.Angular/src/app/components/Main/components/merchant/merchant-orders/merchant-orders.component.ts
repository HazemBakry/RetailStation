import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { FieldType } from 'src/app/components/Shared/Enums/FieldType';
import { DataField } from 'src/app/components/Shared/models/DataField';
import { DynamicComponentLoaderService } from 'src/app/components/Shared/services/dynamic-component-loader.service';
import { ComponentHostDirective } from 'src/app/components/Shared/directives/component-host.directive';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FilterItem, FilterModel } from 'src/app/components/Shared/models/FilterModel';
import { PagedResponseModel } from 'src/app/components/Shared/models/PagedResponseDTO';
import { OrderService } from '../../../services/order.service';
import { WebsiteOrderModel } from 'src/app/components/Website/models/WebsiteOrderModel ';
import { MerchantService } from 'src/app/components/Website/services/merchant.service';


@Component({
  selector: 'app-merchant-orders',
  templateUrl: './merchant-orders.component.html',
  styleUrls: ['./merchant-orders.component.css']
})
export class MerchantOrdersComponent implements OnInit {
  TitleList = ['Merchant', 'Orders'];
  showLoader: boolean;
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
  constructor(private merchantService: MerchantService,
    private orderService: OrderService,
    private modalService: NgbModal,
    private toaster: ToastrService, private dynamicComponentService: DynamicComponentLoaderService) { }

  ngOnInit(): void {
    this.getsOrdersData();
    this.loadFilters();
  }

  getsOrdersData() {
    this.showLoader = true;
    this.merchantService.GetOrders_Data(this.pagedResponseModel).subscribe(data => {
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
    this.merchantService.GetOrders_Filters(this.pagedResponseModel).subscribe(data => {
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
    this.orderService.CancelOrder(this.selectedOrderId).subscribe(data => {
      if (data.isSuccess) {
        this.toaster.success(data.message);
        this.getsOrdersData();
      }
      else {
        this.toaster.error(data.message);
      }
    }, (error) => {
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
        `Order #${detailsModel.serialNumber} Details`
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
      displayName: 'Name (AR)',
    },
    {
      fieldName: 'nameEN',
      fieldType: FieldType.Text,
      displayName: 'Name (EN)',
    },
    {
      fieldName: 'unitName',
      fieldType: FieldType.Text,
      displayName: 'Unit',
    },
    {
      fieldName: 'price',
      fieldType: FieldType.Text,
      displayName: 'Price',
    },
    {
      fieldName: 'quantity',
      fieldType: FieldType.Text,
      displayName: 'Quantity',
    },
    {
      fieldName: 'totalValue',
      fieldType: FieldType.Text,
      displayName: 'TotalValue',
    }
  ];

}
