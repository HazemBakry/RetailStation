import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, map } from 'rxjs';
import { CustomerModel } from '../../GeneralAccounts/models/GeneralAccounts/CustomerModel';
import { ExcelExportStyle } from '../Enums/ImporterTemplateEnum';
import { ActionsResponseModel } from '../models/ActionsResponseModel';
import { FormControl, FormGroup } from '@angular/forms';
import { GeneralSelectorModel } from '../components/general-selector/general-selector.component';
import { FinancialPeriodModel } from '../../GeneralAccounts/models/FinancialPeriodModel';
import { AccountTypeEnum } from '../Enums/AccountTypeEnum';

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

  GetReceiptLedgersSelector(PaymentTypeId: number) {
    return this.http.get<any[]>(this.URL + 'Shared/GetReceiptLedgersSelector?PaymentTypeId=' + PaymentTypeId);
  }


  GetAccountsByTypeId(typeId: number) {
    return this.http.get<any[]>(this.URL + 'Shared/GetAccountsByTypeId?TypeId=' + typeId);
  }

  GetReceiptLedgerTypes() {
    return this.http.get<any[]>(this.URL + 'Shared/GetReceiptLedgerTypes');
  }

  GetFinancialPeriods() {
    return this.http.get<FinancialPeriodModel[]>(this.URL + 'Shared/GetFinancialPeriods');
  }
  GetCurrentFinancialPeriod() {
    return this.http.get<FinancialPeriodModel>(this.URL + 'Shared/GetCurrentFinancialPeriod');
  }

  downloadImporterTemplate(template: ExcelExportStyle) {
    return this.http.get<ActionsResponseModel>(this.URL + 'Shared/DownloadImporterTemplate?ImporterType=' + template);
  }


  // --------------------------------- Finance Lookups --------------------------------- //

  // GetAccountsSelector(IsGroup: boolean = false) {
  //   return this.http.get<any[]>(this.URL + 'Shared/GetAccountsSelector?IsGroup=' + IsGroup);
  // }
  // GetAccountsSelector(IsGroup: boolean = null,accountTypeId:number=null) {
  //   const param = IsGroup !== null ? `?IsGroup=${IsGroup}` : '';

  //   return this.http.get<any[]>(this.URL + 'Shared/GetAccountsSelector' + param);
  // }
  GetAccountsSelector(IsGroup: boolean = null, accountTypeId: AccountTypeEnum = null) {
    const params = new URLSearchParams();

    if (IsGroup !== null) {
      params.append('IsGroup', IsGroup.toString());
    }
    if (accountTypeId !== null) {
      params.append('AccountTypeId', accountTypeId.toString());
    }

    const queryString = params.toString();
    return this.http.get<any[]>(this.URL + 'Shared/GetAccountsSelector' + (queryString ? `?${queryString}` : ''));
  }
  GetCostCenterSelector(IsParent: boolean = false, accountId: number = null) {
    const params = new URLSearchParams();

    if (IsParent !== null) {
      params.append('IsParent', IsParent.toString());
    }
    if (accountId !== null) {
      params.append('AccountId', accountId.toString());
    }

    const queryString = params.toString();
    return this.http.get<any[]>(this.URL + 'Shared/GetCostCenterSelector' + (queryString ? `?${queryString}` : ''));
  }
  GetJournalTemplatesSelector() {
    return this.http.get<GeneralSelectorModel[]>(this.URL + 'Shared/GetJournalTemplatesSelector');
  }

  GetBranchesSelector() {
    return this.http.get<GeneralSelectorModel[]>(this.URL + 'Shared/GetBranchesSelector');
  }
  GetSponsorsSelector() {
    return this.http.get<GeneralSelectorModel[]>(this.URL + 'Shared/GetSponsorsSelector');
  }
  GetDepartmentsSelector() {
    return this.http.get<GeneralSelectorModel[]>(this.URL + 'Shared/GetDepartmentsSelector');
  }
  GetOrderStatusSelector() {
    return this.http.get<GeneralSelectorModel[]>(this.URL + 'Shared/GetOrderStatusSelector');
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

  GetAllEmployeesSelector() {
    return this.http.get<GeneralSelectorModel[]>(this.URL + 'Employee/GetAllEmployeesSelector');
  }

  GetActiveEmployeesSelector() {
    return this.http.get<GeneralSelectorModel[]>(this.URL + 'Employee/GetActiveEmployeesSelector');
  }

  GetIqamaIssuePlacesSelector() {
    return this.http.get<GeneralSelectorModel[]>(this.URL + 'Shared/GetIqamaIssuePlacesSelector');
  }

  GetBanksSelector() {
    return this.http.get<GeneralSelectorModel[]>(this.URL + 'Shared/GetBanksSelector');
  }

  GetVisaJobsSelector() {
    return this.http.get<GeneralSelectorModel[]>(this.URL + 'Shared/GetVisaJobsSelector');
  }

  GetRegionsSelector() {
    return this.http.get<GeneralSelectorModel[]>(this.URL + 'Shared/GetRegionsSelector');
  }

  GetCustomersSelector() {
    return this.http.get<GeneralSelectorModel[]>(this.URL + 'Shared/GetCustomersSelector');
  }

  GetArabicEnglishNumberText(ReceiptId: any) {
    return this.http.get<any>(this.URL + 'Shared/GetArabicEnglishNumberText?ReceiptId=' + ReceiptId);
  }


}
