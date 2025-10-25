import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ActionsResponseModel } from '../../Shared/models/ActionsResponseModel';
import { FilterItem } from '../../Shared/models/FilterModel';
import { PagedResponseModel } from '../../Shared/models/PagedResponseDTO';
import { WebsiteOrderItemModel, WebsiteOrderModel } from '../../Website/models/WebsiteOrderModel ';


@Injectable({
  providedIn: 'root',
})
export class OrderService {
  URL = environment.apiURL;

  constructor(private http: HttpClient) { }



  //-------------------------------------  Order ----------------------------------

  GetOrders_Data(model: PagedResponseModel) {
    return this.http.post<PagedResponseModel<WebsiteOrderModel[]>>(this.URL + 'Order/GetOrders_Data', model);
  }
  GetOrders_Filters(model: PagedResponseModel<any[]>) {
    return this.http.post<FilterItem[]>(this.URL + 'Order/GetOrders_Filters', model);
  }
  GetOrderDetailsById(OrderId: number) {
    return this.http.get<WebsiteOrderModel>(this.URL + 'Order/GetOrderDetailsById?OrderId=' + OrderId);
  }
  GetOrder_Items(OrderId: number) {
    return this.http.get<WebsiteOrderItemModel[]>(this.URL + `Order/GetOrder_Items?OrderId=${OrderId}`);
  }
  AddNewOrder(model: WebsiteOrderModel) {
    return this.http.post<ActionsResponseModel>(this.URL + 'Order/AddNewOrder', model);
  }
  EditOrder(OrderId: number, model: WebsiteOrderModel) {
    return this.http.post<ActionsResponseModel>(this.URL + 'Order/EditOrder?OrderId=' + OrderId, model);
  }
  CancelOrder(OrderId: number) {
    return this.http.get<ActionsResponseModel>(this.URL + 'Order/CancelOrder?OrderId=' + OrderId);
  }
}
