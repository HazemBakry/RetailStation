import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { ActionsResponseModel } from '../../Shared/models/ActionsResponseModel';
import { SubscriberApplicationModel, SubscriberModel } from '../models/Subscriber';
import { AddUserRoleModel, RoleModel } from '../../Shared/models/RoleModel';
import { UserModel } from '../../Shared/models/UserModel';
import { BranchModel } from '../../Shared/models/BranchModel';
import { ItemCategoryModel } from '../models/Operation/itemCategory';
import { CategorySortModel } from '../models/Operation/categorySort';
import { PagedResponseModel } from '../../Shared/models/PagedResponseDTO';
import { UnitModel } from '../models/Operation/UnitModel';
import { SupplierModel } from '../models/Operation/SupplierModel';


@Injectable({
  providedIn: 'root',
})
export class OperationService {
  URL = environment.apiURL;

  constructor(private http: HttpClient) { }


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

}
