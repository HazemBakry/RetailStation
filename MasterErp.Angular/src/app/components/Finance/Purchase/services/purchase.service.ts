import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { PurchaseInvoiceModel } from '../models/PurchaseInvoiceModel';
import { PurchaseOrderModel } from '../models/PurchaseOrder';
import { PurchaseReturnsModel } from '../models/PurchaseReturns';
import { ItemModel } from 'src/app/Models/ItemModel';
import { FilterModel, SearchFilterModel } from 'src/app/components/Shared/models/FilterModel';

@Injectable({
  providedIn: 'root'
})
export class PurchaseService {
  URL = environment.apiURL;

  constructor(private http: HttpClient) { }

  GetPurchaseInvoiceData(model: FilterModel) {
    return this.http.post<any>(this.URL + 'PurchaseInvoice/GetPurchaseInvoiceData', model);
  }

  CancelPurchaseInvoice(InvoiceId:number) {
    return this.http.get<any[]>(this.URL + 'PurchaseInvoice/CancelPurchaseInvoice?InvoiceId='+InvoiceId);
  }

  GetInvoiceTypesData() {
    return this.http.get<any[]>(this.URL + 'PurchaseInvoice/GetInvoiceTypesData');
  }

  CreateNewPurchaseInvoice(model: PurchaseInvoiceModel) {
    return this.http.post<any>(this.URL + 'PurchaseInvoice/CreateNewPurchaseInvoice', model);
  }

  CreateNewPurchaseReturns(model: PurchaseReturnsModel) {
    return this.http.post<any>(this.URL + 'PurchaseInvoice/CreateNewPurchaseReturns', model);
  }

  GetPurchasesReturnsData() {
    return this.http.get<any[]>(this.URL + 'PurchaseInvoice/GetPurchasesReturnsData');
  }

  CancelPurchaseReturns(returnsId:number) {
    return this.http.get<any[]>(this.URL + 'PurchaseInvoice/CancelPurchaseReturns?ReturnsId='+returnsId);
  }

  GetSupplierStatementData(supplierId) {
    return this.http.get<any[]>(this.URL + 'PurchaseInvoice/GetSupplierStatementData?SupplierId='+supplierId);
  }

  GetInvoicesSearchData(supplierId:number,invoiceNumber:string,invoiceDate:string) {
    supplierId=supplierId?supplierId:0;
    invoiceNumber=invoiceNumber?invoiceNumber:'';
    invoiceDate=invoiceDate?invoiceDate:'';
    return this.http.get<any[]>(this.URL + 'PurchaseInvoice/GetInvoicesSearchData?SupplierId='+supplierId+'&InvoiceNumber='+invoiceNumber+'&InvoiceDate='+invoiceDate);
  }

  GetInvoiceDetailsById(invoiceId:number) {
   
    return this.http.get<any[]>(this.URL + 'PurchaseInvoice/GetInvoiceDetailsById?InvoiceId='+invoiceId);
  }
  //------------------------------------- Purchase Order ----------------------------------

  CreateNewPurchaseOrder(model: PurchaseOrderModel) {
    return this.http.post<any>(this.URL + 'PurchaseOrder/CreateNewPurchaseOrder', model);
  }

  GetPurchasesOrdersData(model: FilterModel) {
    return this.http.post<any>(this.URL + 'PurchaseOrder/GetPurchasesOrdersData', model);
  }

  CancelPurchaseOrder(orderId:number) {
    return this.http.get<any[]>(this.URL + 'PurchaseOrder/CancelPurchaseOrder?OrderId='+orderId);
  }

  //---------------------------------------- Items ----------------------------------------

  GetItemLookupsData() {
    return this.http.get<any[]>(this.URL + 'Item/GetItemLookupsData');
  }

  GetItemsData() {
    return this.http.get<ItemModel[]>(this.URL + 'Item/GetItemsData');
  }

  GetItemsByLookupId(LookupId: number) {
    return this.http.get<ItemModel[]>(this.URL + 'Item/GetItemsByLookupId?LookupId=' + LookupId);
  }

  GetItemsBySupplierId(SupplierId: number) {
    return this.http.get<ItemModel[]>(this.URL + 'Item/GetItemsBySupplierId?SupplierId=' + SupplierId);
  }

  //--------------------------------------- Suppliers ---------------------------------------

  GetSuppliersData() {
    return this.http.get<any[]>(this.URL + 'Supplier/GetSuppliersData');
  }

  //--------------------------------------- Branches -----------------------------------------

  GetBranchesData() {
    return this.http.get<any[]>(this.URL + 'Branch/GetBranchesData');
  }

}
