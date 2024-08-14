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
        private readonly ISharedFilterService SharedFilterService;

        private string ConnectionString
        {
            get
            {
                return Configuration.GetConnectionString("DBConnection");
            }
        }

        public JournalEntryService(DBContext Context, ISQLHelper SQLHelper, IConfiguration Configuration, ISharedFilterService SharedFilterService)
        {
            this.Context = Context;
            this.SQLHelper = SQLHelper;
            this.Configuration = Configuration;
            this.SharedFilterService = SharedFilterService;
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

        public List<Currency> GetCurrencyList()
        {
            var List = Context.Currency.Where(x => x.IsActive).ToList();
            return List;
        }

        public JournalEntryModel GetJournalEntryDetailsByID(int journalId)
        {
            var entry = Context.JournalEntries.Where(x => x.JournalEntryId == journalId).FirstOrDefault();
            JournalEntryModel EntryModel = new JournalEntryModel();

            if (entry != null)
            {
                EntryModel.EntryNumber = entry.EntryNumber.ToString();
                EntryModel.Month = entry.EntryDate.Month;
                EntryModel.DocNumber = entry.DocNumber;
                EntryModel.Descirption = entry.Description;
                EntryModel.JournalTypeID = entry.JournalTypeId;
                EntryModel.EntryDate = entry.EntryDate;

                //------------------------------Fill Entry Details-----------------------------------//

                var details = (from journal_details in Context.JournalEntryDetails
                               where journal_details.JournalEntryId == entry.JournalEntryId
                               join Accounts in Context.AccountTrees on journal_details.AccountID equals Accounts.AccountId
                               //join costs in Context.CostCenterTrees on journal_details.CostCenterID equals costs.CostCenterID
                               //orderby journal_details.JournalDetialID
                               select new JournalEntryAccount
                               {
                                   AccountID = Accounts.AccountId,
                                   Debit = journal_details.Debit,
                                   Credit = journal_details.Credit,
                                   Description = journal_details.Description,
                                   CostCenterID = journal_details.CostCenterId,
                                   CostPercent = journal_details.CostPercent,
                                   CostValue = journal_details.CostValue,
                                   CurrencyID = journal_details.CurrencyId
                               }).ToList();

                EntryModel.JournalEntryAccounts = details;
            }

            return EntryModel;
        }

        public ActionsResponseModel SaveNewJouranlEntry(JournalEntryModel model)
        {
            try
            {
                int month = model.EntryDate.Month;
                int year = model.EntryDate.Year;
                var PreEntries = Context.JournalEntries.Where(x => x.EntryDate.Month == month && x.EntryDate.Year == year).ToList();
                var CurrentPeriod = Context.FinancialPeriods.OrderByDescending(x => x.FinancialPeriodId).FirstOrDefault();

                JournalEntry Entry_tbl = new JournalEntry
                {
                    EntryNumber = PreEntries.Count > 0 ? PreEntries.Max(x => x.EntryNumber) + 1 : 1,
                    Description = model.Descirption,
                    DocNumber = model.DocNumber,
                    Notes = model.Notes,
                    JournalTypeId = model.JournalTypeID,
                    IsCancelled = false,
                    IsLocked = false,
                    PeriodId = CurrentPeriod != null ? CurrentPeriod.FinancialPeriodId : 0,
                    EntryDate = model.EntryDate,
                    ActionTypeId = 1,
                    ActionId = 0,
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
                            JournalEntryId = Entry_tbl.JournalEntryId,
                            AccountID = row.AccountID,
                            Debit = row.Debit ?? 0,
                            Credit = row.Credit ?? 0,
                            CurrencyId = row.CurrencyID,
                            Description = row.Description,
                            CostCenterId = row.CostCenterID,
                            CostValue = row.CostValue,
                            CostPercent = row.CostPercent
                        };

                        Context.JournalEntryDetails.Add(JournalDetials);
                        Context.SaveChanges();
                    }
                }
                return new ActionsResponseModel
                {
                    Status = 1,
                    Message = "New Entry Saved Successfully",
                    Number = Entry_tbl.EntryNumber.ToString()

                };
            }
            catch (Exception ex)
            {
                return new ActionsResponseModel
                {
                    Status = 0,
                    Message = ex.InnerException?.Message ?? ex.Message
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
                row["CategoryName"] = item.CategoryName;
                row["ItemKey"] = item.ItemKey;
                row["ItemValue"] = item.ItemKey;
                row["DisplayOrder"] = 1;
                dt.Rows.Add(row);
            }

            SqlParameter[] Params = new SqlParameter[3];
            Params[0] = new SqlParameter("@CurrentPage", (object)model.CurrentPage ?? DBNull.Value);
            Params[1] = new SqlParameter("@PageSize", (object)model.PageSize ?? DBNull.Value);
            Params[2] = new SqlParameter("@FilterList", SqlDbType.Structured);
            Params[2].Value = dt;

            DataTable result = SQLHelper.ExecuteDataTable("[Finance].[SP_GetDailyJournalEntries_Summary]", ConnectionString, Params);
            return result;
        }

        public List<FilterModel> GetDailyJournalEntriesFilters(FilterModel model)
        {
            DataTable dt = SharedFilterService.MapFilterModelToDataTable(model.FilterItems);

            SqlParameter[] Params = new SqlParameter[1];
            Params[0] = new SqlParameter("@dt", SqlDbType.Structured);
            Params[0].Value = dt;

            DataTable result = SQLHelper.ExecuteDataTable("[Finance].[SP_GetDailyJournalEntries_Filters]", ConnectionString, Params);
            var GroupFilters = SharedFilterService.GroupedFilter(result);
            return GroupFilters;
        }

        public bool CancelJournalEntry(List<int> JournalEntryIds)
        {
            return true;
        }

        public bool PostJournalEntry(List<int> JournalEntryIds)
        {
            try
            {
                foreach (var entryId in JournalEntryIds)
                {
                    var Entry = Context.JournalEntries.Where(x => x.JournalEntryId == entryId).FirstOrDefault();
                    if (Entry != null)
                    {
                        Entry.IsLocked = true;
                        Entry.PostDate = DateTime.Now;

                        Context.SaveChanges();
                    }
                }
                return true;
            }
            catch (Exception Ex)
            {
                return true;
            }
        }

        public bool ReverseJournalEntry(List<int> JournalEntryIds)
        {
            try
            {
                foreach (var entryId in JournalEntryIds)
                {
                    var Entry = Context.JournalEntries.Where(x => x.JournalEntryId == entryId).FirstOrDefault();
                    if (Entry != null)
                    {
                        Entry.IsLocked = false;
                        Entry.PostDate = null;

                        Context.SaveChanges();
                    }
                }
                return true;
            }
            catch (Exception Ex)
            {
                return true;
            }
        }

        public bool PrintJournalEntry(List<int> JournalEntryIds)
        {
            try
            {
                //foreach (var entryId in JournalEntryIds)
                //{
                //    var Entry = Context.JournalEntries.Where(x => x.JournalEntryId == entryId).FirstOrDefault();
                //    if (Entry != null)
                //    {
                //        Entry.IsLocked = true;
                //        Entry.PostDate = DateTime.Now;

                //        Context.SaveChanges();
                //    }
                //}
                return true;
            }
            catch (Exception Ex)
            {
                return true;
            }
        }


    }


}



