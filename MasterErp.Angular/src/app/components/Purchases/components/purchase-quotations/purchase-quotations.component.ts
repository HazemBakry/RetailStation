
import { Component, ComponentFactoryResolver, OnInit, TemplateRef, ViewChild } from '@angular/core';
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
import { PurchaseQuotationDetailsModel, PurchaseQuotationModel } from '../../models/PurchaseQuotationModel';
import { NgbModal, NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-purchase-quotations',
  templateUrl: './purchase-quotations.component.html',
  styleUrls: ['./purchase-quotations.component.css']
})

export class PurchaseQuotationsComponent implements OnInit {
  TitleList = ['المشتريات', 'عرض المشتريات'];
  showLoader: boolean;
  @ViewChild('QuotationsDetailsSidePanel', { static: true }) DetailsSidePanel: TemplateRef<any>;
  quotationDetailsList: PurchaseQuotationDetailsModel[] = [];
  distinctSuppliers: PurchaseQuotationDetailsModel[] = [];
  pagedResponseModel: PagedResponseDTO<PurchaseQuotationModel[]> = {
    results: [],
    filterList: [],
    pageSize: 25,
    currentPage: 1,
    searchText: ''

  };
  selectedPurchaseQuotationId:number;
  @ViewChild(ComponentHostDirective, { static: true }) detailsComponentHost!: ComponentHostDirective;
  public FieldType = FieldType;
  quotationDetailsModel: PurchaseQuotationModel;
  constructor(private purchaseService: PurchaseService, private modalService: NgbModal,private toaster: ToastrService, private dynamicComponentService: DynamicComponentLoaderService, private offcanvasService: NgbOffcanvas,) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.showLoader = true;
    this.purchaseService.GetPurchaseQuotations_Data(this.pagedResponseModel).subscribe((data: PagedResponseDTO<PurchaseQuotationModel[]>) => {
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
    this.selectedPurchaseQuotationId = itemId;
    this.modalService.open(content, { centered: true, size: 'md' });
  }
  deletePurchaseQuotation() {
    this.purchaseService.DeletePurchaseQuotation(this.selectedPurchaseQuotationId).subscribe(data => {
      if (data.isSuccess) {
        this.toaster.success(data.message);
        this.loadData();
      }
      else {
        this.toaster.error(data.message);
      }
    }, (error) => {
      this.toaster.error('حدث خطأ اثناء الألغاء');
    })
  }
  openQuotationDetailsSidePanel(detailsModel: PurchaseQuotationModel) {
    this.quotationDetailsModel = detailsModel;
    this.showQuotationDetails(detailsModel);
    this.offcanvasService.open(this.DetailsSidePanel, { panelClass: 'details-panel', position: 'end' });

  }
  showQuotationDetails(detailsModel: PurchaseQuotationModel) {
    this.quotationDetailsList = [];
    this.distinctSuppliers = [];
    this.showLoader = true;
    this.purchaseService.GetPurchaseQuotationProducts_Data(detailsModel.purchaseQuotationId).subscribe((data: any[]) => {
      this.quotationDetailsList = this.groupItemsById(data);
      if (this.quotationDetailsList.length > 0)
        this.distinctSuppliers = this.quotationDetailsList[0].supplierPrices;

      // this.dynamicComponentService.loadProductDetailsSidePanel(
      //   this.detailsComponentHost.viewContainerRef,
      //   null,
      //   data,
      //   this.quotationDetailsDataFields,
      //   `تفاصيل العرض ${detailsModel.quotationNumber}#`
      // );

      this.showLoader = false;
    }, err => {
      this.showLoader = false;
    }, () => {
      this.showLoader = false;
    });


  }
  groupItemsById(purchaseQuotationDetails: PurchaseQuotationDetailsModel[]): (PurchaseQuotationDetailsModel[]) {
    const groupedItems: { [key: number]: PurchaseQuotationDetailsModel } = {};

    purchaseQuotationDetails.forEach(detail => {
      // Check if the itemId is already in the groupedItems object
      if (!groupedItems[detail.itemId]) {
        groupedItems[detail.itemId] = {
          purchaseQuotationDetailsId: detail.purchaseQuotationDetailsId,
          purchaseQuotationId: detail.purchaseQuotationId,
          itemId: detail.itemId,
          itemNameAR: detail.itemNameAR,
          itemNameEN: detail.itemNameEN,
          unitId: detail.unitId,
          unitNameAR: detail.unitNameAR,
          unitNameEN: detail.unitNameEN,
          notes: detail.notes,
          supplierPrices: purchaseQuotationDetails.filter(x => x.itemId == detail.itemId)
        };
      }
      // Check if the supplier is already in the suppliers array
      // const supplier = groupedItems[detail.itemId].supplierPrices.find(s => s.supplierId === detail.supplierId);

      // if (supplier)  {
      //   groupedItems[detail.itemId].supplierPrices.push({
      //       purchaseQuotationDetailsId:detail.purchaseQuotationDetailsId,
      //       purchaseQuotationId:detail.purchaseQuotationId,
      //       itemId:detail.itemId,
      //       itemNameAR:detail.itemNameAR,
      //       itemNameEN:detail.itemNameEN,
      //       unitId:detail.unitId,
      //       unitNameAR: detail.unitNameAR,
      //       unitNameEN: detail.unitNameEN,
      //       supplierId : detail.supplierId,
      //       supplierNameAR: detail.supplierNameAR,
      //       supplierNameEN: detail.supplierNameEN,
      //       notes: detail.notes,
      //       price: detail.price,
      //       supplierPrices :[]
      //     });
      // }
    });

    // Convert the groupedItems object to an array
    return Object.values(groupedItems);
  }
  getFieldValue(item: PurchaseQuotationDetailsModel[], supplierId): any {
    return item.find(s => s.supplierId == supplierId)?.price;
  }
  quotationDetailsDataFields: DataField[] = [
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
