
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { SharedService } from 'src/app/components/Shared/services/shared.service';
import { GeneralSelectorModel } from 'src/app/components/Shared/components/general-selector/general-selector.component';
import { PagedResponseDTO } from 'src/app/components/Shared/models/PagedResponseDTO';
import { SupplierStatementModel } from 'src/app/components/Purchases/models/SupplierStatementModel';
import { PurchaseService } from 'src/app/components/Purchases/services/purchase.service';


@Component({
  selector: 'app-customers-statement',
  templateUrl: './customers-statement.component.html',
  styleUrls: ['./customers-statement.component.css']
})

export class CustomersStatementComponent implements OnInit {
  suppliersSelectorData: GeneralSelectorModel[] = [];
  showLoader: boolean;
  selectedSupplierId: any;
  fromDate: string;
  toDate: string;
  pagedResponseModel: PagedResponseDTO<SupplierStatementModel[]> = {
    results: [],
    filterList: [],
    pageSize: 10,
    currentPage: 1,
    searchText: ''
  };

  constructor(private purchaseService: PurchaseService,
    private sharedService: SharedService,
    private toaster: ToastrService) { }

  ngOnInit(): void {
    this.loadSelectors();
  }

  loadSelectors() {
    this.sharedService.GetSuppliersSelector().subscribe(data => {
      this.suppliersSelectorData = data;
    });
  }

  getSelectedSupplier(supplierId) {
    this.selectedSupplierId = supplierId;
  }

  search() {
    this.pagedResponseModel.results = [];
    this.pagedResponseModel.currentPage = 1;
    this.pagedResponseModel.totalCount = 0;
    this.getSupplierStatement();
  }
  getSupplierStatement() {
    this.mapFilters();
    if (!this.selectedSupplierId) {
      this.toaster.warning('يرجى اختيار مورد');
    }
    this.showLoader = true;
    this.purchaseService.GetSupplierStatementData(this.selectedSupplierId, this.pagedResponseModel).subscribe(data => {
      this.pagedResponseModel.results = data.results;
      this.showLoader = false;
    }, (err) => {
      this.showLoader = false;
    }, () => {
      this.showLoader = false;
    })
  }

  mapFilters() {
    this.pagedResponseModel.filterList = [];
    if (this.fromDate) {
      this.pagedResponseModel.filterList.push({ categoryName: 'FromDate', itemFlag: this.fromDate })
    }
    if (this.toDate) {
      this.pagedResponseModel.filterList.push({ categoryName: 'ToDate', itemFlag: this.toDate })
    }

  }
  pageChanged(obj: any) {
    this.pagedResponseModel.currentPage = obj.page;
    this.getSupplierStatement();
  }
}

