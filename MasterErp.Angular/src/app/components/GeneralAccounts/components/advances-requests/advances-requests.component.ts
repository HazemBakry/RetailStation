import { Component, OnInit } from '@angular/core';
import { PagedResponseDTO } from 'src/app/components/Shared/models/PagedResponseDTO';
import { ReceiptModel } from '../../models/GeneralAccounts/ReceiptModel';
import { PaymentService } from '../../services/payment.service';
import { ToastrService } from 'ngx-toastr';
import { EmployeeAdvanceModel } from 'src/app/components/HR/models/EmployeeAdvanceModel';
import { HrService } from 'src/app/components/HR/services/hr.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HRWorkflowStatus } from 'src/app/components/Shared/Enums/FinanceWorkflowStatus';
import { FilterItem } from 'src/app/components/Shared/models/FilterModel';

@Component({
  selector: 'app-advances-requests',
  templateUrl: './advances-requests.component.html',
  styleUrls: ['./advances-requests.component.css']
})
export class AdvancesRequestsComponent implements OnInit {
  TitleList = ['الحسابات العامة', 'طلبات السلف'];
  showLoader: boolean;
  public wfStatus = HRWorkflowStatus;
  filterList: FilterItem[] = [];
  mainFilter: FilterItem = {
    categoryName: 'AdvanceStatus',
    itemFlag: HRWorkflowStatus.Approved.toString()
  }
  pagedResponseModel: PagedResponseDTO<EmployeeAdvanceModel[]> = {
    results: [],
    filterList: [],
    pageSize: 10,
    currentPage: 1,
    searchText: ''
  };
  showAddLoader: boolean = false;
  selectedAdvanceId: number;

  constructor(private modalService: NgbModal, private hrService: HrService,
    private toaster: ToastrService) { }

  ngOnInit(): void {
    this.pagedResponseModel.filterList.push(this.mainFilter)
    this.getAdvancesRequestsSummary();
  }

  getAdvancesRequestsSummary() {
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

  pageChanged(obj: any) {
    this.pagedResponseModel.currentPage = obj.page;
    this.getAdvancesRequestsSummary();
  }

  filterChecked(filterItems: FilterItem[]) {
    this.pagedResponseModel.filterList = filterItems;
    this.pagedResponseModel.filterList.push(this.mainFilter);
    this.getAdvancesRequestsSummary();
  }


  openDeleteModal(content: any, employeeAdvanceId: number) {
    this.selectedAdvanceId = employeeAdvanceId;
    this.modalService.open(content, { centered: true, size: 'md' });
  }

  deleteEmployeeAdvance() {
    this.showAddLoader = true;
    this.hrService.DeleteEmployeeAdvance(this.selectedAdvanceId).subscribe(data => {

      if (data?.isSuccess) {
        this.modalService?.dismissAll();
        this.getAdvancesRequestsSummary();
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
