using MasterErp.Entities.Common;
using MasterErp.Entities.Models;
using MasterErp.Interface.Common;
using MasterErp.Interface.Finance.GeneralAccounts;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Service.Finance.GeneralAccounts
{
    public class GeneralAccountsReportService : IGeneralAccountsReportService
    {
        private readonly DBContext Context;
        private readonly ISQLHelper SQLHelper;
        private readonly IConfiguration Configuration;
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

        public GeneralAccountsReportService(DBContext dBContext, ISQLHelper iSQLHelper, IConfiguration _configuration)
        {
            Context = dBContext;
            SQLHelper = iSQLHelper;
            Configuration = _configuration;
        }

        public List<JournalEntry> GetAccountsGeneralLedger(SearchFilterModel model)
        {
            return new List<JournalEntry>();
        }

        public DataTable GetAccountsAssistantLedger(SearchFilterModel model)
        {
            var accountFilter = model?.FilterModel?.FilterItems.Where(x => x.CategoryName == "accountId").FirstOrDefault();
            DataTable dt = new DataTable();

            if (accountFilter != null)
            {
                SqlParameter[] Params = new SqlParameter[3];
                Params[0] = new SqlParameter("@AccountId", (object)accountFilter.ItemFlag ?? DBNull.Value);
                Params[1] = new SqlParameter("@FromDate", (object)model.FromDate ?? DBNull.Value);
                Params[2] = new SqlParameter("@ToDate", (object)model.ToDate ?? DBNull.Value);

                dt = SQLHelper.ExecuteDataTable("[dbo].[SP_GetAccountsAssistantLedger]", ConnectionString, Params);

                for (int i = 1; i < dt.Rows.Count; i++)
                {
                    string cheque_number = "";
                    int actionId = Int32.Parse(dt.Rows[i]["ActionTypeId"].ToString());

                    if (dt.Rows[i]["ActionTypeId"].ToString() == "3")
                    {
                        var cheque = Context.PaymentReceipt.Where(x => x.PaymentReceiptId == actionId).FirstOrDefault();
                        cheque_number = cheque.ChequeNumber;
                    }
                    else if (dt.Rows[i]["ActionTypeId"].ToString() == "7")
                    {
                        var cheque = Context.ReceiveReceipt.Where(x => x.ReceiveReceiptId == actionId).FirstOrDefault();
                        cheque_number = cheque.ChequeNumber;
                    }
                    dt.Rows[i]["ChequeNumber"] = cheque_number;

                    //double result = double.Parse(dt.Rows[i]["BalanceDebit"].ToString()) + (journal_list[i].Debit ?? 0)
                    //    - double.Parse(dt.Rows[i]["BalanceCredit"].ToString()) + (journal_list[i].Credit ?? 0);

                    double balance = (double.Parse(dt.Rows[i]["Debit"].ToString()) + double.Parse(dt.Rows[i - 1]["BalanceDebit"].ToString())) -
                        (double.Parse(dt.Rows[i]["Credit"].ToString()) + double.Parse(dt.Rows[i - 1]["BalanceCredit"].ToString()));

                    dt.Rows[i]["BalanceDebit"] = balance > 0 ? balance : 0;
                    dt.Rows[i]["BalanceCredit"] = balance < 0 ? Math.Abs(balance) : 0;
                }
            }

            return dt;
        }

        public List<JournalEntryViewModel> GetTrialBalanceReport(SearchFilterModel model)
        {
            List<JournalEntryViewModel> List = new List<JournalEntryViewModel>();
            int Level = Convert.ToInt32(model.SearchLevel);

            var accountFilter = model?.FilterModel?.FilterItems.Where(x => x.CategoryName == "accountId").FirstOrDefault();
            if (accountFilter != null)
            {
                var Parents = Context.AccountTrees.Where(x => x.ParentAccountId == 0).ToList();

                for (int i = 0; i < Parents.Count; i++)
                    Fill_List_Levels(List, model, Parents[i].AccountId, Level);
            }
            else
            {
                var account = Context.AccountTrees.Where(x => x.AccountId == Convert.ToInt32(accountFilter.ItemFlag)).FirstOrDefault();
                Fill_List_Levels(List, model, account.AccountId, Convert.ToInt32(model.SearchLevel));
            }

            return List;
        }

        private void Fill_List_Levels(List<JournalEntryViewModel> List, SearchFilterModel model, int id, int current_level)
        {
            Sum_Pre_Debit = 0;
            Sum_Pre_Credit = 0;
            Sum_Debit = 0;
            Sum_Credit = 0;

            DateTime from_date = model.FromDate.Value;
            DateTime to_date = model.ToDate.Value.AddDays(1);

            var account = Context.AccountTrees.Where(x => x.AccountId == id).FirstOrDefault();

            Sum_Pre_Debit += (from details in Context.JournalEntryDetails
                              join journal in Context.JournalEntries on details.JournalEntryId equals journal.JournalEntryId
                              where details.AccountID == id && journal.IsLocked == true && journal.EntryDate < from_date
                              select details.Debit).DefaultIfEmpty(0).Sum() ?? 0;

            Sum_Pre_Credit += (from details in Context.JournalEntryDetails
                               join journal in Context.JournalEntries on details.JournalEntryId equals journal.JournalEntryId
                               where details.AccountID == id && journal.IsLocked == true && journal.EntryDate < from_date
                               select details.Credit).DefaultIfEmpty(0).Sum() ?? 0;

            Sum_Debit += (from details in Context.JournalEntryDetails
                          join journal in Context.JournalEntries on details.JournalEntryId equals journal.JournalEntryId
                          where details.AccountID == id && journal.IsLocked == true && journal.EntryDate >= from_date &&
                          journal.EntryDate < to_date
                          select details.Debit).DefaultIfEmpty(0).Sum() ?? 0;

            Sum_Credit += (from details in Context.JournalEntryDetails
                           join journal in Context.JournalEntries on details.JournalEntryId equals journal.JournalEntryId
                           where details.AccountID == id && journal.IsLocked == true && journal.EntryDate >= from_date &&
                           journal.EntryDate < to_date
                           select details.Credit).DefaultIfEmpty(0).Sum() ?? 0;

            //Get_Entries_Summary(id);

            if (current_level > 0)
            {
                int Level_Type = Int32.Parse(model.SearchType);

                switch (Level_Type)
                {
                    case (0):
                        if (account != null)
                        {
                            JournalEntryViewModel item = new JournalEntryViewModel();

                            item.AccountNumber = account.AccountNumber;
                            item.AccountName = account.NameAR;
                            item.AccountID = account.AccountId;
                            item.Debit = Math.Round(Sum_Debit, 2);
                            item.Credit = Math.Round(Sum_Credit, 2);
                            item.PreDebit = Math.Round(Sum_Pre_Debit, 2);
                            item.PreCredit = Math.Round(Sum_Pre_Credit, 2);
                            item.TotalDebit = Math.Round(item.PreDebit + item.Debit, 2);
                            item.TotalCredit = Math.Round(item.PreCredit + item.Credit, 2);

                            double net_value = item.TotalDebit - item.TotalCredit;

                            item.NetDebit = (net_value > 0) ? Math.Round(Math.Abs(net_value), 2) : 0;
                            item.NetCredit = (net_value < 0) ? Math.Abs(net_value) : 0;

                            if (item.NetCredit == 0 && item.NetDebit == 0)
                            {
                                if (model.HideEmptyAccounts == false)
                                    List.Add(item);
                            }
                            else
                                List.Add(item);
                        }
                        break;

                    case (1):
                        if (account != null && account.IsParent == true)
                        {
                            JournalEntryViewModel item = new JournalEntryViewModel();

                            item.AccountNumber = account.AccountNumber;
                            item.AccountName = account.NameAR;
                            item.AccountID = account.AccountId;
                            item.Debit = Math.Round(Sum_Debit, 2);
                            item.Credit = Math.Round(Sum_Credit, 2);
                            item.PreDebit = Math.Round(Sum_Pre_Debit, 2);
                            item.PreCredit = Math.Round(Sum_Pre_Credit, 2);
                            item.TotalDebit = Math.Round(item.PreDebit + item.Debit, 2);
                            item.TotalCredit = Math.Round(item.PreCredit + item.Credit, 2);

                            double net_value = item.TotalDebit - item.TotalCredit;

                            item.NetDebit = (net_value > 0) ? Math.Round(Math.Abs(net_value), 2) : 0;
                            item.NetCredit = (net_value < 0) ? Math.Abs(net_value) : 0;

                            if (item.NetCredit == 0 && item.NetDebit == 0)
                            {
                                if (model.HideEmptyAccounts == false)
                                    List.Add(item);
                            }
                            else
                                List.Add(item);
                        }
                        break;

                    case (2):
                        if (account != null && account.IsParent == false)
                        {
                            JournalEntryViewModel item = new JournalEntryViewModel();

                            item.AccountNumber = account.AccountNumber;
                            item.AccountName = account.NameAR;
                            item.AccountID = account.AccountId;
                            item.Debit = Math.Round(Sum_Debit, 2);
                            item.Credit = Math.Round(Sum_Credit, 2);
                            item.PreDebit = Math.Round(Sum_Pre_Debit, 2);
                            item.PreCredit = Math.Round(Sum_Pre_Credit, 2);
                            item.TotalDebit = Math.Round(item.PreDebit + item.Debit, 2);
                            item.TotalCredit = Math.Round(item.PreCredit + item.Credit, 2);

                            double net_value = item.TotalDebit - item.TotalCredit;

                            item.NetDebit = (net_value > 0) ? Math.Round(Math.Abs(net_value), 2) : 0;
                            item.NetCredit = (net_value < 0) ? Math.Abs(net_value) : 0;

                            if (item.NetCredit == 0 && item.NetDebit == 0)
                            {
                                if (model.HideEmptyAccounts == false)
                                    List.Add(item);
                            }
                            else
                                List.Add(item);
                        }
                        break;


                }
            }

            var childs = Context.AccountTrees.Where(x => x.ParentAccountId == id).ToList();

            for (int i = 0; i < childs.Count; i++)
            {
                int xx = current_level - 1;
                Fill_List_Levels(List, model, childs[i].AccountId, xx);
            }
        }

    }
}
