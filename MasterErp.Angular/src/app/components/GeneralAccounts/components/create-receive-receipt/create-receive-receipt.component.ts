import { Component, OnInit } from '@angular/core';
import { SharedService } from 'src/app/components/Shared/services/shared.service';
import {  ReceiptLedger } from '../../models/GeneralAccounts/PaymentReceipt';
import { PaymentService } from '../../services/payment.service';
import { CreateModifyReturnsModel } from 'src/app/components/Shared/models/CreateModifyReturnsModel';
import { ToastrService } from 'ngx-toastr';
import { ReceiveReceipt } from '../../models/GeneralAccounts/ReceiveReceipt';

@Component({
  selector: 'app-create-receive-receipt',
  templateUrl: './create-receive-receipt.component.html',
  styleUrls: ['./create-receive-receipt.component.css']
})



export class CreateReceiveReceiptComponent implements OnInit {
  agencyTypeList:any[]=[];
  paymentTypeList:any[]=[];

  selectedAgencyType:number;
  agencyList:any[]=[];
  accountList:any[]=[];
  receiptLedgerList:any[]=[];

  receiveReceiptModel:ReceiveReceipt={} as ReceiveReceipt
  constructor(private sharedService:SharedService,private paymentService:PaymentService,private toaster:ToastrService) { }

  ngOnInit(): void {
    this.agencyTypeList=this.paymentService.agencyTypeList;
    this.paymentTypeList=this.paymentService.paymentTypeList;
    this.loadReceiptLedgersData();
  }

  loadCustomersData()
  {
    this.sharedService.GetCustomersData().subscribe(data=>{
      this.agencyList=data;
      
    })
  }

  
  loadSuppliersData()
  {
    this.sharedService.GetSuppliersSelector().subscribe(data=>{
      this.agencyList=data;
      
    })
  }
  loadAccountsTreeData()
  {
    this.sharedService.GetAccountsList().subscribe(data=>{
      this.agencyList=data;
      
    })
  }

  loadAccountsByTypeData(typeId:number)
  {
    this.sharedService.GetAccountsByTypeId(typeId).subscribe(data=>{
      this.accountList=data;
      
    })
  }
  loadReceiptLedgersData()
  {
    this.sharedService.GetReceiptLedgersData().subscribe(data=>{
      this.receiptLedgerList=data;
    })
  }
  GetSelectedAgencyType(accountType)
  {

    this.selectedAgencyType=accountType?.id;
    this.receiveReceiptModel.agencyTypeId=accountType?.id;
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

  GetSelectedAgency(account)
  {

    switch (this.selectedAgencyType) {

      case 2:
        //supplier
        this.receiveReceiptModel.agencyId=account.supplierID;
        break;
      case 3:
        //account
        this.receiveReceiptModel.agencyId=account.accountId;

      break;
      default:
        break;
    }
  }

  GetSelectedReceiveType(type)
  {

    this.receiveReceiptModel.receiveTypeId=type.id;
    this.loadAccountsByTypeData(type.id);
  }
  

  GetSelectedAccount(account)
  {
    this.receiveReceiptModel.accountId=account.accountId;
  }
  GetSelectedReceiptLedger(receiptLedger:ReceiptLedger)
  {
    this.receiveReceiptModel.receiptLedgerId=receiptLedger.receiptLedgerId;
  }
  


  SaveNewReceiveReceipt() {
      if (!this.validateReceiveReceipt()) {
        return;
      }
    
    this.paymentService.SaveNewReceiveReceipt(this.receiveReceiptModel).subscribe((data:CreateModifyReturnsModel) => {
      if (data?.status) {
        this.ClearAllFields();
        this.receiveReceiptModel.receiptNumber = data.id;
        this.toaster.success(data?.message);
      } else {
        this.toaster.error(data?.message);
      }
    });

  }

  validateReceiveReceipt():boolean
  {
    let model:ReceiveReceipt=this.receiveReceiptModel;

    if(!model.benefitPerson||
      !model.receiveTypeId||
      !model.receiptLedgerId||
      !model.agencyTypeId||
      !model.agencyId||
      !model.accountId||
      !model.releaseDate||
      !model.moneyAmount)
      {
        this.toaster.warning('يرجي ملئ جميع الخانات');
        return false;
      }
    return true;

  }
  ClearAllFields()
  {

    this.receiveReceiptModel={}as ReceiveReceipt;
    this.selectedAgencyType=null;
  }

}
