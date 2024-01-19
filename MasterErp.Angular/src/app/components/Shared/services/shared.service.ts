import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, map } from 'rxjs';
import { CustomerModel } from '../../GeneralAccounts/models/GeneralAccounts/CustomerModel';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  taxPercent:number=0.15;
  URL = environment.apiURL;

  constructor(private http: HttpClient) { }

  calculateTaxValue(totalAmount:number):number{
    var taxValue=0;
    if(totalAmount&&totalAmount>0)
    {
      taxValue=totalAmount-(totalAmount/(1+this.taxPercent));
    }
    return taxValue;
  }
  //================================== AccountTree ===============================

  GetAccountTreeData_Old(SearchText: string) {
    return this.http.get<any>(this.URL + 'AccountTree/GetAccountTreeData_Old?SearchText=' + SearchText);
  }
  GetAccountTreeData(SearchText: string) {
    return this.http.get<any>(this.URL + 'AccountTree/GetAccountTreeData?SearchText=' + SearchText);
  }
  GetAccountTreeHierarchicalData(SearchText: string) {
    return this.http.get<any>(this.URL + 'AccountTree/GetAccountTreeHierarchicalData?SearchText=' + SearchText);
  }

  //================================== CostCenterTree ===============================

  GetCostCenterTreeData(isParent=false) {
    return this.http.get<any>(this.URL + 'CostCenterTree/GetCostCenterTreeData?IsParent='+isParent);
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


  GetReceiptLedgerTypes() {
    return this.http.get<any[]>(this.URL + 'Shared/GetReceiptLedgerTypes');
  }
  GetFinancialPeriods() {
    return this.http.get<any[]>(this.URL + 'Shared/GetFinancialPeriods');
  }


  GetAccountTypes()
  {
    return this.http.get<any[]>(this.URL + 'Shared/GetAccountTypes');
  }
}
