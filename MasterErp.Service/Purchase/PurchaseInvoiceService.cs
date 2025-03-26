using MasterErp.Entities.Common;
using MasterErp.Entities.Common.Finance.Purchases;
using MasterErp.Entities.Models;
using MasterErp.Entities.Models.Purchases;
using MasterErp.Interface.Common;
using MasterErp.Interface.GeneralAccounts;
using MasterErp.Interface.Inventory;
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
        private readonly IInventoryService _inventoryService;
        private string ConnectionString;

        public PurchaseInvoiceService(DBContext Context,
            ISQLHelper SQLHelper,
            IConfiguration Configuration,
            ISharedFilterService SharedFilterService,
            IJournalEntryService _journalEntryService,
            IInventoryService inventoryService)
        {
            this.Context = Context;
            this.SQLHelper = SQLHelper;
            this.Configuration = Configuration;
            this.ConnectionString = Configuration.GetConnectionString("DBConnection");
            this.SharedFilterService = SharedFilterService;
            JournalEntryService = _journalEntryService;
            _inventoryService = inventoryService;
        }

        public List<OrderModel> GetPurchaseInvoices_Data(SearchFilterModel model, int? InvoiceId = null)
        {
            DataTable FilterList = SharedFilterService.MapFilterModelToDataTable(model.FilterList);

            SqlParameter[] Params = new SqlParameter[4];

            Params[0] = new SqlParameter("@InvoiceId", InvoiceId);
            Params[1] = new SqlParameter("@CurrentPage",model.CurrentPage);
            Params[2] = new SqlParameter("@PageSize", model.PageSize);
            Params[3] = new SqlParameter("@FilterList", SqlDbType.Structured);
            Params[3].Value = FilterList;

            var result = SQLHelper.SQLQuery<OrderModel>("[dbo].[SP_GetPurchaseInvoicesData]", ConnectionString, Params);
            return result;
        }

        public OrderModel GetPurchaseInvoiceDetailsById(int InvoiceId)
        {
            return GetPurchaseInvoices_Data(new SearchFilterModel { PageSize = 25, CurrentPage = 1 }, InvoiceId)?.FirstOrDefault();

        }

        public ActionsResponseModel EditPurchaseInvoice(int InvoiceId, OrderModel model)
        {
            try
            {
                var order_tbl = Context.PurchaseInvoices.Where(i => i.PurchaseInvoiceId == InvoiceId).FirstOrDefault();
                if (order_tbl != null)
                {
                    order_tbl.DueDate = DateTime.Now;
                    order_tbl.IsCancelled = model.IsCancelled != null ? model.IsCancelled ?? false : false;
                    order_tbl.IsLocked = model.IsLocked !=null ? model.IsLocked ??false :false;
                    order_tbl.Notes = model.Notes;
                    //order_tbl.InvoiceDate = model?.OrderDate ?? DateTime.Now;
                    order_tbl.TotalValue = model.OrderProducts?.Sum(x => x.TotalValue) ?? 0;
                    order_tbl.SupplierId = model.SupplierId ?? 0;
                    order_tbl.InvoiceTypeId = model.OrderTypeId;
                    order_tbl.ReceiveOrderId = model.ReceiveOrderId;
                    order_tbl.DocNumber = model.DocNumber;

                    order_tbl.Discount = model.Discount;
                    order_tbl.DiscountPercent = model.DiscountPercent;
                    order_tbl.Tax = model.Tax;
                    order_tbl.TaxPercent = model.TaxPercent;
                    order_tbl.NetValue = model.OrderProducts?.Sum(x => x.TotalValue) ?? 0;

                    
                    order_tbl.ModifiedBy = model.ModifiedBy;
                    order_tbl.ModifiedDate = DateTime.Now;

                    Context.SaveChanges();

                    var PurchaseInvoiceDetails = Context.PurchaseInvoiceDetails.Where(x => x.PurchaseInvoiceId == InvoiceId).ToList();
                    Context.PurchaseInvoiceDetails.RemoveRange(PurchaseInvoiceDetails);
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
                    var updateReceiveOrderResponse = _inventoryService.AddInvoiceToMaterialReceipts(model.SecondaryOrderIds, order_tbl.PurchaseInvoiceId);

                    return new ActionsResponseModel { Message = "Purchase Invoice Updated Successfly !" };
                }
                else
                    return new ActionsResponseModel { IsSuccess = false, Message = "can't find this purchase invoicer" };

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

        public List<OrderProductModel> GetPurchaseInvoiceProducts_Data(int InvoiceId)
        {

            var result = (from invoiceProduct in Context.PurchaseInvoiceDetails
                          join item in Context.Items on invoiceProduct.ItemId equals item.ItemId
                          join unit in Context.Units on item.UnitId equals unit.UnitId into jT2
                          from unit in jT2.DefaultIfEmpty()
                          where (invoiceProduct.PurchaseInvoiceId == InvoiceId)
                          select new OrderProductModel
                          {
                              ItemId = item.ItemId,
                              ItemNameEN = item.NameEN,
                              ItemNameAR = item.NameAR,
                              Price = invoiceProduct.Price,
                              Quantity = invoiceProduct.Quantity,
                              TotalValue = invoiceProduct.TotalValue,
                              UnitId = item.UnitId,
                              UnitNameAR = unit.NameAR,
                              UnitNameEN = unit.NameEN,
                              OrderId = invoiceProduct.PurchaseInvoiceId,

                          }).ToList();

            return result;
        }
        public ActionsResponseModel AddNewPurchaseInvoice(OrderModel model)
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
                order_tbl.InvoiceDate = DateTime.Now;
                order_tbl.TotalValue = model.OrderProducts?.Sum(x => x.TotalValue) ?? 0;
                order_tbl.SupplierId = model.SupplierId ?? 0;
                order_tbl.InvoiceTypeId = model.OrderTypeId;
                order_tbl.InvoiceNumber = Context.PurchaseInvoices.Count() > 0 ? Context.PurchaseInvoices.Max(x => x.InvoiceNumber) + 1 : 1;
                order_tbl.DocNumber = model.DocNumber;
                order_tbl.Discount = model.Discount;
                order_tbl.DiscountPercent = model.DiscountPercent;
                order_tbl.Tax = model.Tax;
                order_tbl.TaxPercent = model.TaxPercent;
                order_tbl.NetValue = model.OrderProducts?.Sum(x => x.TotalValue) ?? 0;
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
                var updateReceiveOrderResponse = _inventoryService.AddInvoiceToMaterialReceipts(model.SecondaryOrderIds, order_tbl.PurchaseInvoiceId);
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
                    IsSuccess = false,
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
                AccountId = supplier_account.AccountId,
                Debit = 0,
                Credit = invoice.NetValue,
                Description = " فواتير شهر " + invoice.InvoiceDate.Date.Month + " فاتورة مشتريات رقم " + invoice.InvoiceNumber.ToString() + (supplierName ?? " للمورد " + supplierName),
                CurrencyId = 1
            });
            accounts.Add(new JournalEntryAccount
            {
                AccountId = (int)invoice_type.AccountDebitId,
                Debit = invoice.NetValue,
                Credit = 0,
                CurrencyId = 1,
                Description = "فاتورة مشتريات رقم  " + invoice.InvoiceNumber.ToString() + (supplierName ?? " للمورد " + supplierName)

            });

            if (invoice.Tax > 0)
            {
                var tax_account = Context.AccountTrees.Where(x => x.AccountTypeId == 7).FirstOrDefault();

                accounts.Add(new JournalEntryAccount
                {
                    AccountId = tax_account.AccountId,
                    Debit = invoice.Tax,
                    Credit = 0,
                    CurrencyId = 1,
                    Description = " فاتورة مشتريات رقم  " + invoice.InvoiceNumber.ToString() + (supplierName ?? " للمورد " + supplierName)
                });
            }

            JournalEntryModel entry = new JournalEntryModel
            {
                Description = " فواتير شهر " + invoice.InvoiceDate.Month + " فاتورة مشتريات رقم " + invoice.PurchaseInvoiceId.ToString() + (supplierName ?? " للمورد " + supplierName),
                DocNumber = invoice.PurchaseInvoiceId.ToString(),
                EntryDate = invoice.InvoiceDate,
                Month = invoice.InvoiceDate.Month,
                Year = invoice.InvoiceDate.Year,
                JournalTypeId = 1,   // "قيد تسوية" 
                JournalEntryAccounts = accounts
            };

            JournalEntryService.SaveNewJournalEntry(entry);
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
                x.TotalValue,
                x.SupplierNameEN
            }).Select(p => new OrderModel
            {
                OrderNumber = p.Key.InvoiceNumber,
                SupplierNameEN = p.Key.SupplierNameEN,
                OrderDate = (DateTime)p.Key.InvoiceDate,
                TotalValue = p.Key.TotalValue,
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
                x.TotalValue,
                x.SupplierNameEN
            }).Select(p => new OrderModel
            {
                OrderNumber = p.Key.InvoiceNumber,
                SupplierNameEN = p.Key.SupplierNameEN,
                OrderDate = (DateTime)p.Key.InvoiceDate,
                TotalValue = p.Key.TotalValue,
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


        public List<OrderModel> GetPurchaseReturns_Data(SearchFilterModel PagingFilter, int? OrderId = null)
        {
            var FilterListDt = SharedFilterService.MapFilterModelToDataTable(PagingFilter.FilterList);

            SqlParameter[] Params = new SqlParameter[4];

            Params[0] = new SqlParameter("@ReturnsId", OrderId);
            Params[1] = new SqlParameter("@CurrentPage", PagingFilter.CurrentPage);
            Params[2] = new SqlParameter("@PageSize", PagingFilter.PageSize);
            Params[3] = new SqlParameter("@FilterList", SqlDbType.Structured);
            Params[3].Value = FilterListDt;

            var result = SQLHelper.SQLQuery<OrderModel>("[dbo].[SP_GetPurchasesReturns_Data]", ConnectionString, Params);
            return result;
        }

        public OrderModel GetPurchaseReturnsDetailsById(int OrderId)
        {
            return GetPurchaseReturns_Data(new SearchFilterModel { PageSize = 25, CurrentPage = 1 }, OrderId)?.FirstOrDefault();
        }

        public List<OrderProductModel> GetPurchaseReturnsProducts_Data(int OrderId)
        {
            var result = (from orderProduct in Context.PurchaseReturnsDetails
                          join item in Context.Items on orderProduct.ItemId equals item.ItemId
                          join unit in Context.Units on item.UnitId equals unit.UnitId into jT2
                          from unit in jT2.DefaultIfEmpty()
                          where (orderProduct.PurchaseReturnsId == OrderId)
                          select new OrderProductModel
                          {
                              ItemId = item.ItemId,
                              ItemNameEN = item.NameEN,
                              ItemNameAR = item.NameAR,
                              Price = orderProduct.Price,
                              Quantity = orderProduct.Quantity,
                              TotalValue = orderProduct.TotalValue,
                              UnitId = item.UnitId,
                              UnitNameAR = unit.NameAR,
                              UnitNameEN = unit.NameEN,
                              OrderId = orderProduct.PurchaseReturnsId,

                          }).ToList();

            return result;

        }
        public ActionsResponseModel AddNewPurchaseReturns(OrderModel model)
        {
            try
            {

                PurchaseReturns order_tbl = new PurchaseReturns();

                order_tbl.CreatedDate = DateTime.Now;
                order_tbl.ReturnsDate = DateTime.Now;//model.OrderDate;
                order_tbl.CreatedBy = model.CreatedBy;

                order_tbl.PurchaseInvoiceId = model.SecondaryOrderId ?? 0;
                order_tbl.Notes = model.Notes;
                order_tbl.TotalValue = model.OrderProducts != null ? model.OrderProducts.Sum(x => x.TotalValue) : 0;
                //order_tbl.SupplierId = (int)model?.SupplierId;
                //order_tbl.BranchId = (int)model?.BranchId;
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
                        PurchaseReturnsId = order_tbl.PurchaseReturnsId,
                        UnitId = item.UnitId
                    };

                    Context.PurchaseReturnsDetails.Add(detail);
                    Context.SaveChanges();
                }
                return new ActionsResponseModel
                {
                    Message = "Purchase Returns Created"
                };
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
        public ActionsResponseModel EditPurchaseReturns(int OrderId, OrderModel model)
        {
            try
            {
                var order_tbl = Context.PurchaseReturns.Where(i => i.PurchaseReturnsId == OrderId).FirstOrDefault();
                if (order_tbl != null)
                {
                    order_tbl.ModifiedDate = DateTime.Now;
                    order_tbl.ModifiedBy = model.ModifiedBy;

                    //order_tbl.ReturnsDate = model.OrderDate;

                    order_tbl.PurchaseInvoiceId = model.SecondaryOrderId ?? 0;
                    order_tbl.Notes = model.Notes;
                    order_tbl.TotalValue = model.OrderProducts != null ? model.OrderProducts.Sum(x => x.TotalValue) : 0;
                    //order_tbl.SupplierId = (int)model?.SupplierId;
                    //order_tbl.BranchId = (int)model?.BranchId;

                    //order_tbl.InvoiceNumber = "po_" + (Context.PurchaseReturns.Count() > 0 ? Context.PurchaseReturns.Max(x => x.PurchaseReturnsID) + 1 : 1);

                    Context.SaveChanges();

                    var PurchaseReturnDetails = Context.PurchaseReturnsDetails.Where(x => x.PurchaseReturnsId == OrderId).ToList();
                    Context.PurchaseReturnsDetails.RemoveRange(PurchaseReturnDetails);
                    foreach (OrderProductModel item in model.OrderProducts)
                    {
                        var detail = new PurchaseReturnsDetails
                        {
                            Price = item.Price,
                            ItemId = item.ItemId,
                            Notes = model.Notes,
                            Quantity = item.Quantity,
                            TotalValue = item.TotalValue,
                            PurchaseReturnsId = order_tbl.PurchaseReturnsId,
                            UnitId = item.UnitId
                        };

                        Context.PurchaseReturnsDetails.Add(detail);
                        Context.SaveChanges();
                    }

                    return new ActionsResponseModel { Message = "Purchase Returns Updated Successfly !" };
                }
                else
                    return new ActionsResponseModel { IsSuccess = false, Message = "can't find this purchase returns" };

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
