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


  agencyTypeList:any[]=[
    // {
    //   id:1,
    //   nameAR:'عميل',
    //   nameEN:'Customer'
    // },
    {
      id:2,
      nameAR:'مورد',
      nameEN:'Supplier'
    },
    {
      id:3,
      nameAR:'حساب',
      nameEN:'Account'
    }
  ]

  paymentTypeList:any[]=[
    {
      id:3,
      nameAR:'شيكات',
      nameEN:'Cheque'
    },
    {
      id:4,
      nameAR:'نقدي',
      nameEN:'Cash'
    }
  ]
  selectedAgencyType:number;
  agencyList:any[]=[];
  accountList:any[]=[];
  receiptLedgerList:any[]=[];

  paymentReceiptModel:PaymentReceipt={} as PaymentReceipt
  constructor(private sharedService:SharedService,private paymentService:PaymentService,private toaster:ToastrService) { }

  ngOnInit(): void {
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
    this.sharedService.GetSuppliersData().subscribe(data=>{
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
    this.paymentReceiptModel.agencyTypeId=accountType?.id;
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
        this.paymentReceiptModel.agencyId=account.supplierID;
        break;
      case 3:
        //account
        this.paymentReceiptModel.agencyId=account.accountID;

      break;
      default:
        break;
    }
  }

  GetSelectedPaymentType(type)
  {

    this.paymentReceiptModel.paymentTypeId=type.id;
    this.loadAccountsByTypeData(type.id);
  }
  

  GetSelectedAccount(account)
  {
    this.paymentReceiptModel.accountId=account.accountID;
  }
  GetSelectedReceiptLedger(receiptLedger:ReceiptLedger)
  {
    this.paymentReceiptModel.receiptLedgerId=receiptLedger.receiptLedgerId;
  }
  


  SaveNewPaymentReceipt() {
      if (!this.validatePaymentReceipt()) {
        return;
      }
    
    this.paymentService.SaveNewPaymentReceipt(this.paymentReceiptModel).subscribe((data:CreateModifyReturnsModel) => {
      if (data?.status) {
        this.ClearAllFields();
        this.paymentReceiptModel.receiptNumber = data.id;
        this.toaster.success(data?.message);
      } else {
        this.toaster.error(data?.message);
      }
    });

  }

  validatePaymentReceipt():boolean
  {
    let model:PaymentReceipt=this.paymentReceiptModel;

    if(!model.benefitPerson||
      !model.paymentTypeId||
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

    this.paymentReceiptModel={}as PaymentReceipt;
    this.selectedAgencyType=null;
  }

}
