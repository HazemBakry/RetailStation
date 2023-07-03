import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { PurchaseInvoiceModel } from '../models/PurchaseInvoiceModel';

@Injectable({
  providedIn: 'root'
})
export class PurchaseService {
  URL = environment.apiURL;

  constructor(private http: HttpClient) { }

  GetPurchaseInvoiceData() {
    return this.http.get<any[]>(this.URL + 'PurchaseInvoice/GetPurchaseInvoiceData');
  }

  GetSuppliersData() {
    return this.http.get<any[]>(this.URL + 'PurchaseInvoice/GetSuppliersData');
  }

  GetBranchesData() {
    return this.http.get<any[]>(this.URL + 'PurchaseInvoice/GetBranchesData');
  }

  GetItemLookupsData() {
    return this.http.get<any[]>(this.URL + 'PurchaseInvoice/GetItemLookupsData');
  }

  GetItemsData() {
    return this.http.get<any[]>(this.URL + 'PurchaseInvoice/GetItemsData');
  }

  GetItemsByLookupId(LookupId: number) {
    return this.http.get<any[]>(this.URL + 'PurchaseInvoice/GetItemsByLookupId?LookupId=' + LookupId);
  }

  GetItemsBySupplierId(SupplierId: number) {
    return this.http.get<any[]>(this.URL + 'PurchaseInvoice/GetItemsBySupplierId?SupplierId=' + SupplierId);
  }

  SaveNewPurchaseInvoice(model: PurchaseInvoiceModel) {
    return this.http.post<any>(this.URL + 'PurchaseInvoice/SaveNewPurchaseInvoice', model);
  }


}
