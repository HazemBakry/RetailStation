import { Component, OnInit } from '@angular/core';
import { SharedService } from 'src/app/components/Shared/services/shared.service';
import { PaymentService } from '../../services/payment.service';
import { ToastrService } from 'ngx-toastr';
import { ActionsResponseModel } from 'src/app/components/Shared/models/ActionsResponseModel';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormService } from 'src/app/components/Shared/services/form.service';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { LookupService } from 'src/app/components/Shared/services/lookup.service';
import { FilterModel } from 'src/app/components/Shared/models/FilterModel';
import { ReceiptModel } from '../../models/GeneralAccounts/ReceiptModel';
import { FormDropdownModel } from 'src/app/components/Shared/components/drop-down-form-control/drop-down-form-control.component';

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
  fromAccounts: any[] = [];
  receiptLedgerList: any[] = [];
  receiptTypeList: any[] = [];
  paymentOrdersList: FormDropdownModel[] = [];
  paymentReceiptModel: ReceiptModel = {} as ReceiptModel
  isFocused = false;
  isUpdate: any = false;
  paymentOrderId: any;
  FilterModel: FilterModel = {
    currentPage: 1,
    pageSize: 25
  };
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
    receiptTypeId: '',
    paymentOrderId: '',
  };

  constructor(private sharedService: SharedService,
    private paymentService: PaymentService,
    private form: FormBuilder,
    private _FormService: FormService,
    private datePipe: DatePipe,
    private acRoute: ActivatedRoute,
    private lookupService: LookupService,
    private toaster: ToastrService) { }

  ngOnInit(): void {
    this.acRoute.queryParams.subscribe((params: any) => {
      if (params.receiptId) {
        this.paymentReceiptModel.receiptId = params.receiptId;
        this.getReceiptDetailsById(params.receiptId);
      }

      else if (params.paymentOrderId) {
        this.paymentOrderId = params.paymentOrderId;
        this.getPaymentOrderDetails(params.paymentOrderId);
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

    this.lookupService.GetReceiptTypes('Payment').subscribe(data => {
      this.receiptTypeList = data;
    });

    this.lookupService.GetPaymentTypes().subscribe(data => {
      this.paymentTypeList = data;
    });

    this.paymentService.GetPaymentOrdersSelector().subscribe((data: FormDropdownModel[]) => {
      this.paymentOrdersList = data;
    });


    this.agencyTypeList = this.paymentService.agencyTypeList.filter(x => x.value != 3);

    //this.paymentTypeList = this.paymentService.paymentTypeList;
  }

  initNewForm(receiptModel: ReceiptModel = null) {
    this.isUpdate = false;
    this.buildForm();
    // if (receiptModel)
    //   this.fillEditForm(receiptModel);
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
      receiptTypeId: [null, [Validators.required]],
      paymentOrderId: [null],
      fromAccountId: [null]
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
      paymentReceiptId: receiptModel.receiptId,
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
      receiptTypeId: receiptModel.receiptTypeId,
      paymentOrderId: receiptModel.paymentOrderId,
      fromAccountId: receiptModel.fromAccountId
    });
  }

  getPaymentOrderDetails(orderId: number) {
    this.paymentService.GetPaymentOrderDetails(orderId).subscribe(data => {
      this.paymentReceiptModel.contactName = data?.contactName;
      this.paymentReceiptModel.description = data?.description;
      this.paymentReceiptModel.agencyTypeId = data?.agencyTypeId;
      this.paymentReceiptModel.paymentOrderId = data?.paymentOrderId;
      this.paymentReceiptModel.accountId = data?.accountId;
      this.paymentReceiptModel.currencyId = data?.currencyId;
      this.paymentReceiptModel.paymentTypeId = data?.paymentTypeId;
      this.paymentReceiptModel.moneyAmount = data?.moneyAmount;
      this.paymentReceiptModel.fromAccountId = data?.fromAccountId;

      if (data.paymentTypeId) {
        this.onChoosePayment(data.paymentTypeId);
      }
      this.fillEditForm(this.paymentReceiptModel);

    });
  }

  getReceiptDetailsById(receiptId: number) {

  }

  onChoosePayment(payment: number) {
    if (payment == 1) {
      this.sharedService.GetAccountsByTypeId(4).subscribe(data => {
        this.fromAccounts = data;
      });
    }
    else {
      this.sharedService.GetAccountsByTypeId(3).subscribe(data => {
        this.fromAccounts = data;
      });
    }
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

  SavePaymentReceipt() {
    if (!this.validateForm()) {
      return;
    }

    this.paymentReceiptModel = this.formGroup.value;
    if (!this.validatePaymentReceipt()) {
      return;
    }
    if (!this.paymentReceiptModel.receiptId)
      this.paymentReceiptModel.receiptId = 0;

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
    let model: ReceiptModel = this.paymentReceiptModel;

    if (!model.contactName ||
      !model.paymentTypeId ||
      !model.receiptTypeId ||
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
    this.paymentReceiptModel = {} as ReceiptModel;
    this.selectedAgencyType = null;
  }

}
