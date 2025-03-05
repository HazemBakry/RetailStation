using MasterErp.Entities.Common;
using MasterErp.Entities.Common.Enums;
using MasterErp.Entities.Common.Finance.GeneralAccounts;
using MasterErp.Entities.Models;
using MasterErp.Entities.Models.Finance;
using MasterErp.Interface.Common;
using MasterErp.Interface.GeneralAccounts;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;

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

        //----------------------------------- Payment Order ------------------------------------------//

        public List<ReceiptModel> GetPaymentOrders_Summary(FilterModel model)
        {
            SqlParameter[] Params = new SqlParameter[2];
            Params[0] = new SqlParameter("@CurrentPage", (object)model.CurrentPage ?? DBNull.Value);
            Params[1] = new SqlParameter("@PageSize", (object)model.PageSize ?? DBNull.Value);

            var result = SQLHelper.SQLQuery<ReceiptModel>("[Finance].[SP_GetPaymentOrders_Summary]", ConnectionString, Params).ToList();
            return result;
        }

        public DataTable GetPaymentOrders_Filters(FilterModel model)
        {
            return new DataTable();
        }

        public ActionsResponseModel SavePaymentOrder(PaymentOrder Model)
        {
            try
            {
                PaymentOrder order = new PaymentOrder();

                if (Model.PaymentOrderId > 0)
                {
                    order = Context.PaymentOrders.FirstOrDefault(x => x.PaymentOrderId == Model.PaymentOrderId);
                    if (order != null)
                    {
                        order.ContactName = Model.ContactName;
                        order.CurrencyId = Model.CurrencyId;
                        order.CustomerId = Model.CustomerId;
                        order.EmployeeId = Model.EmployeeId;
                        order.Description = Model.Description;
                        order.MoneyAmount = Model.MoneyAmount;
                        order.AgencyTypeId = Model.AgencyTypeId;
                        order.AccountId = Model.AccountId;
                        order.SupplierId = Model.SupplierId;
                        order.FromAccountId = Model.FromAccountId;
                        order.PaymentTypeId = Model.PaymentTypeId;

                        Context.SaveChanges();
                    }
                }
                else
                {
                    order = new PaymentOrder()
                    {
                        OrderNumber = Context.PaymentOrders.Count() > 0 ? Context.PaymentOrders.Max(x => x.OrderNumber) + 1 : 1,
                        ReleaseDate = Model.ReleaseDate,
                        ContactName = Model.ContactName,
                        CurrencyId = Model.CurrencyId,
                        CustomerId = Model.CustomerId,
                        EmployeeId = Model.EmployeeId,
                        PaymentTypeId = Model.PaymentTypeId,
                        Description = Model.Description,
                        MoneyAmount = Model.MoneyAmount,
                        AgencyTypeId = Model.AgencyTypeId,
                        AccountId = Model.AccountId,
                        SupplierId = Model.SupplierId,
                        FromAccountId = Model.FromAccountId,
                        CreatedDate = DateTime.Now,
                        CreatedBy = "",
                        IsCancelled = false,
                        IsLocked = false
                    };

                    Context.PaymentOrders.Add(order);
                    Context.SaveChanges();
                }

                return new ActionsResponseModel
                {
                    Status = 200,
                    Message = "تم حفظ أمر الصرف بنجاح",
                    Id = order.PaymentOrderId,
                    Number = order.OrderNumber.ToString(),
                    IsSuccess = true,
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

        public ActionsResponseModel CancelPaymentOrder(int OrderId)
        {
            var order = Context.PaymentOrders.FirstOrDefault(x => x.PaymentOrderId == OrderId);
            if (order != null && order.IsLocked != true)
            {
                order.IsCancelled = true;
                order.ModifiedDate = DateTime.Now;

                Context.SaveChanges();
                return new ActionsResponseModel
                {
                    Id = OrderId,
                    IsSuccess = true,
                    Message = "تم الغاء أمر الصرف بنجاح",
                    Status = 200,
                    Number = order.OrderNumber.ToString()
                };
            }
            else
            {
                return new ActionsResponseModel
                {
                    Id = OrderId,
                    IsSuccess = false,
                    Message = "لا يمكن الغاء هذا الأمر",
                    Status = 100,
                    Number = order.OrderNumber.ToString()
                };
            }
        }

        public PaymentOrder GetPaymentOrderDetails(int OrderId)
        {
            var order = Context.PaymentOrders.FirstOrDefault(x => x.PaymentOrderId == OrderId);
            return order;
        }

        public List<SelectorDataModel> GetPaymentOrdersSelector()
        {
            var results = Context.PaymentOrders.Select(b => new SelectorDataModel
            {
                Id = b.PaymentOrderId,
                Name = b.OrderNumber.ToString(),
            }).ToList();
            return results;
        }

        //----------------------------------- Payment Receipt ------------------------------------------//

        public List<ReceiptModel> GetPaymentReceipts_Summary(FilterModel model)
        {
            //return Context.PaymentReceipts.ToList().ToDataTable();

            SqlParameter[] Params = new SqlParameter[2];
            Params[0] = new SqlParameter("@CurrentPage", (object)model.CurrentPage ?? DBNull.Value);
            Params[1] = new SqlParameter("@PageSize", (object)model.PageSize ?? DBNull.Value);

            var result = SQLHelper.SQLQuery<ReceiptModel>("[Finance].[SP_GetPaymentReceipts_Summary]", ConnectionString, Params).ToList();
            return result;
        }

        public DataTable GetPaymentReceipts_Filters(FilterModel model)
        {
            return new DataTable();
        }

        public ActionsResponseModel SavePaymentReceipt(ReceiptModel Model)
        {
            try
            {
                PaymentReceipt receipt = new PaymentReceipt();

                if (Model.ReceiptId > 0)
                {
                    receipt = Context.PaymentReceipts.FirstOrDefault(x => x.PaymentReceiptId == Model.ReceiptId);
                    if (receipt != null)
                    {
                        receipt.ReceiptLedgerId = Model.ReceiptLedgerId;
                        receipt.PaymentTypeId = Model.PaymentTypeId;
                        receipt.ContactName = Model.ContactName;
                        receipt.CurrencyId = Model.CurrencyId;
                        receipt.ReceiptTypeId = Model.ReceiptTypeId;
                        receipt.BankAccountId = Model.BankAccountId;
                        receipt.FromAccountId = Model.FromAccountId;
                        receipt.CustomerId = Model.CustomerId;
                        receipt.EmployeeId = Model.EmployeeId;
                        receipt.Description = Model.Description;
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
                        FromAccountId = Model.FromAccountId,
                        BankAccountId = Model.BankAccountId,
                        CustomerId = Model.CustomerId,
                        EmployeeId = Model.EmployeeId,
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
                //int generalSupplierId = Context.AccountTrees.Single(x => x.AccountTypeId == 5).AccountId;
                //int accountId = Model.AgencyTypeId == 2 ? generalSupplierId : (int)Model.AccountId;
                List<JournalEntryAccount> accounts = new List<JournalEntryAccount>();

                accounts.Add(new JournalEntryAccount
                {
                    AccountId = (int)Model.FromAccountId,//Model.AgencyTypeId == 2 ? generalSupplierId : (int)Model.AccountId,
                    Credit = 0,
                    Debit = Model.MoneyAmount,
                    CurrencyId = 1,
                    SupplierId = Model.AgencyTypeId == 2 ? Model.SupplierId : null,
                    Description = Model.Description
                });

                accounts.Add(new JournalEntryAccount
                {
                    AccountId = (int)Model.AccountId,//Context.AccountTrees.FirstOrDefault(x => x.AccountTypeId == 4 && x.IsParent == false).AccountId,
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

        public List<ReceiptModel> GetReceiveReceipts_Summary(FilterModel model)
        {
            //return Context.ReceiveReceipts.ToList().ToDataTable();
            SqlParameter[] Params = new SqlParameter[2];
            Params[0] = new SqlParameter("@CurrentPage", (object)model.CurrentPage ?? DBNull.Value);
            Params[1] = new SqlParameter("@PageSize", (object)model.PageSize ?? DBNull.Value);

            var result = SQLHelper.SQLQuery<ReceiptModel>("[Finance].[SP_GetReceiveReceipts_Summary]", ConnectionString, Params).ToList();
            return result;
        }

        public DataTable GetReceiveReceipts_Filters(FilterModel model)
        {
            return new DataTable();
        }

        public ActionsResponseModel SaveReceiveReceipt(ReceiptModel Model)
        {
            try
            {
                ReceiveReceipt receipt = new ReceiveReceipt();

                if (Model.ReceiptId > 0)
                {
                    receipt = Context.ReceiveReceipts.FirstOrDefault(x => x.ReceiveReceiptId == Model.ReceiptId);
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
                        //receipt.SafeId = Model.SafeId;
                        receipt.Description = Model.Description;
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
                    receipt = new ReceiveReceipt()
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
                        //SafeId = Model.SafeId,
                        Description = Model.Description,
                        MoneyAmount = Model.MoneyAmount,
                        DocNumber = Model.DocNumber,
                        AgencyTypeId = Model.AgencyTypeId,
                        AccountId = Model.AccountId,
                        CreatedDate = DateTime.Now,
                        CreatedBy = "",
                        IsCancelled = false,
                        IsLocked = false
                    };

                    Context.ReceiveReceipts.Add(receipt);
                    Context.SaveChanges();
                }

                var entry = PrepareReceiveEntryModel(receipt);
                var result = entryService.SaveNewJournalEntry(entry);

                return new ActionsResponseModel
                {
                    Status = result.Status,
                    Message = result.IsSuccess ? "تم حفظ البيانات بنجاح" : "فشل فى تسجيل القيد المحاسبى",
                    Id = receipt.ReceiveReceiptId,
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

        private JournalEntryModel PrepareReceiveEntryModel(ReceiveReceipt Model)
        {
            try
            {
                int generalSupplierId = Context.AccountTrees.Single(x => x.AccountTypeId == 5).AccountId;
                List<JournalEntryAccount> accounts = new List<JournalEntryAccount>();

                //---------- Debit Account ----------//
                accounts.Add(new JournalEntryAccount
                {
                    SupplierId = Model.AgencyTypeId == 2 ? Model.SupplierId : null,
                    AccountId = Model.AgencyTypeId == 2 ? generalSupplierId : (int)Model.AccountId,
                    Credit = 0,
                    Debit = Model.MoneyAmount,
                    CurrencyId = 1,
                    Description = Model.Description
                });

                //---------- Credit Account ----------//
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
