import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CustomValidators } from 'src/app/components/Shared/services/custom-validators';
import { FormService } from 'src/app/components/Shared/services/form.service';
import { SharedService } from 'src/app/components/Shared/services/shared.service';
import { PaymentService } from '../../services/payment.service';
import { PaymentReceipt, ReceiptLedger } from '../../models/GeneralAccounts/PaymentReceipt';
import { CreateModifyReturnsModel } from 'src/app/components/Shared/models/CreateModifyReturnsModel';

@Component({
  selector: 'app-payment-receipts',
  templateUrl: './payment-receipts.component.html',
  styleUrls: ['./payment-receipts.component.css']
})
export class PaymentReceiptsComponent implements OnInit {
  agencyTypeList:any[]=[];
  paymentTypeList:any[]=[];

  selectedAgencyType:number;
  agencyList:any[]=[];
  accountList:any[]=[];
  receiptLedgerList:any[]=[];

  paymentReceiptModel:PaymentReceipt={} as PaymentReceipt
  public formGroup: FormGroup;
  public formErrors = {
    receiptNumber: '',
      benefitPerson:  '',
      chequeNumber:  '',
      releaseDate:  '',
      docNumber:  '',
      moneyAmount: '',
      notes:  '',
      agencyTypeId:  '',
      receiptLedgerId:  '',
      agencyId:  '',
      paymentTypeId:  '',
      accountId:  '',
  };
  
  
  constructor(
    private sharedService:SharedService,
    private paymentService:PaymentService,
    private form: FormBuilder,
    private FormService: FormService,
    private toaster:ToastrService
  ) {}

    // initiate component
    public ngOnInit() {
      this.agencyTypeList=this.paymentService.agencyTypeList;
      this.paymentTypeList=this.paymentService.paymentTypeList;
      this.loadReceiptLedgersData();
      this.buildForm();
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
      // this.paymentReceiptModel.agencyTypeId=accountType?.id;
      this.formGroup.patchValue({agencyTypeId:accountType?.id});
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
          // this.paymentReceiptModel.agencyId=account.supplierID;
        this.formGroup.patchValue({agencyId:account.supplierID});

          break;
        case 3:
          //account
          // this.paymentReceiptModel.agencyId=account.accountID;
        this.formGroup.patchValue({agencyId:account.accountID});

  
        break;
        default:
          break;
      }
    }
  
    GetSelectedPaymentType(type)
    {
  
      // this.paymentReceiptModel.receiveTypeId=type.id;
      this.formGroup.patchValue({paymentTypeId:type.id});

      this.loadAccountsByTypeData(type.id);
    }
    
  
    GetSelectedAccount(account)
    {
      // this.paymentReceiptModel.accountId=account.accountID;
      this.formGroup.patchValue({accountId:account.accountID});

    }
    GetSelectedReceiptLedger(receiptLedger:ReceiptLedger)
    {
      this.formGroup.patchValue({receiptLedgerId:receiptLedger.receiptLedgerId});

      // this.paymentReceiptModel.receiptLedgerId=receiptLedger.receiptLedgerId;
    }
    
  
  
    SaveNewPaymentReceipt() {
        if (!this.validatePaymentReceipt()) {
          return;
        }
        this.paymentReceiptModel=this.formGroup.value;
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

      console.log("this.formGroup",this.formGroup);
    
      this.FormService.markFormGroupTouched(this.formGroup);
      if (this.formGroup.valid) {
  
        return true;
        this.toaster.success('success');
        // this.formGroup.reset();
      } else {
        this.formErrors = this.FormService.validateForm(this.formGroup, this.formErrors, false)
        return false;
      }


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
  

  buildForm() {
    this.formGroup = this.form.group({
      receiptNumber: [''],
      benefitPerson: ['', [Validators.required, CustomValidators.validateCharacters]],
      chequeNumber: ['', [Validators.required,]],
      releaseDate: ['', [Validators.required]],
      docNumber: ['', [Validators.required]],
      // moneyAmount: ['', [Validators.required,Validators.pattern("^[0-9]*$"),Validators.min(1)]],
      moneyAmount: [null, [Validators.required,Validators.pattern('[0-9,.]*$'),Validators.min(1)]],
      notes: [''],
      agencyTypeId: ['', [Validators.required]],
      receiptLedgerId: ['', [Validators.required]],
      agencyId: ['', [Validators.required]],
      paymentTypeId: ['', [Validators.required]],
      accountId: ['', [Validators.required]],
      
      
    });
    this.formGroup.valueChanges.subscribe((data) => {
      this.formErrors = this.FormService.validateForm(this.formGroup, this.formErrors, true)
    });
  }


}
