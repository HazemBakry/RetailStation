import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ReceiveOrderModel } from '../models/inventory';
import { FilterModel } from '../../Shared/models/FilterModel';
import { ItemModel } from '../models/Item';
import { PurchaseRequestModel } from '../models/PurchasesRequestModel';
import { Unit } from '../models/unit';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  URL = environment.apiURL;

  constructor(private http: HttpClient) { }

  // -------------------------------------- Items -------------------------------------- //

  GetItemsList(ItemCategoryId: number, SearchText: string) {
    return this.http.get<any[]>(this.URL + 'Item/GetItemsList?ItemCategoryId=' + ItemCategoryId + '&SearchText=' + SearchText);
  }

  GetItemsDeleted(ItemCategoryId: number, SearchText: string) {
    return this.http.get<any[]>(this.URL + 'Item/GetItemsDeleted?ItemCategoryId=' + ItemCategoryId + '&SearchText=' + SearchText);
  }

  GetItemCategories() {
    return this.http.get<any[]>(this.URL + 'Item/GetItemCategories');
  }

  GetItemsByCategoryId(CategoryId: number) {
    return this.http.get<any[]>(this.URL + 'Item/GetItemsByCategoryId?CategoryId=' + CategoryId);
  }

  GetItemDetailsByItemId(ItemId: number) {
    return this.http.get<any>(this.URL + 'Item/GetItemDetailsByItemId?ItemId=' + ItemId);
  }

  AddNewItem(model: ItemModel) {
    return this.http.post<any>(this.URL + 'Item/AddNewItem', model);
  }

  EditItem(itemId: number, model: ItemModel) {
    return this.http.post<any>(this.URL + 'Item/EditItem', model);
  }

  DeleteItem(ItemId: number[]) {
    return this.http.post<any>(this.URL + 'Item/DeleteItem', ItemId);
  }

  ExportItems(ItemCategoryId: number, SearchText: string, UserName: string) {
    return this.http.get<any>(this.URL + 'Item/ExportItems?ItemCategoryId=' + ItemCategoryId + '&SearchText=' + SearchText + '&UserName=' + UserName);
  }

  ExportItemsDeleted(ItemCategoryId: number, SearchText: string, UserName: string) {
    return this.http.get<any>(this.URL + 'Item/ExportItemsDeleted?ItemCategoryId=' + ItemCategoryId + '&SearchText=' + SearchText + '&UserName=' + UserName);
  }

  GetUnits() {
    return this.http.get<any>(this.URL + 'Item/GetUnits');
  }

  AddNewUnit(model: Unit) {
    return this.http.post<any>(this.URL + 'Item/AddUnit', model);
  }

  EditUnit(model: Unit) {
    return this.http.post<any>(this.URL + 'Item/EditUnit', model);
  }

  DeleteUnit(UnitId: number[]) {
    return this.http.post<any>(this.URL + 'Item/DeleteUnit', UnitId);
  }


  // -------------------------------------- Receive Orders -------------------------------------- //

  GetReceiveOrdersSummary(model: FilterModel) {
    return this.http.post<any>(this.URL + 'Inventory/GetReceiveOrdersSummary', model);
  }

  GetInventoryList() {
    return this.http.get<any[]>(this.URL + 'Inventory/GetInventoryList');
  }

  CreateNewReceiveOrder(model: ReceiveOrderModel) {
    return this.http.post<any>(this.URL + 'Inventory/CreateNewReceiveOrder', model);
  }

  GetOrdersSearchData(supplierId: number, orderNumber: string, orderDate: string) {
    supplierId = supplierId ? supplierId : 0;
    orderNumber = orderNumber ? orderNumber : '';
    orderDate = orderDate ? orderDate : '';
    return this.http.get<any[]>(this.URL + 'Inventory/GetOrdersSearchData?SupplierId=' + supplierId + '&OrderNumber=' + orderNumber + '&OrderDate=' + orderDate);
  }

  CancelReceiveOrder(OrderId: number) {
    return this.http.get<any[]>(this.URL + 'Inventory/CancelReceiveOrder?=OrderId' + OrderId);
  }



  ///////////////////

  GetPurchasesRequestsData(model: FilterModel) {
    return this.http.post<any>(this.URL + 'PurchasesRequests/GetPurchasesRequestsData', model);
  }

  CreateNewPurchasesRequest(model: PurchaseRequestModel) {
    return this.http.post<any>(this.URL + 'PurchasesRequests/CreateNewPurchasesRequest', model);
  }
}
