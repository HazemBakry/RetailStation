import { Component, OnInit } from '@angular/core';
import { PagedResponseDTO } from 'src/app/components/Shared/models/PagedResponseDTO';
import { ToastrService } from 'ngx-toastr';
import { GeneralAccountService } from '../../services/general-account.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SharedService } from 'src/app/components/Shared/services/shared.service';
import { ReceiptLedgerModel } from '../../models/ReceiptLedgerModel';
import { ActionsResponseModel } from 'src/app/components/Shared/models/ActionsResponseModel';
import { PaymentService } from '../../services/payment.service';
import { DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormService } from 'src/app/components/Shared/services/form.service';
import { GeneralSelectorModel } from 'src/app/components/Shared/components/general-selector/general-selector.component';
import { LookupService } from 'src/app/components/Shared/services/lookup.service';

@Component({
  selector: 'app-receipt-ledgers',
  templateUrl: './receipt-ledgers.component.html',
  styleUrls: ['./receipt-ledgers.component.css']
})
export class ReceiptLedgersComponent implements OnInit {



  TitleList = ['الحسابات العامة', 'دفاتر الايصال'];

  showLoader: boolean = false;
  showAddLoader: boolean = false;
  pagedResponse: PagedResponseDTO<ReceiptLedgerModel[]> = {
    currentPage: 1,
    pageSize: 10,
    results: [],
    filterList: [],
    searchText: ''
  }
  receiptLedgerModel: ReceiptLedgerModel =
    {} as ReceiptLedgerModel;

  constructor(private GeneralAccountsService: GeneralAccountService, private toaster: ToastrService,
    private sharedService: SharedService,
    private modalService: NgbModal,
    private paymentService: PaymentService,
    private lookupService: LookupService,
    private form: FormBuilder,
    private _FormService: FormService,
    private datePipe: DatePipe,
  ) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.showLoader = true;
    this.GeneralAccountsService.GetReceiptLedgersData(this.pagedResponse).subscribe((data: any) => {
      this.pagedResponse.results = data.results;
      this.pagedResponse.totalCount = data.totalCount;
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
    receiptLedgerId: '',
    code: '',
    nameAR: '',
    nameEN: '',
    isActive: '',
    isLocked: '',
    startReceiptNumber: '',
    financialPeriodId: '',
    receiptLedgerTypeId: '',
    paymentTypeId: '',
    notes: '',

  };
  paymentTypesSelectorData: GeneralSelectorModel[] = [];
  financialPeriodsSelectorData: GeneralSelectorModel[] = [];
  receiptLedgerTypesSelectorData: GeneralSelectorModel[] = [];
  selectedReceiptLedgerId: number;
  openAddModal(content: any, receiptLedgerModel: ReceiptLedgerModel = null) {
    this.loadSelectors();
    this.isUpdate = false;
    this.buildForm();
    if (receiptLedgerModel)
      this.fillEditForm(receiptLedgerModel);

    this.modalService.open(content, { centered: true, size: 'lg', fullscreen: 'lg' });
  }
  loadSelectors() {
    this.lookupService.GetLedgerTypes().subscribe(data => {
      this.receiptLedgerTypesSelectorData = data;
    });
    this.lookupService.GetPaymentTypes().subscribe(data => {
      this.paymentTypesSelectorData = data;
    });
    this.sharedService.GetFinancialPeriods().subscribe(data => {
      this.financialPeriodsSelectorData = data.map(x => {
        return { value: x.financialPeriodId, name: x.nameAR }
      });
    });
    // this.paymentTypesSelectorData=this.paymentService.paymentTypeList;
  }
  buildForm() {
    this.formGroup = this.form.group({
      receiptLedgerId: [null],
      code: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      nameAR: [null, [Validators.required]],
      nameEN: [null, [Validators.required]],
      startReceiptNumber: [null, [Validators.required]],
      financialPeriodId: [null, [Validators.required]],
      receiptLedgerTypeId: [null, [Validators.required]],
      paymentTypeId: [null, [Validators.required]],
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
    this.receiptLedgerModel = this.formGroup.value;
    if (this.receiptLedgerModel?.receiptLedgerId)
      this.editNewReceiptLedger();
    else
      this.addNewReceiptLedger();
  }

  addNewReceiptLedger() {

    this.showAddLoader = true;
    this.GeneralAccountsService
      .CreateNewReceiptLedger(this.receiptLedgerModel).subscribe(data => {
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

  editNewReceiptLedger() {


    this.showAddLoader = true;
    this.GeneralAccountsService
      .EditReceiptLedger(this.receiptLedgerModel.receiptLedgerId, this.receiptLedgerModel).subscribe(data => {

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

  fillEditForm(receiptLedgerModel: ReceiptLedgerModel) {
    this.isUpdate = true;

    this.formGroup.patchValue({
      receiptLedgerId: receiptLedgerModel.receiptLedgerId,
      code: receiptLedgerModel.code,
      nameAR: receiptLedgerModel.nameAR,
      nameEN: receiptLedgerModel.nameEN,
      isActive: receiptLedgerModel.isActive,
      isLocked: receiptLedgerModel.isLocked,
      notes: receiptLedgerModel.notes,
      startReceiptNumber: receiptLedgerModel.startReceiptNumber,
      financialPeriodId: receiptLedgerModel.financialPeriodId,
      receiptLedgerTypeId: receiptLedgerModel.receiptLedgerTypeId,
      paymentTypeId: receiptLedgerModel.paymentTypeId,
      // startDate: this.datePipe.transform(receiptLedgerModel.startDate, 'yyyy-MM-dd'),
      // endDate: this.datePipe.transform(receiptLedgerModel.endDate, 'yyyy-MM-dd'),

    });
  }
  openDeleteModal(content: any, id: number) {
    this.selectedReceiptLedgerId = id;
    this.modalService.open(content, { centered: true, size: 'sm' });
  }

  deleteReceiptLedger() {
    this.showAddLoader = true;
    this.GeneralAccountsService.DeleteReceiptLedger(this.selectedReceiptLedgerId).subscribe(data => {

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
