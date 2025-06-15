import { Component, OnInit } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from "ngx-toastr";
import { HRWorkflowStatus, WorkflowStatusGroup } from "src/app/components/Shared/Enums/FinanceWorkflowStatus";
import { FilterItem } from "src/app/components/Shared/models/FilterModel";
import { PagedResponseDTO } from "src/app/components/Shared/models/PagedResponseDTO";
import { EmployeeAdvanceModel } from "../../models/EmployeeAdvanceModel";
import { HrService } from "../../services/hr.service";
import { GeneralSelectorModel } from "src/app/components/Shared/components/general-selector/general-selector.component";
import { SharedService } from "src/app/components/Shared/services/shared.service";
import { LookupService } from "src/app/components/Shared/services/lookup.service";


@Component({
  selector: 'app-hr-advances-reports',
  templateUrl: './hr-advances-reports.component.html',
  styleUrls: ['./hr-advances-reports.component.css']
})
export class HrAdvancesReportsComponent implements OnInit {
  TitleList = ['الحسابات العامة', 'تقارير السلف'];
  showLoader: boolean;
  advanceTypesSelectorData: GeneralSelectorModel[] = [];
  workflowStatusSelectorData: GeneralSelectorModel[] = [];
  employeeSelectorData: GeneralSelectorModel[] = [];
  fromDate: string;
  toDate: string;
  selectedEmployeeId: number;
  selectedAdvanceTypeId: number;
  selectedStatusId: number;
  filterList: FilterItem[] = [];

  pagedResponseModel: PagedResponseDTO<EmployeeAdvanceModel[]> = {
    results: [],
    filterList: [],
    pageSize: 10,
    currentPage: 1,
    searchText: ''
  };
  showAddLoader: boolean = false;
  selectedAdvanceId: number;

  constructor(private modalService: NgbModal, private hrService: HrService, private sharedService: SharedService,
    private lookupService: LookupService,
    private toaster: ToastrService) { }

  ngOnInit(): void {
    this.loadSelectors();
  }


  loadSelectors() {

    this.hrService.GetAdvanceTypesSelector().subscribe((data: GeneralSelectorModel[]) => {
      this.advanceTypesSelectorData = data;
    });
    this.lookupService.GetWorkStatusSelector(WorkflowStatusGroup.HR).subscribe((data: GeneralSelectorModel[]) => {
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
    this.getAdvancesRequestsSummary();
  }
  getAdvancesRequestsSummary() {
    this.mapFilters();
    this.showLoader = true;
    this.hrService.GetAllEmployeeAdvancesData(this.pagedResponseModel).subscribe(data => {
      this.pagedResponseModel.results = data.results;
      this.pagedResponseModel.totalCount = data.totalCount;


      this.showLoader = false;
    }, err => {
      this.showLoader = false;
    }, () => {
      this.showLoader = false;
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
    if (this.selectedAdvanceTypeId) {
      this.pagedResponseModel.filterList.push({ categoryName: 'AdvanceType', itemFlag: this.selectedAdvanceTypeId?.toString() })
    }
    if (this.selectedStatusId) {
      this.pagedResponseModel.filterList.push({ categoryName: 'AdvanceStatus', itemFlag: this.selectedStatusId?.toString() })
    }
  }
  pageChanged(obj: any) {
    this.pagedResponseModel.currentPage = obj.page;
    this.getAdvancesRequestsSummary();
  }

  filterChecked(filterItems: FilterItem[]) {
    this.pagedResponseModel.filterList = filterItems;
    this.getAdvancesRequestsSummary();
  }


}
