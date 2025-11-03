import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ActionsResponseModel } from '../../Shared/models/ActionsResponseModel';
import { PagedResponseModel } from '../../Shared/models/PagedResponseDTO';
import { FilterItem, FilterModel } from '../../Shared/models/FilterModel';
import { CreateOrderModel, WebsiteOrderModel } from '../models/WebsiteOrderModel ';
import { SliderModel } from '../../Admin/models/Operation/SliderModel';
import { MerchantItemModel } from '../../Shared/models/MerchantItemModel';
import { PromotionModel } from '../../Shared/models/PromotionModel';
import { ItemCategoryModel } from '../../Shared/models/ItemCategory';
import { TopPartner } from '../../Shared/models/TopPartnerModel';
import { SearchAutoCompleteModel } from '../models/SearchAutoCompleteModel';
import { MerchantRequestModel } from '../../Admin/models/MerchantRequestModel';


@Injectable({
  providedIn: 'root',
})
export class WebsiteService {
  URL = environment.apiURL;

  constructor(private http: HttpClient) { }


  GetWebsiteHomeCategories() {
    return this.http.get<PagedResponseModel<ItemCategoryModel[]>>(this.URL + 'Website/GetWebsiteHomeCategories');
  }

  /////////////////////////////// SupplierItems ////////////////////////

  GetWebsiteItems_Data(searchModel: PagedResponseModel<MerchantItemModel[]>) {
    return this.http.post<PagedResponseModel<MerchantItemModel[]>>(this.URL + 'Website/GetWebsiteItems_Data', searchModel);
  }

  GetWebsiteItems_Filters(searchModel: PagedResponseModel<MerchantItemModel[]>) {
    return this.http.post<FilterModel[]>(this.URL + 'Website/GetWebsiteItems_Filters', searchModel);
  }

  GetItemsByCategoryId(categoryId: number, searchModel: PagedResponseModel<MerchantItemModel[]>) {
    return this.http.post<PagedResponseModel<MerchantItemModel[]>>(this.URL + `Website/GetItemsByCategoryId?CategoryId=${categoryId}`, searchModel);
  }

  GetWebsitePromotionItems(searchModel: PagedResponseModel<PromotionModel[]>) {
    return this.http.post<PagedResponseModel<PromotionModel[]>>(this.URL + 'Website/GetWebsitePromotionItems', searchModel);
  }
  GetWebsiteMainSlider() {
    return this.http.get<SliderModel[]>(this.URL + 'Website/GetWebsiteMainSlider');
  }

  GetWebsiteItemDetailsById(itemId: number) {
    return this.http.get<MerchantItemModel>(this.URL + `Website/GetWebsiteItemDetailsById?merchantItemId=${itemId}`);
  }




  //////////////////////  MerchantRequest
  SaveNewMerchantRequest(model: MerchantRequestModel) {
    return this.http.post<ActionsResponseModel>(this.URL + 'Auth/ApplyMerchantRequest', model);
  }



  /////////////// order
  //-------------------------------------  Order ----------------------------------
  CreateNewOrder(order: CreateOrderModel) {
    return this.http.post<ActionsResponseModel>(this.URL + 'Order/CreateNewOrder', order);
  }


  GetOrders_Data(model: PagedResponseModel) {
    return this.http.post<PagedResponseModel<WebsiteOrderModel[]>>(this.URL + 'Order/GetOrders_Data', model);
  }
  GetOrders_Filters(model: PagedResponseModel<any[]>) {
    return this.http.post<FilterItem[]>(this.URL + 'Order/GetOrders_Filters', model);
  }

  GetOrderDetailsById(orderId: number) {
    return this.http.get<WebsiteOrderModel>(this.URL + 'Order/GetOrderDetailsById?OrderId=' + orderId);

  }

  GetTopPartners() {
    return this.http.get<TopPartner[]>(this.URL + `Website/GetTopPartners`);
  }
  ToggleFavorite(merchantItemId: number) {
    return this.http.get<ActionsResponseModel>(this.URL + 'Website/ToggleFavorite?merchantItemId=' + merchantItemId);
  }
  SearchAutoComplete(searchText: string) {
    return this.http.get<SearchAutoCompleteModel[]>(this.URL + 'Website/SearchAutoComplete?SearchText=' + searchText);
  }
}
