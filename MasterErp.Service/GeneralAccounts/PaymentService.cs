using MasterErp.Entities.Common;
using MasterErp.Entities.Common.Enums;
using MasterErp.Entities.Models;
using MasterErp.Interface.Common;
using MasterErp.Interface.GeneralAccounts;
using MasterErp.Service.Common;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Service.GeneralAccounts
{
    public class PaymentService : IPaymentService
    {
        private readonly DBContext Context;
        private readonly ISQLHelper SQLHelper;
        private readonly IConfiguration Configuration;
        private readonly IJournalEntryService entryService;
        private readonly string ConnectionString;

        public PaymentService(DBContext DbContext, ISQLHelper SQLHelper, IConfiguration _configuration, IJournalEntryService EntryService)
        {
            this.Context = DbContext;
            this.SQLHelper = SQLHelper;
            this.Configuration = _configuration;
            this.ConnectionString = Configuration.GetConnectionString("DBConnection");
            this.entryService = EntryService;
        }

        public DataTable GetPaymentReceipts_Summary(FilterModel model)
        {
            //return Context.PaymentReceipts.ToList().ToDataTable();

            SqlParameter[] Params = new SqlParameter[2];
            Params[0] = new SqlParameter("@CurrentPage", (object)model.CurrentPage ?? DBNull.Value);
            Params[1] = new SqlParameter("@PageSize", (object)model.PageSize ?? DBNull.Value);

            var dt = SQLHelper.ExecuteDataTable("[Finance].[SP_GetPaymentReceipts_Summary]", ConnectionString, Params);
            return dt;
        }

        public DataTable GetPaymentReceipts_Filters(FilterModel model)
        {
            return new DataTable();
        }

        public ActionsResponseModel SavePaymentReceipt(PaymentReceipt Model)
        {
            try
            {
                PaymentReceipt tbl = new PaymentReceipt()
                {
                    ReceiptNumber = Context.PaymentReceipts.Count() > 0 ? Context.PaymentReceipts.Max(x => x.ReceiptNumber) + 1 : 1,
                    ReceiptLedgerId = Model.ReceiptLedgerId,
                    PaymentTypeId = Model.PaymentTypeId,
                    ReleaseDate = Model.ReleaseDate,
                    Notes = Model.Notes,
                    MoneyAmount = Model.MoneyAmount,
                    DocNumber = Model.DocNumber,
                    AgencyTypeId = Model.AgencyTypeId,
                    AccountId = Model.AccountId,
                    SupplierId = Model.SupplierId,
                    CreatedDate = DateTime.Now,
                    CreatedBy = "",
                    IsCancelled = false,
                    IsLocked = false
                };

                Context.PaymentReceipts.Add(tbl);
                Context.SaveChanges();

                var entry = PreparePaymentEntryModel(tbl);
                var result = entryService.SaveNewJournalEntry(entry);

                //{
                return new ActionsResponseModel
                {
                    Status = result.Status,
                    Message = result.Status == 1 ? "تم حفظ البيانات بنجاح" : "فشل فى تسجيل القيد المحاسبى",
                    Id = tbl.ReceiptNumber,
                };
                //}
                //else
                //{
                //    return new ActionsResponseModel
                //    {
                //        Status = 0,
                //        Message = "فشل فى تسجيل القيد المحاسبى"
                //    };
                //}
            }
            catch (Exception ex)
            {
                return new ActionsResponseModel
                {
                    Status = 0,
                    Message = ex.Message
                };
            }
        }

        private JournalEntryModel PreparePaymentEntryModel(PaymentReceipt Model)
        {
            try
            {
                int generalSupplierId = Context.AccountTrees.Single(x => x.AccountTypeId == 5).AccountId;
                int accountId = Model.AgencyTypeId == 0 ? generalSupplierId : (int)Model.AccountId;
                List<JournalEntryAccount> accounts = new List<JournalEntryAccount>();

                accounts.Add(new JournalEntryAccount
                {
                    AccountId = Model.AgencyTypeId == 0 ? generalSupplierId : (int)Model.AccountId,
                    Credit = 0,
                    Debit = Model.MoneyAmount,
                    CurrencyId = 1,
                    SupplierId = Model.AgencyTypeId == 0 ? Model.SupplierId : null,
                    Description = Model.Notes
                });

                accounts.Add(new JournalEntryAccount
                {
                    AccountId = Context.AccountTrees.FirstOrDefault(x => x.AccountTypeId == 4 && x.IsParent == false).AccountId,
                    Credit = Model.MoneyAmount,
                    Debit = 0,
                    CurrencyId = 1,
                    SupplierId = Model.AgencyTypeId == 0 ? Model.SupplierId : null,
                    Description = Model.Notes
                });

                JournalEntryModel entry = new JournalEntryModel
                {
                    //EntryNumber = GenerateNewEntryNumber(Model.ReleaseDate.Month, Model.ReleaseDate.Year);
                    DocNumber = Model.DocNumber,
                    EntryDate = Model.ReleaseDate,
                    Description = Model.Notes,
                    Notes = Model.Notes,
                    JournalTypeId = (int)EntryType.Cashing,
                    PeriodId = Context.ReceiptLedgers.Single(x => x.ReceiptLedgerId == Model.ReceiptLedgerId).PeriodId,
                    ActionTypeId = (int)JournalActionType.CashPayment,
                    ActionId = Model.PaymentTypeId,
                    Month = Model.ReleaseDate.Month,
                    Year = Model.ReleaseDate.Year,
                    JournalEntryAccounts = accounts
                };

                return entry;
            }
            catch (Exception)
            {
                throw new Exception();
            }
        }

        public DataTable GetReceiveReceipts_Summary(FilterModel model)
        {
            return Context.ReceiveReceipt.ToList().ToDataTable();
        }

        public DataTable GetReceiveReceipts_Filters(FilterModel model)
        {
            return new DataTable();
        }

        public ActionsResponseModel SaveReceiveReceipt(ReceiveReceipt Model)
        {
            try
            {
                ReceiveReceipt tbl = new ReceiveReceipt();

                tbl.ReceiptNumber = Context.ReceiveReceipt.Count() > 0 ? Context.ReceiveReceipt.Max(x => x.ReceiptNumber) + 1 : 1;
                tbl.ReceiptLedgerId = Model.ReceiptLedgerId;
                tbl.BenefitPerson = Model.BenefitPerson;
                //tbl.SafeID = Int32.Parse(cmb_Safe.SelectedItem.Value.ToString());
                tbl.ReceiveTypeId = Model.ReceiveTypeId;
                tbl.ReleaseDate = Model.ReleaseDate;
                //tbl.CurrencyID = Int32.Parse(cmb_Currency.SelectedItem.Value.ToString());
                tbl.Notes = Model.Notes;
                tbl.DocNumber = Model.DocNumber;
                tbl.ChequeNumber = Model.ChequeNumber;
                tbl.MoneyAmount = Model.MoneyAmount;
                tbl.AgencyTypeId = Model.AgencyTypeId;
                tbl.AgencyId = Model.AgencyId;
                tbl.AccountId = Model.AccountId;
                tbl.InsertDate = DateTime.Now;
                tbl.InsertUser = "";
                tbl.IsCancelled = false;
                tbl.IsLocked = false;

                //tbl.PaymentTypeID = Int32.Parse(cmb_PaymentType.SelectedItem.Value.ToString());
                //tbl.LoanNumber = txt_ProductNumber.Text;
                //tbl.LedegerNumber = txt_LedgerNumber.Text;
                //tbl.PaidWithID = Int32.Parse(cmb_PaidWith.SelectedItem.Value.ToString());
                //tbl.JustmentNumber = txt_JustmentNumber.Text;


                //txt_ReceiptNumber.Text = Header_tbl.ReceitNumber.ToString();

                Context.ReceiveReceipt.Add(tbl);
                Context.SaveChanges();

                //if (entryService.SaveReceiveJournalEntry(tbl))
                //{
                return new ActionsResponseModel
                {
                    Status = 1,
                    Message = "تم حفظ البيانات بنجاح",
                    Id = tbl.ReceiptNumber
                };
                //}
                //else
                //{
                //    return new ActionsResponseModel
                //    {
                //        Status = 0,
                //        Message = "فشل فى تسجيل القيد المحاسبى"
                //    };
                //}
            }
            catch (Exception ex)
            {
                return new ActionsResponseModel
                {
                    Status = 0,
                    Message = ex.Message
                };
            }
        }

    }
}
