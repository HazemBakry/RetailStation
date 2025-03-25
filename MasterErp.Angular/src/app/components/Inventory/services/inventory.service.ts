import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { OrderModel } from '../models/inventory';
import { FilterModel, SearchFilterModel } from '../../Shared/models/FilterModel';
import { ItemModel } from '../models/Item';
import { PurchaseRequestModel } from '../models/PurchasesRequestModel';
import { Unit } from '../models/unit';
import { PagedResponseDTO } from '../../Shared/models/PagedResponseDTO';
import { ActionsResponseModel } from '../../Shared/models/ActionsResponseModel';
import { SupplierModel } from '../../Purchases/models/SupplierModel';
import { ItemCategoryModel } from '../models/itemCategory';
import { CategorySortModel } from '../models/categorySort';
import { OrderDetailModel } from '../../Shared/models/ItemModel';
import { MaterialRequestModel } from '../models/MaterialRequestModel ';
import { GeneralOrderDetailsModel } from '../models/GeneralOrderModel ';

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
    return this.http.get<GeneralOrderDetailsModel[]>(this.URL + 'Items/GetItemsByLookupId?LookupId=' + LookupId);
  }




  GetItemsData(searchModel: SearchFilterModel) {
    return this.http.post<PagedResponseDTO<ItemModel[]>>(this.URL + 'Items/GetItemsData', searchModel);
  }

  GetItemDetailsById(itemId: number) {
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
  ChangeItemActiveStatus(ItemId: number) {
    return this.http.get<ActionsResponseModel>(this.URL + 'Items/ChangeItemActiveStatus?ItemId=' + ItemId);
  }
  ItemQuickUpdate(ItemId: number,Price : number,UnitId: number) {
    return this.http.get<ActionsResponseModel>(this.URL + `Items/ItemQuickUpdate?ItemId=${ItemId}&Price=${Price}&UnitId=${UnitId}`);
  }
  ExportItems(searchModel: PagedResponseDTO, categoryId: number) {
    return this.http.post<ActionsResponseModel>(this.URL + `Items/ExportItems?CategoryId=${categoryId} `, searchModel);
  }
  GetSuppliersByItemId(itemId: number) {
    return this.http.get<PagedResponseDTO<SupplierModel[]>>(this.URL + `Suppliers/GetSuppliersByItemId?ItemId=${itemId} `);
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
  GetReceiveOrders_Filters(model: SearchFilterModel) {
    return this.http.post<FilterModel[]>(this.URL + 'Inventory/GetReceiveOrders_Filters', model);
  }

  GetReceiveOrderDetailsById(orderId: number) {
    return this.http.get<OrderModel>(this.URL + `Inventory/GetReceiveOrderDetailsById?OrderId=${orderId}`);
  }

  GetReceiveOrderProducts_Data(orderIds: number[]) {
    return this.http.post<GeneralOrderDetailsModel[]>(this.URL + 'Inventory/GetReceiveOrderProducts_Data', orderIds);
  }

  AddNewReceiveOrder(model: OrderModel) {
    return this.http.post<ActionsResponseModel>(this.URL + 'Inventory/AddNewReceiveOrder', model);
  }

  EditReceiveOrder(orderId: number, model: OrderModel) {
    return this.http.post<ActionsResponseModel>(this.URL + 'Inventory/EditReceiveOrder?OrderId=' + orderId, model);
  }

  CancelReceiveOrder(OrderId: number) {
    return this.http.get<ActionsResponseModel>(this.URL + 'Inventory/CancelReceiveOrder?OrderId=' + OrderId);
  }

  //-------------------------------------------- Purchase Receipt --------------------------------------------//

  GetPurchaseReceipts_Data(model: PagedResponseDTO) {
    return this.http.post<PagedResponseDTO<OrderModel[]>>(this.URL + 'Inventory/GetPurchaseReceipts_Data', model);    
  }

  GetPurchaseReceipts_Filters(model: SearchFilterModel) {
    return this.http.post<FilterModel[]>(this.URL + 'Inventory/GetPurchaseReceipts_Filters', model);
  }
  
  GetPurchaseReceiptDetailsById(orderId: number) {
    return this.http.get<OrderModel>(this.URL + `Inventory/GetPurchaseReceiptDetailsById?OrderId=${orderId}`);
  }

  GetPurchaseReceiptItems_Data(orderId: number) {
    return this.http.get<GeneralOrderDetailsModel[]>(this.URL + `Inventory/GetPurchaseReceiptItems_Data?OrderId=${orderId}`);
  }

  AddNewPurchaseReceipt(model: OrderModel) {
    return this.http.post<ActionsResponseModel>(this.URL + 'Inventory/AddNewPurchaseReceipt', model);
  }

  EditPurchaseReceipt(receiptId: number, model: OrderModel) {
    return this.http.post<ActionsResponseModel>(this.URL + `Inventory/EditPurchaseReceipt?ReceiptId=${receiptId}`, model);
  }

  CancelPurchaseReceipt(receiptId: number) {
    return this.http.get<ActionsResponseModel>(this.URL + 'Inventory/CancelPurchaseReceipt?ReceiptId' + receiptId);
  }

  //-------------------------------------------- Material Issue Receipt --------------------------------------------//

  GetMaterialIssueReceipts_Data(model: FilterModel) {
    return this.http.post<PagedResponseDTO<OrderModel[]>>(this.URL + 'Inventory/GetMaterialIssueReceipts_Data', model);
  }

  GetMaterialIssueReceipts_Filters(model: FilterModel) {
    return this.http.post<FilterModel[]>(this.URL + 'Inventory/GetMaterialIssueReceipts_Filters', model);
  }
  
  GetMaterialIssueReceiptDetailsById(receiptId: number) {
    return this.http.get<OrderModel>(this.URL + `Inventory/GetMaterialIssueReceiptDetailsById?ReceiptId=${receiptId}`);
  }

  GetMaterialIssueReceiptItems_Data(receiptId: number) {
    return this.http.get<GeneralOrderDetailsModel[]>(this.URL + `Inventory/GetMaterialIssueReceiptItems_Data?ReceiptId=${receiptId}`);
  }

  AddNewMaterialIssueReceipt(model: OrderModel) {
    return this.http.post<ActionsResponseModel>(this.URL + 'Inventory/AddNewMaterialIssueReceipt', model);
  }

  EditMaterialIssueReceipt(receiptId: number, model: OrderModel) {
    return this.http.post<ActionsResponseModel>(this.URL + `Inventory/EditMaterialIssueReceipt?ReceiptId=${receiptId}`, model);
  }

  CancelMaterialIssueReceipt(receiptId: number) {
    return this.http.get<ActionsResponseModel>(this.URL + 'Inventory/CancelMaterialIssueReceipt?ReceiptId' + receiptId);
  }
  
  // ------------------------------------------- Delivery Orders ------------------------------------------- //

  GetDeliveryNotes_Data(model: PagedResponseDTO) {
    return this.http.post<PagedResponseDTO<OrderModel[]>>(this.URL + 'Inventory/GetDeliveryNotes_Data', model);
  }

  GetDeliveryNotes_Filters(model: SearchFilterModel) {
    return this.http.post<FilterModel[]>(this.URL + 'Inventory/GetDeliveryNotes_Filters', model);
  }
  
  GetDeliveryNoteDetailsById(orderId: number) {
    return this.http.get<OrderModel>(this.URL + `Inventory/GetDeliveryNoteDetailsById?OrderId=${orderId}`);
  }

  GetDeliveryNoteProducts_Data(orderId: number) {
    return this.http.get<GeneralOrderDetailsModel[]>(this.URL + `Inventory/GetDeliveryNoteProducts_Data?OrderId=${orderId}`);
  }

  AddNewDeliveryNote(model: OrderModel) {
    return this.http.post<ActionsResponseModel>(this.URL + 'Inventory/AddNewDeliveryNote', model);
  }

  EditDeliveryNote(orderId: number, model: OrderModel) {
    return this.http.post<ActionsResponseModel>(this.URL + `Inventory/EditDeliveryNote?OrderId=${orderId}`, model);
  }

  CancelDeliveryNote(OrderId: number) {
    return this.http.get<ActionsResponseModel>(this.URL + 'Inventory/CancelDeliveryNote?OrderId' + OrderId);
  }

  GetOrdersSearchData(supplierId: number, orderNumber: string, orderDate: string) {
    supplierId = supplierId ? supplierId : 0;
    orderNumber = orderNumber ? orderNumber : '';
    orderDate = orderDate ? orderDate : '';
    return this.http.get<any[]>(this.URL + 'Inventory/GetOrdersSearchData?SupplierId=' + supplierId + '&OrderNumber=' + orderNumber + '&OrderDate=' + orderDate);
  }


   // ------------------------------------------- Material Issue ------------------------------------------- //

   GetMaterialIssue_Data(model: PagedResponseDTO) {
    return this.http.post<PagedResponseDTO<OrderModel[]>>(this.URL + 'Inventory/GetMaterialIssue_Data', model);
  }

  GetMaterialIssue_Filters(model: SearchFilterModel) {
    return this.http.post<FilterModel[]>(this.URL + 'Inventory/GetMaterialIssue_Filters', model);
  }
  
  GetMaterialIssueDetailsById(orderId: number) {
    return this.http.get<OrderModel>(this.URL + `Inventory/GetMaterialIssueDetailsById?OrderId=${orderId}`);
  }

  GetMaterialIssueProducts_Data(orderId: number) {
    return this.http.get<GeneralOrderDetailsModel[]>(this.URL + `Inventory/GetMaterialIssueProducts_Data?OrderId=${orderId}`);
  }

  AddNewMaterialIssue(model: OrderModel) {
    return this.http.post<ActionsResponseModel>(this.URL + 'Inventory/AddNewMaterialIssue', model);
  }

  EditMaterialIssue(orderId: number, model: OrderModel) {
    return this.http.post<ActionsResponseModel>(this.URL + `Inventory/EditMaterialIssue?OrderId=${orderId}`, model);
  }

  CancelMaterialIssue(OrderId: number) {
    return this.http.get<ActionsResponseModel>(this.URL + 'Inventory/CancelMaterialIssue?OrderId' + OrderId);
  }
  //----------------------------------------- Supplier Vouchers ------------------------------------//

  GetSupplierVouchers_Data(model: PagedResponseDTO) {
    return this.http.post<PagedResponseDTO<OrderModel[]>>(this.URL + 'Inventory/GetSupplierVouchers_Data', model);
  }

  CancelSupplierVoucher(OrderId: number) {
    return this.http.get<ActionsResponseModel>(this.URL + 'Inventory/CancelSupplierVoucher?OrderId' + OrderId);
  }

  //----------------------------------------- Material Requests ------------------------------------//

  GetMaterialRequests_Data(model: FilterModel) {
    return this.http.post<PagedResponseDTO<MaterialRequestModel[]>>(this.URL + 'Inventory/GetMaterialRequests_Data', model);
  }

  GetMaterialRequestDetailsById(materialRequestId: number) {
    return this.http.get<MaterialRequestModel>(this.URL + 'Inventory/GetMaterialRequestDetailsById?MaterialRequestId=' + materialRequestId);
  }

  CreateNewMaterialRequest(model: MaterialRequestModel) {
    return this.http.post<ActionsResponseModel>(this.URL + 'Inventory/CreateNewMaterialRequest', model);
  }

  EditMaterialRequest(materialRequestId: number, model: MaterialRequestModel) {
    return this.http.post<ActionsResponseModel>(this.URL + `Inventory/EditMaterialRequest?MaterialRequestId=${materialRequestId}`, model);
  }

  CancelMaterialRequest(MaterialRequestId: number) {
    return this.http.get<ActionsResponseModel>(this.URL + 'Inventory/CancelMaterialRequest?MaterialRequestId=' + MaterialRequestId);
  }

  GetMaterialRequestProducts_Data(materialRequestIds: number[]) {
    return this.http.post<GeneralOrderDetailsModel[]>(this.URL + `Inventory/GetMaterialRequestProducts_Data`,materialRequestIds);
  }

}
