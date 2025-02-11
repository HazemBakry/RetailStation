import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { PaymentReceipt } from '../models/GeneralAccounts/PaymentReceipt';
import { ReceiveReceipt } from '../models/GeneralAccounts/ReceiveReceipt';
import { CreateModifyReturnsModel } from 'src/app/components/Shared/models/CreateModifyReturnsModel';
import { FilterModel } from 'src/app/components/Shared/models/FilterModel';
import { PaymentOperationType } from '../../Shared/Enums/GeneralAccountsEnums';

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
      id: 2,
      name: 'مورد',
      nameAR: 'مورد',
      nameEN: 'Supplier'
    },
    {
      id: 3,
      name: 'حساب',
      nameAR: 'حساب',
      nameEN: 'Account'
    }
  ]

  paymentTypeList: any[] = [
    {
      id: PaymentOperationType.Cheque,
      name: 'شيكات',
      nameAR: 'شيكات',
      nameEN: 'Cheque'
    },
    {
      id: PaymentOperationType.Cash,
      name: 'نقدي',
      nameAR: 'نقدي',
      nameEN: 'Cash'
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

  SaveNewReceiveReceipt(model: ReceiveReceipt) {
    return this.http.post<CreateModifyReturnsModel>(this.URL + 'Payment/SaveNewReceiveReceipt', model);

  }

  GetReceiveReceiptsSummary(model: FilterModel) {
    return this.http.post<any>(this.URL + 'Payment/GetReceiveReceiptsSummary', model);
  }

  CancelReceiveReceipt(ReceiptId: any) {
    return this.http.get<any[]>(this.URL + 'Payment/CancelReceiveReceipt?ReceiptId=' + ReceiptId);
  }

  GetPaymentReceiptsSummary(model: FilterModel) {
    return this.http.post<any>(this.URL + 'Payment/GetPaymentReceiptsSummary', model);
  }

  CancelPaymentReceipt(ReceiptId: any) {
    return this.http.get<any[]>(this.URL + 'Payment/CancelPaymentReceipt?ReceiptId=' + ReceiptId);
  }


}
