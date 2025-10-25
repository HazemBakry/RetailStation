using RetailStation.Entities.Common;
using RetailStation.Entities.Common.Enums;
using RetailStation.Entities.Common.Finance.GeneralAccounts;
using RetailStation.Entities.DTOs.Purchases;
using RetailStation.Entities.Models;
using RetailStation.Entities.Models.Finance;
using RetailStation.Entities.Models.Inventory;
using RetailStation.Interface.Common;
using RetailStation.Interface.GeneralAccounts;
using RetailStation.Service.Common;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using Microsoft.Identity.Client;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;

namespace RetailStation.Service.GeneralAccounts
{
    public class PaymentService : IPaymentService
    {
        private readonly DBContext Context;
        private readonly ISQLHelper SQLHelper;
        private readonly ISharedFilterService SharedFilterService;

        public PaymentService(DBContext DbContext, ISQLHelper SQLHelper, 
            ISharedFilterService sharedFilterService) 
        {
            this.Context = DbContext;
            this.SQLHelper = SQLHelper;
            this.SharedFilterService = sharedFilterService;
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

        public ActionsResponseModel SaveNewPaymentOrder(ReceiptModel Model)
        {
            try
            {
                //int? accountId = Model.AccountId;

                //if (Model.EmployeeId != null)
                //    accountId = Model.AccountId; //Context.AccountTrees.Where(x => x.AccountTypeId == 6).FirstOrDefault().AccountId;

                //if (Model.SupplierId != null)
                //    accountId = Context.AccountTrees.Where(x => x.AccountTypeId == 5).FirstOrDefault().AccountId;

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
                    AccountId = Model.AccountId,
                    SupplierId = Model.SupplierId,
                    FromAccountId = Model.FromAccountId,
                    WorkflowStatusId = (int)WorkflowStatus.Pending,
                    CreatedDate = DateTime.Now,
                    CreatedBy = ""
                };

                Context.PaymentOrders.Add(order);
                Context.SaveChanges();

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
                                                                                x.WorkflowStatusId != (int)WorkflowStatus.Cancelled && x.WorkflowStatusId != (int)WorkflowStatus.Completed);

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
            if (order != null && order.WorkflowStatusId != (int)WorkflowStatus.Cancelled)
            {
                order.WorkflowStatusId = (int)WorkflowStatus.Cancelled;
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
            var results = Context.PaymentOrders.Where(x => x.WorkflowStatusId == (int)WorkflowStatus.Pending).Select(b => new SelectorDataModel
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

        public ActionsResponseModel SaveNewPaymentReceipt(ReceiptModel Model)
        {
            return new ActionsResponseModel
            {
                Message = "يجب اختيار أمر صرف أولا لاتمام حفظ السند",
                IsSuccess = false
            };
        }

        public ActionsResponseModel EditPaymentReceipt(int PaymentReceiptId, ReceiptModel Model)
        {
            return new ActionsResponseModel
            {
                Message = "يجب اختيار أمر صرف أولا لاتمام حفظ السند",
                IsSuccess = false
            };
        }

      

        public ActionsResponseModel CancelPaymentReceipt(int ReceiptId)
        {
            var receipt = Context.PaymentReceipts.FirstOrDefault(x => x.PaymentReceiptId == ReceiptId);
            if (receipt != null)
            {
                receipt.WorkflowStatusId = (int)WorkflowStatus.Cancelled;
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

        public List<ReceiptModel> GetReceiveReceipts_Summary(SearchFilterModel model)
        {
            //return Context.ReceiveReceipts.ToList().ToDataTable();

            DataTable FilterList = SharedFilterService.MapFilterModelToDataTable(model.FilterList);

            SqlParameter[] Params = new SqlParameter[3];
            Params[0] = new SqlParameter("@CurrentPage", (object)model.CurrentPage ?? DBNull.Value);
            Params[1] = new SqlParameter("@PageSize", (object)model.PageSize ?? DBNull.Value);
            Params[2] = new SqlParameter("@FilterList", SqlDbType.Structured);
            Params[2].Value = FilterList;

            var result = SQLHelper.SQLQuery<ReceiptModel>("[Finance].[SP_GetReceiveReceipts_Summary]", null, Params).ToList();
            return result;
        }

        public DataTable GetReceiveReceipts_Filters(FilterModel model)
        {
            return new DataTable();
        }

        public ActionsResponseModel SaveNewReceiveReceipt(ReceiptModel Model)
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
                        receipt.WorkflowStatusId = (int)WorkflowStatus.Completed;

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
                        WorkflowStatusId = (int)WorkflowStatus.Completed,
                        CreatedDate = DateTime.Now,
                        CreatedBy = "",
                        IsCancelled = false,
                        IsLocked = false
                    };

                    Context.ReceiveReceipts.Add(receipt);
                    Context.SaveChanges();
                }

                var entry = PrepareReceiveEntryModel(receipt);
                //var result = entryService.SaveNewJournalEntry(entry);

                //receipt.JournalEntryId = result.Id ?? -1;
                //Context.SaveChanges();

                return new ActionsResponseModel
                {
                    Status = 100,   //result.Status,
                    Message = "",   //result.IsSuccess ? "تم حفظ البيانات بنجاح" : "فشل فى تسجيل القيد المحاسبى",
                    Id = receipt.ReceiveReceiptId,
                    Number = receipt.ReceiptNumber.ToString(),
                    IsSuccess = false     //result.IsSuccess
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
                var customers_account = Context.AccountTrees.FirstOrDefault(x => x.AccountTypeId == 9);

                if (customers_account != null)
                {
                    int generalCustomerId = customers_account.AccountId;
                    List<JournalEntryAccount> accounts = new List<JournalEntryAccount>();
                    int debitAccountId = Model.AgencyTypeId == 3 ? generalCustomerId : (int)Model.AccountId;
                    int creditAccountId = Context.AccountTrees.FirstOrDefault(x => x.AccountTypeId == 4 && x.IsParent == false).AccountId;

                    //---------- Debit Account ----------//
                    accounts.Add(new JournalEntryAccount
                    {
                        CustomerId = Model.AgencyTypeId == 3 ? Model.CustomerId : null,
                        AccountId = debitAccountId, //Model.AgencyTypeId == 3 ? generalSupplierId : (int)Model.AccountId,
                        Credit = Model.MoneyAmount,
                        Debit = 0,
                        CurrencyId = 1,
                        Description = Model.Description,
                        CostCenterId = Context.AccountTrees.FirstOrDefault(x => x.AccountId == debitAccountId)?.CostCenterId
                    });

                    //---------- Credit Account ----------//
                    accounts.Add(new JournalEntryAccount
                    {
                        AccountId = creditAccountId, //Context.AccountTrees.FirstOrDefault(x => x.AccountTypeId == 4 && x.IsParent == false).AccountId,
                        Credit = 0,
                        Debit = Model.MoneyAmount,
                        CurrencyId = 1,
                        CustomerId = Model.AgencyTypeId == 3 ? Model.CustomerId : null,
                        Description = Model.Description,
                        CostCenterId = Context.AccountTrees.FirstOrDefault(x => x.AccountId == creditAccountId)?.CostCenterId
                    });

                    JournalEntryModel entry = new JournalEntryModel
                    {
                        //EntryNumber = GenerateNewEntryNumber(Model.ReleaseDate.Month, Model.ReleaseDate.Year);
                        DocNumber = Model.DocNumber,
                        EntryDate = Model.ReleaseDate,
                        Description = Model.Description,
                        IsPosted = true,
                        IsLocked = true,
                        JournalTypeId = (int)EntryType.Receiving,
                        PeriodId = Context.ReceiptLedgers.Single(x => x.ReceiptLedgerId == Model.ReceiptLedgerId).FinancialPeriodId,
                        ActionTypeId = Model.PaymentTypeId == 1 ? (int)JournalActionType.CashReceive : (int)JournalActionType.ChequeReceiveReceipt,
                        ActionId = Model.PaymentTypeId,
                        Month = Model.ReleaseDate.Month,
                        Year = Model.ReleaseDate.Year,
                        JournalEntryAccounts = accounts
                    };

                    return entry;
                }
                else
                    throw new Exception("لا يوجد حساب للعملاء فى شجرة الحسابات , يرجى إضافة حساب عملاء");
            }
            catch (Exception)
            {
                throw new Exception("فشل فى حفظ القيد");
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
