import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ActionsResponseModel } from '../../Shared/models/ActionsResponseModel';
import { PagedResponseModel } from '../../Shared/models/PagedResponseDTO';
import { FilterItem, FilterModel } from '../../Shared/models/FilterModel';
import { SliderModel } from '../../Admin/models/Operation/SliderModel';
import { CreateOrderModel, WebsiteOrderModel } from '../../Website/models/WebsiteOrderModel ';
import { PromotionModel } from '../../Shared/models/PromotionModel';
import { MerchantItemModel } from '../../Shared/models/MerchantItemModel';
import { MerchantRequestModel } from '../../Admin/models/MerchantRequestModel';


@Injectable({
  providedIn: 'root',
})
export class WebsiteService {
  URL = environment.apiURL;

  constructor(private http: HttpClient) { }



  /////////////////////////////// SupplierItems ////////////////////////

  GetWebsiteItems_Data(searchModel: PagedResponseModel<MerchantItemModel[]>) {
    return this.http.post<PagedResponseModel<MerchantItemModel[]>>(this.URL + 'Website/GetWebsiteItems_Data', searchModel);
  }
  GetWebsiteItems_Filters(searchModel: PagedResponseModel<MerchantItemModel[]>) {
    return this.http.post<FilterModel[]>(this.URL + 'Website/GetWebsiteItems_Filters', searchModel);
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
    debugger
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
