import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { JournalEntryModel } from '../models/GeneralAccounts/JurnalEntryModel';
import { FilterModel } from 'src/app/components/Shared/models/FilterModel';

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

  GetSavedJournalTemplates() {
    return this.http.get<any[]>(this.URL + 'JournalEntry/GetSavedJournalTemplates');
  }

  GetAccountsByTemplateId(templateId: number) {
    return this.http.get<any[]>(this.URL + 'JournalEntry/GetAccountsByTemplateId?templateId=' + templateId);
  }

  SaveNewJouranlEntry(model: JournalEntryModel) {
    return this.http.post<any>(this.URL + 'JournalEntry/SaveNewJouranlEntry', model);
  }

  GetDailyJournalEntries(model: FilterModel) {
    return this.http.post<any>(this.URL + 'JournalEntry/GetDailyJournalEntries', model);
  }

  DropDailyJournalEntries(JournalEntryIds: number[]) {
    return this.http.post<any>(this.URL + 'JournalEntry/DropDailyJournalEntries', JournalEntryIds);
  }

  ExpulsionDailyJournalEntries(JournalEntryIds: number[]) {
    return this.http.post<any>(this.URL + 'JournalEntry/ExpulsionDailyJournalEntries', JournalEntryIds);
  }

  ReverseDailyJournalEntries(JournalEntryIds: number[]) {
    return this.http.post<any>(this.URL + 'JournalEntry/ReverseDailyJournalEntries', JournalEntryIds);
  }

  PrintDailyJournalEntries(JournalEntryIds: number[]) {
    return this.http.post<any>(this.URL + 'JournalEntry/PrintDailyJournalEntries', JournalEntryIds);
  }

  //================================== AccountTree ===============================

  GetChildAccountsList() {
    return this.http.get<any[]>(this.URL + 'AccountTree/GetChildAccountsList');
  }

}
