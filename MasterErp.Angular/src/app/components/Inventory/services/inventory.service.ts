import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ReceiveOrderModel } from '../models/inventory';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  URL = environment.apiURL;

  constructor(private http: HttpClient) { }

  GetReceiveOrdersData() {
    return this.http.get<any[]>(this.URL + 'Inventory/GetReceiveOrdersData');
  }

  GetInventoryList() {
    return this.http.get<any[]>(this.URL + 'Inventory/GetInventoryList');
  }
  CreateNewReceiveOrder(model: ReceiveOrderModel) {
    return this.http.post<any>(this.URL + 'Inventory/CreateNewReceiveOrder', model);
  }

  GetOrdersSearchData(supplierId:number,orderNumber:string,orderDate:string) {
    supplierId=supplierId?supplierId:0;
    orderNumber=orderNumber?orderNumber:'';
    orderDate=orderDate?orderDate:'';
    return this.http.get<any[]>(this.URL + 'Inventory/GetOrdersSearchData?SupplierId='+supplierId+'&OrderNumber='+orderNumber+'&OrderDate='+orderDate);
  }
}
