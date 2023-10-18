import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { PaymentReceipt } from '../models/GeneralAccounts/PaymentReceipt';
import { ReceiveReceipt } from '../models/GeneralAccounts/ReceiveReceipt';
import { CreateModifyReturnsModel } from 'src/app/components/Shared/models/CreateModifyReturnsModel';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  URL = environment.apiURL;
  constructor(private http:HttpClient) { }

  GetPaymentReceiptData() {
    return this.http.get<any[]>(this.URL + 'Payment/GetPaymentReceiptData');
  }
  
  SaveNewPaymentReceipt(model:PaymentReceipt) {
    return this.http.post<CreateModifyReturnsModel>(this.URL + 'Payment/SaveNewPaymentReceipt',model);

  }

  GetReceiveReceiptData() {
    return this.http.get<any[]>(this.URL + 'Payment/GetReceiveReceiptData');

  }

  SaveNewReceiveReceipt(model:ReceiveReceipt) {
    return this.http.post<any[]>(this.URL + 'Payment/SaveNewReceiveReceipt',model);

  }
}
