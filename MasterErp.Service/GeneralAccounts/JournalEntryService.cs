using MasterErp.Entities.Common;
using MasterErp.Entities.Common.Enums;
using MasterErp.Entities.Models;
using MasterErp.Interface.Common;
using MasterErp.Interface.GeneralAccounts;
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
    public class JournalEntryService : IJournalEntryService
    {
        private readonly DBContext Context;
        private readonly ISQLHelper SQLHelper;
        private readonly IConfiguration Configuration;
        private readonly ISharedFilterService SharedFilterService;
        private readonly string ConnectionString;

        public JournalEntryService(DBContext Context, ISQLHelper SQLHelper, IConfiguration Configuration,
            ISharedFilterService SharedFilterService)
        {
            this.Context = Context;
            this.SQLHelper = SQLHelper;
            this.Configuration = Configuration;
            this.SharedFilterService = SharedFilterService;
            this.ConnectionString = Configuration.GetConnectionString("DBConnection");
        }

        public JournalEntryModel GetJournalEntryDetailsById(int journalId)
        {
            var entry = Context.JournalEntries.Where(x => x.JournalEntryId == journalId).FirstOrDefault();
            JournalEntryModel EntryModel = new JournalEntryModel();

            if (entry != null)
            {
                EntryModel.EntryId = entry.JournalEntryId;
                EntryModel.EntryNumber = entry.EntryNumber.ToString();
                EntryModel.Month = entry.EntryDate.Month;
                EntryModel.DocNumber = entry.DocNumber;
                EntryModel.Description = entry.Description;
                EntryModel.JournalTypeId = entry.JournalTypeId;
                EntryModel.EntryDate = entry.EntryDate;
                EntryModel.Notes = entry.Notes;

                //------------------------------Fill Entry Details-----------------------------------//

                var details = (from journal_details in Context.JournalEntryDetails
                               join Accounts in Context.AccountTrees on journal_details.AccountID equals Accounts.AccountId
                               join costs in Context.CostCenterTree on journal_details.CostCenterId equals costs.CostCenterId into joinT
                               from costs in joinT.DefaultIfEmpty()
                                   //orderby journal_details.JournalDetialID
                               where journal_details.JournalEntryId == entry.JournalEntryId
                               select new JournalEntryAccount
                               {
                                   AccountId = Accounts.AccountId,
                                   Debit = journal_details.Debit,
                                   Credit = journal_details.Credit,
                                   Description = journal_details.Description,
                                   CostCenterId = journal_details.CostCenterId,
                                   CostPercent = journal_details.CostPercent,
                                   CostValue = journal_details.CostValue,
                                   CurrencyId = journal_details.CurrencyId,
                                   AccountName = Accounts.NameAR,
                                   AccountNumber = Accounts.AccountNumber,
                                   Notes = journal_details.Description
                               }).ToList();

                EntryModel.JournalEntryAccounts = details;
            }

            return EntryModel;
        }


        public int GenerateNewEntryNumber(int month, int year)
        {
            //int month = dtp_EntryDate.Date.Month;
            //int year = dtp_EntryDate.Date.Year;
            int entry_number = 1;

            try
            {
                entry_number = (Context.JournalEntries.Where(x => x.EntryDate.Month == month && x.EntryDate.Year == year).Max(x => x.EntryNumber) + 1);
            }
            catch (Exception)
            {
                //entry_number = "1";
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


        public ActionsResponseModel SaveNewJournalEntry(JournalEntryModel model)
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
                    Description = model.Description,
                    DocNumber = model.DocNumber,
                    Notes = model.Notes,
                    JournalTypeId = model.JournalTypeId,
                    IsCancelled = false,
                    IsLocked = false,
                    PeriodId = CurrentPeriod != null ? CurrentPeriod.FinancialPeriodId : 0,
                    EntryDate = model.EntryDate,
                    ActionTypeId = 1,
                    ActionId = 0,
                    CreatedDate = DateTime.Now,
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
                            AccountID = row.AccountId,
                            Debit = row.Debit ?? 0,
                            Credit = row.Credit ?? 0,
                            CurrencyId = row.CurrencyId,
                            Description = row.Description,
                            CostCenterId = row.CostCenterId,
                            CostValue = row.CostValue,
                            CostPercent = row.CostPercent
                        };

                        Context.JournalEntryDetails.Add(JournalDetials);
                        Context.SaveChanges();
                    }
                }
                return new ActionsResponseModel
                {
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

        public ActionsResponseModel EditJournalEntry(int EntryId, JournalEntryModel model)
        {
            try
            {
                var entry_tbl = Context.JournalEntries.Where(i => i.JournalEntryId == EntryId).FirstOrDefault();
                if (entry_tbl != null)
                {
                    entry_tbl.Description = model.Description;
                    entry_tbl.DocNumber = model.DocNumber;
                    entry_tbl.Notes = model.Notes;
                    entry_tbl.JournalTypeId = model.JournalTypeId;
                    entry_tbl.EntryDate = model.EntryDate;
                   
                    entry_tbl.ModifiedDate = DateTime.Now;
                    entry_tbl.ModifiedBy = "";

                    
                    Context.SaveChanges();

                    var JournalEntryDetails = Context.JournalEntryDetails.Where(x => x.JournalEntryId == EntryId).ToList();
                    Context.JournalEntryDetails.RemoveRange(JournalEntryDetails);
                    foreach (JournalEntryAccount row in model.JournalEntryAccounts)
                    {
                        if (row.Debit != 0 || row.Credit != 0)
                        {
                            JournalEntryDetail JournalDetials = new JournalEntryDetail
                            {
                                JournalEntryId = entry_tbl.JournalEntryId,
                                AccountID = row.AccountId,
                                Debit = row.Debit ?? 0,
                                Credit = row.Credit ?? 0,
                                CurrencyId = row.CurrencyId,
                                Description = row.Description,
                                CostCenterId = row.CostCenterId,
                                CostValue = row.CostValue,
                                CostPercent = row.CostPercent
                            };

                            Context.JournalEntryDetails.Add(JournalDetials);
                            Context.SaveChanges();
                        }
                    }

                    return new ActionsResponseModel { Message = "Entry Updated Successfly !" };
                }
                else
                    return new ActionsResponseModel { IsSuccess = false, Message = "can't find this entry" };

            }
            catch (Exception ex)
            {
                return new ActionsResponseModel
                {
                    IsSuccess = false,
                    Message = ex.Message
                };
            }
        }



        public DataTable GetDailyJournalEntriesSummary(FilterModel model)
        {
            //DataTable dt = new DataTable();
            //dt.Clear();
            //dt.Columns.Add("CategoryDisplayName");
            //dt.Columns.Add("CategoryName");
            //dt.Columns.Add("ItemKey");
            //dt.Columns.Add("ItemValue");
            //dt.Columns.Add("DisplayOrder");

            //foreach (FilterItem item in model.FilterItems)
            //{
            //    DataRow row = dt.NewRow();

            //    row["CategoryDisplayName"] = item.CategoryDisplayName;
            //    row["CategoryName"] = item.CategoryName;
            //    row["ItemKey"] = item.ItemKey;
            //    row["ItemValue"] = item.ItemKey;
            //    row["DisplayOrder"] = 1;
            //    dt.Rows.Add(row);
            //}

            DataTable dt = SharedFilterService.MapFilterModelToDataTable(model.FilterItems);

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


        public bool SavePaymentJournalEntry(PaymentReceipt Model)
        {
            try
            {
                JournalEntry JournalHeader_tbl = new JournalEntry();

                JournalHeader_tbl.EntryNumber = GenerateNewEntryNumber(Model.ReleaseDate.Month, Model.ReleaseDate.Year);
                JournalHeader_tbl.DocNumber = Model.DocNumber;
                JournalHeader_tbl.EntryDate = Model.ReleaseDate;
                JournalHeader_tbl.Description = Model.Notes;
                JournalHeader_tbl.Notes = Model.Notes;
                JournalHeader_tbl.IsLocked = false;
                JournalHeader_tbl.IsCancelled = false;
                JournalHeader_tbl.JournalTypeId = (int)EntryType.Cashing;
                JournalHeader_tbl.PeriodId = Context.ReceiptLedgers.Single(x => x.ReceiptLedgerId == Model.ReceiptLedgerId).PeriodId;
                JournalHeader_tbl.ActionTypeId = (int)JournalActionType.CashPayment;
                JournalHeader_tbl.ActionId = Model.PaymentTypeId;
                JournalHeader_tbl.CreatedDate = DateTime.Now;
                JournalHeader_tbl.CreatedBy = "";

                Context.JournalEntries.Add(JournalHeader_tbl);
                Context.SaveChanges();


                int GeneralSupplierID = Context.AccountTrees.Single(x => x.AccountTypeId == 5).AccountId;

                // Debit

                JournalEntryDetail JournalDetailsCredit_tbl = new JournalEntryDetail();

                JournalDetailsCredit_tbl.JournalEntryId = JournalHeader_tbl.JournalEntryId;

                if (Model.AgencyTypeId == 0)
                {
                    JournalDetailsCredit_tbl.SupplierId = Model.SupplierId;
                    JournalDetailsCredit_tbl.AccountID = GeneralSupplierID;
                }
                else
                {
                    JournalDetailsCredit_tbl.AccountID = (int)Model.AccountId;
                }

                JournalDetailsCredit_tbl.Credit = 0;
                JournalDetailsCredit_tbl.Debit = Model.MoneyAmount;
                JournalDetailsCredit_tbl.CurrencyId = 1;
                JournalDetailsCredit_tbl.Description = Model.Notes;

                Context.JournalEntryDetails.Add(JournalDetailsCredit_tbl);
                Context.SaveChanges();


                // Credit

                JournalEntryDetail JournalDetailsDebit_tbl = new JournalEntryDetail();

                JournalDetailsDebit_tbl.JournalEntryId = JournalHeader_tbl.JournalEntryId;
                JournalDetailsDebit_tbl.AccountID = Context.AccountTrees.FirstOrDefault(x => x.AccountTypeId == 4 && x.IsParent == false).AccountId;
                JournalDetailsDebit_tbl.Credit = Model.MoneyAmount; //Double.Parse(((Label)gvc.FooterRow.FindControl("lbl_TotalAmount")).Text);
                JournalDetailsDebit_tbl.Debit = 0;
                JournalDetailsDebit_tbl.CurrencyId = 1; // Int32.Parse(cmb_Currency.SelectedItem.Value.ToString());
                JournalDetailsDebit_tbl.Description = Model.Notes; //((Label)gvc.Rows[0].FindControl("lbl_Notes_Row")).Text;

                Context.JournalEntryDetails.Add(JournalDetailsDebit_tbl);
                Context.SaveChanges();
                return true;
            }
            catch (Exception)
            {
                return false;
            }
        }

        public bool SaveReceiveJournalEntry(ReceiveReceipt Model)
        {
            try
            {
                JournalEntry JournalHeader_tbl = new JournalEntry();

                JournalHeader_tbl.EntryNumber = GenerateNewEntryNumber(Model.ReleaseDate.Month, Model.ReleaseDate.Year);
                JournalHeader_tbl.DocNumber = "";// txt_ReceiptNumber.Text;
                JournalHeader_tbl.EntryDate = Model.ReleaseDate;
                JournalHeader_tbl.Description = Model.Notes;
                JournalHeader_tbl.Notes = Model.Notes;
                JournalHeader_tbl.IsLocked = false;
                JournalHeader_tbl.IsCancelled = false;
                JournalHeader_tbl.JournalTypeId = 3;
                JournalHeader_tbl.PeriodId = Context.ReceiptLedgers.Single(x => x.ReceiptLedgerId == Model.ReceiptLedgerId).PeriodId;
                JournalHeader_tbl.ActionTypeId = 4;
                JournalHeader_tbl.ActionId = Model.ReceiveReceiptId;
                JournalHeader_tbl.CreatedDate = DateTime.Now;
                JournalHeader_tbl.CreatedBy = "";

                Context.JournalEntries.Add(JournalHeader_tbl);
                Context.SaveChanges();


                int GeneralSupplierID = Context.AccountTrees.Single(x => x.AccountTypeId == 5).AccountId;

                // Debit

                JournalEntryDetail JournalDetailsCredit_tbl = new JournalEntryDetail();

                JournalDetailsCredit_tbl.JournalEntryId = JournalHeader_tbl.JournalEntryId;

                if (Model.AgencyTypeId == 0)
                {
                    JournalDetailsCredit_tbl.SupplierId = Model.AgencyTypeId;
                    JournalDetailsCredit_tbl.AccountID = GeneralSupplierID;
                }
                else
                {
                    JournalDetailsCredit_tbl.AccountID = Model.AccountId;
                }

                JournalDetailsCredit_tbl.Credit = 0;
                JournalDetailsCredit_tbl.Debit = Model.MoneyAmount;
                JournalDetailsCredit_tbl.CurrencyId = 1;
                JournalDetailsCredit_tbl.Description = Model.Notes;

                Context.JournalEntryDetails.Add(JournalDetailsCredit_tbl);
                Context.SaveChanges();


                // Credit

                JournalEntryDetail JournalDetailsDebit_tbl = new JournalEntryDetail();

                JournalDetailsDebit_tbl.JournalEntryId = JournalHeader_tbl.JournalEntryId;
                JournalDetailsDebit_tbl.AccountID = 1; //Int32.Parse(cmb_Safe.SelectedItem.Value.ToString());
                JournalDetailsDebit_tbl.Credit = Model.MoneyAmount; //Double.Parse(((Label)gvc.FooterRow.FindControl("lbl_TotalAmount")).Text);
                JournalDetailsDebit_tbl.Debit = 0;
                JournalDetailsDebit_tbl.CurrencyId = 1; // Int32.Parse(cmb_Currency.SelectedItem.Value.ToString());
                JournalDetailsDebit_tbl.Description = Model.Notes; //((Label)gvc.Rows[0].FindControl("lbl_Notes_Row")).Text;

                Context.JournalEntryDetails.Add(JournalDetailsDebit_tbl);
                Context.SaveChanges();
                return true;
            }
            catch (Exception)
            {
                return false;
            }
        }


    }


}



