import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { OrderModel, OrderProductModel } from '../models/inventory';
import { FilterModel, SearchFilterModel } from '../../Shared/models/FilterModel';
import { ItemModel } from '../models/Item';
import { PurchaseRequestModel } from '../models/PurchasesRequestModel';
import { Unit } from '../models/unit';
import { PagedResponseDTO } from '../../Shared/models/PagedResponseDTO';
import { ActionsResponseModel } from '../../Shared/models/CreateModifyReturnsModel';
import { SupplierModel } from '../../Purchases/models/SupplierModel';
import { ItemCategoryModel } from '../models/itemCategory';
import { CategorySortModel } from '../models/categorySort';
import { OrderDetailModel } from '../../Shared/models/ItemModel';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  URL = environment.apiURL;

  constructor(private http: HttpClient) { }

  // -------------------------------------- Items -------------------------------------- //


  GetItemsLookups() {
    return this.http.get<any[]>(this.URL + 'Items/GetItemsLookups');
  }

  // GetItemsData() {
  //   return this.http.get<OrderDetailModel[]>(this.URL + 'Items/GetItemsData');
  // }

  GetItemsByLookupId(LookupId: number) {
    return this.http.get<OrderProductModel[]>(this.URL + 'Items/GetItemsByLookupId?LookupId=' + LookupId);
  }




  GetItemsData(searchModel: SearchFilterModel) {
    return this.http.post<PagedResponseDTO<ItemModel[]>>(this.URL + 'Items/GetItemsData?=', searchModel);
  }

  GetItemById(itemId: number) {
    return this.http.get<ItemModel>(this.URL + `Items/GetItemDetailsById?ItemId=${itemId}`);
  }

  AddNewItem(model: ItemModel) {
    return this.http.post<ActionsResponseModel>(this.URL + 'Items/AddNewItem', model);
  }

  EditItem(itemId: number, model: ItemModel) {
    return this.http.post<ActionsResponseModel>(this.URL + `Items/EditItem?ItemId=${itemId}`, model)
  }

  DeleteItem(itemId: number) {
    return this.http.get<ActionsResponseModel>(this.URL + `Items/DeleteItem?ItemId=${itemId}`);
  }


  ExportItems(searchModel: PagedResponseDTO, categoryId: number) {
    return this.http.post<ActionsResponseModel>(this.URL + `Items/ExportItems?CategoryId=${categoryId} `, searchModel);
  }
  GetItemSuppliersByItemId(itemId: number) {
    return this.http.get<SupplierModel[]>(this.URL + `Items/GetItemSuppliersByItemId?ItemId=${itemId} `);
  }
  GetItemsBySupplierId(supplierId: number) {
    return this.http.get<ItemModel[]>(this.URL + `Items/GetItemsBySupplierId?SupplierId=${supplierId} `);
  }

  GetItemsDeleted(ItemCategoryId: number, SearchText: string) {
    return this.http.get<any[]>(this.URL + 'Items/GetItemsDeleted?ItemCategoryId=' + ItemCategoryId + '&SearchText=' + SearchText);
  }

  GetItemsByCategoryId(CategoryId: number) {
    return this.http.get<any[]>(this.URL + 'Items/GetItemsByCategoryId?CategoryId=' + CategoryId);
  }

  ExportItemsDeleted(ItemCategoryId: number, SearchText: string, UserName: string) {
    return this.http.get<any>(this.URL + 'Items/ExportItemsDeleted?ItemCategoryId=' + ItemCategoryId + '&SearchText=' + SearchText + '&UserName=' + UserName);
  }

  //----------------------------------------------- Item Categories ---------------------------------------------//

  AddNewItemCategory(model: ItemCategoryModel) {
    return this.http.post<ActionsResponseModel>(this.URL + 'Items/AddNewItemCategory', model);
  }

  EditItemCategory(categoryId: number, model: ItemCategoryModel) {
    return this.http.post<ActionsResponseModel>(this.URL + `Items/EditItemCategory?ItemCategoryId=${categoryId}`, model)
  }

  DeleteItemCategory(categoryId: number) {
    return this.http.get<ActionsResponseModel>(this.URL + `Items/DeleteItemCategory?ItemCategoryId=${categoryId}`);
  }

  GetItemCategories() {
    return this.http.get<PagedResponseDTO<ItemCategoryModel[]>>(this.URL + 'Items/GetItemCategories');
  }

  ChangeItemCategoryActiveStatus(CategoryId: number) {
    return this.http.get<ActionsResponseModel>(this.URL + 'Items/ChangeItemCategoryActiveStatus?CategoryId=' + CategoryId);
  }

  ChangeCategoriesDisplayOrder(SortedItems: CategorySortModel[]) {
    return this.http.post<ActionsResponseModel>(this.URL + 'Items/ChangeCategoriesDisplayOrder', SortedItems);
  }

  //------------------------------------------------------- Units ------------------------------------------------------//

  GetUnits() {
    return this.http.get<any>(this.URL + 'Items/GetUnits');
  }

  AddNewUnit(model: Unit) {
    return this.http.post<any>(this.URL + 'Items/AddUnit', model);
  }

  EditUnit(model: Unit) {
    return this.http.post<any>(this.URL + 'Items/EditUnit', model);
  }

  DeleteUnit(UnitId: number[]) {
    return this.http.post<any>(this.URL + 'Items/DeleteUnit', UnitId);
  }


  // -------------------------------------- Inventory operations -------------------------------------- //

  GetInventoryList() {
    return this.http.get<any[]>(this.URL + 'Inventory/GetInventoryList');
  }

  GetInventoryStatistics() {
    return this.http.get<any>(this.URL + 'Inventory/GetInventoryStatistics');
  }

  GetReceiveOrders_Data(model: SearchFilterModel) {
    return this.http.post<any>(this.URL + 'Inventory/GetReceiveOrders_Data', model);
  }
  GetReceiveOrderDetailsById(orderId: number) {
    return this.http.get<OrderModel>(this.URL + `Inventory/GetReceiveOrderDetailsById?OrderId=${orderId}`);
  }
  GetReceiveOrderProducts_Data(orderId: number) {
    return this.http.get<OrderProductModel[]>(this.URL + `Inventory/GetReceiveOrderProducts_Data?OrderId=${orderId}`);
  }

  AddNewReceiveOrder(model: OrderModel) {
    return this.http.post<ActionsResponseModel>(this.URL + 'Inventory/AddNewReceiveOrder', model);
  }
  EditReceiveOrder(orderId:number,model: OrderModel) {
    return this.http.post<ActionsResponseModel>(this.URL + `Inventory/EditReceiveOrder?OrderId=${orderId}`, model);
  }

  CancelReceiveOrder(OrderId: number) {
    return this.http.get<any[]>(this.URL + 'Inventory/CancelReceiveOrder?=OrderId' + OrderId);
  }

  GetDeliveryOrdersSummary(model: FilterModel) {
    return this.http.post<any>(this.URL + 'Inventory/GetDeliveryOrdersSummary', model);
  }

  CreateNewDeliveryOrder(model: OrderModel) {
    return this.http.post<any>(this.URL + 'Inventory/CreateNewDeliverOrder', model);
  }

  CancelDeliveryOrder(OrderId: number) {
    return this.http.get<any[]>(this.URL + 'Inventory/CancelDeliveryOrder?=OrderId' + OrderId);
  }

  GetOrdersSearchData(supplierId: number, orderNumber: string, orderDate: string) {
    supplierId = supplierId ? supplierId : 0;
    orderNumber = orderNumber ? orderNumber : '';
    orderDate = orderDate ? orderDate : '';
    return this.http.get<any[]>(this.URL + 'Inventory/GetOrdersSearchData?SupplierId=' + supplierId + '&OrderNumber=' + orderNumber + '&OrderDate=' + orderDate);
  }


  ///////////////////

  GetPurchasesRequestsData(model: FilterModel) {
    return this.http.post<any>(this.URL + 'PurchasesRequests/GetPurchasesRequestsData', model);
  }

  CreateNewPurchasesRequest(model: PurchaseRequestModel) {
    return this.http.post<any>(this.URL + 'PurchasesRequests/CreateNewPurchasesRequest', model);
  }
}
