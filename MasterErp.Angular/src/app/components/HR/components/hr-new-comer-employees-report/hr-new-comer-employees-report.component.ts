import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { HrService } from '../../services/hr.service';
import { DatePipe } from '@angular/common';
import { FilterItem, FilterModel } from 'src/app/components/Shared/models/FilterModel';
import { ToastrService } from 'ngx-toastr';
import { FormDropdownModel } from 'src/app/components/Shared/components/drop-down-form-control/drop-down-form-control.component';
import { PagedResponseDTO } from 'src/app/components/Shared/models/PagedResponseDTO';
import { FormService } from 'src/app/components/Shared/services/form.service';
import { CustomValidators, RegexType } from 'src/app/components/Shared/services/custom-validators';
import { SharedService } from 'src/app/components/Shared/services/shared.service';
import { EmployeeAdvanceModel } from '../../models/EmployeeAdvanceModel';
import { HRWorkflowStatus } from 'src/app/components/Shared/Enums/FinanceWorkflowStatus';
import { GeneralSelectorComponent, GeneralSelectorModel } from 'src/app/components/Shared/components/general-selector/general-selector.component';
import { ExpireType } from 'src/app/components/Shared/Enums/ExpireType';
import { EmployeeReportModel } from '../../models/EmployeeReportModel';

@Component({
  selector: 'app-hr-new-comer-employees-report',
  templateUrl: './hr-new-comer-employees-report.component.html',
  styleUrls: ['./hr-new-comer-employees-report.component.css']
})
export class HrNewComerEmployeesReportComponent implements OnInit {

  fromDate: string;
  toDate: string;

  showLoader: boolean = false;
  showExportLoader: boolean = false;
  showAddLoader: boolean = false;
  selectedReportType: number = null;
  selectedEmployeeId: number = null;
  filterList: FilterModel[] = [];

  public workflowStatus = HRWorkflowStatus;
  reportName: string;

  pagedResponse: PagedResponseDTO<EmployeeReportModel[]> = {
    results: [],
    filterList: [],
    pageSize: 10,
    currentPage: 1,
    searchText: ''
  };

  constructor(private modalService: NgbModal, private hrService: HrService,
    private sharedService: SharedService,
    private datePipe: DatePipe, private toaster: ToastrService, private offcanvasService: NgbOffcanvas,) { }

  ngOnInit(): void {

  }

  search() {

    this.pagedResponse.currentPage = 1;
    this.pagedResponse.searchText = '';
    this.pagedResponse.filterList = [];
    this.pagedResponse.results = [];
    this.pagedResponse.totalCount = 0;
    if (!this.checkReport())
      return;

    this.loadData();
    this.loadFilters();
  }
  exportData() {
    if (!this.checkReport())
      return;

    this.showExportLoader = true;
    this.hrService.GetNewComerEmployeesReport_Export(this.fromDate, this.toDate, this.pagedResponse).subscribe(data => {
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
  loadData() {
    if (!this.checkReport())
      return;

    this.showLoader = true;
    this.hrService.GetNewComerEmployeesReport_Data(this.fromDate, this.toDate, this.pagedResponse).subscribe(data => {
      this.pagedResponse.results = data.results;
      this.pagedResponse.totalCount = data.totalCount;

      this.showLoader = false;
    }, err => {
      this.showLoader = false;
    }, () => {
      this.showLoader = false;
    });
  }

  loadFilters() {
    if (!this.checkReport())
      return;

    // this.showLoader = true;
    this.hrService.GetNewComerEmployeesReport_Filters(this.fromDate, this.toDate, this.pagedResponse).subscribe(data => {
      this.filterList = data;

      // this.showLoader = false;
    }, err => {
      // this.showLoader = false;
    }, () => {
      // this.showLoader = false;
    });
  }

  checkReport() {
    if (!this.fromDate|| !this.toDate) {

      this.toaster.warning('من فضلك اختر الفترة', 'تحذير');
      return false;
    }
    return true;
  }


  filterChecked(filterItems: FilterItem[]) {
    this.pagedResponse.filterList = filterItems;
    this.loadData();
  }
  pageChanged(obj: any) {
    this.pagedResponse.currentPage = obj.page;
    this.loadData();
  }


}


