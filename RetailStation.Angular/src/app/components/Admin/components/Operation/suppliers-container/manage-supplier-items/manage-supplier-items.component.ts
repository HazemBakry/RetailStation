import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal, NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { OperationService } from 'src/app/components/Admin/services/operation.service';
import { SupplierItemModel } from 'src/app/components/Main/models/SupplierItemModel';
import { FormDropdownModel } from 'src/app/components/Shared/components/drop-down-form-control/drop-down-form-control.component';
import { GeneralSelectorModel } from 'src/app/components/Shared/components/general-selector/general-selector.component';
import { PagedResponseModel } from 'src/app/components/Shared/models/PagedResponseDTO';
import { SharedService } from 'src/app/components/Shared/services/shared.service';

@Component({
  selector: 'app-manage-supplier-items',
  templateUrl: './manage-supplier-items.component.html',
  styleUrls: ['./manage-supplier-items.component.css']
})
export class ManageSupplierItemsComponent implements OnInit {
  TitleList = ['التشغيل', 'بيانات الأصناف'];
  itemsSelectorData: GeneralSelectorModel[] = [];
  selectedItemId: number;
  itemModel: SupplierItemModel = {} as SupplierItemModel;
  pagedResponse: PagedResponseModel<SupplierItemModel[]> = {
    results: [],
    filterList: [],
    pageSize: 20,
    currentPage: 1,
    searchText: ''
  };
  showLoader: boolean = false;
  showAddLoader: boolean = false;
  showExportLoader: boolean = false;

  supplierId: number;
  constructor(private modalService: NgbModal, private acRoute: ActivatedRoute, private operationService: OperationService,
    private sharedService: SharedService,
    private toaster: ToastrService, private offcanvasService: NgbOffcanvas,) { }

  ngOnInit(): void {
    this.acRoute.params.subscribe((params: any) => {
      if (params.SupplierId) {
        this.supplierId = Number(params.SupplierId);
        this.loadData();
      }
    });
    this.loadItemsSelector();
  }
  loadItemsSelector() {

    this.sharedService.GetItemsSelector().subscribe((data: GeneralSelectorModel[]) => {
      this.itemsSelectorData = data;
    });
  }
  loadData() {
    this.showLoader = true;
    this.operationService.GetSupplierItems_Data(this.supplierId, this.pagedResponse).subscribe(data => {
      this.pagedResponse.results = data.results;
      this.pagedResponse.totalCount = data.totalCount;
      this.showLoader = false;
    }, err => {
      this.showLoader = false;
    }, () => {
      this.showLoader = false;
    });
  }

  pageChanged(obj: any) {
    this.pagedResponse.currentPage = obj.page;
    this.loadData();
  }
  mapSupplierItem(supplierItemId: number, itemId: number) {
    this.showLoader = true;
    this.operationService.MapSupplierItem(this.supplierId, supplierItemId, itemId).subscribe(data => {
      this.loadData();
      this.showLoader = false;
    }, err => {
      this.showLoader = false;
    }, () => {
      this.showLoader = false;
    });
  }

}
