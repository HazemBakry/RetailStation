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
    public class JournalEntryService : IJournalEntryService
    {
        private readonly DBContext Context;
        private readonly ISQLHelper SQLHelper;
        private readonly IConfiguration Configuration;

        private string ConnectionString
        {
            get
            {
                return Configuration.GetConnectionString("DBConnection");
            }
        }

        public JournalEntryService(DBContext dBContext, ISQLHelper iSQLHelper, IConfiguration _configuration)
        {
            Context = dBContext;
            SQLHelper = iSQLHelper;
            Configuration = _configuration;
        }

        private string GenerateNewEntryNumber(int month, int year)
        {
            //int month = dtp_EntryDate.Date.Month;
            //int year = dtp_EntryDate.Date.Year;
            string entry_number = "";

            try
            {
                entry_number = (Context.JournalEntries.Where(x => x.EntryDate.Month == month && x.EntryDate.Year == year).Max(x => x.EntryNumber) + 1).ToString();
            }
            catch (Exception)
            {
                entry_number = "1";
            }

            return entry_number;
        }

        public List<JournalTemplate> GetSavedJournalTemplates()
        {
            var List = Context.JournalTemplate.ToList();
            return List;
        }

        public List<JournalTemplateDetails> GetAccountsByTemplateId(int templateId)
        {
            var List = Context.JournalTemplateDetails.Where(x => x.JournalTemplateId == templateId).ToList();
            return List;
        }

        public List<JournalEntryType> GetJournalEntryTypes()
        {
            var List = Context.JournalEntryTypes.Where(x => x.IsActive).ToList();
            return List;
        }

        public JournalEntryModel GetJournalEntryDetailsByID(int journalId)
        {
            var entry = Context.JournalEntries.Where(x => x.JournalEntryID == journalId).FirstOrDefault();
            JournalEntryModel EntryModel = new JournalEntryModel();

            if (entry != null)
            {
                EntryModel.EntryNumber = entry.EntryNumber.ToString();
                EntryModel.Month = entry.EntryDate.Month;
                EntryModel.DocNumber = entry.DocNumber;
                EntryModel.Descirption = entry.Description;
                EntryModel.JournalTypeID = entry.JournalTypeID;
                EntryModel.EntryDate = entry.EntryDate;

                //------------------------------Fill Entry Details-----------------------------------//

                var details = (from journal_details in Context.JournalEntryDetails
                               where journal_details.JournalEntryID == entry.JournalEntryID
                               join Accounts in Context.AccountTrees on journal_details.AccountID equals Accounts.AccountID
                               //join costs in Context.CostCenterTrees on journal_details.CostCenterID equals costs.CostCenterID
                               //orderby journal_details.JournalDetialID
                               select new JournalEntryAccount
                               {
                                   AccountID = Accounts.AccountID,
                                   Debit = journal_details.Debit,
                                   Credit = journal_details.Credit,
                                   Description = journal_details.Description,
                                   CostCenterID = journal_details.CostCenterID,
                                   CostPercent = journal_details.CostPercent,
                                   CostValue = journal_details.CostValue,
                                   CurrencyID = journal_details.CurrencyID
                               }).ToList();

                EntryModel.JournalEntryAccounts = details;
            }

            return EntryModel;
        }

        public CreateModifyReturnsModel SaveNewJouranlEntry(JournalEntryModel model)
        {
            try
            {
                int month = model.EntryDate.Month;
                int year = model.EntryDate.Year;
                var PreEntries = Context.JournalEntries.Where(x => x.EntryDate.Month == month && x.EntryDate.Year == year).ToList();
                var CurrentPeriod = Context.FinancialPeriods.OrderByDescending(x => x.FinancialPeriodID).FirstOrDefault();

                JournalEntry Entry_tbl = new JournalEntry
                {
                    EntryNumber = PreEntries.Count > 0 ? PreEntries.Max(x => x.EntryNumber) + 1 : 1,
                    Description = model.Descirption,
                    DocNumber = model.DocNumber,
                    Notes = model.Notes,
                    JournalTypeID = model.JournalTypeID,
                    IsCancelled = false,
                    IsLocked = false,
                    PeriodID = CurrentPeriod != null ? CurrentPeriod.FinancialPeriodID : 0,
                    EntryDate = model.EntryDate,
                    ActionTypeID = 1,
                    ActionID = 0,
                    CreateDate = DateTime.Now,
                    CreatedBy = ""
                };

                Context.JournalEntries.Add(Entry_tbl);
                Context.SaveChanges();

                foreach (JournalEntryAccount row in model.JournalEntryAccounts)
                {
                    if (row.Debit != 0 || row.Credit != 0)
                    {
                        JournalEntryDetail JournalDetials = new JournalEntryDetail
                        {
                            JournalEntryID = Entry_tbl.JournalEntryID,
                            AccountID = row.AccountID,
                            Debit = row.Debit,
                            Credit = row.Credit,
                            CurrencyID = row.CurrencyID,
                            Description = row.Description,
                            CostCenterID = row.CostCenterID,
                            CostValue = row.CostValue,
                            CostPercent = row.CostPercent
                        };

                        Context.JournalEntryDetails.Add(JournalDetials);
                        Context.SaveChanges();
                    }
                }
                return new CreateModifyReturnsModel
                {
                    Status = 1,
                    Message = "New Entry Saved Successfully",
                    Number = Entry_tbl.EntryNumber.ToString()

                };
            }
            catch (Exception Ex)
            {
                return new CreateModifyReturnsModel
                {
                    Status = 0,
                    //Message = Ex.Message,
                    Message = "Error in Saving New Entry"
                };
            }
        }

        public DataTable GetDailyJournalEntriesSummary(FilterModel model)
        {
            DataTable dt = new DataTable();
            dt.Clear();
            dt.Columns.Add("CategoryDisplayName");
            dt.Columns.Add("CategoryName");
            dt.Columns.Add("ItemKey");
            dt.Columns.Add("ItemValue");
            dt.Columns.Add("DisplayOrder");

            foreach (FilterItem item in model.FilterItems)
            {
                DataRow row = dt.NewRow();

                row["CategoryDisplayName"] = item.CategoryDisplayName;
                row["CategoryName"] = item.ItemKey;
                row["ItemKey"] = item.ItemKey;
                row["ItemValue"] = item.ItemKey;
                row["DisplayOrder"] = item.ItemKey;
                dt.Rows.Add(row);
            }

            SqlParameter[] Params = new SqlParameter[1];
            Params[0] = new SqlParameter("@dt", SqlDbType.Structured);
            Params[0].Value = dt;

            DataTable result = SQLHelper.ExecuteDataTable("[dbo].[SP_GetDailyJournalEntries_Summary]", ConnectionString, Params);
            return result;
        }

        public DataTable GetDailyJournalEntriesFilters(FilterModel model)
        {
            DataTable dt = new DataTable();
            dt.Clear();
            dt.Columns.Add("CategoryDisplayName");
            dt.Columns.Add("CategoryName");
            dt.Columns.Add("ItemKey");
            dt.Columns.Add("ItemValue");
            dt.Columns.Add("DisplayOrder");

            foreach (FilterItem item in model.FilterItems)
            {
                DataRow row = dt.NewRow();

                row["CategoryDisplayName"] = item.CategoryDisplayName;
                row["CategoryName"] = item.ItemKey;
                row["ItemKey"] = item.ItemKey;
                row["ItemValue"] = item.ItemKey;
                row["DisplayOrder"] = item.ItemKey;
                dt.Rows.Add(row);
            }

            SqlParameter[] Params = new SqlParameter[1];
            Params[0] = new SqlParameter("@dt", SqlDbType.Structured);
            Params[0].Value = dt;

            DataTable result = SQLHelper.ExecuteDataTable("[dbo].[SP_GetDailyJournalEntries_Filters]", ConnectionString, Params);
            return result;
        }

        public bool DropDailyJournalEntries(List<int> JournalEntryIds)
        {
            return true;
        }

        public bool ExpulsionDailyJournalEntries(List<int> JournalEntryIds)
        {
            return true;
        }

        public bool ReverseDailyJournalEntries(List<int> JournalEntryIds)
        {
            return true;
        }

        public bool PrintDailyJournalEntries(List<int> JournalEntryIds)
        {
            return true;
        }


    }


}



