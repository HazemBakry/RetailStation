import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GeneralAccountSettingsService {
  URL = environment.apiURL;

  constructor(private http: HttpClient) { }

  //================================== PaymentTerm ===============================

  GetPaymentTermsData() {
    return this.http.get<any[]>(this.URL + 'PaymentTerm/GetPaymentTermsData');
  }

  GetPaymentTermDetailsById(PaymentTermId: number) {
    return this.http.get<any[]>(this.URL + 'PaymentTerm/GetPaymentTermDetailsById?PaymentTermId=' + PaymentTermId);
  }

  ChangePaymentTermStatus(IsActive: boolean, PaymentTermId: number) {
    return this.http.get<any>(this.URL + 'PaymentTerm/ChangePaymentTermStatus?IsActive=' + IsActive + '&PaymentTermId=' + PaymentTermId);
  }

  AddNewPaymentTerm(Model: any) {
    return this.http.post<any>(this.URL + 'PaymentTerm/AddNewPaymentTerm', Model);
  }

  AddNewPaymentTermDetails(Model: any) {
    return this.http.post<any>(this.URL + 'PaymentTerm/AddNewPaymentTermDetails', Model);
  }

  EditPaymentTerm(Model: any) {
    return this.http.post<any>(this.URL + 'PaymentTerm/EditPaymentTerm', Model);
  }

  EditPaymentTermDetails(Model: any) {
    return this.http.post<any>(this.URL + 'PaymentTerm/EditPaymentTermDetails', Model);
  }

  DeletePaymentTerm(PaymentTermId: number) {
    return this.http.get<any>(this.URL + 'PaymentTerm/DeletePaymentTerm?PaymentTermId=' + PaymentTermId);
  }

  DeletePaymentTermDetails(PaymentTermDetailId: number) {
    return this.http.get<any>(this.URL + 'PaymentTerm/DeletePaymentTermDetails?PaymentTermDetailId=' + PaymentTermDetailId);
  }
}
