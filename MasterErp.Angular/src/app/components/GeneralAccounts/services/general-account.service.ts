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
import { CostCenterTreeModel } from '../models/GeneralAccounts/CostCenter';
import { ActionsResponseModel } from '../../Shared/models/ActionsResponseModel';
import { JournalTemplateDetails } from '../models/GeneralAccounts/JournalTemplateDetailsModel';
import { PagedResponseDTO } from '../../Shared/models/PagedResponseDTO';
import { AccountsAssistantLedgerModel, AccountsGeneralLedgerModel, AccountsReportSearchFilterModel, TrialBalanceModel } from '../models/GeneralAccounts/AccountsReportSearchFilterModel';

@Injectable({
  providedIn: 'root'
})
export class GeneralAccountService {
  URL = environment.apiURL;

  constructor(private http: HttpClient) { }

  searchTypeList: any[] = [
    {
      id: SearchLevelType.GroupsAndAccounts,
      nameAR: 'مجموعات و حسابات معا',
      nameEN: 'Groups And Accounts'
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
      id: CostCenterType.Expenses,
      nameAR: 'مصروفات',
      nameEN: 'Expenses'
    },
    {
      id: CostCenterType.Withdrawals,
      nameAR: 'مسحوبات',
      nameEN: 'Withdrawals'
    }
  ]
  //================================== JournalEntry ===============================

  GetGeneralAccounts_Statistics() {
    return this.http.get<any>(this.URL + 'JournalEntry/GetGeneralAccounts_Statistics');
  }

  GetDailyJournalEntriesSummary(model: PagedResponseDTO<JournalEntryModel[]>) {
    return this.http.post<any>(this.URL + 'JournalEntry/GetDailyJournalEntriesSummary', model);
  }

  GetDailyJournalEntriesFilters(model: FilterModel) {
    return this.http.post<any>(this.URL + 'JournalEntry/GetDailyJournalEntriesFilters', model);
  }

  GetJournalEntryDetailsById(journalEntryId: number) {
    return this.http.get<JournalEntryModel>(this.URL + 'JournalEntry/GetJournalEntryDetailsById?EntryId=' + journalEntryId);
  }

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
    return this.http.get<JournalTemplateDetails[]>(this.URL + 'JournalEntry/GetAccountsByTemplateId?templateId=' + templateId);
  }

  SaveNewJournalEntry(model: JournalEntryModel) {
    return this.http.post<any>(this.URL + 'JournalEntry/SaveNewJournalEntry', model);
  }
  EditJournalEntry(journalEntryId:number,model: JournalEntryModel) {
    return this.http.post<any>(this.URL + 'JournalEntry/EditJournalEntry?EntryId='+journalEntryId, model);
  }



  CancelJournalEntry(JournalEntryIds: number[]) {
    return this.http.post<ActionsResponseModel>(this.URL + 'JournalEntry/CancelJournalEntry', JournalEntryIds);
  }

  PostJournalEntry(JournalEntryIds: number[]) {
    return this.http.post<ActionsResponseModel>(this.URL + 'JournalEntry/PostJournalEntry', JournalEntryIds);
  }

  ReverseJournalEntry(JournalEntryIds: number[]) {
    return this.http.post<ActionsResponseModel>(this.URL + 'JournalEntry/ReverseJournalEntry', JournalEntryIds);
  }

  PrintJournalEntry(JournalEntryIds: number[]) {
    return this.http.post<ActionsResponseModel>(this.URL + 'JournalEntry/PrintJournalEntry', JournalEntryIds);
  }
  GetDailyJournalEntriesLastFiveRecords() {
    return this.http.get<any>(this.URL + 'JournalEntry/GetDailyJournalEntriesLastFiveRecords');
  }

  //================================== AccountTree ===============================

  GetChildAccountsList() {
    return this.http.get<any[]>(this.URL + 'AccountTree/GetChildAccountsList');
  }

  AddNewAccount(model: AccountTreeModel) {
    return this.http.post<any>(this.URL + 'AccountTree/AddNewAccount', model);
  }

  EditAccountTree(accountId: number, model: AccountTreeModel) {
    return this.http.post<any>(this.URL + 'AccountTree/EditAccountTree?AccountId=' + accountId, model);
  }
  DeleteAccountTree(accountId: number) {
    return this.http.get<ActionsResponseModel>(this.URL + 'AccountTree/DeleteAccountTree?AccountId=' + accountId);
  }

  ExportAccountTreeList(searchText: string) {
    return this.http.get<ActionsResponseModel>(this.URL + 'AccountTree/ExportAccountTreeList?SearchText=' + searchText);
  }
  ImportAccountTreeList(File: any) {

    return this.http.post<ActionsResponseModel>(this.URL + 'AccountTree/ImportAccountTreeList', File);
    // ,
    // {
    //     reportProgress: true,
    //     observe: 'events'
    //   }

    // );
  }

  ////////////////// General Accounts Reports ///////

  GetAccountsGeneralLedger(model: AccountsReportSearchFilterModel) {
    return this.http.post<PagedResponseDTO<AccountsGeneralLedgerModel[]>>(this.URL + 'GeneralAccountsReport/GetAccountsGeneralLedger', model);
  }

  ExportAccountsGeneralLedger(model: AccountsReportSearchFilterModel) {
    return this.http.post<ActionsResponseModel>(this.URL + 'GeneralAccountsReport/ExportAccountsGeneralLedger', model);
  }

  GetAccountsAssistantLedger(model: AccountsReportSearchFilterModel) {
    return this.http.post<PagedResponseDTO<AccountsAssistantLedgerModel[]>>(this.URL + 'GeneralAccountsReport/GetAccountsAssistantLedger', model);
  }
  ExportAccountsAssistantLedger(model: AccountsReportSearchFilterModel) {
    return this.http.post<ActionsResponseModel>(this.URL + 'GeneralAccountsReport/ExportAccountsAssistantLedger', model);
  }
  GetTrialBalanceReport(model: AccountsReportSearchFilterModel) {
    return this.http.post<PagedResponseDTO<TrialBalanceModel[]>>(this.URL + 'GeneralAccountsReport/GetTrialBalanceReport', model);
  }
  ExportTrialBalanceReport(model: AccountsReportSearchFilterModel) {
    return this.http.post<ActionsResponseModel>(this.URL + 'GeneralAccountsReport/ExportTrialBalanceReport', model);
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


  ///////////////////// OpeningBalance

  GetCostCenterTreeHierarchicalData(SearchText: string) {
    return this.http.get<any>(this.URL + 'CostCenterTree/GetCostCenterTreeHierarchicalData?SearchText=' + SearchText);
  }

  CreateNewCostCenter(model: CostCenterTreeModel) {
    return this.http.post<any>(this.URL + 'CostCenterTree/CreateNewCostCenter', model);
  }

  UpdateCostCenterTree(costCenterId: number, model: CostCenterTreeModel) {
    return this.http.post<any>(this.URL + 'CostCenterTree/UpdateCostCenterTree?CostCenterId=' + costCenterId, model);
  }
  DeleteCostCenterTree(costCenterId: number) {
    return this.http.get<ActionsResponseModel>(this.URL + 'CostCenterTree/DeleteCostCenterTree?CostCenterId=' + costCenterId);
  }
  ExportCostCenterTreeList(searchText: string) {
    return this.http.get<ActionsResponseModel>(this.URL + 'CostCenterTree/ExportCostCenterTreeList?SearchText=' + searchText);
  }
  ImportCostCenterTreeList(File: any) {

    return this.http.post<ActionsResponseModel>(this.URL + 'CostCenterTree/ImportCostCenterTreeList', File);
    // ,
    // {
    //     reportProgress: true,
    //     observe: 'events'
    //   }

    // );
  }

  //================================== LoansForm ===============================

  GetLoansData() {
    return this.http.get<any[]>(this.URL + 'LoansForm/GetLoansData');
  }

  AddNewLoans(Model: any) {
    return this.http.post<any>(this.URL + 'LoansForm/AddNewLoans', Model);
  }

  EditLoans(Model: any) {
    return this.http.post<any>(this.URL + 'LoansForm/EditLoans', Model);
  }

  DeleteLoans(LoanId: number) {
    return this.http.get<any>(this.URL + 'LoansForm/DeleteLoans?LoanId=' + LoanId);
  }

}
