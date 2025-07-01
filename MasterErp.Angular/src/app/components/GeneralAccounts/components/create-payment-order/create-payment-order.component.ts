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
import { GeneralSelectorModel } from 'src/app/components/Shared/components/general-selector/general-selector.component';
import { PurchaseInvoiceModel } from 'src/app/components/Purchases/models/PurchaseInvoiceModel';
import { PurchaseService } from 'src/app/components/Purchases/services/purchase.service';
import { FinanceWorkflowStatus, HRWorkflowStatus } from 'src/app/components/Shared/Enums/FinanceWorkflowStatus';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HrService } from 'src/app/components/HR/services/hr.service';
import { EmployeeAdvanceModel } from 'src/app/components/HR/models/EmployeeAdvanceModel';

@Component({
  selector: 'app-create-payment-order',
  templateUrl: './create-payment-order.component.html',
  styleUrls: ['./create-payment-order.component.css']
})
export class CreatePaymentOrderComponent implements OnInit {
  TitleList = ['الحسابات العامة', 'أمر صرف جديد'];
  agencyTypeList: GeneralSelectorModel[] = [];
  paymentTypeList: GeneralSelectorModel[] = [];
  employeesSelectorData: GeneralSelectorModel[] = [];
  selectedAgencyType: number = 1;
  supplierList: GeneralSelectorModel[] = [];
  accountList: GeneralSelectorModel[] = [];
  fromAccounts: GeneralSelectorModel[] = [];
  receiptModel: ReceiptModel = {} as ReceiptModel
  paymentOrderId: number;
  showLoader: boolean = false;
  showAddLoader: boolean = false;
  isUpdate: any = false;
  formData: FormData = new FormData();
  formGroup: FormGroup;
  purchaseInvoiceId: number;
  employeeAdvanceId: number;
  purchaseInvoiceModel: PurchaseInvoiceModel = {} as PurchaseInvoiceModel;
  formErrors = {
    paymentOrderId: '',
    orderNumber: '',
    releaseDate: '',
    paymentTypeId: '',
    agencyTypeId: '',
    fromAccountId: '',
    accountId: '',
    description: '',
    contactName: '',
    currencyId: '',
    moneyAmount: '',
    supplierId: '',
    fromAccounts: '',
    employeeId: ''
  };

  constructor(private sharedService: SharedService,
    private router: Router, private modalService: NgbModal,
    private paymentService: PaymentService,
    private form: FormBuilder,
    private _FormService: FormService,
    private datePipe: DatePipe,
    private acRoute: ActivatedRoute,
    private lookupService: LookupService,
    private purchaseService: PurchaseService,
    private hrService: HrService,
    private toaster: ToastrService) { }

  ngOnInit(): void {
    this.initNewForm();
    this.loadSelectors();
    this.acRoute.queryParams.subscribe((params: any) => {
      if (params.PaymentOrderId) {
        this.paymentOrderId = params.PaymentOrderId;
        this.getPaymentOrderDetailsById();
      } else if (params.InvoiceId) {
        this.purchaseInvoiceId = params.InvoiceId;
        this.getPurchaseInvoiceDetailsById();
      }
      else if (params.EmployeeAdvanceId) {
        this.employeeAdvanceId = params.EmployeeAdvanceId;
        this.getAdvancesDetailsById();
      }
    });
  }

  loadSelectors() {
    this.sharedService.GetSuppliersSelector().subscribe(data => {
      this.supplierList = data;
    });

    this.sharedService.GetAccountsSelector(false).subscribe(data => {
      this.accountList = data;
    });

    this.lookupService.GetPaymentTypes().subscribe(data => {
      this.paymentTypeList = data;
    });
    this.hrService.GetActiveEmployeesSelector().subscribe(data => {
      this.employeesSelectorData = data;
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
      fromAccountId: [null, [Validators.required]],
      supplierId: [null],
      employeeId: [null],// for advance payment
      accountId: [null],
      description: [null],
      contactName: [null],
      currencyId: [null],
      employeeAdvanceId: [null],
      moneyAmount: [null, [Validators.required]]
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
      paymentOrderId: receiptModel.paymentOrderId,
      orderNumber: receiptModel.orderNumber,
      releaseDate: this.datePipe.transform(receiptModel.releaseDate, 'yyyy-MM-dd'),
      fromAccountId: receiptModel.fromAccountId,
      agencyTypeId: receiptModel.agencyTypeId,
      paymentTypeId: receiptModel.paymentTypeId,
      accountId: receiptModel.accountId,
      description: receiptModel.description,
      contactName: receiptModel.contactName,
      currencyId: receiptModel.currencyId,
      moneyAmount: receiptModel.moneyAmount,
      employeeId: receiptModel.employeeId
    });
  }



  getPaymentOrderDetailsById() {
    this.showLoader = true;
    this.paymentService.GetPaymentOrderDetailsById(this.paymentOrderId).subscribe((data: ReceiptModel) => {
      if (data) {
        if (data && ![FinanceWorkflowStatus.Cancelled, FinanceWorkflowStatus.Paid].includes(data.workflowStatusId)) {
          this.receiptModel = data;
          this.initNewForm(this.receiptModel);
        } else {
          this.receiptModel = null;
          this.toaster.error("لا يمكن تعديل أمر صرف تم دفعه أو ملغي");
        }
        // this.receiptModel = data;
        // this.initNewForm(this.receiptModel);
      }
      this.showLoader = false;
    }, err => {
      this.showLoader = false;
    }, () => {
      this.showLoader = false;
    });
  }
  getPurchaseInvoiceDetailsById() {
    this.showLoader = true;
    this.purchaseService.GetPurchaseInvoiceDetailsById(this.purchaseInvoiceId).subscribe((data: PurchaseInvoiceModel) => {
      if (data && ![FinanceWorkflowStatus.Cancelled, FinanceWorkflowStatus.Paid].includes(data.workflowStatusId)) {
        this.purchaseInvoiceModel = data;
        this.formGroup?.patchValue({
          moneyAmount: this.purchaseInvoiceModel.totalValue,
          agencyTypeId: 2,
          supplierId: this.purchaseInvoiceModel.supplierId,
        });
        this.formGroup?.get('moneyAmount')?.disable();
      } else {
        this.purchaseInvoiceId = null;
        this.toaster.error("لا يمكن انشاء أمر صرف على فاتورة تم دفعها أو ملغية");
      }
      this.showLoader = false;
    }, err => {
      this.showLoader = false;
    }, () => {
      this.showLoader = false;
    });
  }
  getAdvancesDetailsById() {
    this.showLoader = true;
    this.hrService.getAdvanceById(this.employeeAdvanceId).subscribe((data: EmployeeAdvanceModel) => {
      if (data && [HRWorkflowStatus.Approved].includes(data.workflowStatusId)) {
        this.formGroup?.patchValue({
          moneyAmount: data.advanceAmount,
          agencyTypeId: 4,
          employeeId: data.employeeId,
          contactName: data.employeeName,
          employeeAdvanceId: this.employeeAdvanceId
        });
        this.formGroup?.get('moneyAmount')?.disable();
        console.log("this.formGroup", this.formGroup);

      } else {
        this.employeeAdvanceId = null;
        this.toaster.error("لا يمكن انشاء أمر صرف على سلفة غير مقبولة");
      }
      this.showLoader = false;
    }, err => {
      this.showLoader = false;
    }, () => {
      this.showLoader = false;
    });
  }
  onChoosePaymentType(paymentTypeId: number) {
    if (paymentTypeId == 1) {
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
    debugger
    this.selectedAgencyType = accountType;
    this.receiptModel.agencyTypeId = accountType;
  }

  savePaymentOrder() {
    if (!this.validateForm()) {
      return;
    }
    // this.receiptModel = this.formGroup.value;
    this.receiptModel = this.formGroup.getRawValue();
    // if (!this.receiptModel.paymentOrderId)
    //   this.receiptModel.paymentOrderId = 0;


    if (this.paymentOrderId)
      this.editPaymentOrder();
    else
      this.addNewPaymentOrder();
  }
  addNewPaymentOrder() {


    this.paymentService.AddNewPaymentOrder(this.receiptModel).subscribe((data: ActionsResponseModel) => {
      if (data?.isSuccess) {

        this.initNewForm();
        this.toaster.success(data?.message);
        if (data.id) {
          this.receiptModel.orderNumber = data.number;
          this.paymentOrderId = data.id;
          this.goToPage(this.paymentOrderId);
        }
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

  editPaymentOrder() {
    this.showAddLoader = true;
    this.paymentService.EditPaymentOrder(this.paymentOrderId, this.receiptModel).subscribe((data: ActionsResponseModel) => {
      if (data?.isSuccess) {
        this.formGroup?.reset();
        this.initNewForm();
        this.toaster.success(data?.message);
        this.getPaymentOrderDetailsById();
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
  openSaveModal(content: any) {
    if (!this.validateForm()) {
      return;
    }
    this.modalService.open(content, { centered: true, size: 'md' });
  }
  goToPage(id: number) {
    if (id) {
      this.router.navigate([], {
        relativeTo: this.acRoute,
        queryParams: { PaymentOrderId: id },
        // queryParamsHandling: 'merge'
      });
    }
  }


}
