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
import { JournalTemplateDetailsModel, JournalTemplateModel } from '../models/GeneralAccounts/JournalTemplateDetailsModel';
import { PagedResponseDTO } from '../../Shared/models/PagedResponseDTO';
import { AccountsAssistantLedgerModel, AccountsBalanceSheetModel, AccountsGeneralLedgerModel, AccountsReportSearchFilterModel, AccountsTrialBalanceModel, CostAssistantLedgerModel, CostGeneralLedgerModel, CostTrialBalanceModel } from '../models/GeneralAccounts/AccountsReportSearchFilterModel';

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
  ExportDailyJournalEntries(model: PagedResponseDTO<JournalEntryModel[]>) {
    return this.http.post<ActionsResponseModel>(this.URL + 'JournalEntry/ExportDailyJournalEntries', model);
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

  GetSavedJournalTemplates(model: PagedResponseDTO<JournalTemplateModel[]>) {
    return this.http.post<PagedResponseDTO<JournalTemplateModel[]>>(this.URL + 'JournalEntry/GetSavedJournalTemplates',model);
  }

  GetJournalTemplateDetailsById(templateId: number) {
    return this.http.get<JournalTemplateModel>(this.URL + 'JournalEntry/GetJournalTemplateDetailsById?templateId=' + templateId);
  }

  SaveNewJournalEntryTemplate(model: JournalTemplateModel) {
    return this.http.post<any>(this.URL + 'JournalEntry/SaveNewJournalEntryTemplate', model);
  }
  EditJournalEntryTemplate(journalEntryId:number,model: JournalTemplateModel) {
    return this.http.post<any>(this.URL + 'JournalEntry/EditJournalEntryTemplate?EntryId='+journalEntryId, model);
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
  CancelPostJournalEntry(JournalEntryIds: number[]) {
    return this.http.post<ActionsResponseModel>(this.URL + 'JournalEntry/CancelPostJournalEntry', JournalEntryIds);
  }
  PrintJournalEntry(JournalEntryIds: number[]) {
    return this.http.post<ActionsResponseModel>(this.URL + 'JournalEntry/PrintJournalEntry', JournalEntryIds);
  }
  GetDailyJournalEntriesLastFiveRecords() {
    return this.http.get<any>(this.URL + 'JournalEntry/GetDailyJournalEntriesLastFiveRecords');
  }

  //================================== AccountTree ===============================


  AddNewAccount(model: AccountTreeModel) {
    return this.http.post<any>(this.URL + 'AccountTree/AddNewAccount', model);
  }

  EditAccountTree(accountId: number, model: AccountTreeModel) {
    return this.http.post<any>(this.URL + 'AccountTree/EditAccountTree?AccountId=' + accountId, model);
  }
  GenerateAccountNumber(parentAccountId: number) {
    return this.http.get<string>(this.URL + 'AccountTree/GenerateAccountNumber?ParentAccountId=' + parentAccountId);
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
  GetAccountsTrialBalanceReport(model: AccountsReportSearchFilterModel) {
    return this.http.post<PagedResponseDTO<AccountsTrialBalanceModel[]>>(this.URL + 'GeneralAccountsReport/GetAccountsTrialBalanceReport', model);
  }
  ExportAccountsTrialBalanceReport(model: AccountsReportSearchFilterModel) {
    return this.http.post<ActionsResponseModel>(this.URL + 'GeneralAccountsReport/ExportAccountsTrialBalanceReport', model);
  }

  GetAccountsBalanceSheetReport(model: AccountsReportSearchFilterModel) {
    return this.http.post<PagedResponseDTO<AccountsBalanceSheetModel[]>>(this.URL + 'GeneralAccountsReport/GetAccountsBalanceSheetReport', model);
  }
  ExportAccountsBalanceSheetReport(model: AccountsReportSearchFilterModel) {
    return this.http.post<ActionsResponseModel>(this.URL + 'GeneralAccountsReport/ExportAccountsBalanceSheetReport', model);
  }



  //////////////////////// Cost Center /////////////////

  GetCostGeneralLedger(model: AccountsReportSearchFilterModel) {
    return this.http.post<PagedResponseDTO<CostGeneralLedgerModel[]>>(this.URL + 'GeneralAccountsReport/GetCostGeneralLedger', model);
  }

  ExportCostGeneralLedger(model: AccountsReportSearchFilterModel) {
    return this.http.post<ActionsResponseModel>(this.URL + 'GeneralAccountsReport/ExportCostGeneralLedger', model);
  }


  GetCostAssistantLedger(model: AccountsReportSearchFilterModel) {
    return this.http.post<PagedResponseDTO<CostAssistantLedgerModel[]>>(this.URL + 'GeneralAccountsReport/GetCostAssistantLedger', model);
  }

  ExportCostAssistantLedger(model: AccountsReportSearchFilterModel) {
    return this.http.post<ActionsResponseModel>(this.URL + 'GeneralAccountsReport/ExportCostAssistantLedger', model);
  }


  GetCostTrialBalanceReport(model: AccountsReportSearchFilterModel) {
    return this.http.post<PagedResponseDTO<CostTrialBalanceModel[]>>(this.URL + 'GeneralAccountsReport/GetCostTrialBalanceReport', model);
  }

  ExportCostTrialBalanceReport(model: AccountsReportSearchFilterModel) {
    return this.http.post<ActionsResponseModel>(this.URL + 'GeneralAccountsReport/ExportCostTrialBalanceReport', model);
  }


  GetCostCenterMatrix(model: SearchFilterModel) {
    return this.http.post<any>(this.URL + 'GeneralAccountsReport/GetCostCenterMatrix', model);
  }

  ExportCostCenterMatrix(model: SearchFilterModel) {
    return this.http.post<any>(this.URL + 'GeneralAccountsReport/ExportCostCenterMatrix', model);
  }




  ////////////////////////  


  GetReceiptLedgersData(model: PagedResponseDTO<ReceiptLedgerModel[]>) {
    return this.http.post<PagedResponseDTO<ReceiptLedgerModel[]>>(this.URL + 'ReceiptLedger/GetReceiptLedgersData', model);
  }

  CreateNewReceiptLedger(model: ReceiptLedgerModel) {
    return this.http.post<ActionsResponseModel>(this.URL + 'ReceiptLedger/CreateNewReceiptLedger', model);
  }

  EditReceiptLedger(receiptLedgerId:number,model: ReceiptLedgerModel) {
    return this.http.post<ActionsResponseModel>(this.URL + `ReceiptLedger/EditReceiptLedger?ReceiptLedgerId=${receiptLedgerId}`, model);
  }
  DeleteReceiptLedger(receiptLedgerId:number) {
    return this.http.get<ActionsResponseModel>(this.URL + `ReceiptLedger/DeleteReceiptLedger?ReceiptLedgerId=${receiptLedgerId}`);
  }
  ////////////////////////  


  GetJournalEntryTypesData(model: PagedResponseDTO<JournalEntryTypeModel[]>) {
    return this.http.post<PagedResponseDTO<JournalEntryTypeModel[]>>(this.URL + 'JournalEntryType/GetJournalEntryTypesData', model);
  }

  CreateNewJournalEntryType(model: JournalEntryTypeModel) {
    return this.http.post<ActionsResponseModel>(this.URL + 'JournalEntryType/CreateNewJournalEntryType', model);
  }
  EditJournalEntryType(journalTypeId:number,model: JournalEntryTypeModel) {
    return this.http.post<ActionsResponseModel>(this.URL + `JournalEntryType/EditJournalEntryType?JournalTypeId=${journalTypeId}`, model);
  }
  DeleteJournalEntryType(journalTypeId:number) {
    return this.http.get<ActionsResponseModel>(this.URL + `JournalEntryType/DeleteJournalEntryType?JournalTypeId=${journalTypeId}`);
  }

  ////////////////////////  


  GetFinancialPeriodsData(model: PagedResponseDTO<FinancialPeriodModel[]>) {
    return this.http.post<PagedResponseDTO<FinancialPeriodModel[]>>(this.URL + 'FinancialPeriod/GetFinancialPeriodsData', model);
  }

  CreateNewFinancialPeriod(model: FinancialPeriodModel) {
    return this.http.post<ActionsResponseModel>(this.URL + 'FinancialPeriod/CreateNewFinancialPeriod', model);
  }

  EditFinancialPeriod(financialPeriodId:number,model: FinancialPeriodModel) {
    return this.http.post<ActionsResponseModel>(this.URL + `FinancialPeriod/EditFinancialPeriod?FinancialPeriodId=${financialPeriodId}`, model);
  }
  DeleteFinancialPeriod(financialPeriodId:number) {
    return this.http.get<ActionsResponseModel>(this.URL + `FinancialPeriod/DeleteFinancialPeriod?FinancialPeriodId=${financialPeriodId}`);
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
  GenerateCostCenterNumber(parentCostCenterId: number) {
    return this.http.get<string>(this.URL + 'CostCenterTree/GenerateCostCenterNumber?ParentCostCenterId=' + parentCostCenterId);
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
