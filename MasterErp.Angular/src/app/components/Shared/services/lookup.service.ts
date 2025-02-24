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
export class LookupService {
  URL = environment.apiURL;

  constructor(private http: HttpClient) {

  }

  // --------------------------------- Finance Lookups --------------------------------- //

  GetBanksSelector() {
    return this.http.get<FormDropdownModel[]>(this.URL + 'Lookup/GetBanksSelector');
  }

  GetCurrencySelector() {
    return this.http.get<FormDropdownModel[]>(this.URL + 'Lookup/GetCurrencySelector');
  }

  GetAccountTypes() {
    return this.http.get<FormDropdownModel[]>(this.URL + 'Lookup/GetAccountTypes');
  }

  GetActionTypes() {
    return this.http.get<FormDropdownModel[]>(this.URL + 'Lookup/GetActionTypes');
  }

  GetBankDepositTypes() {
    return this.http.get<FormDropdownModel[]>(this.URL + 'Lookup/GetBankDepositTypes');
  }

  GetJournalEntryTypes() {
    return this.http.get<FormDropdownModel[]>(this.URL + 'Lookup/GetJournalEntryTypes');
  }

  GetLedgerTypes() {
    return this.http.get<FormDropdownModel[]>(this.URL + 'Lookup/GetLedgerTypes');
  }

  GetPaymentTypes() {
    return this.http.get<FormDropdownModel[]>(this.URL + 'Lookup/GetPaymentTypes');
  }

  GetReceiptTypes(GroupName: string) {
    return this.http.get<FormDropdownModel[]>(this.URL + 'Lookup/GetReceiptTypes?GroupName=' + GroupName);
  }

  // --------------------------------- HR Lookups --------------------------------- //

  GetVacationTypesSelector() {
    return this.http.get<FormDropdownModel[]>(this.URL + 'Lookup/GetVacationTypesSelector');
  }

  GetLoanTypesSelector() {
    return this.http.get<FormDropdownModel[]>(this.URL + 'Lookup/GetLoanTypesSelector');
  }

  GetNationalitiesSelector() {
    return this.http.get<FormDropdownModel[]>(this.URL + 'Lookup/GetNationalitiesSelector');
  }

  // --------------------------------- Global Lookups --------------------------------- //

  GetCountriesSelector() {
    return this.http.get<FormDropdownModel[]>(this.URL + 'Lookup/GetCountriesSelector');
  }

  GetCitiesSelector() {
    return this.http.get<FormDropdownModel[]>(this.URL + 'Lookup/GetCitiesSelector');
  }

}
