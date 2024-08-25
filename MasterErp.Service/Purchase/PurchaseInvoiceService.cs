using MasterErp.Entities.Common;
using MasterErp.Entities.Common.Finance.Purchases;
using MasterErp.Entities.Models;
using MasterErp.Interface.Common;
using MasterErp.Interface.GeneralAccounts;
using MasterErp.Interface.Purchase;
using MasterErp.Interface.Shared;
using MasterErp.Service.Common;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Service.Purchase
{
    public class PurchaseInvoiceService : IPurchaseInvoiceService
    {
        private readonly DBContext Context;
        private readonly ISQLHelper SQLHelper;
        private readonly IConfiguration Configuration;
        private readonly ISharedFilterService SharedFilterService;
        private readonly IJournalEntryService JournalEntryService;
        private string ConnectionString;

        public PurchaseInvoiceService(DBContext Context, 
            ISQLHelper SQLHelper, 
            IConfiguration Configuration, 
            ISharedFilterService SharedFilterService,
            IJournalEntryService _journalEntryService)
        {
            this.Context = Context;
            this.SQLHelper = SQLHelper;
            this.Configuration = Configuration;
            this.ConnectionString = Configuration.GetConnectionString("DBConnection");
            this.SharedFilterService = SharedFilterService;
            JournalEntryService = _journalEntryService;
        }

        public DataTable GetPurchaseInvoicesData(FilterModel model)
        {
            DataTable dt = SharedFilterService.MapFilterModelToDataTable(model.FilterItems);

            SqlParameter[] Params = new SqlParameter[3];

            Params[0] = new SqlParameter("@CurrentPage", (object)model.CurrentPage ?? DBNull.Value);
            Params[1] = new SqlParameter("@PageSize", (object)model.PageSize ?? DBNull.Value);
            Params[2] = new SqlParameter("@FilterList", SqlDbType.Structured);
            Params[2].Value = dt;

            var result = SQLHelper.ExecuteDataTable("[dbo].[SP_GetPurchaseInvoicesData]", ConnectionString, Params);
            return result;
        }

        public ActionsResponseModel CreateNewPurchaseInvoice(OrderModel model)
        {
            try
            {
                PurchaseInvoice order_tbl = new PurchaseInvoice();

                order_tbl.DueDate = DateTime.Now;
                order_tbl.CreatedDate = DateTime.Now;
                order_tbl.CreatedBy = model.CreatedBy;
                order_tbl.IsCancelled = false;
                order_tbl.IsLocked = false;
                order_tbl.Notes = model.Notes;
                order_tbl.InvoiceDate = model?.OrderDate ?? DateTime.Now;
                order_tbl.TotalValue = model.OrderProducts != null ? model.OrderProducts.Sum(x => x.TotalValue) : 0;
                order_tbl.SupplierId = model.SupplierId ?? 0;
                order_tbl.InvoiceTypeId = model.OrderTypeId;
                order_tbl.InvoiceNumber = Context.PurchaseInvoices.Count() > 0 ? Context.PurchaseInvoices.Max(x => x.InvoiceNumber) + 1 : 1;

                Context.PurchaseInvoices.Add(order_tbl);
                Context.SaveChanges();

                foreach (var item in model.OrderProducts)
                {
                    var detail = new PurchaseInvoiceDetails
                    {
                        Price = item.Price,
                        ItemId = item.ItemId,
                        Notes = model.Notes,
                        Quantity = item.Quantity,
                        TotalValue = item.TotalValue,
                        PurchaseInvoiceId = order_tbl.PurchaseInvoiceId,
                        UnitId = item.UnitId,
                        Discount = 0,
                        NetValue = item.TotalValue
                    };

                    Context.PurchaseInvoiceDetails.Add(detail);
                    Context.SaveChanges();
                }

                ActionsResponseModel result = new ActionsResponseModel();
                var AccountsList = new List<JournalEntryAccount>();
                var InvoiceType = Context.PurchaseInvoiceTypes.Where(x => x.PurchaseInvoiceTypeId == model.OrderTypeId).FirstOrDefault();

                if (InvoiceType != null && InvoiceType.IsBindToGeneralAccounting)
                {
                    CreateJournalEntryModel(order_tbl);
                }
                return new ActionsResponseModel
                {
                    Status = 1,
                    Message = "تم حفظ الفاتورة بنجاح"
                };
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

        private void CreateJournalEntryModel(PurchaseInvoice invoice)
        {
            var supplierName = Context.Suppliers.Where(x => x.SupplierId == invoice.SupplierId).FirstOrDefault()?.NameAR;
            var supplier_account = Context.AccountTrees.Where(x => x.AccountTypeId == 5).FirstOrDefault();
            var invoice_type = Context.PurchaseInvoiceTypes.Where(x => x.PurchaseInvoiceTypeId == invoice.InvoiceTypeId).FirstOrDefault();

            List<JournalEntryAccount> accounts = new List<JournalEntryAccount>();

            accounts.Add(new JournalEntryAccount
            {
                AccountID = supplier_account.AccountId,
                Debit = 0,
                Credit = invoice.NetValue,
                Description = " فواتير شهر " + invoice.InvoiceDate.Date.Month + " فاتورة مشتريات رقم " + invoice.InvoiceNumber.ToString() + (supplierName ?? " للمورد " + supplierName),
                CurrencyID = 1
            });
            accounts.Add(new JournalEntryAccount
            {
                AccountID = (int)invoice_type.AccountDebitId,
                Debit = invoice.NetValue,
                Credit = 0,
                CurrencyID = 1,
                Description = "فاتورة مشتريات رقم  " + invoice.InvoiceNumber.ToString() + (supplierName ?? " للمورد " + supplierName)

            });

            if (invoice.Tax > 0)
            {
                var tax_account = Context.AccountTrees.Where(x => x.AccountTypeId == 7).FirstOrDefault();

                accounts.Add(new JournalEntryAccount
                {
                    AccountID = tax_account.AccountId,
                    Debit = invoice.Tax,
                    Credit = 0,
                    CurrencyID = 1,
                    Description = " فاتورة مشتريات رقم  " + invoice.InvoiceNumber.ToString() + (supplierName ?? " للمورد " + supplierName)
                });
            }

            JournalEntryModel entry = new JournalEntryModel
            {
                Descirption = " فواتير شهر " + invoice.InvoiceDate.Month + " فاتورة مشتريات رقم " + invoice.PurchaseInvoiceId.ToString() + (supplierName ?? " للمورد " + supplierName),
                DocNumber = invoice.PurchaseInvoiceId.ToString(),
                EntryDate = invoice.InvoiceDate,
                Month = invoice.InvoiceDate.Month,
                Year = invoice.InvoiceDate.Year,
                Notes = invoice.Notes,
                JournalTypeID = 1,   // "قيد تسوية" 
                JournalEntryAccounts = accounts
            };

            JournalEntryService.SaveNewJouranlEntry(entry);
        }

        public bool CancelPurchaseInvoice(int InvoiceId)
        {
            var Invoice = Context.PurchaseInvoices.FirstOrDefault(x => x.PurchaseInvoiceId == InvoiceId);
            if (Invoice is null)
            {
                return false;
            }
            //Context.PurchaseInvoices.Remove(Invoice);
            Invoice.IsCancelled = true;
            Context.SaveChanges();
            return true;
        }

        public List<OrderModel> GetInvoicesSearchData(int SupplierId, string InvoiceNumber, string InvoiceDate, int InvoiceId = 0)
        {
            SqlParameter[] param = new SqlParameter[4];
            param[0] = new SqlParameter("@SupplierId", SupplierId);
            param[1] = new SqlParameter("@InvoiceNumber", InvoiceNumber);
            param[2] = new SqlParameter("@InvoiceDate", !string.IsNullOrEmpty(InvoiceDate) ? DateTime.Parse(InvoiceDate) : DBNull.Value);
            param[3] = new SqlParameter("@InvoiceId", InvoiceId);

            var result = SQLHelper.SQLQuery<PurchaseInvoiceItemsModel>("[dbo].[SP_GetInvoicesSearchData]", ConnectionString, param);

            var grpList = result.GroupBy(x => new
            {
                x.PurchaseInvoiceId,
                x.InvoiceDate,
                x.InvoiceNumber,
                x.InvoiceTotalValue,
                x.SupplierNameEN
            }).Select(p => new OrderModel
            {
                OrderNumber = p.Key.InvoiceNumber,
                SupplierNameEN = p.Key.SupplierNameEN,
                OrderDate = (DateTime)p.Key.InvoiceDate,
                TotalValue = p.Key.InvoiceTotalValue,
                OrderProducts = p.Select(y => new OrderProductModel
                {
                    ItemId = y.ItemId,
                    Price = y.Price,
                    ItemNameEN = y.ItemNameEN,
                    ItemNameAR = y.ItemNameAR,
                    Quantity = y.Quantity,
                    TotalValue = y.ItemTotalValue,
                    UnitNameAR = y.UnitNameAr,
                    UnitNameEN = y.UnitNameEn,
                    UnitId = y.UnitId
                }).ToList()
            }).ToList();

            return grpList;
        }

        public List<OrderModel> GetPurchaseInvoiceDetails(int InvoiceId)
        {
            SqlParameter[] Param = new SqlParameter[1];
            Param[0] = new SqlParameter("@PurchaseInvoiceId", InvoiceId);

            var result = SQLHelper.SQLQuery<PurchaseInvoiceItemsModel>("[dbo].[SP_GetPurchaseInvoiceDetails]", ConnectionString, Param);

            var grp = result.GroupBy(x => new
            {
                x.PurchaseInvoiceId,
                x.InvoiceDate,
                x.InvoiceNumber,
                x.InvoiceTotalValue,
                x.SupplierNameEN
            }).Select(p => new OrderModel
            {
                OrderNumber = p.Key.InvoiceNumber,
                SupplierNameEN = p.Key.SupplierNameEN,
                OrderDate = (DateTime)p.Key.InvoiceDate,
                TotalValue = p.Key.InvoiceTotalValue,
                OrderProducts = p.Select(y => new OrderProductModel
                {
                    ItemId = y.ItemId,
                    Price = y.Price,
                    ItemNameEN = y.ItemNameEN,
                    ItemNameAR = y.ItemNameAR,
                    Quantity = y.Quantity,
                    TotalValue = y.ItemTotalValue,
                    UnitNameAR = y.UnitNameAr,
                    UnitNameEN = y.UnitNameEn,
                    UnitId = y.UnitId
                }).ToList()
            }).ToList();

            return grp;
        }

        public List<PurchaseReturns> GetPurchasesReturnsData()
        {
            return Context.PurchaseReturns.ToList();
        }

        public ActionsResponseModel SaveNewPurchaseReturns(OrderModel model)
        {
            try
            {
                PurchaseReturns order_tbl = new PurchaseReturns();

                order_tbl.InsertDate = DateTime.Now;
                order_tbl.ReturnsDate = DateTime.Now;
                order_tbl.InsertUser = string.Empty;

                order_tbl.InvoiceNumber = model.OrderNumber;
                order_tbl.InvoiceTypeID = model.OrderTypeId ?? 0;
                order_tbl.Notes = model.Notes;
                order_tbl.InvoiceDate = DateTime.Now;
                order_tbl.ReturnsInvoiceTotal = model.OrderProducts != null ? model.OrderProducts.Sum(x => x.TotalValue) : 0;
                order_tbl.SupplierID = (int)model?.SupplierId;
                //order_tbl.InvoiceNumber = "po_" + (Context.PurchaseReturns.Count() > 0 ? Context.PurchaseReturns.Max(x => x.PurchaseReturnsID) + 1 : 1);

                Context.PurchaseReturns.Add(order_tbl);
                Context.SaveChanges();

                foreach (OrderProductModel item in model.OrderProducts)
                {
                    var detail = new PurchaseReturnsDetails
                    {
                        Price = item.Price,
                        ItemId = item.ItemId,
                        Notes = model.Notes,
                        Quantity = item.Quantity,
                        TotalValue = item.TotalValue,
                        PurchaseReturnsId = order_tbl.PurchaseReturnsID,
                        UnitId = item.UnitId
                    };

                    Context.PurchaseReturnsDetails.Add(detail);
                    Context.SaveChanges();
                }

                return new ActionsResponseModel
                {
                    Status = 1,
                    Message = "Purchase Order Created"
                };
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

        public bool CancelPurchaseReturns(int ReturnsId)
        {

            var Invoice = Context.PurchaseInvoices.FirstOrDefault(x => x.PurchaseInvoiceId == ReturnsId);
            if (Invoice is null)
            {
                return false;
            }
            //Context.PurchaseInvoices.Remove(Invoice);
            Invoice.IsCancelled = true;
            Context.SaveChanges();
            return true;
        }

        public List<SupplierStatementModel> GetSupplierStatementData(int SupplierId)
        {
            SqlParameter[] param = new SqlParameter[1];
            param[0] = new SqlParameter("@SupplierId", SupplierId);

            var results = SQLHelper.SQLQuery<SupplierStatementModel>("[dbo].[SP_GetSupplierAccountStatement]", ConnectionString, param);
            return results;

        }

        public List<PurchaseInvoiceType> GetInvoiceTypesData()
        {
            return Context.PurchaseInvoiceTypes.ToList();
        }

    }
}
