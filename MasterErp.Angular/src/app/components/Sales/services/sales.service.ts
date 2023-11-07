import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { SalesInvoiceModel } from '../models/SalesInvoiceModel';

@Injectable({
  providedIn: 'root'
})
export class SalesService {
  URL = environment.apiURL;

  constructor(private http: HttpClient) { }

  GetSalesInvoiceData() {
    return this.http.get<any[]>(this.URL + 'SalesInvoice/GetSalesInvoiceData');
  }

  SaveNewSalesInvoice(model: SalesInvoiceModel) {
    return this.http.post<any>(this.URL + 'SalesInvoice/SaveNewSalesInvoice', model);
  }
}
