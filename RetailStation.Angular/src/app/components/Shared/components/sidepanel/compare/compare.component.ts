import { Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewEncapsulation } from '@angular/core';
import { NgbModal, NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { PagedResponseModel } from 'src/app/components/Shared/models/PagedResponseDTO';
import { SharedService } from 'src/app/components/Shared/services/shared.service';
import { GeneralSelectorModel } from '../../general-selector/general-selector.component';
import { MaterialReceiptModel } from 'src/app/components/Inventory/models/MaterialReceiptModel';
import { WebsiteService } from 'src/app/components/Main/services/website.service';
import { CompareService, ItemCompareModel } from '../../../services/comapre.service';
import { FieldType } from '../../../Enums/FieldType';
import { DataField } from '../../../models/DataField';
import { SupplierItemModel } from '../../../models/SupplierItemModel';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-compare',
  templateUrl: './compare.component.html',
  styleUrls: ['./compare.component.css'],
  encapsulation: ViewEncapsulation.None,

})
export class CompareComponent implements OnInit {
  @Input() selectedSupplierId: any;

  @Output() selectedOrder = new EventEmitter<MaterialReceiptModel[]>()
  OrdersList: any[] = [];
  showLoader: boolean;
  systemURL: string = environment.systemUrl;

  selectAll: boolean = false;
  orderNumber: string = '';
  orderDate: string;
  pageResponseModel: PagedResponseModel<SupplierItemModel[]> = {
    results: [],
    filterList: [],
    pageSize: 20,
    currentPage: 1,
    searchText: ''
  };
  suppliersSelectorData: GeneralSelectorModel[] = [];
  compareCount$: number = 0;

  constructor(private offcanvasService: NgbOffcanvas,
    private sharedService: SharedService,
    private compareService: CompareService,
    private modalService: NgbModal,
    private toaster: ToastrService, private websiteService: WebsiteService,
  ) { }


  ngOnInit(): void {
    this.compareService.itemCount$.subscribe(count => {
      this.compareCount$ = count || 0;
    });
  }


  loadData() {
    this.mapFilters();
    if (this.pageResponseModel.filterList.length == 0) {
      this.toaster.warning('لا يوجد أصناف ');
      return;
    }

    this.showLoader = true;
    this.websiteService.GetWebsiteItems_Data(this.pageResponseModel).subscribe(data => {
      this.pageResponseModel.results = data.results;
      // this.suppliersData = this.suppliersData.concat([...data.results]);
      this.pageResponseModel.totalCount = data.totalCount;

      this.showLoader = false;
    }, err => {
      this.showLoader = false;
    }, () => {
      this.showLoader = false;
    });
  }
  pageChanged(obj: any) {
    this.pageResponseModel.currentPage = obj.page;
    this.loadData();
  }
  mapFilters() {
    const compareList: ItemCompareModel[] = this.compareService.getCurrentList();
    this.pageResponseModel.pageSize = compareList.length;
    this.pageResponseModel.results = [];
    this.pageResponseModel.filterList = [];
    compareList.forEach(item => {
      if (item.supplierItemId) {
        this.pageResponseModel.filterList.push({ categoryName: 'SupplierItemId', itemFlag: item.supplierItemId.toString() })
      }
    });
  }
  OpenSidePanel(content: TemplateRef<any>) {
    this.pageResponseModel.results = [];
    this.loadData();
    // this.offcanvasService.open(content, { panelClass: 'details-panel', position: 'end' });
    this.modalService.open(content, {
      size: 'xl',
      centered: true,
      scrollable: true,
    });
  }


  remove(item: SupplierItemModel): void {
    this.compareService.removeItem(item.supplierItemId, item.itemId);
    this.loadData();
  }


  dataFields: DataField[] = [
    {
      fieldName: 'productImage',
      fieldType: FieldType.image,
      displayName: 'صورة المنتج',
    },
    {
      fieldName: 'productName',
      fieldType: FieldType.Text,
      displayName: 'اسم المنتج',
    },
    {
      fieldName: 'price',
      fieldType: FieldType.Text,
      displayName: 'السعر',
    },
    {
      fieldName: 'productRate',
      fieldType: FieldType.Text,
      displayName: 'تقييم المنتج',
    },

    {
      fieldName: 'productUrl',
      fieldType: FieldType.Text,
      displayName: 'رابط المنتج',
    }
    ,
    {
      fieldName: 'supplierName',
      fieldType: FieldType.Text,
      displayName: 'اسم المورد',
    }
    // ,
    // {
    //   fieldName: 'manufacturingCountry',
    //   fieldType: FieldType.Text,
    //   displayName: 'بلد المنشأ',
    // }
    ,
    {
      fieldName: 'supplierRate',
      fieldType: FieldType.Text,
      displayName: 'تقييم المورد',
    }
    ,
    {
      fieldName: 'deliveryTime',
      fieldType: FieldType.Text,
      displayName: 'مدة الشحن المتوقعة',
    }
    // ,
    // {
    //   fieldName: 'dimensions',
    //   fieldType: FieldType.Text,
    //   displayName: 'الأبعاد',
    // }
    // ,
    // {
    //   fieldName: 'weight',
    //   fieldType: FieldType.Text,
    //   displayName: 'الوزن',
    // }
    ,
    {
      fieldName: 'minOrderQuantity',
      fieldType: FieldType.Text,
      displayName: 'الحد الأدنى للكمية',
    }
    // ,
    // {
    //   fieldName: 'returnPolicy',
    //   fieldType: FieldType.Text,
    //   displayName: 'سياسة الإرجاع',
    // }
    ,
    {
      fieldName: 'paymentMethods',
      fieldType: FieldType.Text,
      displayName: 'طرق الدفع المتاحة',
    }
  ];

}


