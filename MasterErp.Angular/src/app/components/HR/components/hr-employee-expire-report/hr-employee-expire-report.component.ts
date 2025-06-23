import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
import { EmployeeExpireReportModel } from '../../models/EmployeeExpireReportModel';
import { GeneralSelectorComponent, GeneralSelectorModel } from 'src/app/components/Shared/components/general-selector/general-selector.component';
import { ExpireType } from 'src/app/components/Shared/Enums/ExpireType';

@Component({
  selector: 'app-hr-employee-expire-report',
  templateUrl: './hr-employee-expire-report.component.html',
  styleUrls: ['./hr-employee-expire-report.component.css']
})
export class HrEmployeeExpireReportComponent implements OnInit {

  reportTypes: GeneralSelectorModel[] = [
    { value: ExpireType.Iqama, name: 'تقرير الموظفين المنتهية أقاممتهم' },
    { value: ExpireType.Passport, name: 'تقرير الموظفين المنتهية جوازات سفرهم' },
    { value: ExpireType.DrivingLicense, name: 'تقرير الموظفين المنتهية رخصة قيادتهم' },
    { value: ExpireType.Contract, name: 'تقرير الموظفين المنتهية عقودهم' },
    { value: ExpireType.WorkStatus, name: 'تقرير الموظفين المنتهية وضعهم الوظيفي' },

  ];

  showLoader: boolean = false;
  showExportLoader: boolean = false;
  showAddLoader: boolean = false;
  selectedReportType: number = null;
  selectedEmployeeId: number = null;
  filterList: FilterModel[] = [];

  public workflowStatus = HRWorkflowStatus;
  reportName: string;

  pagedResponse: PagedResponseDTO<EmployeeExpireReportModel[]> = {
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
    this.reportName = this.reportTypes.find(x => x.value === this.selectedReportType)?.name;
    this.loadData();
    this.loadFilters();
  }
  exportData() {
    if (!this.checkReport())
      return;

    this.showExportLoader = true;
    this.hrService.GetEmployeesExpireReport_Export(this.selectedReportType, this.pagedResponse).subscribe(data => {
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
    this.hrService.GetEmployeesExpireReport_Data(this.selectedReportType, this.pagedResponse).subscribe(data => {
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
    this.hrService.GetEmployeesExpireReport_Filters(this.selectedReportType, this.pagedResponse).subscribe(data => {
      this.filterList = data;

      // this.showLoader = false;
    }, err => {
      // this.showLoader = false;
    }, () => {
      // this.showLoader = false;
    });
  }

  checkReport() {
    if (!this.selectedReportType) {
      this.toaster.warning('من فضلك اختر نوع التقرير', 'تحذير');
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


