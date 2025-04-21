import { Component, OnInit } from '@angular/core';
import { PagedResponseDTO } from 'src/app/components/Shared/models/PagedResponseDTO';
import { ToastrService } from 'ngx-toastr';
import { GeneralAccountService } from '../../services/general-account.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SharedService } from 'src/app/components/Shared/services/shared.service';
import { FinancialPeriodModel } from '../../models/FinancialPeriodModel';
import { ActionsResponseModel } from 'src/app/components/Shared/models/ActionsResponseModel';
import { PaymentService } from '../../services/payment.service';
import { DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormService } from 'src/app/components/Shared/services/form.service';


@Component({
  selector: 'app-financial-periods',
  templateUrl: './financial-periods.component.html',
  styleUrls: ['./financial-periods.component.css']
})

export class FinancialPeriodsComponent implements OnInit {
  TitleList = ['الحسابات العامة', 'الفترات المالية'];

  showLoader: boolean = false;
  showAddLoader: boolean = false;
  pagedResponse: PagedResponseDTO<any[]> = {
    currentPage: 1,
    pageSize: 25,
    results: [],
    filterList: [],
    searchText: ''
  }
  financialPeriodModel: FinancialPeriodModel =
    {} as FinancialPeriodModel;

  constructor(private GeneralAccountsService: GeneralAccountService, private toaster: ToastrService,
    private sharedService: SharedService,
    private modalService: NgbModal,
    private paymentService: PaymentService,
    private form: FormBuilder,
    private _FormService: FormService,
    private datePipe: DatePipe,
  ) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.showLoader = true;
    this.GeneralAccountsService.GetFinancialPeriodsData(this.pagedResponse).subscribe((data: any) => {
      this.pagedResponse.results = data.results;
      this.pagedResponse.totalCount = data.totalCount;
      this.pagedResponse.currentPage = data.currentPage;
      this.pagedResponse.pageSize = data.pageSize;
      this.pagedResponse.totalPages = data.totalPages;
      // this.TotalCount = data && data.length > 0 && (data[0].matchCount != null || data[0].matchCount != undefined) ? data[0].matchCount : 0;
      this.showLoader = false;
    }, (err) => {
      this.showLoader = false;
    }, () => {
      this.showLoader = false;
    })
  }



  pageChanged(obj: any) {
    this.pagedResponse.currentPage = obj.page;
    this.loadData();
  }



  ////////////////////////////  Actions /////////////////////////////


  isUpdate: boolean = false;
  public formGroup: FormGroup;
  public formErrors = {
    financialPeriodId: '',
    code: '',
    nameAR: '',
    nameEN: '',
    isActive: '',
    isLocked: '',
    startDate: '',
    endDate: '',
    notes: '',

  };
  selectedFinancialPeriodId: number;
  openAddModal(content: any, financialPeriodModel: FinancialPeriodModel = null) {
    this.loadSelectors();
    this.isUpdate = false;
    this.buildForm();
    if (financialPeriodModel)
      this.fillEditForm(financialPeriodModel);

    this.modalService.open(content, { centered: true, size: 'lg', fullscreen: 'lg' });
  }
  loadSelectors() {

  }
  buildForm() {
    this.formGroup = this.form.group({
      financialPeriodId: [null],
      code: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      nameAR: [null, [Validators.required]],
      nameEN: [null, [Validators.required]],
      startDate: [null, [Validators.required]],
      endDate: [null, [Validators.required]],
      isActive: [true, [Validators.required]],
      isLocked: [false, [Validators.required]],
      notes: [null],

    });
    this.formGroup.valueChanges.subscribe((data) => {
      this.formErrors = this._FormService.validateForm(this.formGroup, this.formErrors, true);

    });

  }

  saveRecord() {
    if (!this.validateForm()) {
      return;
    }
    this.financialPeriodModel = this.formGroup.value;
    if (this.financialPeriodModel?.financialPeriodId)
      this.editNewFinancialPeriod();
    else
      this.addNewFinancialPeriod();
  }

  addNewFinancialPeriod() {

    this.showAddLoader = true;
    this.GeneralAccountsService
      .CreateNewFinancialPeriod(this.financialPeriodModel).subscribe(data => {
        if (data?.isSuccess) {
          this.formGroup?.reset();
          this.modalService?.dismissAll();
          this.loadData();
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

  editNewFinancialPeriod() {


    this.showAddLoader = true;
    this.GeneralAccountsService
      .EditFinancialPeriod(this.financialPeriodModel.financialPeriodId, this.financialPeriodModel).subscribe(data => {

        if (data?.isSuccess) {
          // this.formGroup?.reset();
          this.isUpdate = false;
          this.modalService?.dismissAll();
          this.formGroup?.reset();
          this.toaster.success(data?.message);

          this.loadData();
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

  validateForm(): boolean {
    this._FormService.markFormGroupTouched(this.formGroup);
    if (this.formGroup.valid) {
      return true;
    } else {
      this.formErrors = this._FormService.validateForm(this.formGroup, this.formErrors, false)
      return false;
    }
  }

  fillEditForm(financialPeriodModel: FinancialPeriodModel) {
    this.isUpdate = true;

    this.formGroup.patchValue({
      financialPeriodId: financialPeriodModel.financialPeriodId,
      code: financialPeriodModel.code,
      nameAR: financialPeriodModel.nameAR,
      nameEN: financialPeriodModel.nameAR,
      isActive: financialPeriodModel.isActive,
      isLocked: financialPeriodModel.isLocked,
      notes: financialPeriodModel.notes,
      startDate: this.datePipe.transform(financialPeriodModel.startDate, 'yyyy-MM-dd'),
      endDate: this.datePipe.transform(financialPeriodModel.endDate, 'yyyy-MM-dd'),

    });
  }
  openDeleteModal(content: any, id: number) {
    this.selectedFinancialPeriodId = id;
    this.modalService.open(content, { centered: true, size: 'sm' });
  }

  deleteFinancialPeriod() {
    this.showAddLoader = true;
    this.GeneralAccountsService.DeleteFinancialPeriod(this.selectedFinancialPeriodId).subscribe(data => {

      if (data?.isSuccess) {
        this.modalService?.dismissAll();
        this.loadData();
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
