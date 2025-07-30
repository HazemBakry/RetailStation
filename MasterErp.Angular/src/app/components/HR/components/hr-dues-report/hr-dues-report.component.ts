import { Component, OnInit } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from "ngx-toastr";
import { HRWorkflowStatus, WorkflowStatusGroup } from "src/app/components/Shared/Enums/FinanceWorkflowStatus";
import { FilterItem } from "src/app/components/Shared/models/FilterModel";
import { PagedResponseDTO } from "src/app/components/Shared/models/PagedResponseDTO";
import { HrService } from "../../services/hr.service";
import { GeneralSelectorModel } from "src/app/components/Shared/components/general-selector/general-selector.component";
import { SharedService } from "src/app/components/Shared/services/shared.service";
import { LookupService } from "src/app/components/Shared/services/lookup.service";
import { EmployeeDueModel } from "../../models/EmployeeDueModel";


@Component({
    selector: 'app-hr-dues-report',
    templateUrl: './hr-dues-report.component.html',
    styleUrls: ['./hr-dues-report.component.css']
})
export class HrDuesReportComponent implements OnInit {
    TitleList = ['لموارد البشرية', 'تقارير المستحقات'];
    showLoader: boolean;
    dueTypesSelectorData: GeneralSelectorModel[] = [];
    workflowStatusSelectorData: GeneralSelectorModel[] = [];
    employeeSelectorData: GeneralSelectorModel[] = [];
    fromDate: string;
    toDate: string;
    selectedEmployeeId: number;
    selectedDueTypeId: number;
    selectedStatusId: number;
    filterList: FilterItem[] = [];

    pagedResponseModel: PagedResponseDTO<EmployeeDueModel[]> = {
        results: [],
        filterList: [],
        pageSize: 10,
        currentPage: 1,
        searchText: ''
    };
    showAddLoader: boolean = false;
    showExportLoader: boolean = false;

    selectedDueId: number;

    constructor(private modalService: NgbModal, private hrService: HrService, private sharedService: SharedService,
        private lookupService: LookupService,
        private toaster: ToastrService) { }

    ngOnInit(): void {
        this.loadSelectors();
        this.onSearch();
    }


    loadSelectors() {

        this.lookupService.GetEmployeeDueTypesSelector().subscribe((data: GeneralSelectorModel[]) => {
            this.dueTypesSelectorData = data;
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
        this.getAllEmployeeDuesData();
    }
    getAllEmployeeDuesData() {
        this.mapFilters();
        this.showLoader = true;
        this.hrService.GetDues_Data(this.pagedResponseModel).subscribe(data => {
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
        this.hrService.GetEmployeeDues_Export(this.pagedResponseModel).subscribe(data => {
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
        if (this.selectedEmployeeId) {
            this.pagedResponseModel.filterList.push({ categoryName: 'EmployeeId', itemFlag: this.selectedEmployeeId?.toString() })
        }
        if (this.selectedDueTypeId) {
            this.pagedResponseModel.filterList.push({ categoryName: 'DueType', itemFlag: this.selectedDueTypeId?.toString() })
        }
        if (this.selectedStatusId) {
            this.pagedResponseModel.filterList.push({ categoryName: 'DueStatus', itemFlag: this.selectedStatusId?.toString() })
        }
    }
    pageChanged(obj: any) {
        this.pagedResponseModel.currentPage = obj.page;
        this.getAllEmployeeDuesData();
    }

    filterChecked(filterItems: FilterItem[]) {
        this.pagedResponseModel.filterList = filterItems;
        this.getAllEmployeeDuesData();
    }


}
