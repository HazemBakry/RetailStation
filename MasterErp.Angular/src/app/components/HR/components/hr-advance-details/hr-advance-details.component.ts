import { Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { NgbModal, NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { OrderModel } from 'src/app/components/Inventory/models/inventory';
import { PurchaseService } from 'src/app/components/Purchases/services/purchase.service';
import { FormDropdownModel } from 'src/app/components/Shared/components/drop-down-form-control/drop-down-form-control.component';
import { FilterItem } from 'src/app/components/Shared/models/FilterModel';
import { PagedResponseDTO } from 'src/app/components/Shared/models/PagedResponseDTO';
import { SharedService } from 'src/app/components/Shared/services/shared.service';
import { AdvancePaymentModel } from '../../models/EmployeeAdvanceModel';
import { HrService } from '../../services/hr.service';

@Component({
  selector: 'app-hr-advance-details',
  templateUrl: './hr-advance-details.component.html',
  styleUrls: ['./hr-advance-details.component.css']
})
export class HrAdvanceDetailsComponent implements OnInit {

  @Input() employeeAdvanceId: number;
  @Input() employeeId: number;
  selectedAdvancePaymentId: number;
  showLoader: boolean = false;
  showAddLoader: boolean = false;

  @ViewChild('detailsSidePanel', { static: true }) detailsSidePanel: TemplateRef<any>;

  constructor(private modalService: NgbModal, private hrService: HrService, private sharedService: SharedService,
    private toaster: ToastrService, private offcanvasService: NgbOffcanvas,) { }

  employeeAdvanceResponse: PagedResponseDTO<AdvancePaymentModel[]> = {
    results: [],
    filterList: [],
    pageSize: 10,
    currentPage: 1,
    searchText: ''
  };




  ngOnInit(): void {
  }
  openSidePanel(content: any) {
    this.employeeAdvanceResponse.results = [];
    this.employeeAdvanceResponse.currentPage = 1;
    this.getAdvancePaymentsData();
    this.offcanvasService.open(content, { panelClass: 'details-panel', position: 'end' });
  }
  getAdvancePaymentsData() {
    if (!this.checkEmployee())
      return;

    this.showLoader = true;
    this.hrService.GetAdvancePaymentsData(this.employeeId, this.employeeAdvanceResponse, this.employeeAdvanceId).subscribe(data => {
      this.employeeAdvanceResponse.results = data.results;
      this.employeeAdvanceResponse.totalCount = data.totalCount;

      this.showLoader = false;
    }, err => {
      this.showLoader = false;
    }, () => {
      this.showLoader = false;
    });
  }

  checkEmployee() {
    if (!this.employeeId) {
      this.toaster.warning('من فضلك اختر من قائمة الموظفين', 'تحذير');
      return false;
    }
    return true;
  }

  openDeleteModal(content: any, selectedAdvancePaymentId: number) {
    this.selectedAdvancePaymentId = selectedAdvancePaymentId;
    this.modalService.open(content, { centered: true, size: 'md' });
  }

  filterChecked(filterItems: FilterItem[]) {
    this.employeeAdvanceResponse.filterList = filterItems;
    this.getAdvancePaymentsData();
  }

  pageChanged(obj: any) {
    this.employeeAdvanceResponse.currentPage = obj.page;
    this.getAdvancePaymentsData();
  }


  deleteAdvancePayment() {
    this.showAddLoader = true;
    this.hrService.DeleteEmployeeAdvance(this.selectedAdvancePaymentId).subscribe(data => {

      if (data?.isSuccess) {
        this.modalService?.dismissAll();
        this.getAdvancePaymentsData();
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
  openPostponeModal(content: any, advancePaymentId: number) {
    this.selectedAdvancePaymentId = advancePaymentId;
    this.modalService.open(content, { centered: true, size: 'md' });
  }
  postponeAdvancesInstallment() {
    this.showAddLoader = true;
    this.hrService.PostponeAdvancesInstallment(this.employeeId, this.selectedAdvancePaymentId).subscribe(data => {

      if (data?.isSuccess) {
        this.modalService?.dismissAll();
        this.getAdvancePaymentsData();
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
