import { Component, OnInit } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from "ngx-toastr";
import { HRWorkflowStatus, WorkflowStatusGroup } from "src/app/components/Shared/Enums/FinanceWorkflowStatus";
import { FilterItem } from "src/app/components/Shared/models/FilterModel";
import { PagedResponseDTO } from "src/app/components/Shared/models/PagedResponseDTO";
import { GeneralSelectorModel } from "src/app/components/Shared/components/general-selector/general-selector.component";
import { SharedService } from "src/app/components/Shared/services/shared.service";
import { LookupService } from "src/app/components/Shared/services/lookup.service";
import { ItemModel } from "../../models/Item";
import { InventoryService } from "../../services/inventory.service";


@Component({
  selector: 'app-items-followup-report',
  templateUrl: './items-followup-report.component.html',
  styleUrls: ['./items-followup-report.component.css']
})
export class ItemsFollowupReportComponent implements OnInit {
  TitleList = ['المخازن', 'تقارير تتبع أسعار الأصناف'];
  showLoader: boolean;
  vacationTypesSelectorData: GeneralSelectorModel[] = [];
  workflowStatusSelectorData: GeneralSelectorModel[] = [];
  employeeSelectorData: GeneralSelectorModel[] = [];
  fromDate: string;
  toDate: string;
  selectedEmployeeId: number;
  selectedVacationTypeId: number;
  selectedStatusId: number;
  filterList: FilterItem[] = [];

  pagedResponseModel: PagedResponseDTO<ItemModel[]> = {
    results: [],
    filterList: [],
    pageSize: 10,
    currentPage: 1,
    searchText: ''
  };
  showAddLoader: boolean = false;
  showExportLoader: boolean = false;

  constructor(private modalService: NgbModal,
    private sharedService: SharedService,
    private lookupService: LookupService,
    private inventoryService: InventoryService,
    private toaster: ToastrService) { }

  ngOnInit(): void {
    //this.loadSelectors();
    //this.onSearch();
  }


  loadSelectors() {
    this.lookupService.GetVacationTypesSelector().subscribe((data: GeneralSelectorModel[]) => {
      this.vacationTypesSelectorData = data;
    });
    this.lookupService.GetWorkStatusSelector(WorkflowStatusGroup.HR).subscribe((data: GeneralSelectorModel[]) => {
      this.workflowStatusSelectorData = data;
    });
  }

  onSearch() {
    this.pagedResponseModel.results = [];
    this.pagedResponseModel.currentPage = 1;
    this.pagedResponseModel.totalCount = 0;
    this.getItemsPricesFollowUp_Data();
  }

  getItemsPricesFollowUp_Data() {
    this.mapFilters();
    this.showLoader = true;
    this.inventoryService.GetItemsPricesFollowUp_Data(this.fromDate, this.toDate, this.pagedResponseModel).subscribe(data => {
      debugger
      this.pagedResponseModel.results = data.results;
      this.pagedResponseModel.totalCount = data.totalCount;

      this.showLoader = false;
    }, err => {
      this.showLoader = false;
    }, () => {
      this.showLoader = false;
    });
  }

  exportData() {
    //this.mapFilters();
    this.showExportLoader = true;
    this.inventoryService.GetItemsPricesFollowUp_Export(this.fromDate, this.toDate, this.pagedResponseModel).subscribe(data => {
      if (data.isSuccess) {
        this.sharedService.urlDownloadOrOpen(data.url);
        this.toaster.success(data.message);
      } else {
        this.toaster.error(data.message);
      }
    }, err => {
      this.showExportLoader = false;
    }, () => {
      this.showExportLoader = false;
    });
  }

  mapFilters() {
    this.pagedResponseModel.filterList = [];
    if (this.fromDate) {
      this.pagedResponseModel.filterList.push({ categoryName: 'FromDate', itemFlag: this.fromDate })
    }
    if (this.toDate) {
      this.pagedResponseModel.filterList.push({ categoryName: 'ToDate', itemFlag: this.toDate })
    }
    // if (this.selectedEmployeeId) {
    //   this.pagedResponseModel.filterList.push({ categoryName: 'EmployeeId', itemFlag: this.selectedEmployeeId?.toString() })
    // }
    // if (this.selectedVacationTypeId) {
    //   this.pagedResponseModel.filterList.push({ categoryName: 'VacationType', itemFlag: this.selectedVacationTypeId?.toString() })
    // }
    // if (this.selectedStatusId) {
    //   this.pagedResponseModel.filterList.push({ categoryName: 'VacationStatus', itemFlag: this.selectedStatusId?.toString() })
    // }
  }

  pageChanged(obj: any) {
    this.pagedResponseModel.currentPage = obj.page;
    this.getItemsPricesFollowUp_Data();
  }

  filterChecked(filterItems: FilterItem[]) {
    this.pagedResponseModel.filterList = filterItems;
    this.getItemsPricesFollowUp_Data();
  }


}
