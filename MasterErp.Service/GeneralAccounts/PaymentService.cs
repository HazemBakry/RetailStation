using MasterErp.Entities.Common;
using MasterErp.Entities.Common.Enums;
using MasterErp.Entities.Models;
using MasterErp.Entities.Models.HR.Employee;
using MasterErp.Interface.Common;
using MasterErp.Interface.GeneralAccounts;
using MasterErp.Service.Common;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using Microsoft.Identity.Client;
using System;
using System.Collections.Generic;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static Azure.Core.HttpHeader;

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
                PaymentReceipt receipt = new PaymentReceipt();

                if (Model.PaymentReceiptId > 0)
                {
                    receipt = Context.PaymentReceipts.FirstOrDefault(x => x.PaymentReceiptId == Model.PaymentReceiptId);
                    if (receipt != null)
                    {
                        receipt.ReceiptLedgerId = Model.ReceiptLedgerId;
                        receipt.PaymentTypeId = Model.PaymentTypeId;
                        receipt.ContactName = Model.ContactName;
                        receipt.CurrencyId = Model.CurrencyId;
                        receipt.ReceiptTypeId = Model.ReceiptTypeId;
                        receipt.BankAccountId = Model.BankAccountId;
                        receipt.CustomerId = Model.CustomerId;
                        receipt.EmployeeId = Model.EmployeeId;
                        receipt.SafeId = Model.SafeId;
                        receipt.Notes = Model.Notes;
                        receipt.MoneyAmount = Model.MoneyAmount;
                        receipt.DocNumber = Model.DocNumber;
                        receipt.AgencyTypeId = Model.AgencyTypeId;
                        receipt.AccountId = Model.AccountId;
                        receipt.SupplierId = Model.SupplierId;

                        Context.SaveChanges();
                    }
                }
                else
                {
                    receipt = new PaymentReceipt()
                    {
                        ReceiptNumber = Context.PaymentReceipts.Count() > 0 ? Context.PaymentReceipts.Max(x => x.ReceiptNumber) + 1 : 1,
                        ReceiptLedgerId = Model.ReceiptLedgerId,
                        PaymentTypeId = Model.PaymentTypeId,
                        ReleaseDate = Model.ReleaseDate,
                        ContactName = Model.ContactName,
                        CurrencyId = Model.CurrencyId,
                        ReceiptTypeId = Model.ReceiptTypeId,
                        BankAccountId = Model.BankAccountId,
                        CustomerId = Model.CustomerId,
                        EmployeeId = Model.EmployeeId,
                        SafeId = Model.SafeId,
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

                    Context.PaymentReceipts.Add(receipt);
                    Context.SaveChanges();
                }

                var entry = PreparePaymentEntryModel(receipt);
                var result = entryService.SaveNewJournalEntry(entry);

                return new ActionsResponseModel
                {
                    Status = result.Status,
                    Message = result.IsSuccess ? "تم حفظ البيانات بنجاح" : "فشل فى تسجيل القيد المحاسبى",
                    Id = receipt.PaymentReceiptId,
                    Number = receipt.ReceiptNumber.ToString(),
                    IsSuccess = result.IsSuccess
                };
            }
            catch (Exception ex)
            {
                return new ActionsResponseModel
                {
                    Status = 0,
                    Message = ex.Message,
                    IsSuccess = false
                };
            }
        }

        private JournalEntryModel PreparePaymentEntryModel(PaymentReceipt Model)
        {
            try
            {
                int generalSupplierId = Context.AccountTrees.Single(x => x.AccountTypeId == 5).AccountId;
                int accountId = Model.AgencyTypeId == 2 ? generalSupplierId : (int)Model.AccountId;
                List<JournalEntryAccount> accounts = new List<JournalEntryAccount>();

                accounts.Add(new JournalEntryAccount
                {
                    AccountId = Model.AgencyTypeId == 2 ? generalSupplierId : (int)Model.AccountId,
                    Credit = 0,
                    Debit = Model.MoneyAmount,
                    CurrencyId = 1,
                    SupplierId = Model.AgencyTypeId == 2 ? Model.SupplierId : null,
                    Description = Model.Notes
                });

                accounts.Add(new JournalEntryAccount
                {
                    AccountId = Context.AccountTrees.FirstOrDefault(x => x.AccountTypeId == 4 && x.IsParent == false).AccountId,
                    Credit = Model.MoneyAmount,
                    Debit = 0,
                    CurrencyId = 1,
                    SupplierId = Model.AgencyTypeId == 2 ? Model.SupplierId : null,
                    Description = Model.Notes
                });

                JournalEntryModel entry = new JournalEntryModel
                {
                    //EntryNumber = GenerateNewEntryNumber(Model.ReleaseDate.Month, Model.ReleaseDate.Year);
                    DocNumber = Model.DocNumber,
                    EntryDate = Model.ReleaseDate,
                    Description = Model.Notes,
                    JournalTypeId = (int)EntryType.Cashing,
                    PeriodId = Context.ReceiptLedgers.Single(x => x.ReceiptLedgerId == Model.ReceiptLedgerId).PeriodId,
                    ActionTypeId = (int)JournalActionType.CashPayment,
                    ActionId = Model.PaymentReceiptId,
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

        public ActionsResponseModel CancelPaymentReceipt(int ReceiptId)
        {
            var receipt = Context.PaymentReceipts.FirstOrDefault(x => x.PaymentReceiptId == ReceiptId);
            if (receipt != null)
            {
                receipt.IsCancelled = true;
                receipt.ModifiedDate = DateTime.Now;

                Context.SaveChanges();
                return new ActionsResponseModel
                {
                    Id = ReceiptId,
                    IsSuccess = true,
                    Message = "تم الغاء السند بنجاح",
                    Status = 200,
                    Number = receipt.ReceiptNumber.ToString()
                };
            }
            else
            {
                return new ActionsResponseModel
                {
                    Id = ReceiptId,
                    IsSuccess = false,
                    Message = "هذا السند غير موجود",
                    Status = 100,
                    Number = receipt.ReceiptNumber.ToString()
                };
            }
        }

        public DataTable GetReceiveReceipts_Summary(FilterModel model)
        {
            return Context.ReceiveReceipts.ToList().ToDataTable();
        }

        public DataTable GetReceiveReceipts_Filters(FilterModel model)
        {
            return new DataTable();
        }

        public ActionsResponseModel SaveReceiveReceipt(ReceiveReceipt Model)
        {
            try
            {
                ReceiveReceipt tbl = new ReceiveReceipt()
                {
                    ReceiptNumber = Context.ReceiveReceipts.Count() > 0 ? Context.ReceiveReceipts.Max(x => x.ReceiptNumber) + 1 : 1,
                    ReceiptLedgerId = Model.ReceiptLedgerId,
                    PaymentTypeId = Model.PaymentTypeId,
                    ReleaseDate = Model.ReleaseDate,
                    ContactName = Model.ContactName,
                    CurrencyId = Model.CurrencyId,
                    ReceiptTypeId = Model.ReceiptTypeId,
                    BankAccountId = Model.BankAccountId,
                    CustomerId = Model.CustomerId,
                    EmployeeId = Model.EmployeeId,
                    SafeId = Model.SafeId,
                    Description = Model.Description,
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

                Context.ReceiveReceipts.Add(tbl);
                Context.SaveChanges();

                var entry = PrepareReceiveEntryModel(tbl);
                var result = entryService.SaveNewJournalEntry(entry);

                return new ActionsResponseModel
                {
                    Status = result.Status,
                    Message = result.IsSuccess ? "تم حفظ البيانات بنجاح" : "فشل فى تسجيل القيد المحاسبى",
                    Id = tbl.ReceiveReceiptId,
                    Number = tbl.ReceiptNumber.ToString(),
                    IsSuccess = result.IsSuccess
                };
            }
            catch (Exception ex)
            {
                return new ActionsResponseModel
                {
                    Status = 0,
                    Message = ex.Message,
                    IsSuccess = false
                };
            }
        }

        private JournalEntryModel PrepareReceiveEntryModel(ReceiveReceipt Model)
        {
            try
            {
                int generalSupplierId = Context.AccountTrees.Single(x => x.AccountTypeId == 5).AccountId;
                int accountId = Model.AgencyTypeId == 2 ? generalSupplierId : (int)Model.AccountId;
                List<JournalEntryAccount> accounts = new List<JournalEntryAccount>();

                accounts.Add(new JournalEntryAccount
                {
                    AccountId = Model.AgencyTypeId == 2 ? generalSupplierId : (int)Model.AccountId,
                    Credit = 0,
                    Debit = Model.MoneyAmount,
                    CurrencyId = 1,
                    SupplierId = Model.AgencyTypeId == 2 ? Model.SupplierId : null,
                    Description = Model.Description
                });

                accounts.Add(new JournalEntryAccount
                {
                    AccountId = Context.AccountTrees.FirstOrDefault(x => x.AccountTypeId == 4 && x.IsParent == false).AccountId,
                    Credit = Model.MoneyAmount,
                    Debit = 0,
                    CurrencyId = 1,
                    SupplierId = Model.AgencyTypeId == 2 ? Model.SupplierId : null,
                    Description = Model.Description
                });

                JournalEntryModel entry = new JournalEntryModel
                {
                    //EntryNumber = GenerateNewEntryNumber(Model.ReleaseDate.Month, Model.ReleaseDate.Year);
                    DocNumber = Model.DocNumber,
                    EntryDate = Model.ReleaseDate,
                    Description = Model.Description,
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

        public ActionsResponseModel CancelReceiveReceipt(int ReceiptId)
        {
            var receipt = Context.ReceiveReceipts.FirstOrDefault(x => x.ReceiveReceiptId == ReceiptId);
            if (receipt != null)
            {
                receipt.IsCancelled = true;
                receipt.ModifiedDate = DateTime.Now;

                Context.SaveChanges();
                return new ActionsResponseModel
                {
                    Id = ReceiptId,
                    IsSuccess = true,
                    Message = "تم الغاء السند بنجاح",
                    Status = 200,
                    Number = receipt.ReceiptNumber.ToString()
                };
            }
            else
            {
                return new ActionsResponseModel
                {
                    Id = ReceiptId,
                    IsSuccess = false,
                    Message = "هذا السند غير موجود",
                    Status = 100,
                    Number = receipt.ReceiptNumber.ToString()
                };
            }
        }
    }
}
