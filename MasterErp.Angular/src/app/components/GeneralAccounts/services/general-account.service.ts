import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { JournalEntryModel } from '../models/GeneralAccounts/JurnalEntryModel';
import { FilterModel, SearchFilterModel } from 'src/app/components/Shared/models/FilterModel';
import { CostCenterType, SearchLevelType } from '../../Shared/Enums/GeneralAccountsEnums';
import { ReceiptLedgerModel } from '../models/ReceiptLedgerModel';
import { JournalEntryTypeModel } from '../models/JournalEntryTypeModel';
import { FinancialPeriodModel } from '../models/FinancialPeriodModel';
import { AccountTreeModel } from '../models/GeneralAccounts/AccountTree';
import { AccountOpeningBalanceModel } from '../models/GeneralAccounts/OpeningBalance';

@Injectable({
  providedIn: 'root'
})
export class GeneralAccountService {
  URL = environment.apiURL;

  constructor(private http: HttpClient) { }

  searchTypeList: any[] = [
    {
      id:SearchLevelType.GroupsAndAccounts,
      nameAR:'مجموعات و حسابات معا',
      nameEN:'Groups And Accounts'
    },
    {
      id: SearchLevelType.GroupsOnly,
      nameAR: 'مجموعات',
      nameEN: 'Groups'
    },
    {
      id: SearchLevelType.AccountsOnly,
      nameAR: 'حسابات',
      nameEN: 'Accounts'
    }
  ];

  costCenterTypeList: any[] = [
    {
      id:CostCenterType.Expenses,
      nameAR:'مصروفات',
      nameEN:'Expenses'
    },
    {
      id: CostCenterType.Withdrawals,
      nameAR: 'مسحوبات',
      nameEN: 'Withdrawals'
    }
  ]
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
  GetDailyJournalEntriesLastFiveRecords() {
    return this.http.get<any>(this.URL + 'JournalEntry/GetDailyJournalEntriesLastFiveRecords');
  }
  //================================== AccountTree ===============================

  GetChildAccountsList() {
    return this.http.get<any[]>(this.URL + 'AccountTree/GetChildAccountsList');
  }


 
  CreateNewAccount(model: AccountTreeModel) {
    return this.http.post<any>(this.URL + 'AccountTree/CreateNewAccount', model);
  }


  ////////////////// General Accounts Reports ///////

  GetAccountsGeneralLedger(model: SearchFilterModel) {
    return this.http.post<any>(this.URL + 'GeneralAccountsReport/GetAccountsGeneralLedger', model);
  }

  ExportAccountsGeneralLedger(model: SearchFilterModel) {
    return this.http.post<any>(this.URL + 'GeneralAccountsReport/ExportAccountsGeneralLedger', model);
  }

  GetAccountsAssistantLedger(model: SearchFilterModel) {
    return this.http.post<any>(this.URL + 'GeneralAccountsReport/GetAccountsAssistantLedger', model);
  }
  ExportAccountsAssistantLedger(model: SearchFilterModel) {
    return this.http.post<any>(this.URL + 'GeneralAccountsReport/ExportAccountsAssistantLedger', model);
  }
  GetTrialBalanceReport(model: SearchFilterModel) {
    return this.http.post<any>(this.URL + 'GeneralAccountsReport/GetTrialBalanceReport', model);
  }
  ExportTrialBalanceReport(model: SearchFilterModel) {
    return this.http.post<any>(this.URL + 'GeneralAccountsReport/ExportTrialBalanceReport', model);
  }



  

  //////////////////////// Cost Center /////////////////

  GetCostGeneralLedger(model: SearchFilterModel) {
    return this.http.post<any>(this.URL + 'GeneralAccountsReport/GetCostGeneralLedger', model);
  }

  ExportCostGeneralLedger(model: SearchFilterModel) {
    return this.http.post<any>(this.URL + 'GeneralAccountsReport/ExportCostGeneralLedger', model);
  }


  GetCostAssistantLedger(model: SearchFilterModel) {
    return this.http.post<any>(this.URL + 'GeneralAccountsReport/GetCostAssistantLedger', model);
  }

  ExportCostAssistantLedger(model: SearchFilterModel) {
    return this.http.post<any>(this.URL + 'GeneralAccountsReport/ExportCostAssistantLedger', model);
  }


  GetCostTrialBalanceReport(model: SearchFilterModel) {
    return this.http.post<any>(this.URL + 'GeneralAccountsReport/GetCostTrialBalanceReport', model);
  }

  ExportCostTrialBalanceReport(model: SearchFilterModel) {
    return this.http.post<any>(this.URL + 'GeneralAccountsReport/ExportCostTrialBalanceReport', model);
  }


  GetCostCenterMatrix(model: SearchFilterModel) {
    return this.http.post<any>(this.URL + 'GeneralAccountsReport/GetCostCenterMatrix', model);
  }

  ExportCostCenterMatrix(model: SearchFilterModel) {
    return this.http.post<any>(this.URL + 'GeneralAccountsReport/ExportCostCenterMatrix', model);
  }




  ////////////////////////  


  GetReceiptLedgersData(model: FilterModel) {
    return this.http.post<any>(this.URL + 'ReceiptLedger/GetReceiptLedgersData', model);
  }

  CreateNewReceiptLedger(model: ReceiptLedgerModel) {
    return this.http.post<any>(this.URL + 'ReceiptLedger/CreateNewReceiptLedger', model);
  }

  ////////////////////////  


  GetJournalEntryTypesData(model: FilterModel) {
    return this.http.post<any>(this.URL + 'JournalEntryType/GetJournalEntryTypesData', model);
  }

  CreateNewJournalEntryType(model: JournalEntryTypeModel) {
    return this.http.post<any>(this.URL + 'JournalEntryType/CreateNewJournalEntryType', model);
  }

  ////////////////////////  


  GetFinancialPeriodsData(model: FilterModel) {
    return this.http.post<any>(this.URL + 'FinancialPeriod/GetFinancialPeriodsData', model);
  }

  CreateNewFinancialPeriod(model: FinancialPeriodModel) {
    return this.http.post<any>(this.URL + 'FinancialPeriod/CreateNewFinancialPeriod', model);
  }


  ///////////////////// OpeningBalance

  GetAccountsOpeningBalanceData(SearchText: string) {
    return this.http.get<any>(this.URL + 'AccountTree/GetAccountsOpeningBalanceData?SearchText=' + SearchText);
  }
  UpdateAccountsOpeningBalance(model: AccountTreeModel[]) {
    return this.http.post<any>(this.URL + 'AccountTree/UpdateAccountsOpeningBalance', model);
  }
  CreateNewOpeningBalance(model: AccountOpeningBalanceModel) {
    return this.http.post<any>(this.URL + 'AccountTree/CreateNewOpeningBalance', model);
  }

}
