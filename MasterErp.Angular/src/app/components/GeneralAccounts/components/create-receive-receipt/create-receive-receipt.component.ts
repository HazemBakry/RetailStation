import { Component, OnInit } from '@angular/core';
import { SharedService } from 'src/app/components/Shared/services/shared.service';
import {  PaymentReceipt, ReceiptLedger } from '../../models/GeneralAccounts/PaymentReceipt';
import { PaymentService } from '../../services/payment.service';
import { ActionsResponseModel } from 'src/app/components/Shared/models/ActionsResponseModel';
import { ToastrService } from 'ngx-toastr';
import { ReceiveReceipt } from '../../models/GeneralAccounts/ReceiveReceipt';

@Component({
  selector: 'app-create-receive-receipt',
  templateUrl: './create-receive-receipt.component.html',
  styleUrls: ['./create-receive-receipt.component.css']
})



export class CreateReceiveReceiptComponent implements OnInit {
  TitleList = ['الحسابات العامة', 'سند قبض جديد'];
    agencyTypeList: any[] = [];
    paymentTypeList: any[] = [];
    selectedAgencyType: number = 1;
    supplierList: any[] = [];
    accountList: any[] = [];
    receiptLedgerList: any[] = [];
    receiveReceiptModel: ReceiveReceipt = {} as ReceiveReceipt
    inputDropdownValue = '';
    isFocused = false;
  
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
      this.sharedService.GetReceiptLedgersSelector().subscribe(data => {
        this.receiptLedgerList = data;
      })
    }
  
    GetSelectedAgencyType(accountType) {
      this.selectedAgencyType = accountType?.id;
      this.receiveReceiptModel.agencyTypeId = accountType?.id;
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
          this.receiveReceiptModel.supplierId = account.id;
          break;
        case 1:
          //account
          this.receiveReceiptModel.accountId = account.id;
          break;
  
        default:
          break;
      }
    }
  
    GetSelectedPaymentType(type) {
      this.receiveReceiptModel.paymentTypeId = type.id;
      //this.loadAccountsByTypeData(type.id);
    }
  
    GetSelectedAccount(account) {
      this.receiveReceiptModel.accountId = account.id;
    }
  
    GetSelectedReceiptLedger(receiptLedger: ReceiptLedger) {
      this.receiveReceiptModel.receiptLedgerId = receiptLedger.receiptLedgerId;
    }
  
    SavePaymentReceipt() {
      if (!this.validatePaymentReceipt()) {
        return;
      }
      this.paymentService.SaveReceiveReceipt(this.receiveReceiptModel).subscribe((data: ActionsResponseModel) => {
        if (data?.status) {
          this.ClearAllFields();
          this.receiveReceiptModel.receiptNumber = data.number;
          this.toaster.success(data?.message);
        } else {
          this.toaster.error(data?.message);
        }
      });
  
    }
  
    validatePaymentReceipt(): boolean {
      let model: ReceiveReceipt = this.receiveReceiptModel;
  
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
      this.receiveReceiptModel = {} as ReceiveReceipt;
      this.selectedAgencyType = null;
    }
  
  }
  