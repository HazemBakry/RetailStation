import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { SalesInvoiceModel } from '../models/SalesInvoiceModel';
import { FilterModel } from 'src/app/components/Shared/models/FilterModel';
import { PagedResponseDTO, PagedResponseModel } from '../../Shared/models/PagedResponseDTO';
import { ActionsResponseModel } from '../../Shared/models/ActionsResponseModel';
import { SupplierModel } from '../../Shared/models/SupplierModel';
import { ItemModel } from '../../Shared/models/ItemModel';
import { UnitModel } from '../../Shared/models/UnitModel';
import { ItemCategoryModel } from '../../Shared/models/ItemCategory';
import { CategorySortModel } from '../../Shared/models/CategorySort';
import { SupplierItemModel } from '../../Shared/models/SupplierItemModel';
import { PurchaseReturnsModel } from '../../Purchases/models/PurchaseReturns';
import { GeneralOrderDetailsModel } from '../../Inventory/models/GeneralOrderModel ';

@Injectable({
  providedIn: 'root'
})
export class SalesService {
  URL = environment.apiURL;

  constructor(private http: HttpClient) { }

  GetSalesInvoicesData(model: FilterModel) {
    return this.http.post<any[]>(this.URL + 'SalesInvoice/GetSalesInvoicesData', model);
  }

  CreateNewSalesInvoice(model: SalesInvoiceModel) {
    return this.http.post<any>(this.URL + 'SalesInvoice/CreateNewSalesInvoice', model);
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
    return this.http.get<PagedResponseModel<ItemCategoryModel[]>>(this.URL + 'Items/GetItemCategories');
  }

  ChangeItemCategoryActiveStatus(CategoryId: number) {
    return this.http.get<ActionsResponseModel>(this.URL + 'Items/ChangeItemCategoryActiveStatus?CategoryId=' + CategoryId);
  }

  ChangeCategoriesDisplayOrder(SortedItems: CategorySortModel[]) {
    return this.http.post<ActionsResponseModel>(this.URL + 'Items/ChangeCategoriesDisplayOrder', SortedItems);
  }

  //------------------------------------------------------- Units ------------------------------------------------------//

  GetUnits_Data(model: PagedResponseModel<UnitModel[]>) {
    return this.http.post<PagedResponseModel<UnitModel[]>>(this.URL + 'Items/GetUnits_Data', model);
  }

  CreateNewUnit(model: UnitModel) {
    return this.http.post<ActionsResponseModel>(this.URL + 'Items/AddUnit', model);
  }

  EditUnit(unitId: number, model: UnitModel) {
    return this.http.post<ActionsResponseModel>(this.URL + `Items/EditUnit?UnitId=${unitId}`, model);
  }

  DeleteUnit(unitId: number) {
    return this.http.get<ActionsResponseModel>(this.URL + `Items/DeleteUnit?UnitId=${unitId}`);
  }


  //--------------------------------------- Suppliers ---------------------------------------

  GetSuppliers_Data(model: PagedResponseModel<SupplierModel[]>) {
    return this.http.post<PagedResponseModel<SupplierModel[]>>(this.URL + 'Suppliers/GetSuppliers_Data', model);
  }

  GetSupplierDetailsById(supplierId: number) {
    return this.http.get<SupplierModel>(this.URL + 'Suppliers/GetSupplierDetailsById?SupplierId=' + supplierId);
  }

  CreateNewSupplier(model: SupplierModel) {
    return this.http.post<ActionsResponseModel>(this.URL + 'Suppliers/AddNewSupplier', model);
  }

  EditSupplier(supplierId: number, model: SupplierModel) {
    return this.http.post<ActionsResponseModel>(this.URL + 'Suppliers/EditSupplier?SupplierId=' + supplierId, model);
  }

  DeleteSupplier(supplierId: number) {
    return this.http.get<ActionsResponseModel>(this.URL + 'Suppliers/DeleteSupplier?SupplierId=' + supplierId);
  }



  /////////////////////////////// Items ////////////////////////

  GetItemsData(searchModel: PagedResponseModel<ItemModel[]>) {
    return this.http.post<PagedResponseModel<ItemModel[]>>(this.URL + 'Items/GetItemsData', searchModel);
  }

  GetItemDetailsById(itemId: number) {
    return this.http.get<ItemModel>(this.URL + `Items/GetItemDetailsById?ItemId=${itemId}`);
  }

  AddNewItem(model: FormData) {
    return this.http.post<ActionsResponseModel>(this.URL + 'Items/AddNewItem', model);
  }

  EditItem(itemId: number, model: FormData) {
    return this.http.post<ActionsResponseModel>(this.URL + `Items/EditItem?ItemId=${itemId}`, model)
  }

  DeleteItem(itemId: number) {
    return this.http.get<ActionsResponseModel>(this.URL + `Items/DeleteItem?ItemId=${itemId}`);
  }
  ChangeItemActiveStatus(ItemId: number) {
    return this.http.get<ActionsResponseModel>(this.URL + 'Items/ChangeItemActiveStatus?ItemId=' + ItemId);
  }
  ItemQuickUpdate(ItemId: number, Price: number, UnitId: number) {
    return this.http.get<ActionsResponseModel>(this.URL + `Items/ItemQuickUpdate?ItemId=${ItemId}&Price=${Price}&UnitId=${UnitId}`);
  }
  ExportItems(searchModel: PagedResponseModel, categoryId: number) {
    return this.http.post<ActionsResponseModel>(this.URL + `Items/ExportItems?CategoryId=${categoryId} `, searchModel);
  }
  GetSuppliersByItemId(itemId: number) {
    return this.http.get<PagedResponseModel<SupplierModel[]>>(this.URL + `Suppliers/GetSuppliersByItemId?ItemId=${itemId} `);
  }

  GetSupplierItems_Data(supplierId: number, searchModel: PagedResponseModel<SupplierItemModel[]>) {
    return this.http.post<PagedResponseModel<SupplierItemModel[]>>(this.URL + `SupplierManagement/GetSupplierItems_Data?SupplierId=${supplierId}`, searchModel);
  }


  CancelPurchaseReturns(returnsId: number) {
    return this.http.get<ActionsResponseModel>(this.URL + 'PurchaseInvoice/CancelPurchaseReturns?ReturnsId=' + returnsId);
  }

  GetPurchaseReturns_Data(model: PagedResponseDTO) {
    return this.http.post<PagedResponseDTO<PurchaseReturnsModel[]>>(this.URL + 'PurchaseInvoice/GetPurchaseReturns_Data', model);
  }

  GetPurchaseReturnsDetailsById(orderId: number) {
    return this.http.get<PurchaseReturnsModel>(this.URL + `PurchaseInvoice/GetPurchaseReturnsDetailsById?OrderId=${orderId}`);
  }

  GetPurchaseReturnsProducts_Data(orderId: number) {
    return this.http.get<GeneralOrderDetailsModel[]>(this.URL + `PurchaseInvoice/GetPurchaseReturnsProducts_Data?OrderId=${orderId}`);
  }

  AddNewPurchaseReturns(model: PurchaseReturnsModel) {
    return this.http.post<ActionsResponseModel>(this.URL + 'PurchaseInvoice/AddNewPurchaseReturns', model);
  }
  
  EditPurchaseReturns(orderId:number,model: PurchaseReturnsModel) {
    return this.http.post<ActionsResponseModel>(this.URL + `PurchaseInvoice/EditPurchaseReturns?OrderId=${orderId}`, model);
  }



  MapSupplierItem(supplierId: number, supplierItemId: number, itemId: number) {
    const params = new URLSearchParams();
    params.append('SupplierId', supplierId.toString());
    params.append('SupplierItemId', supplierItemId.toString());
    if (itemId !== null) {
      params.append('ItemId', itemId.toString());
    }

    const queryString = params.toString();
    return this.http.get<ActionsResponseModel>(this.URL + `SupplierManagement/MapSupplierItem?${queryString}`);

  }

}