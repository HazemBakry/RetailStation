import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { PagedResponseDTO } from 'src/app/components/Shared/models/PagedResponseDTO';
import { OrderModel } from 'src/app/components/Inventory/models/inventory';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FieldType } from 'src/app/components/Shared/Enums/FieldType';
import { DataField } from 'src/app/components/Shared/models/DataField';
import { GeneralOrderDetailsModel } from 'src/app/components/Inventory/models/GeneralOrderModel ';
import { ComponentHostDirective } from 'src/app/components/Shared/directives/component-host.directive';
import { DynamicComponentLoaderService } from 'src/app/components/Shared/services/dynamic-component-loader.service';
import { PurchaseReturnsModel } from 'src/app/components/Purchases/models/PurchaseReturns';
import { SalesService } from '../../services/sales.service';
@Component({
  selector: 'app-sales-returns',
  templateUrl: './sales-returns.component.html',
  styleUrls: ['./sales-returns.component.css']
})
export class SalesReturnsComponent implements OnInit {
  TitleList = ['المبيعات', 'مرتجعات المبيعات'];

  showLoader: boolean =false;
  showDetailsLoader: boolean =false;
  pagedResponseModel: PagedResponseDTO<PurchaseReturnsModel[]> = {
    results: [],
    filterList: [],
    pageSize: 10,
    currentPage: 1,
    searchText: ''

  };
  @ViewChild(ComponentHostDirective, { static: true }) detailsComponentHost!: ComponentHostDirective;

  selectedPurchaseReturnsId: number;
  constructor(private saleseService: SalesService,
    private modalService: NgbModal, private toaster: ToastrService, 
    private dynamicComponentService: DynamicComponentLoaderService) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.showLoader = true;

    this.saleseService.GetPurchaseReturns_Data(this.pagedResponseModel).subscribe(data => {
      // this.PurchaseList = data.results;
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
    this.loadData();
  }
  openDeleteModal(content: any, itemId: number) {
    this.selectedPurchaseReturnsId = itemId;
    this.modalService.open(content, { centered: true, size: 'md' });
  }

  cancelPurchaseReturns() {
    this.saleseService.CancelPurchaseReturns(this.selectedPurchaseReturnsId).subscribe(data => {
      if (data.isSuccess) {
        this.toaster.success('تم الغاء الطلب بنجاح');
        this.loadData();
      }
      else {
        this.toaster.error('حدث خطأ اثناء الألغاء');
      }
    }, (error) => {
      this.toaster.error('حدث خطأ اثناء الألغاء');
    })
  }


  showOrderDetails(detailsModel: PurchaseReturnsModel) {
    this.showDetailsLoader = true;
    this.saleseService.GetPurchaseReturnsProducts_Data(detailsModel.purchaseReturnsId).subscribe((data: GeneralOrderDetailsModel[]) => {
      this.dynamicComponentService.loadProductDetailsSidePanel(
        this.detailsComponentHost.viewContainerRef,
        detailsModel,
        data,
        this.orderDetailsDataFields,
        `تفاصيل الطلب #${detailsModel.serialNumber}`
      );

      this.showDetailsLoader = false;
    }, err => {
      this.showDetailsLoader = false;
    }, () => {
      this.showDetailsLoader = false;
    });


  }
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
    },
  ];
}
