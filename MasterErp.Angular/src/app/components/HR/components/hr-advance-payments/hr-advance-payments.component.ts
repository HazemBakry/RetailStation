import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { HrService } from '../../services/hr.service';
import { DatePipe } from '@angular/common';
import { FilterItem } from 'src/app/components/Shared/models/FilterModel';
import { ToastrService } from 'ngx-toastr';
import { FormDropdownModel } from 'src/app/components/Shared/components/drop-down-form-control/drop-down-form-control.component';
import { AdvancePaymentModel, EmployeeAdvanceModel } from '../../models/EmployeeAdvanceModel';
import { PagedResponseDTO } from 'src/app/components/Shared/models/PagedResponseDTO';
import { FormService } from 'src/app/components/Shared/services/form.service';
import { CustomValidators, RegexType } from 'src/app/components/Shared/services/custom-validators';
import { SharedService } from 'src/app/components/Shared/services/shared.service';


@Component({
  selector: 'app-hr-advance-payments',
  templateUrl: './hr-advance-payments.component.html',
  styleUrls: ['./hr-advance-payments.component.css']
})
export class HrAdvancePaymentsComponent implements OnInit {
  selectedAdvancePaymentId: number;
  showLoader: boolean = false;
  selectedEmployeeId: number = null;
  showAddLoader: boolean=false;
  employeeSelectorData: FormDropdownModel[] = [];

  employeeAdvanceResponse: PagedResponseDTO<AdvancePaymentModel[]> = {
    results: [],
    filterList: [],
    pageSize: 25,
    currentPage: 1,
    searchText: ''
  };


  constructor(private modalService: NgbModal, private hrService: HrService, private sharedService: SharedService,
     private toaster: ToastrService, private offcanvasService: NgbOffcanvas,) { }

  ngOnInit(): void {
    this.getActiveEmployeesSelector();
  }
  getAdvancePaymentsData() {
    if (!this.checkEmployee())
      return;

    this.showLoader = true;
    this.hrService.GetAdvancePaymentsData(this.selectedEmployeeId, this.employeeAdvanceResponse).subscribe(data => {
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
    if (!this.selectedEmployeeId) {
      this.toaster.warning('من فضلك اختر من قائمة الموظفين', 'تحذير');
      return false;
    }
    return true;
  }





  openDeleteModal(content: any, selectedAdvancePaymentId: number) {
    this.selectedAdvancePaymentId = selectedAdvancePaymentId;
    this.modalService.open(content, { centered: true, size: 'md' });
  }

  getActiveEmployeesSelector() {
    this.hrService.GetActiveEmployeesSelector().subscribe((data: FormDropdownModel[]) => {
      this.employeeSelectorData = data;
    });
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
  

}


