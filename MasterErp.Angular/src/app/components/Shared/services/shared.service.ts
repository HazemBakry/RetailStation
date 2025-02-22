import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, map } from 'rxjs';
import { CustomerModel } from '../../GeneralAccounts/models/GeneralAccounts/CustomerModel';
import { ExcelExportStyle } from '../Enums/ImporterTemplateEnum';
import { ActionsResponseModel } from '../models/ActionsResponseModel';
import { FormControl, FormGroup } from '@angular/forms';
import { FormDropdownModel } from '../components/drop-down-form-control/drop-down-form-control.component';

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
          debugger;
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


  //================================== Selectors (dropdown) ===============================

  GetAccountsSelector(IsParent: boolean = false) {
    return this.http.get<any[]>(this.URL + 'Shared/GetAccountsSelector?IsParent=' + IsParent);
  }

  GetCostCenterSelector(IsParent: boolean = false) {
    return this.http.get<any[]>(this.URL + 'Shared/GetCostCenterSelector?IsParent=' + IsParent);
  }

  GetAccountTypesSelector() {
    return this.http.get<FormDropdownModel[]>(this.URL + 'Shared/GetAccountTypes');
  }

  GetJournalEntryTypesSelector(){
    return this.http.get<FormDropdownModel[]>(this.URL + 'Shared/GetJournalEntryTypesSelector');
  }

  GetBranchesSelector() {
    return this.http.get<FormDropdownModel[]>(this.URL + 'Shared/GetBranchesSelector');
  }

  GetVacationTypesSelector() {
    return this.http.get<FormDropdownModel[]>(this.URL + 'Vacation/GetVacationTypesSelector');
  }
  GetActiveEmployeesSelector() {
    return this.http.get<FormDropdownModel[]>(this.URL + 'Employee/GetActiveEmployeesSelector');
  }

  GetLoanTypesSelector() {
    return this.http.get<FormDropdownModel[]>(this.URL + 'Loans/GetLoanTypesSelector');
  }

  GetBanksSelector() {
    return this.http.get<FormDropdownModel[]>(this.URL + 'Shared/GetBanksSelector');
  }
  GetNationalitiesSelector() {
    return this.http.get<FormDropdownModel[]>(this.URL + 'Shared/GetNationalitiesSelector');
  }
  GetIqamaIssuePlacesSelector() {
    return this.http.get<FormDropdownModel[]>(this.URL + 'Shared/GetIqamaIssuePlacesSelector');
  }
  GetVisaJobsSelector() {
    return this.http.get<FormDropdownModel[]>(this.URL + 'Shared/GetVisaJobsSelector');
  }
  GetCountriesSelector() {
    return this.http.get<FormDropdownModel[]>(this.URL + 'Shared/GetCountriesSelector');
  }
  GetCitiesSelector() {
    return this.http.get<FormDropdownModel[]>(this.URL + 'Shared/GetCitiesSelector');
  }
  GetRegionsSelector() {
    return this.http.get<FormDropdownModel[]>(this.URL + 'Shared/GetRegionsSelector');
  }
  GetSuppliersSelector() {
    return this.http.get<FormDropdownModel[]>(this.URL + 'Shared/GetSuppliersSelector');
  }
  GetSupplierGroupsSelector() {
    return this.http.get<FormDropdownModel[]>(this.URL + 'Shared/GetSupplierGroupsSelector');
  }
  GetPurchaseInvoiceTypesSelector() {
    return this.http.get<FormDropdownModel[]>(this.URL + 'Shared/GetPurchaseInvoiceTypesSelector');
  }
  GetItemsSelector() {
    return this.http.get<FormDropdownModel[]>(this.URL + 'Shared/GetItemsSelector');
  }
  GetItemCategoriesSelector() {
    return this.http.get<FormDropdownModel[]>(this.URL + 'Shared/GetItemCategoriesSelector');
  }
  GetUnitsSelector() {
    return this.http.get<FormDropdownModel[]>(this.URL + 'Shared/GetUnitsSelector');
  }
  GetChildAccountsSelector() {
    return this.http.get<FormDropdownModel[]>(this.URL + 'Shared/GetChildAccountsSelector');
  }
  GetInventoriesSelector() {
    return this.http.get<FormDropdownModel[]>(this.URL + 'Shared/GetInventoriesSelector');
  }
  GetItemLookupsSelector() {
    return this.http.get<FormDropdownModel[]>(this.URL + 'Shared/GetItemLookupsSelector');
  }
  GetCurrencySelector() {
    return this.http.get<FormDropdownModel[]>(this.URL + 'Shared/GetCurrencySelector');
  }
  GetReligionsSelector() {
    return this.http.get<FormDropdownModel[]>(this.URL + 'Shared/GetReligionsSelector');
  }
  GetSocialStatusSelector() {
    return this.http.get<FormDropdownModel[]>(this.URL + 'Shared/GetSocialStatusSelector');
  }
}
