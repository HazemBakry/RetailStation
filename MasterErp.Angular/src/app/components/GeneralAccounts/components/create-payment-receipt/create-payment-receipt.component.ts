import { Component, OnInit } from '@angular/core';
import { SharedService } from 'src/app/components/Shared/services/shared.service';
import { PaymentReceipt, ReceiptLedger } from '../../models/GeneralAccounts/PaymentReceipt';
import { PaymentService } from '../../services/payment.service';
import { ToastrService } from 'ngx-toastr';
import { ActionsResponseModel } from 'src/app/components/Shared/models/ActionsResponseModel';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormService } from 'src/app/components/Shared/services/form.service';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-create-payment-receipt',
  templateUrl: './create-payment-receipt.component.html',
  styleUrls: ['./create-payment-receipt.component.css']
})
export class CreatePaymentReceiptComponent implements OnInit {
  TitleList = ['الحسابات العامة', 'سند صرف جديد'];
  agencyTypeList: any[] = [];
  paymentTypeList: any[] = [];
  selectedAgencyType: number = 1;
  supplierList: any[] = [];
  accountList: any[] = [];
  receiptLedgerList: any[] = [];
  paymentReceiptModel: PaymentReceipt = {} as PaymentReceipt
  inputDropdownValue = '';
  isFocused = false;
  isUpdate: any = false;
  formData: FormData = new FormData();
  formGroup: FormGroup;
  formErrors = {
    paymentReceiptId: '',
    receiptNumber: '',
    docNumber: '',
    releaseDate: '',
    agencyTypeId: '',
    accountId: '',
    description: '',
    bankAccountId: '',
    contactName: '',
    currencyId: '',
    moneyAmount: '',
    paymentTypeId: '',
    receiptLedgerId: '',
    safeId: '',
  };

  constructor(private sharedService: SharedService,
    private paymentService: PaymentService,
    private form: FormBuilder,
    private _FormService: FormService,
    private datePipe: DatePipe,
    private acRoute: ActivatedRoute,
    private toaster: ToastrService) { }

  ngOnInit(): void {
    this.acRoute.queryParams.subscribe((params: any) => {
      if (params.receiptId) {
        this.paymentReceiptModel = params.receiptId;
        this.getReceiptDetailsById(params.receiptId);
      }
    });
    this.initNewForm();
    this.loadSelectors();
  }

  loadSelectors() {
    this.sharedService.GetSuppliersSelector().subscribe(data => {
      this.supplierList = data;
    });

    this.sharedService.GetAccountsSelector().subscribe(data => {
      this.accountList = data;
    });

    this.sharedService.GetReceiptLedgersSelector().subscribe(data => {
      this.receiptLedgerList = data;
    });

    // this.generalService.GetSavedJournalTemplates().subscribe(data => {
    //   this.journalTemplates = data;
    //   this.journalTemplatesSelector = this.journalTemplates.map(x => {
    //     return {
    //       value: x.journalTemplateId,
    //       name: x.nameAR,

    //     }
    //   });
    // });

    this.agencyTypeList = this.paymentService.agencyTypeList;
    this.paymentTypeList = this.paymentService.paymentTypeList;
  }

  initNewForm(receiptModel: PaymentReceipt = null) {
    this.isUpdate = false;
    this.buildForm();
    if (receiptModel)
      this.fillEditForm(receiptModel);
  }

  buildForm() {
    this.formGroup = this.form.group({
      paymentReceiptId: [null],
      receiptNumber: [null],
      docNumber: [null],
      releaseDate: [null, [Validators.required]],
      agencyTypeId: [null, [Validators.required]],
      accountId: [null],
      description: [null],
      bankAccountId: [null],
      contactName: [null],
      currencyId: [null],
      moneyAmount: [null, [Validators.required]],
      paymentTypeId: [null, [Validators.required]],
      receiptLedgerId: [null, [Validators.required]],
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

  fillEditForm(receiptModel: PaymentReceipt) {
    this.isUpdate = true;
    this.formGroup.patchValue({
      paymentReceiptId: receiptModel.paymentReceiptId,
      receiptNumber: receiptModel.receiptNumber,
      docNumber: receiptModel.docNumber,
      releaseDate: this.datePipe.transform(receiptModel.releaseDate, 'yyyy-MM-dd'),
      agencyTypeId: receiptModel.agencyTypeId,
      accountId: receiptModel.accountId,
      Description: receiptModel.description,
      bankAccountId: receiptModel.bankAccountId,
      contactName: receiptModel.contactName,
      currencyId: receiptModel.currencyId,
      moneyAmount: receiptModel.moneyAmount,
      paymentTypeId: receiptModel.paymentTypeId,
      receiptLedgerId: receiptModel.receiptLedgerId,
      safeId: receiptModel.safeId,
    });
  }

  getReceiptDetailsById(receiptId: number) {

  }

  onChoosePayment(payment: string) {
    this.inputDropdownValue = payment;
  }

  getSelectedAgencyType(accountType) {
    this.selectedAgencyType = accountType;
    this.paymentReceiptModel.agencyTypeId = accountType;
    // switch (accountType?.id) {
    //   // case 1:
    //   //   this.loadCustomersData();
    //   //   break;
    //   case 1:
    //     this.loadAccountsTreeData();
    //     break;
    //   case 2:
    //     this.loadSuppliersData();
    //     break;

    //   default:
    //     break;
    // }
  }

  GetSelectedSupplier(account) {
    switch (this.selectedAgencyType) {
      case 0:
        //supplier
        this.paymentReceiptModel.supplierId = account.id;
        break;
      case 1:
        //account
        this.paymentReceiptModel.accountId = account.id;
        break;

      default:
        break;
    }
  }

  GetSelectedAccount(account) {
    this.paymentReceiptModel.accountId = account.id;
  }

  GetSelectedReceiptLedger(receiptLedger: ReceiptLedger) {
    this.paymentReceiptModel.receiptLedgerId = receiptLedger.receiptLedgerId;
  }


  SavePaymentReceipt() {
    if (!this.validateForm()) {
      return;
    }

    this.paymentReceiptModel = this.formGroup.value;
    if (!this.validatePaymentReceipt()) {
      return;
    }
    if (!this.paymentReceiptModel.paymentReceiptId)
      this.paymentReceiptModel.paymentReceiptId = 0;

    this.paymentService.SavePaymentReceipt(this.paymentReceiptModel).subscribe((data: ActionsResponseModel) => {
      if (data?.status) {
        this.ClearAllFields();
        this.paymentReceiptModel.receiptNumber = data.number;
        this.toaster.success(data?.message);
      } else {
        this.toaster.error(data?.message);
      }
    });
  }

  validatePaymentReceipt(): boolean {
    let model: PaymentReceipt = this.paymentReceiptModel;

    if (!model.contactName ||
      !model.paymentTypeId ||
      !model.receiptLedgerId ||
      // !model.agencyTypeId ||
      // !model.agencyId ||
      // !model.accountId ||
      !model.releaseDate ||
      !model.moneyAmount) {
      this.toaster.warning(' يرجى ملئ الخانات الفارغة');
      return false;
    }
    return true;

  }

  ClearAllFields() {
    this.paymentReceiptModel = {} as PaymentReceipt;
    this.selectedAgencyType = null;
  }

}
