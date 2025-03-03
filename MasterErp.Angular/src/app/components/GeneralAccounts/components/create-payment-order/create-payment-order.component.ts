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

@Component({
  selector: 'app-create-payment-order',
  templateUrl: './create-payment-order.component.html',
  styleUrls: ['./create-payment-order.component.css']
})
export class CreatePaymentOrderComponent implements OnInit {
  TitleList = ['الحسابات العامة', 'أمر صرف جديد'];
  agencyTypeList: any[] = [];
  paymentTypeList: any[] = [];
  selectedAgencyType: number = 1;
  supplierList: any[] = [];
  accountList: any[] = [];
  fromAccounts: any[] = [];
  receiptModel: ReceiptModel = {} as ReceiptModel
  isUpdate: any = false;
  formData: FormData = new FormData();
  formGroup: FormGroup;

  formErrors = {
    paymentOrdeId: '',
    orderNumber: '',
    releaseDate: '',
    paymentTypeId: '',
    agencyTypeId: '',
    fromAccountId: '',
    accountId: '',
    description: '',
    contactName: '',
    currencyId: '',
    moneyAmount: ''
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
      if (params.orderId) {
        this.receiptModel = params.orderId;
        this.getOrderDetailsById(params.orderId);
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

    this.lookupService.GetPaymentTypes().subscribe(data => {
      this.paymentTypeList = data;
    });

    this.agencyTypeList = this.paymentService.agencyTypeList.filter(x => x.value != 3);
    //this.paymentTypeList = this.paymentService.paymentTypeList;
  }

  initNewForm(receiptModel: ReceiptModel = null) {
    this.isUpdate = false;
    this.buildForm();
    if (receiptModel)
      this.fillEditForm(receiptModel);
  }

  buildForm() {
    this.formGroup = this.form.group({
      paymentOrderId: [null],
      orderNumber: [null],
      releaseDate: [null, [Validators.required]],
      agencyTypeId: [null, [Validators.required]],
      paymentTypeId: [null, [Validators.required]],
      fromAccountId: [null],
      accountId: [null],
      description: [null],
      contactName: [null],
      currencyId: [null],
      moneyAmount: [null, [Validators.required]]
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
      paymentOrderId: receiptModel.paymentOrderId,
      orderNumber: receiptModel.receiptNumber,
      releaseDate: this.datePipe.transform(receiptModel.releaseDate, 'yyyy-MM-dd'),
      fromAccountId: receiptModel.fromAccountId,
      agencyTypeId: receiptModel.agencyTypeId,
      paymentTypeId: receiptModel.paymentTypeId,
      accountId: receiptModel.accountId,
      Description: receiptModel.description,
      contactName: receiptModel.contactName,
      currencyId: receiptModel.currencyId,
      moneyAmount: receiptModel.moneyAmount
    });
  }

  getOrderDetailsById(receiptId: number) {

  }

  onChoosePayment(payment: number) {
    //this.inputDropdownValue = payment;

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
    this.receiptModel.agencyTypeId = accountType;
  }

  SavePaymentOrder() {
    if (!this.validateForm()) {
      return;
    }

    this.receiptModel = this.formGroup.value;
    if (!this.validatePaymentReceipt()) {
      return;
    }
    if (!this.receiptModel.paymentOrderId)
      this.receiptModel.paymentOrderId = 0;

    this.paymentService.SavePaymentOrder(this.receiptModel).subscribe((data: ActionsResponseModel) => {
      if (data?.status) {
        this.ClearAllFields();
        this.receiptModel.receiptNumber = data.number;
        this.toaster.success(data?.message);
      } else {
        this.toaster.error(data?.message);
      }
    });
  }

  validatePaymentReceipt(): boolean {
    let model: ReceiptModel = this.receiptModel;

    if (!model.contactName ||
      // !model.agencyTypeId ||
      // !model.agencyId ||
      !model.fromAccountId ||
      !model.releaseDate ||
      !model.moneyAmount) {
      this.toaster.warning(' يرجى ملئ الخانات الفارغة');
      return false;
    }
    return true;

  }

  ClearAllFields() {
    this.receiptModel = {} as ReceiptModel;
    this.selectedAgencyType = 1;
  }

}
