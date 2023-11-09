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

        public DataTable GetAccountsGeneralLedger(SearchFilterModel model)
        {
            //if (txt_Account.Text == "")
            //{
            //    var Parents = Context.AccountTrees.Where(x => x.ParentID == 0).ToList();

            //    for (int i = 0; i < Parents.Count; i++)
            //        Fill_List_Levels(Parents[i].AccountID, Convert.ToInt32(model.SearchLevel));
            //}
            //else
            //{
            //    var account = Context.AccountTrees.Where(x => x.NameAR == txt_Account.Text).FirstOrDefault();
            //    Fill_List_Levels(account.AccountID, Convert.ToInt32(model.SearchLevel));
            //}
            return new DataTable();
        }

        public DataTable GetAccountsAssistantLedger(SearchFilterModel model)
        {
            //if(model.SearchType)
            throw new NotImplementedException();
        }

        public DataTable GetTrialBalanceReport(SearchFilterModel model)
        {
            throw new NotImplementedException();
        }

        private void Fill_List_Levels(SearchFilterModel model, int id, int current_level)
        {
            Sum_Pre_Debit = 0;
            Sum_Pre_Credit = 0;
            Sum_Debit = 0;
            Sum_Credit = 0;

            var account = Context.AccountTrees.Where(x => x.AccountID == id).FirstOrDefault();

            Sum_Pre_Debit += (from details in Context.JournalEntryDetails
                              join journal in Context.JournalEntries on details.JournalEntryId equals journal.JournalEntryId
                              where details.AccountID == id && journal.IsLocked == true && journal.EntryDate <= model.FromDate
                              select details.Debit).DefaultIfEmpty(0).Sum() ?? 0;

            Sum_Pre_Credit += (from details in Context.JournalEntryDetails
                               join journal in Context.JournalEntries on details.JournalEntryId equals journal.JournalEntryId
                               where details.AccountID == id && journal.IsLocked == true && journal.EntryDate <= model.FromDate
                               select details.Credit).DefaultIfEmpty(0).Sum() ?? 0;

            //Sum_Debit += (from details in Context.JournalDetails
            //              join journal in Context.Journals on details.JournalID equals journal.JournalID
            //              where details.AccountID == id && journal.IsLocked == true && journal.EntryDate >= from_date &&
            //              journal.EntryDate < to_date
            //              select details.Debit).DefaultIfEmpty(0).Sum();

            //Sum_Credit += (from details in Context.JournalDetails
            //               join journal in Context.Journals on details.JournalID equals journal.JournalID
            //               where details.AccountID == id && journal.IsLocked == true && journal.EntryDate >= from_date &&
            //               journal.EntryDate < to_date
            //               select details.Credit).DefaultIfEmpty(0).Sum();

            //Get_Entries_Summary(id);

            if (current_level > 0)
            {
                int Level_Type = int.Parse(model.SearchLevel); //.Text;

                //switch (Level_Type)
                //{
                //    case (0):
                //        if (account != null)
                //        {
                //            JournalEntry item = new JournalEntry();

                //            item.AccountNumber = account.AccountNumber;
                //            item.AccountName = account.NameArabic;
                //            item.AccountID = account.AccountID;
                //            item.Debit = Math.Round(Sum_Debit, 2);
                //            item.Credit = Math.Round(Sum_Credit, 2);
                //            item.PreDebit = Math.Round(Sum_Pre_Debit, 2);
                //            item.PreCredit = Math.Round(Sum_Pre_Credit, 2);
                //            item.TotalDebit = Math.Round(item.PreDebit + item.Debit, 2);
                //            item.TotalCredit = Math.Round(item.PreCredit + item.Credit, 2);

                //            double net_value = item.TotalDebit - item.TotalCredit;

                //            item.NetDebit = (net_value > 0) ? Math.Round(Math.Abs(net_value), 2) : 0;
                //            item.NetCredit = (net_value < 0) ? Math.Abs(net_value) : 0;

                //            if (chk_HideDetails.Checked && item.NetCredit == 0 && item.NetDebit == 0)
                //                ;
                //            else
                //                List.Add(item);
                //        }
                //        break;

                //    case (1):
                //        if (account != null && account.IsParent == true)
                //        {
                //            JournalEntry item = new JournalEntry();

                //            item.AccountNumber = account.AccountNumber;
                //            item.AccountName = account.NameArabic;
                //            item.AccountID = account.AccountID;
                //            item.Debit = Math.Round(Sum_Debit, 2);
                //            item.Credit = Math.Round(Sum_Credit, 2);
                //            item.PreDebit = Math.Round(Sum_Pre_Debit, 2);
                //            item.PreCredit = Math.Round(Sum_Pre_Credit, 2);
                //            item.TotalDebit = Math.Round(item.PreDebit + item.Debit, 2);
                //            item.TotalCredit = Math.Round(item.PreCredit + item.Credit, 2);

                //            double net_value = item.TotalDebit - item.TotalCredit;

                //            item.NetDebit = (net_value > 0) ? Math.Round(Math.Abs(net_value), 2) : 0;
                //            item.NetCredit = (net_value < 0) ? Math.Abs(net_value) : 0;

                //            if (chk_HideDetails.Checked && item.NetCredit == 0 && item.NetDebit == 0)
                //                ;
                //            else
                //                List.Add(item);
                //        }
                //        break;

                //    case (2):
                //        if (account != null && account.IsParent == false)
                //        {
                //            JournalEntry item = new JournalEntry();

                //            item.AccountNumber = account.AccountNumber;
                //            item.AccountName = account.NameArabic;
                //            item.AccountID = account.AccountID;
                //            item.Debit = Math.Round(Sum_Debit, 2);
                //            item.Credit = Math.Round(Sum_Credit, 2);
                //            item.PreDebit = Math.Round(Sum_Pre_Debit, 2);
                //            item.PreCredit = Math.Round(Sum_Pre_Credit, 2);
                //            item.TotalDebit = Math.Round(item.PreDebit + item.Debit, 2);
                //            item.TotalCredit = Math.Round(item.PreCredit + item.Credit, 2);

                //            double net_value = item.TotalDebit - item.TotalCredit;

                //            item.NetDebit = (net_value > 0) ? Math.Round(Math.Abs(net_value), 2) : 0;
                //            item.NetCredit = (net_value < 0) ? Math.Abs(net_value) : 0;

                //            if (chk_HideDetails.Checked && item.NetCredit == 0 && item.NetDebit == 0)
                //                ;
                //            else
                //                List.Add(item);
                //        }
                //        break;


                //}
            }

            var childs = Context.AccountTrees.Where(x => x.ParentID == id).ToList();

            for (int i = 0; i < childs.Count; i++)
            {
                int xx = current_level - 1;
                //Fill_List_Levels(childs[i].AccountID, xx);
            }
        }

    }
}
