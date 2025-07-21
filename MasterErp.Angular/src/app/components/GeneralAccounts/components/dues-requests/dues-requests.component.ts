import { Component, OnInit } from '@angular/core';
import { PagedResponseDTO } from 'src/app/components/Shared/models/PagedResponseDTO';
import { ReceiptModel } from '../../models/GeneralAccounts/ReceiptModel';
import { PaymentService } from '../../services/payment.service';
import { ToastrService } from 'ngx-toastr';
import { HrService } from 'src/app/components/HR/services/hr.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HRWorkflowStatus } from 'src/app/components/Shared/Enums/FinanceWorkflowStatus';
import { FilterItem } from 'src/app/components/Shared/models/FilterModel';
import { EmployeeDueModel } from 'src/app/components/HR/models/EmployeeDueModel';

@Component({
  selector: 'app-dues-requests',
  templateUrl: './dues-requests.component.html',
  styleUrls: ['./dues-requests.component.css']
})
export class DuesRequestsComponent  implements OnInit {
  TitleList = ['الحسابات العامة', 'طلبات المستحقات'];
  showLoader: boolean;
  public wfStatus = HRWorkflowStatus;
  filterList: FilterItem[] = [];
  // mainFilter: FilterItem = {
  //   categoryName: 'DuesStatus',
  //   itemFlag: HRWorkflowStatus.Approved.toString()
  // }
  //mainFilter: FilterItem = { categoryName: 'FinalStatus', itemFlag: '0' }
    mainFilter: FilterItem = { categoryName: 'WorkflowStatusId', itemFlag: '4' }


  pagedResponseModel: PagedResponseDTO<EmployeeDueModel[]> = {
    results: [],
    filterList: [],
    pageSize: 10,
    currentPage: 1,
    searchText: ''
  };
  showAddLoader: boolean = false;
  selectedDuesId: number;

  constructor(private modalService: NgbModal, private hrService: HrService,
    private toaster: ToastrService) { }

  ngOnInit(): void {
    this.pagedResponseModel.filterList.push(this.mainFilter)
    this.getDuesRequestsSummary();
  }

  getDuesRequestsSummary() {
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

  pageChanged(obj: any) {
    this.pagedResponseModel.currentPage = obj.page;
    this.getDuesRequestsSummary();
  }

  filterChecked(filterItems: FilterItem[]) {
    this.pagedResponseModel.filterList = filterItems;
    this.pagedResponseModel.filterList.push(this.mainFilter);
    this.getDuesRequestsSummary();
  }


  openDeleteModal(content: any, employeeDueId: number) {
    this.selectedDuesId = employeeDueId;
    this.modalService.open(content, { centered: true, size: 'md' });
  }

  deleteEmployeeDues() {
    this.showAddLoader = true;
    this.hrService.DeleteEmployeeDues(this.selectedDuesId).subscribe(data => {

      if (data?.isSuccess) {
        this.modalService?.dismissAll();
        this.getDuesRequestsSummary();
        this.toaster.success(data?.message);
      }
      else {
        this.toaster.error(data?.message);
      }
      this.showAddLoader = false;
    }, err => {
      this.showAddLoader = false;
    }, () => {
      this.showAddLoader = false;
    });
  }
}
