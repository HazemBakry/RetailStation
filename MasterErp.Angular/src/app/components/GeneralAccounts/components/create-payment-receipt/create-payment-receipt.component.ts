import { Component, OnInit } from '@angular/core';
import { SharedService } from 'src/app/components/Shared/services/shared.service';
import { PaymentService } from '../../services/payment.service';
import { ToastrService } from 'ngx-toastr';
import { ActionsResponseModel } from 'src/app/components/Shared/models/ActionsResponseModel';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormService } from 'src/app/components/Shared/services/form.service';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { LookupService } from 'src/app/components/Shared/services/lookup.service';
import { FilterModel } from 'src/app/components/Shared/models/FilterModel';
import { ReceiptModel } from '../../models/GeneralAccounts/ReceiptModel';
import { FormDropdownModel } from 'src/app/components/Shared/components/drop-down-form-control/drop-down-form-control.component';
import { GeneralSelectorModel } from 'src/app/components/Shared/components/general-selector/general-selector.component';
import { FinanceWorkflowStatus } from 'src/app/components/Shared/Enums/FinanceWorkflowStatus';

@Component({
  selector: 'app-create-payment-receipt',
  templateUrl: './create-payment-receipt.component.html',
  styleUrls: ['./create-payment-receipt.component.css']
})
export class CreatePaymentReceiptComponent implements OnInit {
  TitleList = ['الحسابات العامة', 'سند صرف'];
  agencyTypeList: GeneralSelectorModel[] = [];
  paymentTypeList: GeneralSelectorModel[] = [];
  selectedAgencyType: number = 1;
  supplierList: GeneralSelectorModel[] = [];
  accountList: GeneralSelectorModel[] = [];
  fromAccounts: GeneralSelectorModel[] = [];
  receiptLedgerList: GeneralSelectorModel[] = [];
  receiptTypeList: GeneralSelectorModel[] = [];
  paymentOrdersList: GeneralSelectorModel[] = [];
  showLoader: boolean = false;
  showAddLoader: boolean = false;
  paymentReceiptModel: ReceiptModel = {} as ReceiptModel
  isFocused = false;
  isUpdate: any = false;
  paymentOrderId: any;
  paymentReceiptId: any;

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
    fromAccountId: ''
  };

  constructor(private sharedService: SharedService,
    private paymentService: PaymentService,
    private form: FormBuilder,
    private _FormService: FormService,
    private datePipe: DatePipe,
    private router: Router,
    private acRoute: ActivatedRoute,
    private lookupService: LookupService,
    private toaster: ToastrService) { }

  ngOnInit(): void {
    this.acRoute.queryParams.subscribe((params: any) => {
      if (params.PaymentReceiptId) {
        this.paymentReceiptId = params.PaymentReceiptId;
        this.paymentReceiptModel.receiptId = this.paymentReceiptId;
        this.getPaymentReceiptDetailsById();
      }

      else if (params.PaymentOrderId) {
        this.paymentOrderId = params.PaymentOrderId;
        this.getPaymentOrderDetailsById(this.paymentOrderId);
      }
    });
    this.initNewForm();
    this.loadSelectors();
  }

  loadSelectors() {
    this.sharedService.GetSuppliersSelector().subscribe(data => {
      this.supplierList = data;
    });

    this.sharedService.GetAccountsSelector(false).subscribe(data => {
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

    this.paymentService.GetPaymentOrdersSelector(true).subscribe((data: FormDropdownModel[]) => {
      this.paymentOrdersList = data;
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
      fromAccountId: [null],
      supplierId: [null],
    });
    this.formGroup.valueChanges.subscribe((data) => {
      this.formErrors = this._FormService.validateForm(this.formGroup, this.formErrors, true);
    });
    this.formGroup?.get('paymentTypeId')?.valueChanges.subscribe((paymentTypeId) => {
      if (paymentTypeId) {
        this.onChoosePaymentType(paymentTypeId);
      }
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
      fromAccountId: receiptModel.fromAccountId,
      supplierId: receiptModel.supplierId,
    });
  }

  getPaymentOrderDetailsById(paymentOrderId) {
    this.showLoader = true;
    this.paymentService.GetPaymentOrderDetailsById(paymentOrderId).subscribe((data: ReceiptModel) => {
      if (data && ![FinanceWorkflowStatus.Cancelled, FinanceWorkflowStatus.Paid].includes(data.workflowStatusId)) {
        this.paymentReceiptModel = data;
        this.fillEditForm(this.paymentReceiptModel)
      } else {
        this.paymentReceiptModel = null;
        this.toaster.error("لا يمكن انشاء سند صرف على أمر صرف تم دفعه أو ملغي");
      }
      this.showLoader = false;
    }, err => {
      this.showLoader = false;
    }, () => {
      this.showLoader = false;
    });
  }


  getReceiptDetailsById(receiptId: number) {

  }

  getPaymentReceiptDetailsById() {
    this.showLoader = true;
    this.paymentService.GetPaymentReceiptDetailsById(this.paymentReceiptId).subscribe((data: ReceiptModel) => {
      if (data && ![FinanceWorkflowStatus.Cancelled, FinanceWorkflowStatus.Paid].includes(data.workflowStatusId)) {
        this.paymentReceiptModel = data;
        this.initNewForm(this.paymentReceiptModel);
        // this.fillEditForm(this.receiptModel)
      } else {
        this.paymentReceiptId = null;
        this.toaster.error("لا يمكن تعديل سند صرف على فاتورة تم تم دفعه أو ملغي");
      }
      this.showLoader = false;
    }, err => {
      this.showLoader = false;
    }, () => {
      this.showLoader = false;
    });
  }

  onChoosePaymentType(payment: number) {
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

  savePaymentReceipt() {
    if (!this.validateForm()) {
      return;
    }
    this.paymentReceiptModel = this.formGroup.value;
    // if (!this.paymentReceiptModel.paymentReceiptId)
    //   this.paymentReceiptModel.paymentReceiptId = 0;


    if (this.paymentReceiptId)
      this.editPaymentReceipt();
    else
      this.addNewPaymentReceipt();
  }
  addNewPaymentReceipt() {


    this.paymentService.AddNewPaymentReceipt(this.paymentReceiptModel).subscribe((data: ActionsResponseModel) => {
      if (data?.isSuccess) {
        this.paymentReceiptModel.orderNumber = data.number;
        if (data.id) {
          this.paymentReceiptId = data.id;
          this.goToPage(this.paymentReceiptId);
        }
        this.formGroup.patchValue({ receiptNumber: data.number });
        // this.formGroup?.reset();
        // this.initNewForm();
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

  editPaymentReceipt() {
    this.showAddLoader = true;
    this.paymentService.EditPaymentReceipt(this.paymentReceiptId, this.paymentReceiptModel).subscribe((data: ActionsResponseModel) => {
      if (data?.isSuccess) {
        this.formGroup?.reset();
        this.initNewForm();
        this.toaster.success(data?.message);
        this.getPaymentReceiptDetailsById();
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
  goToPage(id: number) {
    if (id) {
      this.router.navigate([], {
        relativeTo: this.acRoute,
        queryParams: { PaymentReceiptId: id },
        // queryParamsHandling: 'merge'
      });
    }
  }
}
