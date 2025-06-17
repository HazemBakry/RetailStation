import { Component, OnInit } from '@angular/core';
import { FilterItem, FilterModel, SearchFilterModel } from 'src/app/components/Shared/models/FilterModel';
import { ToastrService } from 'ngx-toastr';
import { PagedResponseDTO } from 'src/app/components/Shared/models/PagedResponseDTO';
import { ActionsResponseModel } from 'src/app/components/Shared/models/ActionsResponseModel';
import { SharedService } from 'src/app/components/Shared/services/shared.service';
import { HrService } from '../../services/hr.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-hr-payroll-report',
  templateUrl: './hr-payroll-report.component.html',
  styleUrls: ['./hr-payroll-report.component.css']
})

export class HRPayrollReportComponent implements OnInit {
  TitleList = ['الموارد البشرية', 'Payroll'];
  showLoader: boolean = false;
  showExportLoader: boolean = false;
  filterList: FilterModel[] = [];
  payrollProcessTypes: any[] = [];
  TypeId: number;
  selectAll: boolean = false;
  isApprove:boolean=true;
  pagedResponseModel: PagedResponseDTO<any> = {
    results: [],
    filterList: [],
    pageSize: 10,
    currentPage: 1,
    searchText: '',
    fromDate: '',
    toDate: ''
  };

  pagedFilterModel: SearchFilterModel = {
    currentPage: 1,
    pageSize: 10,
    searchText: '',
    filterModel: {
      filterItems: [],
    }
  }


  constructor(private hrService: HrService,
    private sharedService: SharedService,
    private modalService: NgbModal,
    private toaster: ToastrService) { }

  ngOnInit(): void {
    this.payrollProcessTypes = this.hrService.payrollProcessTypes;

  }
  actionTypeChanged(typeId) {
    this.pagedResponseModel.results = [];
    this.pagedResponseModel.totalCount = 0;
    this.pagedResponseModel.currentPage = 1;
  }
  getEmployeePayrollReport(type: any) {
    if (!type) {
      this.toaster.error('يرجى اختيار نوع التقرير');
      return;
    }
    let typeName = this.payrollProcessTypes.find(x => x.id == type)?.name;
    this.showLoader = true;
    this.hrService.GetPayrollReportData(type, this.pagedFilterModel).subscribe(data => {
      this.pagedResponseModel.results = data;
      this.pagedResponseModel.totalCount = data[0]?.totalCount ?? 0;
      this.pagedResponseModel.results.forEach(element => {
        element.processType = typeName;
      });
      this.showLoader = false;
    }, err => {
      this.showLoader = false;
    }, () => {
      this.showLoader = false;
    });
  }

  exportData(type: any) {
    if (!type) {
      this.toaster.error('يرجى اختيار نوع التقرير');
      return;
    }
    this.showExportLoader = true;
    this.hrService.ExportPayrollReportData(type, this.pagedFilterModel).subscribe((data: ActionsResponseModel) => {
      if (data.isSuccess) {
        this.sharedService.urlDownloadOrOpen(data.url);
        this.toaster.success(data.message);
      } else {
        this.toaster.error(data.message);
      }
      this.showExportLoader = false;
    }, err => {
      this.showExportLoader = false;
    }, () => {
      this.showExportLoader = false;
    });
  }


  filterChecked(filterItems: FilterItem[]) {
    this.pagedFilterModel.filterModel.filterItems = filterItems;
    this.getEmployeePayrollReport(this.TypeId);
  }

  pageChanged(obj: any) {
    this.pagedFilterModel.currentPage = obj.page;
    this.getEmployeePayrollReport(this.TypeId);
  }

  selectAllData() {
    if (this.pagedResponseModel.results && this.pagedResponseModel.results.length > 0) {
      this.pagedResponseModel.results.map(c => {
        c.isChecked = this.selectAll;
      });
    }

  }
  getSelectedRows(): number[] {
    const selectedItems = this.pagedResponseModel.results.filter(b => b.isChecked && b.actionId);
    if (selectedItems.length === 0) {
      this.toaster.warning('يجب الاختيار من الصفوف المناسبة للإجراء المطلوب');
    }
    return selectedItems.map(i => Number(i.actionId));
  }
  openSaveModal(content: any) {
    let rowsId = this.getSelectedRows();
    if (!rowsId?.length)
      return;
    this.modalService.open(content, { centered: true, size: 'md' });
  }
  approve() {

    let rowsId = this.getSelectedRows();
    if (!rowsId?.length)
      return;

    this.showLoader = true;
    this.hrService.ApprovePayrollReportData(this.TypeId, rowsId,this.isApprove).subscribe((data: ActionsResponseModel) => {
      if (data.isSuccess) {
        this.selectAll = false;
        this.getEmployeePayrollReport(this.TypeId);
        this.toaster.success(data.message);
      }
      else {
        this.toaster.error(data.message);
      }
      this.showLoader = false;
    }, (err) => {
      this.showLoader = false;
    }, () => {
      this.showLoader = false;
    });
  }
}