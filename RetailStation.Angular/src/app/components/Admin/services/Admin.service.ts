import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ActionsResponseModel } from '../../Shared/models/ActionsResponseModel';
import { PagedResponseModel } from '../../Shared/models/PagedResponseDTO';
import { SliderModel } from '../models/SliderModel';
import { Observable } from 'rxjs';
import { FilterModel } from '../../Shared/models/FilterModel';
import { Tag } from '../models/TagsManagerModels';
import { CityModel, CountryModel, RegionModel } from '../models/CountryModel';
import { TopPartnerModel } from '../../Shared/models/TopPartnerModel';
import { BestSellerItemsModel } from '../../Shared/models/BestSellerItemsModel';
import { ItemModel } from '../../Shared/models/ItemModel';
import { UnitModel } from '../../Shared/models/UnitModel';
import { CategorySortModel } from '../../Shared/models/CategorySort';
import { ItemCategoryModel } from '../../Shared/models/ItemCategory';
import { MerchantItemModel } from '../../Shared/models/MerchantItemModel';


@Injectable({
  providedIn: 'root',
})
export class AdminService {
  URL = environment.apiURL;

  constructor(private http: HttpClient) { }


  //////////////////////////// Slider /////////////////////////////////////

  GetSlidersData(searchModel: any) {
    return this.http.post<PagedResponseModel<SliderModel[]>>(
      this.URL + 'Admin/GetSlidersData',
      searchModel
    );
  }

  GetSliderById(sliderId: number) {
    return this.http.get<SliderModel>(
      this.URL + `Admin/GetSliderById?SliderId=${sliderId}`
    );
  }

  AddSlider(model: FormData) {
    return this.http.post<ActionsResponseModel>(
      this.URL + 'Admin/AddSlider',
      model
    );
  }

  EditSlider(sliderId: number, model: FormData) {
    return this.http.post<ActionsResponseModel>(
      this.URL + `Admin/EditSlider?SliderId=${sliderId}`,
      model
    );
  }

  DeleteSlider(sliderId: number) {
    return this.http.get<ActionsResponseModel>(
      this.URL + `Admin/DeleteSlider?SliderId=${sliderId}`
    );
  }

  ChangeSliderActiveStatus(sliderId: number) {
    return this.http.get<ActionsResponseModel>(
      this.URL + `Admin/ChangeSliderActiveStatus?SliderId=${sliderId}`
    );
  }




  // ================================== Notifications Manager ==================================

  GetNotifications(model: FilterModel) {
    return this.http.post<any>(this.URL + 'Notification/GetNotificationsBySubscriberID', model);
  }

  GetRecipientsByNotificationID(notificationID: number) {
    return this.http.get<any[]>(this.URL + 'Notification/GetRecipientsByNotificationID?notificationID=' + notificationID);
  }

  getCustomers(params: { search?: string, take?: number }): Observable<any[]> {
    const httpParams = new HttpParams({ fromObject: { ...params } });
    return this.http.get<any[]>(this.URL + 'Notification/GetCustomers', { params: httpParams });
  }

  SaveNotification(model: any) {
    return this.http.post<any>(this.URL + 'Notification/SaveNotification', model)
  }

  UpdateNotification(model: any) {
    return this.http.post<any>(this.URL + 'Notification/UpdateNotification', model)
  }

  UpdateNotificationIsActive(id: any, isActive: any) {
    return this.http.post<any>(this.URL + 'Notification/UpdateNotificationStatus?id=' + id, isActive)
  }



  // ================================== Tags Manager ==================================


  getTags() {
    return this.http.get<Tag[]>(this.URL + 'TagsManager/GetTags');
  }

  createTag(tag: Partial<Tag>) {
    const { name } = tag;
    return this.http.post<Tag>(this.URL + 'TagsManager/CreateTag', tag);
  }

  updateTag(tag: Tag) {
    return this.http.post(this.URL + `TagsManager/tags/${tag.tagId}`, tag);
  }

  deleteTag(tagId: number) {
    return this.http.post(this.URL + `TagsManager/DeleteTag/${tagId}`, {});
  }

  getAllItems() {
    return this.http.get<any[]>(this.URL + 'ItemTags/GetAllItems');
  }

  getItemsForTag(tagId: number) {
    return this.http.get<any[]>(this.URL + `ItemTags/tags/${tagId}/items`);
  }

  assignItemToTag(tagId: number, itemId: number) {
    return this.http.post(this.URL + `ItemTags/assign/${itemId}/${tagId}`, {});
  }

  unassignItemFromTag(tagId: number, itemId: number) {
    return this.http.post(this.URL + `ItemTags/unassign/${itemId}/${tagId}`, {});
  }

  updateIsActive(id: any, isActive: any) {
    return this.http.post<any>(this.URL + 'TagsManager/updateIsActive?id=' + id, isActive)
  }


  //----------------------------------- Countries & Cities & Regions -------------------------------//

  GetCountries_Data(model: PagedResponseModel<CountryModel[]>) {
    return this.http.post<PagedResponseModel<CountryModel[]>>(this.URL + 'SystemSetting/GetCountries_Data', model);
  }

  CreateNewCountry(model: CountryModel) {
    return this.http.post<ActionsResponseModel>(this.URL + 'SystemSetting/AddCountry', model);
  }

  EditCountry(unitId: number, model: CountryModel) {
    return this.http.post<ActionsResponseModel>(this.URL + `SystemSetting/EditCountry?CountryId=${unitId}`, model);
  }

  DeleteCountry(unitId: number) {
    return this.http.get<ActionsResponseModel>(this.URL + `SystemSetting/DeleteCountry?CountryId=${unitId}`);
  }


  GetCities_Data(model: PagedResponseModel<CityModel[]>) {
    return this.http.post<PagedResponseModel<CityModel[]>>(this.URL + 'SystemSetting/GetCities_Data', model);
  }

  CreateNewCity(model: CityModel) {
    return this.http.post<ActionsResponseModel>(this.URL + 'SystemSetting/AddCity', model);
  }

  EditCity(unitId: number, model: CityModel) {
    return this.http.post<ActionsResponseModel>(this.URL + `SystemSetting/EditCity?CityId=${unitId}`, model);
  }

  DeleteCity(unitId: number) {
    return this.http.get<ActionsResponseModel>(this.URL + `SystemSetting/DeleteCity?CityId=${unitId}`);
  }


  GetRegions_Data(model: PagedResponseModel<RegionModel[]>) {
    return this.http.post<PagedResponseModel<RegionModel[]>>(this.URL + 'SystemSetting/GetRegions_Data', model);
  }

  CreateNewRegion(model: RegionModel) {
    return this.http.post<ActionsResponseModel>(this.URL + 'SystemSetting/AddRegion', model);
  }

  EditRegion(unitId: number, model: RegionModel) {
    return this.http.post<ActionsResponseModel>(this.URL + `SystemSetting/EditRegion?RegionId=${unitId}`, model);
  }

  DeleteRegion(unitId: number) {
    return this.http.get<ActionsResponseModel>(this.URL + `SystemSetting/DeleteRegion?RegionId=${unitId}`);
  }


  //////////////////////////////// TopPartners ////////////////////////////////

  GetTopPartners_Data(model: PagedResponseModel<TopPartnerModel[]>) {
    return this.http.post<PagedResponseModel<TopPartnerModel[]>>(this.URL + 'Admin/GetTopPartners_Data', model);
  }

  CreateNewTopPartner(model: FormData) {
    return this.http.post<ActionsResponseModel>(this.URL + 'Admin/AddNewTopPartner', model);
  }

  EditTopPartner(unitId: number, model: FormData) {
    return this.http.post<ActionsResponseModel>(this.URL + `Admin/EditTopPartner?TopPartnerId=${unitId}`, model);
  }

  DeleteTopPartner(unitId: number) {
    return this.http.get<ActionsResponseModel>(this.URL + `Admin/DeleteTopPartner?TopPartnerId=${unitId}`);
  }
  ChangeTopPartnerActiveStatus(unitId: number) {
    return this.http.get<ActionsResponseModel>(this.URL + `Admin/ChangeTopPartnerActiveStatus?TopPartnerId=${unitId}`);
  }

  GetBestSellerItems_Data() {
    return this.http.get<BestSellerItemsModel[]>(this.URL + `Admin/GetBestSellerItems_Data`);
  }
  UpdateBestSellerItems(model: BestSellerItemsModel[]) {
    return this.http.post<ActionsResponseModel>(this.URL + `Admin/UpdateBestSellerItems`, model);
  }


  //--------------------------------- Items ------------------------------------//


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

  GetMerchantItems_Data(merchantId: number, searchModel: PagedResponseModel<MerchantItemModel[]>) {
    return this.http.post<PagedResponseModel<MerchantItemModel[]>>(this.URL + `MerchantManagement/GetMerchantItems_Data?MerchantId=${merchantId}`, searchModel);
  }

  //----------------------------------------------- Item Categories ---------------------------------------------//


  AddNewItemCategory(model: FormData) {
    return this.http.post<ActionsResponseModel>(this.URL + 'Items/AddNewItemCategory', model);
  }

  EditItemCategory(categoryId: number, model: FormData) {
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

}
