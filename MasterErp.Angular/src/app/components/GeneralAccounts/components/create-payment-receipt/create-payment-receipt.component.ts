import { Component, OnInit } from '@angular/core';
import { SharedService } from 'src/app/components/Shared/services/shared.service';
import { PaymentReceipt, ReceiptLedger } from '../../models/GeneralAccounts/PaymentReceipt';
import { PaymentService } from '../../services/payment.service';
import { CreateModifyReturnsModel } from 'src/app/components/Shared/models/CreateModifyReturnsModel';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-create-payment-receipt',
  templateUrl: './create-payment-receipt.component.html',
  styleUrls: ['./create-payment-receipt.component.css']
})
export class CreatePaymentReceiptComponent implements OnInit {
  agencyTypeList: any[] = [];
  paymentTypeList: any[] = [];


  selectedAgencyType: number;
  agencyList: any[] = [];
  accountList: any[] = [];
  receiptLedgerList: any[] = [];

  paymentReceiptModel: PaymentReceipt = {} as PaymentReceipt
  constructor(private sharedService: SharedService,
    private paymentService: PaymentService,
    private toaster: ToastrService) { }

  ngOnInit(): void {
    this.agencyTypeList = this.paymentService.agencyTypeList;
    this.paymentTypeList = this.paymentService.paymentTypeList;
    this.loadReceiptLedgersData();
  }

  loadCustomersData() {
    this.sharedService.GetCustomersData().subscribe(data => {
      this.agencyList = data;
    })
  }


  loadSuppliersData() {
    this.sharedService.GetSuppliersSelector().subscribe(data => {
      this.agencyList = data;
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
    debugger;
    this.selectedAgencyType = accountType?.id;
    this.paymentReceiptModel.agencyTypeId = accountType?.id;
    switch (accountType?.id) {
      // case 1:
      //   this.loadCustomersData();
      //   break;
      case 2:
        this.loadSuppliersData();
        break;
      case 3:
        this.loadAccountsTreeData();
        break;

      default:
        break;
    }
  }

  GetSelectedAgency(account) {
    switch (this.selectedAgencyType) {
      case 2:
        //supplier
        this.paymentReceiptModel.agencyId = account.supplierID;
        break;
      case 3:
        //account
        this.paymentReceiptModel.agencyId = account.accountId;
        break;

      default:
        break;
    }
  }

  GetSelectedPaymentType(type) {

    this.paymentReceiptModel.paymentTypeId = type.id;
    this.loadAccountsByTypeData(type.id);
  }

  GetSelectedAccount(account) {
    this.paymentReceiptModel.accountId = account.accountId;
  }

  GetSelectedReceiptLedger(receiptLedger: ReceiptLedger) {
    this.paymentReceiptModel.receiptLedgerId = receiptLedger.receiptLedgerId;
  }

  SavePaymentReceipt() {
    if (!this.validatePaymentReceipt()) {
      return;
    }

    this.paymentService.SavePaymentReceipt(this.paymentReceiptModel).subscribe((data: CreateModifyReturnsModel) => {
      if (data?.status) {
        this.ClearAllFields();
        this.paymentReceiptModel.receiptNumber = data.id;
        this.toaster.success(data?.message);
      } else {
        this.toaster.error(data?.message);
      }
    });

  }

  validatePaymentReceipt(): boolean {
    debugger
    let model: PaymentReceipt = this.paymentReceiptModel;

    if (!model.benefitPerson ||
      !model.paymentTypeId ||
      !model.receiptLedgerId ||
      // !model.agencyTypeId ||
      // !model.agencyId ||
      // !model.accountId ||
      !model.releaseDate ||
      !model.moneyAmount) {
      this.toaster.warning('ييرج ملئ جميع الخانات');
      return false;
    }
    return true;

  }

  ClearAllFields() {
    this.paymentReceiptModel = {} as PaymentReceipt;
    this.selectedAgencyType = null;
  }

}
