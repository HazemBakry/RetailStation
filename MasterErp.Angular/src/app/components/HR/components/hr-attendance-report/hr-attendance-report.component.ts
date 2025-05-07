import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { HrService } from '../../services/hr.service';
import { ToastrService } from 'ngx-toastr';
import { PagedResponseDTO } from 'src/app/components/Shared/models/PagedResponseDTO';
import { FilterItem, FilterModel, SearchFilterModel } from 'src/app/components/Shared/models/FilterModel';
import { EmployeeModel } from '../../models/Employee/EmployeeModel';
import { Router } from '@angular/router';
import { GeneralSelectorModel } from 'src/app/components/Shared/components/general-selector/general-selector.component';

@Component({
  selector: 'app-hr-attendance-report',
  templateUrl: './hr-attendance-report.component.html',
  styleUrls: ['./hr-attendance-report.component.css']
})
export class HrAttendanceReportComponent implements OnInit {
  TitleList = ['الموارد البشرية', 'الحضور والانصراف'];
  URLs: any[] = [];
  Branches: any[] = [];
  branchSelectorData: GeneralSelectorModel[] = [];
  employeeSelectorData: GeneralSelectorModel[] = [];
  filterList: FilterModel[] = [];
  showLoader: boolean = false;
  pagedResponseModel: PagedResponseDTO<EmployeeModel[]> = {
    results: [],
    filterList: [],
    pageSize: 25,
    currentPage: 1,
    searchText: ''
  };

  searchModel: SearchFilterModel = {
    currentPage: 1,
    pageSize: 25,
    filterModel: { filterItems: [] }
  };

  constructor(private modalService: NgbModal,
    private toaster: ToastrService,
    private hrService: HrService,
    private router: Router) { }

  ngOnInit(): void {
    this.getAttendance_Data();
    this.GetAttendance_Filters();
  }

  getAttendance_Data() {
    this.showLoader = true;
    this.hrService.GetAttendance_Data(this.pagedResponseModel).subscribe(data => {
      this.pagedResponseModel.results = data?.results;
      this.pagedResponseModel.totalCount = data?.totalCount;
      this.showLoader = false;
    }, err => {
      this.showLoader = false;
    }, () => {
      this.showLoader = false;
    });
  }

  GetAttendance_Filters() {
    this.hrService.GetAttendance_Filters(this.pagedResponseModel).subscribe((data: FilterModel[]) => {
      this.filterList = data;
    }, (err) => {
      // this.showLoader = false;
    }, () => {
      // this.showLoader = false;
    });
  }

  goToEmployeeDetails(employeeId: any) {
    this.router.navigateByUrl('/hr/employee-details?EmployeeId=' + employeeId);
  }

  pageChanged(obj: any) {
    this.pagedResponseModel.currentPage = obj.page;
    this.getAttendance_Data();
    this.GetAttendance_Filters();
  }

  filterChecked(filterItems: FilterItem[]) {
    this.pagedResponseModel.filterList = filterItems;
    this.getAttendance_Data();
    this.GetAttendance_Filters();
  }

  getSelectedBranch(branch) {
    //this.selectedAgencyType = accountType;
    //this.receiptModel.agencyTypeId = accountType;
  }

}
