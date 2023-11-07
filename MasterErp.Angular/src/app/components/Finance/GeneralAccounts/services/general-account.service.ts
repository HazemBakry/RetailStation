import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { JournalEntryModel } from '../models/GeneralAccounts/JurnalEntryModel';
import { FilterModel, SearchFilterModel } from 'src/app/components/Shared/models/FilterModel';

@Injectable({
  providedIn: 'root'
})
export class GeneralAccountService {
  URL = environment.apiURL;

  constructor(private http: HttpClient) { }

  //================================== JournalEntry ===============================

  GetJournalEntryTypes() {
    return this.http.get<any[]>(this.URL + 'JournalEntry/GetJournalEntryTypes');
  }

  GetCurrencyList() {
    return this.http.get<any[]>(this.URL + 'JournalEntry/GetCurrencyList');
  }

  GetSavedJournalTemplates() {
    return this.http.get<any[]>(this.URL + 'JournalEntry/GetSavedJournalTemplates');
  }

  GetAccountsByTemplateId(templateId: number) {
    return this.http.get<any[]>(this.URL + 'JournalEntry/GetAccountsByTemplateId?templateId=' + templateId);
  }

  SaveNewJouranlEntry(model: JournalEntryModel) {
    return this.http.post<any>(this.URL + 'JournalEntry/SaveNewJouranlEntry', model);
  }

  GetDailyJournalEntriesSummary(model: FilterModel) {
    return this.http.post<any>(this.URL + 'JournalEntry/GetDailyJournalEntriesSummary', model);
  }

  GetDailyJournalEntriesFilters(model: FilterModel) {
    return this.http.post<any>(this.URL + 'JournalEntry/GetDailyJournalEntriesFilters', model);
  }

  CancelJournalEntry(JournalEntryIds: number[]) {
    return this.http.post<any>(this.URL + 'JournalEntry/CancelJournalEntry', JournalEntryIds);
  }

  PostJournalEntry(JournalEntryIds: number[]) {
    return this.http.post<any>(this.URL + 'JournalEntry/PostJournalEntry', JournalEntryIds);
  }

  ReverseJournalEntry(JournalEntryIds: number[]) {
    return this.http.post<any>(this.URL + 'JournalEntry/ReverseJournalEntry', JournalEntryIds);
  }

  PrintJournalEntry(JournalEntryIds: number[]) {
    return this.http.post<any>(this.URL + 'JournalEntry/PrintJournalEntry', JournalEntryIds);
  }

  //================================== AccountTree ===============================

  GetChildAccountsList() {
    return this.http.get<any[]>(this.URL + 'AccountTree/GetChildAccountsList');
  }

  GetAccountsGeneralLedger(model: SearchFilterModel) {
    return this.http.post<any>(this.URL + 'AccountTree/GetAccountsGeneralLedger', model);
  }

  ExportAccountsGeneralLedger(model: SearchFilterModel) {
    return this.http.post<any>(this.URL + 'AccountTree/GetAccountsGeneralLedger', model);
  }

}
