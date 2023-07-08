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

        public (bool result, string message) SaveNewJouranlEntry(JournalEntryModel model)
        {
            //if (Check_Entered_Data())
            //{
            try
            {
                //int month = model.EntryDate.Month;
                //try
                //{
                //    Entry_tbl.EntryNumber = Context.JournalEntries.Where(x => x.EntryDate.Month == month).Max(x => x.EntryNumber) + 1;
                //}
                //catch (Exception)
                //{
                //    Entry_tbl.EntryNumber = 1;
                //}

                JournalEntry Entry_tbl = new JournalEntry
                {
                    //EntryNumber = Context.JournalEntries.Where(x => x.EntryDate.Month == month).DefaultIfEmpty(0).Max(x => x.EntryNumber) + 1,
                    EntryNumber = "1",// Context.JournalEntries.Where(x => x.EntryDate.Month == model.Month).Select(x => x.EntryNumber).DefaultIfEmpty("0").Max() + 1,
                    Description = model.Descirption,
                    DocNumber = model.DocNumber,
                    Notes = model.Notes,
                    JournalTypeID = model.JournalTypeID,
                    IsCancelled = false,
                    IsLocked = false,
                    PeriodID = Context.FinancialPeriods.OrderByDescending(x => x.FinancialPeriodID).FirstOrDefault().FinancialPeriodID,
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
                    if (row.Debit != 0 && row.Credit != 0)
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

                return (true, "New Entry Saved Successfully");
            }
            catch (Exception Ex)
            {
                return (false, "Error in Saving New Entry");
            }
        }

    }


}



