import { Component, OnInit } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from "ngx-toastr";
import { HRWorkflowStatus, WorkflowStatusGroup } from "src/app/components/Shared/Enums/FinanceWorkflowStatus";
import { FilterItem } from "src/app/components/Shared/models/FilterModel";
import { PagedResponseDTO } from "src/app/components/Shared/models/PagedResponseDTO";
import { EmployeeFinancialCustodyModel } from "../../models/EmployeeFinancialCustodyModel";
import { HrService } from "../../services/hr.service";
import { GeneralSelectorModel } from "src/app/components/Shared/components/general-selector/general-selector.component";
import { SharedService } from "src/app/components/Shared/services/shared.service";
import { LookupService } from "src/app/components/Shared/services/lookup.service";

@Component({
  selector: 'app-hr-financial-custody-report',
  templateUrl: './hr-financial-custody-report.component.html',
  styleUrls: ['./hr-financial-custody-report.component.css']
})
export class HrFinancialCustodyReportComponent implements OnInit {
  TitleList = ['الموارد البشرية', 'تقارير العهد'];
  showLoader: boolean;
  financialCustodyTypesSelectorData: GeneralSelectorModel[] = [];
  workflowStatusSelectorData: GeneralSelectorModel[] = [];
  employeeSelectorData: GeneralSelectorModel[] = [];
  fromDate: string;
  toDate: string;
  selectedEmployeeId: number;
  selectedFinancialCustodyTypeId: number;
  selectedStatusId: number;
  filterList: FilterItem[] = [];

  pagedResponseModel: PagedResponseDTO<EmployeeFinancialCustodyModel[]> = {
    results: [],
    filterList: [],
    pageSize: 10,
    currentPage: 1,
    searchText: ''
  };
  showAddLoader: boolean = false;
  showExportLoader: boolean = false;
  selectedFinancialCustodyId: number;
  constructor(private modalService: NgbModal, private hrService: HrService, private sharedService: SharedService,
    private lookupService: LookupService,
    private toaster: ToastrService) { }

  ngOnInit(): void {
    this.loadSelectors();
    this.onSearch();
  }


  loadSelectors() {

    this.lookupService.GetFinancialCustodyTypesSelector().subscribe((data: GeneralSelectorModel[]) => {
      this.financialCustodyTypesSelectorData = data;
    });
    this.lookupService.GetWorkStatusSelector().subscribe((data: GeneralSelectorModel[]) => {
      this.workflowStatusSelectorData = data;
    });
    this.hrService.GetActiveEmployeesSelector().subscribe((data: GeneralSelectorModel[]) => {
      this.employeeSelectorData = data;
    });
  }
  onSearch() {
    this.pagedResponseModel.results = [];
    this.pagedResponseModel.currentPage = 1;
    this.pagedResponseModel.totalCount = 0;
    this.getAllEmployeeFinancialCustodyData();
  }
  getAllEmployeeFinancialCustodyData() {
    this.mapFilters();
    this.showLoader = true;
    this.hrService.GetAllEmployeeFinancialCustodyData(this.pagedResponseModel).subscribe(data => {
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
    this.mapFilters();


    this.showExportLoader = true;
    this.hrService.GetAllEmployeeFinancialCustody_Export(this.pagedResponseModel).subscribe(data => {
      if (data.isSuccess) {
        // this.sharedService.urlDownloadOrOpen(data.url);
        console.log("🚀 ~ HrFinancialCustodyReportComponent ~ exportData ~ data.url:", data.url)
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
    if (this.selectedEmployeeId) {
      this.pagedResponseModel.filterList.push({ categoryName: 'EmployeeId', itemFlag: this.selectedEmployeeId?.toString() })
    }
    if (this.selectedFinancialCustodyTypeId) {
      this.pagedResponseModel.filterList.push({ categoryName: 'FinancialCustodyType', itemFlag: this.selectedFinancialCustodyTypeId?.toString() })
    }
    if (this.selectedStatusId) {
      this.pagedResponseModel.filterList.push({ categoryName: 'FinancialCustodyStatus', itemFlag: this.selectedStatusId?.toString() })
    }
  }
  pageChanged(obj: any) {
    this.pagedResponseModel.currentPage = obj.page;
    this.getAllEmployeeFinancialCustodyData();
  }

  filterChecked(filterItems: FilterItem[]) {
    this.pagedResponseModel.filterList = filterItems;
    this.getAllEmployeeFinancialCustodyData();
  }


}

