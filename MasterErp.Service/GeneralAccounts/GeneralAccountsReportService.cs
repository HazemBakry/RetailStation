using MasterErp.Entities.Common;
using MasterErp.Entities.Common.Enums;
using MasterErp.Entities.Common.Export;
using MasterErp.Entities.DTOs.GeneralAccounts;
using MasterErp.Entities.DTOs.Inventory;
using MasterErp.Entities.Models;
using MasterErp.Entities.Models.Finance;
using MasterErp.Interface.Common;
using MasterErp.Interface.GeneralAccounts;
using MasterErp.Service.Common;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Service.GeneralAccounts
{
    public class GeneralAccountsReportService : IGeneralAccountsReportService
    {
        private readonly DBContext Context;
        private readonly ISQLHelper SQLHelper;
        private readonly IConfiguration Configuration;
        private readonly IExportService ExportService;
        private double Sum_Pre_Debit = 0;
        private double Sum_Pre_Credit = 0;

        private double Sum_Debit = 0;
        private double Sum_Credit = 0;

        private string ConnectionString
        {
            get
            {
                return Configuration.GetConnectionString("DBConnection");
            }
        }

        public GeneralAccountsReportService(DBContext dBContext, ISQLHelper iSQLHelper, IConfiguration _configuration, IExportService exportService)
        {
            Context = dBContext;
            SQLHelper = iSQLHelper;
            Configuration = _configuration;
            ExportService = exportService;
        }

        public List<AccountsGeneralLedgerModel> GetAccountsGeneralLedger(AccountsReportSearchFilterModel model)
        {
            //var accountFilter = model?.FilterList.FirstOrDefault(x => x.CategoryName == "accountId");
            var results = new List<AccountsGeneralLedgerModel>();
            if (model.AccountId is null)
            {
                return results;

            }
            SqlParameter[] Params = new SqlParameter[6];
            Params[0] = new SqlParameter("@AccountId", model.AccountId);
            Params[1] = new SqlParameter("@FromDate", model.FromDate);
            Params[2] = new SqlParameter("@ToDate", model.ToDate);
            Params[3] = new SqlParameter("@HideEmptyAccounts", model.HideEmptyAccounts);
            Params[4] = new SqlParameter("@CurrentPage", model.CurrentPage);
            Params[5] = new SqlParameter("@PageSize", model.PageSize);
            results = SQLHelper.SQLQuery<AccountsGeneralLedgerModel>("[Finance].[SP_GetAccountsGeneralLedgerReport]", null, Params);

            return results;
        }


        public ActionsResponseModel ExportAccountsGeneralLedger(string UserName, AccountsReportSearchFilterModel SearchModel)
        {
            string url = string.Empty;
            try
            {
                SearchModel.CurrentPage = 1;
                SearchModel.PageSize = 990000;
                var Data = GetAccountsGeneralLedger(SearchModel);

                var result = Data.Select(res =>
                                new AccountsGeneralLedgerExportModel
                                {
                                    NameEN = res.NameEN,
                                    NameAR = res.NameAR,
                                    AccountNumber = res.AccountNumber,
                                    PreDebit = res.PreDebit,
                                    PreCredit = res.PreCredit,
                                    Debit = res.Debit,
                                    Credit = res.Credit,
                                    TotalDebit = res.TotalDebit,
                                    TotalCredit = res.TotalCredit,
                                    BalanceDebit = res.BalanceDebit,
                                    BalanceCredit = res.BalanceCredit
                                    //CreatedDate = res.CreatedDate?.ToString("MM/dd/yyyy"),

                                }).ToList();

                if (!result.Any())
                {
                    result.Add(new AccountsGeneralLedgerExportModel());

                }


                var dtExport = DalHelper.ConvertToDataTable(result, "AccountsGeneralLedger");


                url = GetExportFilePath(dtExport, UserName, "AccountsGeneralLedger");


                return new ActionsResponseModel
                {
                    IsSuccess = true,
                    URL = url,
                    Message = "File Exported successfully"
                };

            }
            catch (Exception ex)
            {
                return new ActionsResponseModel
                {
                    IsSuccess = false,
                    Status = 0,
                    URL = "",
                    Message = ex.InnerException?.Message ?? ex.Message,
                };
            }
        }

        public List<AccountsAssistantLedgerModel> GetAccountsAssistantLedger(AccountsReportSearchFilterModel model)
        {

            var results = new List<AccountsAssistantLedgerModel>();
            if (model.AccountId is null)
            {
                return results;

            }
            SqlParameter[] Params = new SqlParameter[6];
            Params[0] = new SqlParameter("@AccountId", model.AccountId);
            Params[1] = new SqlParameter("@FromDate", model.FromDate);
            Params[2] = new SqlParameter("@ToDate", model.ToDate);
            Params[3] = new SqlParameter("@HideEmptyAccounts", model.HideEmptyAccounts);
            Params[4] = new SqlParameter("@CurrentPage", model.CurrentPage);
            Params[5] = new SqlParameter("@PageSize", model.PageSize);
            results = SQLHelper.SQLQuery<AccountsAssistantLedgerModel>("[Finance].[SP_GetAccountsAssistantLedgerReport]", null, Params);

            return results;
        }

        public List<MonthlyAssistantLedger> GetMonthlyAssistantLedger(AccountsReportSearchFilterModel model)
        {
            SqlParameter[] Params = new SqlParameter[4];
            Params[0] = new SqlParameter("@FromDate", model.FromDate);
            Params[1] = new SqlParameter("@ToDate", model.ToDate);
            Params[2] = new SqlParameter("@CurrentPage", model.CurrentPage);
            Params[3] = new SqlParameter("@PageSize", model.PageSize);
            var results = SQLHelper.SQLQuery<MonthlyAssistantLedger>("[Finance].[SP_GetMonthlyAssistantLedger]", null, Params);

            return results;
        }

        public ActionsResponseModel ExportAccountsAssistantLedger(string UserName, AccountsReportSearchFilterModel SearchModel)
        {
            string url = string.Empty;
            try
            {
                SearchModel.CurrentPage = 1;
                SearchModel.PageSize = 990000;
                var Data = GetAccountsAssistantLedger(SearchModel);

                var result = Data.Select(res =>
                                new AccountsAssistantLedgerExportModel
                                {
                                    EntryDate = res.EntryDate?.ToString("MM/dd/yyyy"),
                                    EntryType = res.EntryType,
                                    EntryNumber = res.EntryNumber,
                                    ChequeNumber = res.ChequeNumber,
                                    Description = res.Description,
                                    Debit = res.Debit,
                                    Credit = res.Credit,
                                    BalanceDebit = res.BalanceDebit,
                                    BalanceCredit = res.BalanceCredit
                                    //CreatedDate = res.CreatedDate?.ToString("MM/dd/yyyy"),

                                }).ToList();

                if (!result.Any())
                {
                    result.Add(new AccountsAssistantLedgerExportModel());

                }


                var dtExport = DalHelper.ConvertToDataTable(result, "AccountsAssistantLedger");


                url = GetExportFilePath(dtExport, UserName, "AccountsAssistantLedger");


                return new ActionsResponseModel
                {
                    IsSuccess = true,
                    URL = url,
                    Message = "File Exported successfully"
                };

            }
            catch (Exception ex)
            {
                return new ActionsResponseModel
                {
                    IsSuccess = false,
                    Status = 0,
                    URL = "",
                    Message = ex.InnerException?.Message ?? ex.Message,
                };
            }
        }

        public ActionsResponseModel ExportMonthlyAssistantLedger(string UserName, AccountsReportSearchFilterModel SearchModel)
        {
            string url = string.Empty;
            try
            {
                SearchModel.CurrentPage = 1;
                SearchModel.PageSize = 990000;
                var Data = GetMonthlyAssistantLedger(SearchModel);

                var result = Data.Select(res =>
                                new MonthlyAssistantLedgerExportModel
                                {
                                    EntryMonth = res.EntryMonth,
                                    Debit = res.Debit,
                                    Credit = res.Credit,
                                    BalanceDebit = res.BalanceDebit,
                                    BalanceCredit = res.BalanceCredit
                                    //CreatedDate = res.CreatedDate?.ToString("MM/dd/yyyy"),

                                }).ToList();

                if (!result.Any())
                {
                    result.Add(new MonthlyAssistantLedgerExportModel());
                }

                var dtExport = DalHelper.ConvertToDataTable(result, "MonthlyAssistantLedger");
                url = GetExportFilePath(dtExport, UserName, "MonthlyAssistantLedger");

                return new ActionsResponseModel
                {
                    IsSuccess = true,
                    URL = url,
                    Message = "File Exported successfully"
                };
            }
            catch (Exception ex)
            {
                return new ActionsResponseModel
                {
                    IsSuccess = false,
                    Status = 0,
                    URL = "",
                    Message = ex.InnerException?.Message ?? ex.Message,
                };
            }
        }

        public List<AccountsTrialBalanceModel> GetAccountsTrialBalanceReport(AccountsReportSearchFilterModel model)
        {

            var results = new List<AccountsTrialBalanceModel>();
            if (model.FromDate is null || model.ToDate is null)
            {
                return results;

            }
            SqlParameter[] Params = new SqlParameter[8];
            Params[0] = new SqlParameter("@AccountId", model.AccountId);
            Params[1] = new SqlParameter("@FromDate", model.FromDate);
            Params[2] = new SqlParameter("@ToDate", model.ToDate);
            Params[3] = new SqlParameter("@SearchType", model.SearchType);
            Params[4] = new SqlParameter("@SearchLevel", model.SearchLevel);
            Params[5] = new SqlParameter("@HideEmptyAccounts", model.HideEmptyAccounts);
            Params[6] = new SqlParameter("@CurrentPage", model.CurrentPage);
            Params[7] = new SqlParameter("@PageSize", model.PageSize);
            results = SQLHelper.SQLQuery<AccountsTrialBalanceModel>("[Finance].[SP_GetAccountsTrialBalanceReport]", null, Params);

            return results;
        }

        public ActionsResponseModel ExportAccountsTrialBalanceReport(string UserName, AccountsReportSearchFilterModel SearchModel)
        {
            string url = string.Empty;
            try
            {
                SearchModel.CurrentPage = 1;
                SearchModel.PageSize = 990000;
                var Data = GetAccountsTrialBalanceReport(SearchModel);

                var result = Data.Select(res =>
                                new AccountsTrialBalanceExportModel
                                {
                                    AccountNameEN = res.AccountNameEN,
                                    AccountNameAR = res.AccountNameAR,
                                    AccountNumber = res.AccountNumber,
                                    PreDebit = res.PreDebit,
                                    PreCredit = res.PreCredit,
                                    Debit = res.Debit,
                                    Credit = res.Credit,
                                    TotalDebit = res.TotalDebit,
                                    TotalCredit = res.TotalCredit,
                                    BalanceDebit = res.BalanceDebit,
                                    BalanceCredit = res.BalanceCredit

                                }).ToList();

                if (!result.Any())
                {
                    result.Add(new AccountsTrialBalanceExportModel());
                }
                var dtExport = DalHelper.ConvertToDataTable(result, "AccountsTrialBalanceReport");
                url = GetExportFilePath(dtExport, UserName, "AccountsTrialBalanceReport");

                return new ActionsResponseModel
                {
                    IsSuccess = true,
                    URL = url,
                    Message = "File Exported successfully"
                };
            }
            catch (Exception ex)
            {
                return new ActionsResponseModel
                {
                    IsSuccess = false,
                    Status = 0,
                    URL = "",
                    Message = ex.InnerException?.Message ?? ex.Message,
                };
            }
        }

        public List<AccountsBalanceSheetModel> GetAccountsBalanceSheetReport(AccountsReportSearchFilterModel model)
        {

            var results = new List<AccountsBalanceSheetModel>();
            if (model.FromDate is null || model.ToDate is null)
            {
                return results;

            }
            SqlParameter[] Params = new SqlParameter[8];
            Params[0] = new SqlParameter("@AccountId", model.AccountId);
            Params[1] = new SqlParameter("@FromDate", model.FromDate);
            Params[2] = new SqlParameter("@ToDate", model.ToDate);
            Params[3] = new SqlParameter("@SearchType", model.SearchType);
            Params[4] = new SqlParameter("@SearchLevel", model.SearchLevel);
            Params[5] = new SqlParameter("@HideEmptyAccounts", model.HideEmptyAccounts);
            Params[6] = new SqlParameter("@CurrentPage", model.CurrentPage);
            Params[7] = new SqlParameter("@PageSize", model.PageSize);
            results = SQLHelper.SQLQuery<AccountsBalanceSheetModel>("[Finance].[SP_GetAccountsBalanceSheetReport]", null, Params);

            return results;
        }

        public ActionsResponseModel ExportAccountsBalanceSheetReport(string UserName, AccountsReportSearchFilterModel SearchModel)
        {
            string url = string.Empty;
            try
            {
                SearchModel.CurrentPage = 1;
                SearchModel.PageSize = 990000;
                var Data = GetAccountsBalanceSheetReport(SearchModel);

                var result = Data.Select(res =>
                                new AccountsBalanceSheetExportModel
                                {
                                    AccountNameEN = res.AccountNameEN,
                                    AccountNameAR = res.AccountNameAR,
                                    AccountNumber = res.AccountNumber,
                                    BalanceDebit = res.BalanceDebit,
                                    BalanceCredit = res.BalanceCredit

                                }).ToList();

                if (!result.Any())
                {
                    result.Add(new AccountsBalanceSheetExportModel());

                }


                var dtExport = DalHelper.ConvertToDataTable(result, "AccountsBalanceSheetReport");


                url = GetExportFilePath(dtExport, UserName, "AccountsBalanceSheetReport");


                return new ActionsResponseModel
                {
                    IsSuccess = true,
                    URL = url,
                    Message = "File Exported successfully"
                };

            }
            catch (Exception ex)
            {
                return new ActionsResponseModel
                {
                    IsSuccess = false,
                    Status = 0,
                    URL = "",
                    Message = ex.InnerException?.Message ?? ex.Message,
                };
            }
        }



        #region CostCenterReports

        public List<CostGeneralLedgerModel> GetCostGeneralLedger(AccountsReportSearchFilterModel model)
        {
            var results = new List<CostGeneralLedgerModel>();
            if (model.CostCenterId is null)
            {
                return results;

            }
            SqlParameter[] Params = new SqlParameter[6];
            Params[0] = new SqlParameter("@CostCenterId", model.CostCenterId);
            Params[1] = new SqlParameter("@FromDate", model.FromDate);
            Params[2] = new SqlParameter("@ToDate", model.ToDate);
            Params[3] = new SqlParameter("@HideEmptyAccounts", model.HideEmptyAccounts);
            Params[4] = new SqlParameter("@CurrentPage", model.CurrentPage);
            Params[5] = new SqlParameter("@PageSize", model.PageSize);
            results = SQLHelper.SQLQuery<CostGeneralLedgerModel>("[Finance].[SP_GetCostGeneralLedgerReport]", null, Params);

            return results;
        }


        public ActionsResponseModel ExportCostGeneralLedger(string UserName, AccountsReportSearchFilterModel SearchModel)
        {
            string url = string.Empty;
            try
            {
                SearchModel.CurrentPage = 1;
                SearchModel.PageSize = 990000;
                var Data = GetCostGeneralLedger(SearchModel);

                var result = Data.Select(res =>
                                new CostGeneralLedgerExportModel
                                {
                                    CostCenterNameEN = res.CostCenterNameEN,
                                    CostCenterNameAR = res.CostCenterNameAR,
                                    CostCenterNumber = res.CostCenterNumber,
                                    PreDebit = res.PreDebit,
                                    PreCredit = res.PreCredit,
                                    Debit = res.Debit,
                                    Credit = res.Credit,
                                    TotalDebit = res.TotalDebit,
                                    TotalCredit = res.TotalCredit,
                                    BalanceDebit = res.BalanceDebit,
                                    BalanceCredit = res.BalanceCredit
                                    //CreatedDate = res.CreatedDate?.ToString("MM/dd/yyyy"),

                                }).ToList();

                if (!result.Any())
                {
                    result.Add(new CostGeneralLedgerExportModel());

                }


                var dtExport = DalHelper.ConvertToDataTable(result, "CostGeneralLedger");


                url = GetExportFilePath(dtExport, UserName, "CostGeneralLedger");


                return new ActionsResponseModel
                {
                    IsSuccess = true,
                    URL = url,
                    Message = "File Exported successfully"
                };

            }
            catch (Exception ex)
            {
                return new ActionsResponseModel
                {
                    IsSuccess = false,
                    Status = 0,
                    URL = "",
                    Message = ex.InnerException?.Message ?? ex.Message,
                };
            }
        }

        public List<CostAssistantLedgerModel> GetCostAssistantLedger(AccountsReportSearchFilterModel model)
        {

            var results = new List<CostAssistantLedgerModel>();
            if (model.CostCenterId is null)
            {
                return results;

            }
            SqlParameter[] Params = new SqlParameter[7];
            Params[0] = new SqlParameter("@AccountId", model.AccountId);
            Params[1] = new SqlParameter("@CostCenterId", model.CostCenterId);
            Params[2] = new SqlParameter("@FromDate", model.FromDate);
            Params[3] = new SqlParameter("@ToDate", model.ToDate);
            Params[4] = new SqlParameter("@HideEmptyAccounts", model.HideEmptyAccounts);
            Params[5] = new SqlParameter("@CurrentPage", model.CurrentPage);
            Params[6] = new SqlParameter("@PageSize", model.PageSize);
            results = SQLHelper.SQLQuery<CostAssistantLedgerModel>("[Finance].[SP_GetCostAssistantLedgerReport]", null, Params);

            return results;
        }
        public ActionsResponseModel ExportCostAssistantLedger(string UserName, AccountsReportSearchFilterModel SearchModel)
        {
            string url = string.Empty;
            try
            {
                SearchModel.CurrentPage = 1;
                SearchModel.PageSize = 990000;
                var Data = GetCostAssistantLedger(SearchModel);

                var result = Data.Select(res =>
                                new CostAssistantLedgerExportModel
                                {
                                    EntryDate = res.EntryDate?.ToString("MM/dd/yyyy"),
                                    EntryType = res.EntryType,
                                    EntryNumber = res.EntryNumber,
                                    ChequeNumber = res.ChequeNumber,
                                    Description = res.Description,
                                    Debit = res.Debit,
                                    Credit = res.Credit,
                                    BalanceDebit = res.BalanceDebit,
                                    BalanceCredit = res.BalanceCredit
                                    //CreatedDate = res.CreatedDate?.ToString("MM/dd/yyyy"),

                                }).ToList();

                if (!result.Any())
                {
                    result.Add(new CostAssistantLedgerExportModel());

                }


                var dtExport = DalHelper.ConvertToDataTable(result, "CostAssistantLedger");


                url = GetExportFilePath(dtExport, UserName, "CostAssistantLedger");


                return new ActionsResponseModel
                {
                    IsSuccess = true,
                    URL = url,
                    Message = "File Exported successfully"
                };

            }
            catch (Exception ex)
            {
                return new ActionsResponseModel
                {
                    IsSuccess = false,
                    Status = 0,
                    URL = "",
                    Message = ex.InnerException?.Message ?? ex.Message,
                };
            }
        }





        public List<CostTrialBalanceModel> GetCostTrialBalanceReport(AccountsReportSearchFilterModel model)
        {

            var results = new List<CostTrialBalanceModel>();
            if (model.FromDate is null || model.ToDate is null)
            {
                return results;

            }
            SqlParameter[] Params = new SqlParameter[8];
            Params[0] = new SqlParameter("@CostCenterId", model.CostCenterId);
            Params[1] = new SqlParameter("@FromDate", model.FromDate);
            Params[2] = new SqlParameter("@ToDate", model.ToDate);
            Params[3] = new SqlParameter("@SearchType", model.SearchType);
            Params[4] = new SqlParameter("@SearchLevel", model.SearchLevel);
            Params[5] = new SqlParameter("@HideEmptyAccounts", model.HideEmptyAccounts);
            Params[6] = new SqlParameter("@CurrentPage", model.CurrentPage);
            Params[7] = new SqlParameter("@PageSize", model.PageSize);
            results = SQLHelper.SQLQuery<CostTrialBalanceModel>("[Finance].[SP_GetCostTrialBalanceReport]", null, Params);

            return results;
        }

        public ActionsResponseModel ExportCostTrialBalanceReport(string UserName, AccountsReportSearchFilterModel SearchModel)
        {
            string url = string.Empty;
            try
            {
                SearchModel.CurrentPage = 1;
                SearchModel.PageSize = 990000;
                var Data = GetCostTrialBalanceReport(SearchModel);

                var result = Data.Select(res =>
                                new CostTrialBalanceExportModel
                                {
                                    CostCenterNameEN = res.CostCenterNameEN,
                                    CostCenterNameAR = res.CostCenterNameAR,
                                    CostCenterNumber = res.CostCenterNumber,
                                    PreDebit = res.PreDebit,
                                    PreCredit = res.PreCredit,
                                    Debit = res.Debit,
                                    Credit = res.Credit,
                                    TotalDebit = res.TotalDebit,
                                    TotalCredit = res.TotalCredit,
                                    BalanceDebit = res.BalanceDebit,
                                    BalanceCredit = res.BalanceCredit

                                }).ToList();

                if (!result.Any())
                {
                    result.Add(new CostTrialBalanceExportModel());

                }


                var dtExport = DalHelper.ConvertToDataTable(result, "CostTrialBalanceReport");


                url = GetExportFilePath(dtExport, UserName, "CostTrialBalanceReport");


                return new ActionsResponseModel
                {
                    IsSuccess = true,
                    URL = url,
                    Message = "File Exported successfully"
                };

            }
            catch (Exception ex)
            {
                return new ActionsResponseModel
                {
                    IsSuccess = false,
                    Status = 0,
                    URL = "",
                    Message = ex.InnerException?.Message ?? ex.Message,
                };
            }
        }


        #endregion

        //public List<TrialBalanceModel> GetTrialBalanceReport(SearchFilterModel model)
        //{
        //    List<TrialBalanceModel> List = new List<TrialBalanceModel>();
        //    int Level = Convert.ToInt32(model.SearchLevel);

        //    var accountFilter = model?.FilterModel?.FilterItems.Where(x => x.CategoryName == "accountId").FirstOrDefault();
        //    if (accountFilter != null)
        //    {
        //        var Parents = Context.AccountTrees.Where(x => x.ParentAccountId == 0).ToList();

        //        for (int i = 0; i < Parents.Count; i++)
        //            Fill_List_Levels(List, model, Parents[i].AccountId, Level);
        //    }
        //    else
        //    {
        //        var account = Context.AccountTrees.Where(x => x.AccountId == Convert.ToInt32(accountFilter.ItemFlag)).FirstOrDefault();
        //        Fill_List_Levels(List, model, account.AccountId, Convert.ToInt32(model.SearchLevel));
        //    }

        //    return List;
        //}

        //private void Fill_List_Levels(List<JournalEntryViewModel> List, SearchFilterModel model, int id, int current_level)
        //{
        //    Sum_Pre_Debit = 0;
        //    Sum_Pre_Credit = 0;
        //    Sum_Debit = 0;
        //    Sum_Credit = 0;

        //    DateTime from_date = model.FromDate.Value;
        //    DateTime to_date = model.ToDate.Value.AddDays(1);

        //    var account = Context.AccountTrees.Where(x => x.AccountId == id).FirstOrDefault();

        //    Sum_Pre_Debit += (from details in Context.JournalEntryDetails
        //                      join journal in Context.JournalEntries on details.JournalEntryId equals journal.JournalEntryId
        //                      where details.AccountID == id && journal.IsLocked == true && journal.EntryDate < from_date
        //                      select details.Debit).DefaultIfEmpty(0).Sum() ?? 0;

        //    Sum_Pre_Credit += (from details in Context.JournalEntryDetails
        //                       join journal in Context.JournalEntries on details.JournalEntryId equals journal.JournalEntryId
        //                       where details.AccountID == id && journal.IsLocked == true && journal.EntryDate < from_date
        //                       select details.Credit).DefaultIfEmpty(0).Sum() ?? 0;

        //    Sum_Debit += (from details in Context.JournalEntryDetails
        //                  join journal in Context.JournalEntries on details.JournalEntryId equals journal.JournalEntryId
        //                  where details.AccountID == id && journal.IsLocked == true && journal.EntryDate >= from_date &&
        //                  journal.EntryDate < to_date
        //                  select details.Debit).DefaultIfEmpty(0).Sum() ?? 0;

        //    Sum_Credit += (from details in Context.JournalEntryDetails
        //                   join journal in Context.JournalEntries on details.JournalEntryId equals journal.JournalEntryId
        //                   where details.AccountID == id && journal.IsLocked == true && journal.EntryDate >= from_date &&
        //                   journal.EntryDate < to_date
        //                   select details.Credit).DefaultIfEmpty(0).Sum() ?? 0;

        //    //Get_Entries_Summary(id);

        //    if (current_level > 0)
        //    {
        //        int Level_Type = int.Parse(model.SearchType);

        //        switch (Level_Type)
        //        {
        //            case 0:
        //                if (account != null)
        //                {
        //                    JournalEntryViewModel item = new JournalEntryViewModel();

        //                    item.AccountNumber = account.AccountNumber;
        //                    item.AccountName = account.NameAR;
        //                    item.AccountID = account.AccountId;
        //                    item.Debit = Math.Round(Sum_Debit, 2);
        //                    item.Credit = Math.Round(Sum_Credit, 2);
        //                    item.PreDebit = Math.Round(Sum_Pre_Debit, 2);
        //                    item.PreCredit = Math.Round(Sum_Pre_Credit, 2);
        //                    item.TotalDebit = Math.Round(item.PreDebit + item.Debit, 2);
        //                    item.TotalCredit = Math.Round(item.PreCredit + item.Credit, 2);

        //                    double net_value = item.TotalDebit - item.TotalCredit;

        //                    item.NetDebit = net_value > 0 ? Math.Round(Math.Abs(net_value), 2) : 0;
        //                    item.NetCredit = net_value < 0 ? Math.Abs(net_value) : 0;

        //                    if (item.NetCredit == 0 && item.NetDebit == 0)
        //                    {
        //                        if (model.HideEmptyAccounts == false)
        //                            List.Add(item);
        //                    }
        //                    else
        //                        List.Add(item);
        //                }
        //                break;

        //            case 1:
        //                if (account != null && account.IsParent == true)
        //                {
        //                    JournalEntryViewModel item = new JournalEntryViewModel();

        //                    item.AccountNumber = account.AccountNumber;
        //                    item.AccountName = account.NameAR;
        //                    item.AccountID = account.AccountId;
        //                    item.Debit = Math.Round(Sum_Debit, 2);
        //                    item.Credit = Math.Round(Sum_Credit, 2);
        //                    item.PreDebit = Math.Round(Sum_Pre_Debit, 2);
        //                    item.PreCredit = Math.Round(Sum_Pre_Credit, 2);
        //                    item.TotalDebit = Math.Round(item.PreDebit + item.Debit, 2);
        //                    item.TotalCredit = Math.Round(item.PreCredit + item.Credit, 2);

        //                    double net_value = item.TotalDebit - item.TotalCredit;

        //                    item.NetDebit = net_value > 0 ? Math.Round(Math.Abs(net_value), 2) : 0;
        //                    item.NetCredit = net_value < 0 ? Math.Abs(net_value) : 0;

        //                    if (item.NetCredit == 0 && item.NetDebit == 0)
        //                    {
        //                        if (model.HideEmptyAccounts == false)
        //                            List.Add(item);
        //                    }
        //                    else
        //                        List.Add(item);
        //                }
        //                break;

        //            case 2:
        //                if (account != null && account.IsParent == false)
        //                {
        //                    JournalEntryViewModel item = new JournalEntryViewModel();

        //                    item.AccountNumber = account.AccountNumber;
        //                    item.AccountName = account.NameAR;
        //                    item.AccountID = account.AccountId;
        //                    item.Debit = Math.Round(Sum_Debit, 2);
        //                    item.Credit = Math.Round(Sum_Credit, 2);
        //                    item.PreDebit = Math.Round(Sum_Pre_Debit, 2);
        //                    item.PreCredit = Math.Round(Sum_Pre_Credit, 2);
        //                    item.TotalDebit = Math.Round(item.PreDebit + item.Debit, 2);
        //                    item.TotalCredit = Math.Round(item.PreCredit + item.Credit, 2);

        //                    double net_value = item.TotalDebit - item.TotalCredit;

        //                    item.NetDebit = net_value > 0 ? Math.Round(Math.Abs(net_value), 2) : 0;
        //                    item.NetCredit = net_value < 0 ? Math.Abs(net_value) : 0;

        //                    if (item.NetCredit == 0 && item.NetDebit == 0)
        //                    {
        //                        if (model.HideEmptyAccounts == false)
        //                            List.Add(item);
        //                    }
        //                    else
        //                        List.Add(item);
        //                }
        //                break;


        //        }
        //    }

        //    var childs = Context.AccountTrees.Where(x => x.ParentAccountId == id).ToList();

        //    for (int i = 0; i < childs.Count; i++)
        //    {
        //        int xx = current_level - 1;
        //        Fill_List_Levels(List, model, childs[i].AccountId, xx);
        //    }
        //}


        private string GetExportFilePath(DataTable dt, string UserName, string TemplateName)
        {
            ExportTemplateBase exportTemplateBase = new ExportTemplateBase
            {
                Name = TemplateName,
                TemplateName = TemplateName,
                ReportName = TemplateName,
                CustomerName = "",
                Username = UserName,
                ExcelStyle = ExcelExportStyle.reportStyle,
                SheetName = "Data",
            };
            var filePath = ExportService.Export(exportTemplateBase, dt);
            return filePath;

        }
    }
}
