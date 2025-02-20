import { Component, OnInit } from '@angular/core';
import { SharedService } from 'src/app/components/Shared/services/shared.service';
import { PaymentReceipt, ReceiptLedger } from '../../models/GeneralAccounts/PaymentReceipt';
import { PaymentService } from '../../services/payment.service';
import { ToastrService } from 'ngx-toastr';
import { ActionsResponseModel } from 'src/app/components/Shared/models/ActionsResponseModel';

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
  paymentList: string[] = [
    'مشروع البنك',
    'نقدي',
    'شيك',
    'بطاقة إئتمان',
    'تحويل على الهواء',
  ];

  constructor(private sharedService: SharedService,
    private paymentService: PaymentService,
    private toaster: ToastrService) { }

  ngOnInit(): void {
    this.agencyTypeList = this.paymentService.agencyTypeList;
    this.paymentTypeList = this.paymentService.paymentTypeList;
    this.loadReceiptLedgersData();
  }

  onChoosePayment(payment: string) {
    this.inputDropdownValue = payment;
  }

  loadCustomersData() {
    this.sharedService.GetCustomersData().subscribe(data => {
      this.supplierList = data;
    })
  }


  loadSuppliersData() {
    this.sharedService.GetSuppliersSelector().subscribe(data => {
      this.supplierList = data;
    })
  }

  loadAccountsTreeData() {
    this.sharedService.GetAccountsSelector().subscribe(data => {
      this.accountList = data;

    })
  }

  loadAccountsByTypeData(typeId: number) {
    this.sharedService.GetAccountsByTypeId(typeId).subscribe(data => {
      this.accountList = data;

    })
  }

  loadReceiptLedgersData() {
    this.sharedService.GetReceiptLedgersData().subscribe(data => {
      this.receiptLedgerList = data;
    })
  }

  GetSelectedAgencyType(accountType) {
    this.selectedAgencyType = accountType?.id;
    this.paymentReceiptModel.agencyTypeId = accountType?.id;
    switch (accountType?.id) {
      // case 1:
      //   this.loadCustomersData();
      //   break;
      case 1:
        this.loadAccountsTreeData();
        break;
      case 2:
        this.loadSuppliersData();
        break;

      default:
        break;
    }
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

  GetSelectedPaymentType(type) {
    this.paymentReceiptModel.paymentTypeId = type.id;
    //this.loadAccountsByTypeData(type.id);
  }

  GetSelectedAccount(account) {
    this.paymentReceiptModel.accountId = account.id;
  }

  GetSelectedReceiptLedger(receiptLedger: ReceiptLedger) {
    this.paymentReceiptModel.receiptLedgerId = receiptLedger.receiptLedgerId;
  }

  SavePaymentReceipt() {
    if (!this.validatePaymentReceipt()) {
      return;
    }
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
