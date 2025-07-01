using MasterErp.Entities.Common;
using MasterErp.Entities.Common.Enums;
using MasterErp.Entities.Common.Finance.GeneralAccounts;
using MasterErp.Entities.DTOs.Purchases;
using MasterErp.Entities.Models;
using MasterErp.Entities.Models.Finance;
using MasterErp.Entities.Models.Inventory;
using MasterErp.Interface.Common;
using MasterErp.Interface.GeneralAccounts;
using MasterErp.Service.Common;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using Microsoft.Identity.Client;
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
        //private readonly IConfiguration Configuration;
        private readonly IJournalEntryService entryService;
        //private readonly string ConnectionString;
        private readonly ISharedFilterService SharedFilterService;

        public PaymentService(DBContext DbContext, ISQLHelper SQLHelper, IJournalEntryService EntryService, ISharedFilterService sharedFilterService) //IConfiguration _configuration )
        {
            this.Context = DbContext;
            this.SQLHelper = SQLHelper;
            //this.Configuration = _configuration;
            //this.ConnectionString = Configuration.GetConnectionString("DBConnection");
            this.entryService = EntryService;
            SharedFilterService = sharedFilterService;
        }

        //----------------------------------- Payment Order ------------------------------------------//

        public List<ReceiptModel> GetPaymentOrders_Summary(SearchFilterModel model, int? PaymentOrderId = null)
        {

            DataTable FilterList = SharedFilterService.MapFilterModelToDataTable(model.FilterList);

            SqlParameter[] Params = new SqlParameter[4];

            Params[0] = new SqlParameter("@PaymentOrderId", PaymentOrderId);
            Params[1] = new SqlParameter("@CurrentPage", model.CurrentPage);
            Params[2] = new SqlParameter("@PageSize", model.PageSize);
            Params[3] = new SqlParameter("@FilterList", SqlDbType.Structured);
            Params[3].Value = FilterList;

            var result = SQLHelper.SQLQuery<ReceiptModel>("[Finance].[SP_GetPaymentOrders_Summary]", null, Params);
            return result;
        }
        public ReceiptModel GetPaymentOrderDetailsById(int PaymentOrderId)
        {
            var result = GetPaymentOrders_Summary(new SearchFilterModel { PageSize = 25, CurrentPage = 1 }, PaymentOrderId)?.FirstOrDefault();
            if (result != null)
            {
                result.PreviousId = Context.PaymentOrders
                                    .Where(p => p.PaymentOrderId < PaymentOrderId)
                                    .OrderByDescending(p => p.PaymentOrderId)
                                    .Select(p => p.PaymentOrderId)
                                    .FirstOrDefault();
                result.NextId = Context.PaymentOrders
                                .Where(p => p.PaymentOrderId > PaymentOrderId)
                                .OrderBy(p => p.PaymentOrderId)
                                .Select(p => p.PaymentOrderId)
                                .FirstOrDefault();
            }
            return result;

        }
        public DataTable GetPaymentOrders_Filters(SearchFilterModel model)
        {
            return new DataTable();
        }

        public ActionsResponseModel AddNewPaymentOrder(ReceiptModel Model)
        {
            try
            {
                int? accountId = Model.AccountId;

                if (Model.EmployeeId != null)
                    accountId = Context.AccountTrees.Where(x => x.AccountTypeId == 6).FirstOrDefault().AccountId;

                if (Model.SupplierId != null)
                    accountId = Context.AccountTrees.Where(x => x.AccountTypeId == 5).FirstOrDefault().AccountId;

                PaymentOrder order = new PaymentOrder();

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
                    AccountId = accountId, //Model.AccountId,
                    SupplierId = Model.SupplierId,
                    FromAccountId = Model.FromAccountId,
                    WorkflowStatusId = (int)FinanceWorkflowStatus.Pending,
                    CreatedDate = DateTime.Now,
                    CreatedBy = ""
                };

                Context.PaymentOrders.Add(order);
                Context.SaveChanges();

                if (Model.EmployeeAdvanceId != null)
                {
                    var advance = Context.EmployeeAdvances.FirstOrDefault(x => x.EmployeeAdvanceId == Model.EmployeeAdvanceId);
                    advance.WorkflowStatusId = (int)HRWorkflowStatus.Completed;
                    Context.SaveChanges();
                }

                return new ActionsResponseModel
                {
                    Message = "تم حفظ أمر الصرف بنجاح",
                    Id = order.PaymentOrderId,
                    Number = order.OrderNumber.ToString(),
                };
            }
            catch (Exception ex)
            {
                return new ActionsResponseModel
                {
                    Message = ex.Message,
                    IsSuccess = false
                };
            }
        }

        public ActionsResponseModel EditPaymentOrder(int PaymentOrderId, ReceiptModel Model)
        {
            try
            {
                PaymentOrder order = Context.PaymentOrders.FirstOrDefault(x => x.PaymentOrderId == PaymentOrderId && 
                                                                                x.WorkflowStatusId != (int)FinanceWorkflowStatus.Cancelled && x.WorkflowStatusId != (int)FinanceWorkflowStatus.Paid);

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
                else
                    return new ActionsResponseModel { IsSuccess = false, Message = "can't find this payment order" };


                return new ActionsResponseModel
                {
                    Message = "تم تعديل أمر الصرف بنجاح",
                    Id = order.PaymentOrderId,
                    Number = order.OrderNumber.ToString(),
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
            if (order != null && order.WorkflowStatusId != (int)FinanceWorkflowStatus.Cancelled)
            {
                order.WorkflowStatusId = (int)FinanceWorkflowStatus.Cancelled;
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

        public List<SelectorDataModel> GetPaymentOrdersSelector(bool OrderStatus)
        {
            var results = Context.PaymentOrders.Where(x => x.WorkflowStatusId != (int)FinanceWorkflowStatus.Paid).Select(b => new SelectorDataModel
            {
                Id = b.PaymentOrderId,
                Name = b.OrderNumber.ToString(),
            }).ToList();
            return results;
        }

        //----------------------------------- Payment Receipt ------------------------------------------//

        public List<ReceiptModel> GetPaymentReceipts_Summary(SearchFilterModel model, int? PaymentReceiptId = null)
        {

            DataTable FilterList = SharedFilterService.MapFilterModelToDataTable(model.FilterList);

            SqlParameter[] Params = new SqlParameter[4];

            Params[0] = new SqlParameter("@PaymentReceiptId", PaymentReceiptId);
            Params[1] = new SqlParameter("@CurrentPage", model.CurrentPage);
            Params[2] = new SqlParameter("@PageSize", model.PageSize);
            Params[3] = new SqlParameter("@FilterList", SqlDbType.Structured);
            Params[3].Value = FilterList;

            var result = SQLHelper.SQLQuery<ReceiptModel>("[Finance].[SP_GetPaymentReceipts_Summary]", null, Params);
            return result;
        }

        public ReceiptModel GetPaymentReceiptDetailsById(int PaymentReceiptId)
        {
            return GetPaymentReceipts_Summary(new SearchFilterModel { PageSize = 25, CurrentPage = 1 }, PaymentReceiptId)?.FirstOrDefault();

        }

        public DataTable GetPaymentReceipts_Filters(SearchFilterModel model)
        {
            return new DataTable();
        }

        public ActionsResponseModel AddNewPaymentReceipt(ReceiptModel Model)
        {
            try
            {
                PaymentReceipt receipt = new PaymentReceipt();

                if (Model.PaymentOrderId == null || Model.PaymentOrderId == 0)
                {
                    return new ActionsResponseModel
                    {
                        Message = "يجب اختيار أمر صرف أولا لاتمام حفظ السند",
                        IsSuccess = false
                    };
                }

                receipt = new PaymentReceipt()
                {
                    ReceiptNumber = Context.PaymentReceipts.Count() > 0 ? Context.PaymentReceipts.Max(x => x.ReceiptNumber) + 1 : 1,
                    ReceiptLedgerId = Model.ReceiptLedgerId,
                    PaymentOrderId = Model.PaymentOrderId,
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
                    WorkflowStatusId = (int)FinanceWorkflowStatus.Pending,
                    CreatedBy = ""
                };

                Context.PaymentReceipts.Add(receipt);
                Context.SaveChanges();


                var payment_order = Context.PaymentOrders.FirstOrDefault(x => x.PaymentOrderId == Model.PaymentOrderId);
                payment_order.WorkflowStatusId = (int)FinanceWorkflowStatus.WaitingPayment;
                Context.SaveChanges();

                var entry = PreparePaymentEntryModel(receipt);
                var result = entryService.SaveNewJournalEntry(entry);

                return new ActionsResponseModel
                {
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
                    Message = ex.Message,
                    IsSuccess = false
                };
            }
        }

        public ActionsResponseModel EditPaymentReceipt(int PaymentReceiptId, ReceiptModel Model)
        {
            try
            {
                PaymentReceipt receipt = new PaymentReceipt();

                if (Model.PaymentOrderId == null || Model.PaymentOrderId == 0)
                {
                    return new ActionsResponseModel
                    {
                        Status = 100,
                        Message = "يجب اختيار أمر صرف أولا لاتمام حفظ السند",
                        Id = 0,
                        IsSuccess = false
                    };
                }

                receipt = Context.PaymentReceipts.FirstOrDefault(x => x.PaymentReceiptId == PaymentReceiptId &&
                                                                                x.WorkflowStatusId != (int)FinanceWorkflowStatus.Cancelled && x.WorkflowStatusId != (int)FinanceWorkflowStatus.Paid);
                if (receipt != null)
                {
                    receipt.ReceiptLedgerId = Model.ReceiptLedgerId;
                    receipt.PaymentOrderId = Model.PaymentOrderId;
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
                else
                    return new ActionsResponseModel { IsSuccess = false, Message = "can't find this payment order" };


                var payment_order = Context.PaymentOrders.FirstOrDefault(x => x.PaymentOrderId == Model.PaymentOrderId);
                payment_order.WorkflowStatusId = (int)FinanceWorkflowStatus.Paid;
                Context.SaveChanges();

                var entry = PreparePaymentEntryModel(receipt);
                var result = entryService.SaveNewJournalEntry(entry);

                return new ActionsResponseModel
                {
                    Message = result.IsSuccess ? "تم حفظ البيانات بنجاح" : "فشل فى تسجيل القيد المحاسبى",
                    Id = receipt.PaymentReceiptId,
                    Number = receipt.ReceiptNumber.ToString(),
                };
            }
            catch (Exception ex)
            {
                return new ActionsResponseModel
                {
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
                    Credit = Model.MoneyAmount,
                    Debit = 0,
                    CurrencyId = 1,
                    SupplierId = Model.AgencyTypeId == 2 ? Model.SupplierId : null,
                    Description = Model.Description,
                    CostCenterId = Context.AccountTrees.FirstOrDefault(x => x.AccountId == (int)Model.FromAccountId)?.CostCenterId
                });

                accounts.Add(new JournalEntryAccount
                {
                    AccountId = (int)Model.AccountId,//Context.AccountTrees.FirstOrDefault(x => x.AccountTypeId == 4 && x.IsParent == false).AccountId,
                    Credit = 0,
                    Debit = Model.MoneyAmount,
                    CurrencyId = 1,
                    SupplierId = Model.AgencyTypeId == 2 ? Model.SupplierId : null,
                    Description = Model.Description,
                    CostCenterId = Context.AccountTrees.FirstOrDefault(x => x.AccountId == (int)Model.AccountId)?.CostCenterId
                });

                JournalEntryModel entry = new JournalEntryModel
                {
                    //EntryNumber = GenerateNewEntryNumber(Model.ReleaseDate.Month, Model.ReleaseDate.Year);
                    DocNumber = Model.DocNumber,
                    EntryDate = Model.ReleaseDate,
                    Description = Model.Description,
                    JournalTypeId = (int)EntryType.Cashing,
                    PeriodId = Context.ReceiptLedgers.Single(x => x.ReceiptLedgerId == Model.ReceiptLedgerId).FinancialPeriodId,
                    ActionTypeId = (int)JournalActionType.CashPayment,
                    ActionId = Model.PaymentReceiptId,
                    Month = Model.ReleaseDate.Month,
                    Year = Model.ReleaseDate.Year,
                    JournalEntryAccounts = accounts
                };

                return entry;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.InnerException?.Message ?? ex.Message);
            }
        }

        public ActionsResponseModel CancelPaymentReceipt(int ReceiptId)
        {
            var receipt = Context.PaymentReceipts.FirstOrDefault(x => x.PaymentReceiptId == ReceiptId);
            if (receipt != null)
            {
                receipt.WorkflowStatusId = (int)FinanceWorkflowStatus.Cancelled;
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

            var result = SQLHelper.SQLQuery<ReceiptModel>("[Finance].[SP_GetReceiveReceipts_Summary]", null, Params).ToList();
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

                if (Model.PaymentReceiptId > 0)
                {
                    receipt = Context.ReceiveReceipts.FirstOrDefault(x => x.ReceiveReceiptId == Model.PaymentReceiptId);
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
                int debitAccountId = Model.AgencyTypeId == 2 ? generalSupplierId : (int)Model.AccountId;
                int creditAccountId = Context.AccountTrees.FirstOrDefault(x => x.AccountTypeId == 4 && x.IsParent == false).AccountId;

                //---------- Debit Account ----------//
                accounts.Add(new JournalEntryAccount
                {
                    SupplierId = Model.AgencyTypeId == 2 ? Model.SupplierId : null,
                    AccountId = debitAccountId, //Model.AgencyTypeId == 2 ? generalSupplierId : (int)Model.AccountId,
                    Credit = 0,
                    Debit = Model.MoneyAmount,
                    CurrencyId = 1,
                    Description = Model.Description,
                    CostCenterId = Context.AccountTrees.FirstOrDefault(x => x.AccountId == debitAccountId)?.CostCenterId
                });

                //---------- Credit Account ----------//
                accounts.Add(new JournalEntryAccount
                {
                    AccountId = creditAccountId, //Context.AccountTrees.FirstOrDefault(x => x.AccountTypeId == 4 && x.IsParent == false).AccountId,
                    Credit = Model.MoneyAmount,
                    Debit = 0,
                    CurrencyId = 1,
                    SupplierId = Model.AgencyTypeId == 2 ? Model.SupplierId : null,
                    Description = Model.Description,
                    CostCenterId = Context.AccountTrees.FirstOrDefault(x => x.AccountId == creditAccountId)?.CostCenterId
                });

                JournalEntryModel entry = new JournalEntryModel
                {
                    //EntryNumber = GenerateNewEntryNumber(Model.ReleaseDate.Month, Model.ReleaseDate.Year);
                    DocNumber = Model.DocNumber,
                    EntryDate = Model.ReleaseDate,
                    Description = Model.Description,
                    JournalTypeId = (int)EntryType.Cashing,
                    PeriodId = Context.ReceiptLedgers.Single(x => x.ReceiptLedgerId == Model.ReceiptLedgerId).FinancialPeriodId,
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
