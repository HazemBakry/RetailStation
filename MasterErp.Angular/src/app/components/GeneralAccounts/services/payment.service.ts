import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { PaymentReceipt } from '../models/GeneralAccounts/PaymentReceipt';
import { ReceiveReceipt } from '../models/GeneralAccounts/ReceiveReceipt';
import { CreateModifyReturnsModel } from 'src/app/components/Shared/models/CreateModifyReturnsModel';
import { FilterModel } from 'src/app/components/Shared/models/FilterModel';
import { PaymentOperationType } from '../../Shared/Enums/GeneralAccountsEnums';
import { FormDropdownModel } from '../../Shared/components/drop-down-form-control/drop-down-form-control.component';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  agencyTypeList: any[] = [
    // {
    //   id:1,
    //   nameAR:'عميل',
    //   nameEN:'Customer'
    // },
    {
      id: 0,
      name: 'مورد',
      nameAR: 'مورد',
      nameEN: 'Supplier'
    },
    {
      id: 1,
      name: 'حساب',
      nameAR: 'حساب',
      nameEN: 'Account'
    }
  ]

  paymentTypeList: any[] = [
    {
      id: PaymentOperationType.Cash,
      name: 'نقدي',
      nameAR: 'نقدي',
      nameEN: 'Cash'
    },
    {
      id: PaymentOperationType.Cheque,
      name: 'شيكات',
      nameAR: 'شيكات',
      nameEN: 'Cheque'
    }
  ]

  CurrencyType = [
    {
      currencyId: 2,
      nameAR: 'جنيه'
    },
    {
      currencyId: 1,
      nameAR: 'ريال'
    }
  ];
  CurrencyTypesSelector: FormDropdownModel[] = [
    {
      value: 2,
      name: 'جنيه'
    },
    {
      value: 1,
      name: 'ريال'
    }
  ]

  JournalEntryType = [
    {
      journalTypeId: 1,
      nameAR: 'تسوية'
    },
    {
      journalTypeId: 4,
      nameAR: 'اقفال'
    },
    {
      journalTypeId: 5,
      nameAR: 'قيد افتتاحى'
    }
  ]
  JournalEntryTypesSelector: FormDropdownModel[] = [
    {
      value: 1,
      name: 'تسوية'
    },
    {
      value: 4,
      name: 'اقفال'
    },
    {
      value: 5,
      name: 'قيد افتتاحى'
    }
  ]
  URL = environment.apiURL;
  constructor(private http: HttpClient) { }

  GetPaymentReceiptData() {
    return this.http.get<any[]>(this.URL + 'Payment/GetPaymentReceiptData');
  }

  SavePaymentReceipt(model: PaymentReceipt) {
    return this.http.post<CreateModifyReturnsModel>(this.URL + 'Payment/SavePaymentReceipt', model);

  }

  GetReceiveReceiptData() {
    return this.http.get<any[]>(this.URL + 'Payment/GetReceiveReceiptData');

  }

  SaveReceiveReceipt(model: ReceiveReceipt) {
    return this.http.post<CreateModifyReturnsModel>(this.URL + 'Payment/SaveReceiveReceipt', model);

  }

  GetReceiveReceiptsSummary(model: FilterModel) {
    return this.http.post<any>(this.URL + 'Payment/GetReceiveReceipts_Summary', model);
  }

  CancelReceiveReceipt(ReceiptId: any) {
    return this.http.get<any[]>(this.URL + 'Payment/CancelReceiveReceipt?ReceiptId=' + ReceiptId);
  }

  GetPaymentReceiptsSummary(model: FilterModel) {
    return this.http.post<any>(this.URL + 'Payment/GetPaymentReceipts_Summary', model);
  }

  CancelPaymentReceipt(ReceiptId: any) {
    return this.http.get<any[]>(this.URL + 'Payment/CancelPaymentReceipt?ReceiptId=' + ReceiptId);
  }


}
