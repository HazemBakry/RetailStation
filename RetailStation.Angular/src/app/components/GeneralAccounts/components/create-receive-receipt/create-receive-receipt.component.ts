import { Component, OnInit } from '@angular/core';
import { SharedService } from 'src/app/components/Shared/services/shared.service';
import { PaymentService } from '../../services/payment.service';
import { ToastrService } from 'ngx-toastr';
import { ActionsResponseModel } from 'src/app/components/Shared/models/ActionsResponseModel';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormService } from 'src/app/components/Shared/services/form.service';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ReceiptModel } from '../../models/GeneralAccounts/ReceiptModel';
import { LookupService } from 'src/app/components/Shared/services/lookup.service';
import { FinanceWorkflowStatus } from 'src/app/components/Shared/Enums/FinanceWorkflowStatus';

@Component({
  selector: 'app-create-receive-receipt',
  templateUrl: './create-receive-receipt.component.html',
  styleUrls: ['./create-receive-receipt.component.css']
})
export class CreateReceiveReceiptComponent implements OnInit {
  TitleList = ['الحسابات العامة', 'سند قبض جديد'];
  showLoader: boolean = false;
  showAddLoader: boolean = false;

  agencyTypeList: any[] = [];
  paymentTypeList: any[] = [];
  selectedAgencyType: number = 1;
  customerList: any[] = [];
  accountList: any[] = [];
  receiptLedgerList: any[] = [];
  receiptTypeList: any[] = [];
  receiveReceiptModel: ReceiptModel = {} as ReceiptModel
  receiveReceiptId: number;
  inputDropdownValue = '';
  isFocused = false;
  isUpdate: any = false;
  formData: FormData = new FormData();
  formGroup: FormGroup;
  formErrors = {
    receiveReceiptId: '',
    receiptNumber: '',
    docNumber: '',
    releaseDate: '',
    agencyTypeId: '',
    accountId: '',
    customerId: '',
    description: '',
    bankAccountId: '',
    contactName: '',
    currencyId: '',
    moneyAmount: '',
    paymentTypeId: '',
    receiptLedgerId: '',
    receiptTypeId: '',
    safeId: '',
  };

  constructor(private sharedService: SharedService,
    private paymentService: PaymentService,
    private form: FormBuilder,
    private _FormService: FormService,
    private datePipe: DatePipe,
    private acRoute: ActivatedRoute,
    private router: Router,
    private lookupService: LookupService,
    private toaster: ToastrService) { }

  ngOnInit(): void {
    this.acRoute.queryParams.subscribe((params: any) => {
      if (params.receiptId) {
        this.receiveReceiptModel = params.receiptId;
        this.getReceiptDetailsById(params.receiptId);
      }
    });
    this.initNewForm();
    this.loadSelectors();
  }

  loadSelectors() {
    this.sharedService.GetCustomersSelector().subscribe(data => {
      this.customerList = data;
    });

    this.sharedService.GetAccountsSelector(false).subscribe(data => {
      this.accountList = data;
    });

    this.lookupService.GetPaymentTypes().subscribe(data => {
      this.paymentTypeList = data;
    });


    this.agencyTypeList = this.paymentService.agencyTypeList.filter(x => x.value == 1 || x.value == 3);
    //this.paymentTypeList = this.paymentService.paymentTypeList;
  }

  getReceiptLedgerByPaymentTypeId(paymentTypeId: number) {
    this.sharedService.GetReceiptLedgersSelector(paymentTypeId).subscribe(data => {
      this.receiptLedgerList = data;
    });

    this.lookupService.GetReceiptTypes('Receive', paymentTypeId).subscribe(data => {
      this.receiptTypeList = data;
    });
  }

  initNewForm(receiptModel: ReceiptModel = null) {
    this.isUpdate = false;
    this.buildForm();
    if (receiptModel)
      this.fillEditForm(receiptModel);
  }

  buildForm() {
    this.formGroup = this.form.group({
      receiveReceiptId: [null],
      receiptNumber: [null],
      docNumber: [null],
      releaseDate: [null, [Validators.required]],
      agencyTypeId: [null, [Validators.required]],
      accountId: [null],
      customerId: [null],
      description: [null],
      bankAccountId: [null],
      contactName: [null],
      currencyId: [null],
      moneyAmount: [null, [Validators.required]],
      paymentTypeId: [null, [Validators.required]],
      receiptLedgerId: [null, [Validators.required]],
      receiptTypeId: [null, [Validators.required]],
      safeId: [null]
    });
    this.formGroup.valueChanges.subscribe((data) => {
      this.formErrors = this._FormService.validateForm(this.formGroup, this.formErrors, true);
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

  fillEditForm(receiptModel: ReceiptModel) {
    this.isUpdate = true;
    this.formGroup.patchValue({
      receiveReceiptId: receiptModel.receiptId,
      receiptNumber: receiptModel.receiptNumber,
      docNumber: receiptModel.docNumber,
      releaseDate: this.datePipe.transform(receiptModel.releaseDate, 'yyyy-MM-dd'),
      agencyTypeId: receiptModel.agencyTypeId,
      accountId: receiptModel.accountId,
      customerId: receiptModel.customerId,
      Description: receiptModel.description,
      bankAccountId: receiptModel.bankAccountId,
      contactName: receiptModel.contactName,
      currencyId: receiptModel.currencyId,
      moneyAmount: receiptModel.moneyAmount,
      paymentTypeId: receiptModel.paymentTypeId,
      receiptLedgerId: receiptModel.receiptLedgerId,
      receiptTypeId: receiptModel.receiptTypeId,
      //safeId: receiptModel.safeId,
    });
  }

  getReceiptDetailsById(receiptId: number) {
    this.showLoader = true;
    this.paymentService.GetReceiveReceiptDetailsById(this.receiveReceiptId).subscribe((data: ReceiptModel) => {
      if (data && ![FinanceWorkflowStatus.Cancelled, FinanceWorkflowStatus.Paid].includes(data.workflowStatusId)) {
        this.receiveReceiptModel = data;
        this.initNewForm(this.receiveReceiptModel);
        // this.fillEditForm(this.receiptModel)
      } else {
        this.receiveReceiptId = null;
        this.toaster.error("لا يمكن تعديل سند صرف على فاتورة تم تم دفعه أو ملغي");
      }
      this.showLoader = false;
    }, err => {
      this.showLoader = false;
    }, () => {
      this.showLoader = false;
    });
  }

  onChoosePayment(payment: string) {
    this.inputDropdownValue = payment;
  }

  getSelectedAgencyType(accountType) {
    this.selectedAgencyType = accountType;
    this.receiveReceiptModel.agencyTypeId = accountType;
    // switch (accountType?.id) {
    //   // case 1:
    //   //   this.loadCustomersData();
    //   //   break;
    //   case 1:
    //     this.loadAccountsTreeData();
    //     break;
    //   case 2:
    //     this.loadCustomersData();
    //     break;

    //   default:
    //     break;
    // }
  }

  saveNewReceiveReceipt() {
    if (!this.validateForm()) {
      return;
    }

    this.receiveReceiptModel = this.formGroup.value;
    if (!this.validateReceiveReceipt()) {
      return;
    }
    if (!this.receiveReceiptModel.receiptId)
      this.receiveReceiptModel.receiptId = 0;

    this.paymentService.SaveNewReceiveReceipt(this.receiveReceiptModel).subscribe((data: ActionsResponseModel) => {
      if (data?.status) {
        this.ClearAllFields();
        this.receiveReceiptModel.receiptNumber = data.number;
        this.toaster.success(data?.message);
        this.router.navigateByUrl('/general-accounts/receive-receipts')
      } else {
        this.toaster.error(data?.message);
      }
    });
  }

  validateReceiveReceipt(): boolean {
    let model: ReceiptModel = this.receiveReceiptModel;

    if (!model.contactName ||
      !model.paymentTypeId ||
      !model.receiptLedgerId ||
      // !model.agencyTypeId ||
      // !model.agencyId ||
      // !model.accountId ||
      // !model.customerId || 
      !model.releaseDate ||
      !model.moneyAmount) {
      this.toaster.warning(' يرجى ملئ الخانات الفارغة');
      return false;
    }
    return true;

  }

  ClearAllFields() {
    this.receiveReceiptModel = {} as ReceiptModel;
    this.selectedAgencyType = null;
  }

}
