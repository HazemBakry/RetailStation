import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, map } from 'rxjs';
import { CustomerModel } from '../../GeneralAccounts/models/GeneralAccounts/CustomerModel';
import { ExcelExportStyle } from '../Enums/ImporterTemplateEnum';
import { ActionsResponseModel } from '../models/ActionsResponseModel';
import { FormControl, FormGroup } from '@angular/forms';
import { GeneralSelectorModel } from '../components/general-selector/general-selector.component';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  taxPercent: number = 0.15;
  URL = environment.apiURL;

  constructor(private http: HttpClient) {

  }

  urlDownloadOrOpen(url?: string) {
    try {
      if (url !== null && url !== ' ' && url !== '') {
        window.location.href = url;
      } else {
      }
    } catch (error) {

    }
  }

  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }

  calculateTaxValue(totalAmount: number): number {
    var taxValue = 0;
    if (totalAmount && totalAmount > 0) {
      taxValue = totalAmount - (totalAmount / (1 + this.taxPercent));
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

  GetCostCenterTreeData(isParent = false) {
    return this.http.get<any>(this.URL + 'CostCenterTree/GetCostCenterTreeData?IsParent=' + isParent);
  }



  //================================== GetCustomersData ===============================

  GetCustomersData(): Observable<CustomerModel[]> {
    return this.http.get<CustomerModel[]>(this.URL + 'Shared/GetCustomersData').
      pipe(
        map(response => {
          response.map(x => {
            return {
              ...x,
              name: x.nameAR
            }
          })
          return response;
        }));
  }

  GetLeadgerJournalsData() {
    return this.http.get<any[]>(this.URL + 'Shared/GetLeadgerJournalsData');
  }

  GetReceiptLedgersSelector() {
    return this.http.get<any[]>(this.URL + 'Shared/GetReceiptLedgersSelector');
  }

  // GetAccountsTreeList() {
  //   return this.http.get<any[]>(this.URL + 'AccountTree/GetChildAccountsList');
  // }

  GetAccountsByTypeId(typeId: number) {
    return this.http.get<any[]>(this.URL + 'Shared/GetAccountsByTypeId?TypeId=' + typeId);
  }

  GetReceiptLedgerTypes() {
    return this.http.get<any[]>(this.URL + 'Shared/GetReceiptLedgerTypes');
  }

  GetFinancialPeriods() {
    return this.http.get<any[]>(this.URL + 'Shared/GetFinancialPeriods');
  }

  downloadImporterTemplate(template: ExcelExportStyle) {
    return this.http.get<ActionsResponseModel>(this.URL + 'Shared/DownloadImporterTemplate?ImporterType=' + template);
  }


  // --------------------------------- Finance Lookups --------------------------------- //

  GetAccountsSelector(IsParent: boolean = false) {
    return this.http.get<any[]>(this.URL + 'Shared/GetAccountsSelector?IsParent=' + IsParent);
  }

  GetCostCenterSelector(IsParent: boolean = false) {
    return this.http.get<any[]>(this.URL + 'Shared/GetCostCenterSelector?IsParent=' + IsParent);
  }

  GetBranchesSelector() {
    return this.http.get<GeneralSelectorModel[]>(this.URL + 'Shared/GetBranchesSelector');
  }

  GetStoresSelector() {
    return this.http.get<GeneralSelectorModel[]>(this.URL + 'Shared/GetStoresSelector');
  }

  GetSuppliersSelector() {
    return this.http.get<GeneralSelectorModel[]>(this.URL + 'Shared/GetSuppliersSelector');
  }

  GetSupplierGroupsSelector() {
    return this.http.get<GeneralSelectorModel[]>(this.URL + 'Shared/GetSupplierGroupsSelector');
  }

  GetPurchaseInvoiceTypesSelector() {
    return this.http.get<GeneralSelectorModel[]>(this.URL + 'Shared/GetPurchaseInvoiceTypesSelector');
  }

  GetItemsSelector() {
    return this.http.get<GeneralSelectorModel[]>(this.URL + 'Shared/GetItemsSelector');
  }

  GetItemCategoriesSelector() {
    return this.http.get<GeneralSelectorModel[]>(this.URL + 'Shared/GetItemCategoriesSelector');
  }

  GetUnitsSelector() {
    return this.http.get<GeneralSelectorModel[]>(this.URL + 'Shared/GetUnitsSelector');
  }

  GetChildAccountsSelector() {
    return this.http.get<GeneralSelectorModel[]>(this.URL + 'Shared/GetChildAccountsSelector');
  }

  GetItemLookupsSelector() {
    return this.http.get<GeneralSelectorModel[]>(this.URL + 'Shared/GetItemLookupsSelector');
  }

  // --------------------------------- HR Selectors --------------------------------- //

  GetActiveEmployeesSelector() {
    return this.http.get<GeneralSelectorModel[]>(this.URL + 'Employee/GetActiveEmployeesSelector');
  }

  GetIqamaIssuePlacesSelector() {
    return this.http.get<GeneralSelectorModel[]>(this.URL + 'Shared/GetIqamaIssuePlacesSelector');
  }

  GetVisaJobsSelector() {
    return this.http.get<GeneralSelectorModel[]>(this.URL + 'Shared/GetVisaJobsSelector');
  }

  GetRegionsSelector() {
    return this.http.get<GeneralSelectorModel[]>(this.URL + 'Shared/GetRegionsSelector');
  }

  GetReligionsSelector() {
    return this.http.get<GeneralSelectorModel[]>(this.URL + 'Shared/GetReligionsSelector');
  }

  GetSocialStatusSelector() {
    return this.http.get<GeneralSelectorModel[]>(this.URL + 'Shared/GetSocialStatusSelector');
  }

  GetCustomersSelector() {
    return this.http.get<GeneralSelectorModel[]>(this.URL + 'Shared/GetCustomersSelector');
  }

}
