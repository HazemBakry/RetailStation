import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ActionsResponseModel } from '../../Shared/models/ActionsResponseModel';
import { PagedResponseModel } from '../../Shared/models/PagedResponseDTO';
import { FilterItem, FilterModel } from '../../Shared/models/FilterModel';
import { SubscribeRequestModel } from '../../Admin/models/SubscribeRequestModel';
import { CreateOrderModel, WebsiteOrderModel } from '../models/WebsiteOrderModel ';
import { SliderModel } from '../../Admin/models/Operation/SliderModel';
import { SupplierItemModel } from '../../Shared/models/SupplierItemModel';
import { PromotionModel } from '../../Shared/models/PromotionModel';


@Injectable({
  providedIn: 'root',
})
export class WebsiteService {
  URL = environment.apiURL;

  constructor(private http: HttpClient) { }



  /////////////////////////////// SupplierItems ////////////////////////

  GetWebsiteItems_Data(searchModel: PagedResponseModel<SupplierItemModel[]>) {
    return this.http.post<PagedResponseModel<SupplierItemModel[]>>(this.URL + 'Website/GetWebsiteItems_Data', searchModel);
  }
  GetWebsiteItems_Filters(searchModel: PagedResponseModel<SupplierItemModel[]>) {
    return this.http.post<FilterModel[]>(this.URL + 'Website/GetWebsiteItems_Filters', searchModel);
  }
  GetWebsitePromotionItems(searchModel: PagedResponseModel<PromotionModel[]>) {
    return this.http.post<PagedResponseModel<PromotionModel[]>>(this.URL + 'Website/GetWebsitePromotionItems', searchModel);
  }
  GetWebsiteMainSlider() {
    return this.http.get<SliderModel[]>(this.URL + 'Website/GetWebsiteMainSlider');
  }

  GetWebsiteItemDetailsById(itemId: number) {
    return this.http.get<SupplierItemModel>(this.URL + `Website/GetWebsiteItemDetailsById?SupplierItemId=${itemId}`);
  }




  //////////////////////  SubscribeRequest
  SaveNewSubscribeRequest(model: SubscribeRequestModel) {
    return this.http.post<ActionsResponseModel>(this.URL + 'Auth/SubscribeRequest', model);
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
}
