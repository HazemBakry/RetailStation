import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { PurchaseInvoiceModel } from '../models/PurchaseInvoiceModel';
import { PurchaseOrderModel } from '../models/PurchaseOrder';

@Injectable({
  providedIn: 'root'
})
export class PurchaseService {
  URL = environment.apiURL;

  constructor(private http: HttpClient) { }

  GetPurchaseInvoiceData() {
    return this.http.get<any[]>(this.URL + 'PurchaseInvoice/GetPurchaseInvoiceData');
  }

  CancelPurchaseInvoice(InvoiceId:number) {
    return this.http.get<any[]>(this.URL + 'PurchaseInvoice/CancelPurchaseInvoice?InvoiceId='+InvoiceId);
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

  SaveNewPurchaseOrder(model: PurchaseOrderModel) {
    return this.http.post<any>(this.URL + 'PurchaseInvoice/SaveNewPurchaseOrder', model);
  }

  SaveNewPurchaseReturns(model: PurchaseInvoiceModel) {
    return this.http.post<any>(this.URL + 'PurchaseInvoice/SaveNewPurchaseReturns', model);
  }



  // Purchases Orders

  GetPurchasesOrdersData() {
    return this.http.get<any[]>(this.URL + 'PurchaseInvoice/GetPurchasesOrdersData');
  }

  CancelPurchaseOrder(orderId:number) {
    return this.http.get<any[]>(this.URL + 'PurchaseInvoice/CancelPurchaseOrder?OrderId='+orderId);
  }


    // Purchases Returns

    GetPurchasesReturnsData() {
      return this.http.get<any[]>(this.URL + 'PurchaseInvoice/GetPurchasesReturnsData');
    }
  
    CancelPurchaseReturns(returnsId:number) {
      return this.http.get<any[]>(this.URL + 'PurchaseInvoice/CancelPurchaseReturns?ReturnsId='+returnsId);
    }
}
