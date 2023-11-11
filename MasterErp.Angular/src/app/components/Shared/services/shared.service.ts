import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, map } from 'rxjs';
import { CustomerModel } from '../../GeneralAccounts/models/GeneralAccounts/CustomerModel';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  URL = environment.apiURL;

  constructor(private http: HttpClient) { }

  //================================== AccountTree ===============================

  GetAccountTreeData(SearchText: string) {
    return this.http.get<any>(this.URL + 'AccountTree/GetAccountTreeData?SearchText=' + SearchText);
  }

  //================================== CostCenterTree ===============================

  GetCostCenterTreeData() {
    return this.http.get<any>(this.URL + 'CostCenterTree/GetCostCenterTreeData');
  }


  
  //================================== GetCustomersData ===============================

  GetCustomersData() :Observable<CustomerModel[]>{
    return this.http.get<CustomerModel[]>(this.URL + 'Shared/GetCustomersData').
    pipe(
      map(response => {
        response.map(x=>x.nameAR=x.nameEN=x.name)
        return response;
      }));
  }

  GetReceiptLedgersData() {
    return this.http.get<any[]>(this.URL + 'Shared/GetReceiptLedgersData');
  }

  // GetAccountsTreeList() {
  //   return this.http.get<any[]>(this.URL + 'AccountTree/GetChildAccountsList');
  // }

  GetSuppliersData() {
    return this.http.get<any[]>(this.URL + 'Supplier/GetSuppliersData');
  }

  GetAccountsList(isParent:boolean=false) {
    return this.http.get<any[]>(this.URL + 'Shared/GetAccountsList?IsParent='+isParent);
  }
  GetAccountsByTypeId(typeId:number) {
    return this.http.get<any[]>(this.URL + 'Shared/GetAccountsByTypeId?TypeId='+typeId);
  }
}
