using ICU4N.Util;
using RetailStation.Entities.Common;
using RetailStation.Entities.Common.Enums;
using RetailStation.Entities.Common.Finance.Purchases;
using RetailStation.Entities.DTOs.Inventory;
using RetailStation.Entities.DTOs.Purchases;
using RetailStation.Entities.Models;
using RetailStation.Entities.Models.Finance;
using RetailStation.Entities.Models.Purchases;
using RetailStation.Interface.Common;
using RetailStation.Interface.GeneralAccounts;
using RetailStation.Interface.Inventory;
using RetailStation.Interface.Purchase;
using RetailStation.Interface.Shared;
using RetailStation.Service.Common;
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

namespace RetailStation.Service.Purchase
{
    public class PurchaseInvoiceService : IPurchaseInvoiceService
    {
        private readonly DBContext Context;
        private readonly ISQLHelper SQLHelper;
        private readonly IConfiguration Configuration;
        private readonly ISharedFilterService SharedFilterService;
        private readonly IInventoryService _inventoryService;
        private string ConnectionString;

        public PurchaseInvoiceService(DBContext Context,
            ISQLHelper SQLHelper,
            IConfiguration Configuration,
            ISharedFilterService SharedFilterService,
            IInventoryService inventoryService)
        {
            this.Context = Context;
            this.SQLHelper = SQLHelper;
            this.Configuration = Configuration;
            this.ConnectionString = Configuration.GetConnectionString("DBConnection");
            this.SharedFilterService = SharedFilterService;
            _inventoryService = inventoryService;
        }

        public List<PurchaseInvoiceModel> GetPurchaseInvoices_Data(SearchFilterModel model, int? InvoiceId = null)
        {
            DataTable FilterList = SharedFilterService.MapFilterModelToDataTable(model.FilterList);

            SqlParameter[] Params = new SqlParameter[4];

            Params[0] = new SqlParameter("@InvoiceId", InvoiceId);
            Params[1] = new SqlParameter("@CurrentPage",model.CurrentPage);
            Params[2] = new SqlParameter("@PageSize", model.PageSize);
            Params[3] = new SqlParameter("@FilterList", SqlDbType.Structured);
            Params[3].Value = FilterList;

            var result = SQLHelper.SQLQuery<PurchaseInvoiceModel>("[dbo].[SP_GetPurchaseInvoicesData]", ConnectionString, Params);
            return result;
        }
        public List<FilterModel> GetPurchaseInvoices_Filters(SearchFilterModel PagingFilter)
        {
            var FilterListDt = SharedFilterService.MapFilterModelToDataTable(PagingFilter.FilterList);

            SqlParameter[] Params = new SqlParameter[1];


            Params[0] = new SqlParameter("@FilterList", SqlDbType.Structured);
            Params[0].Value = FilterListDt;

            var results = SQLHelper.SQLQuery<FilterItem>("[dbo].[SP_GetPurchaseInvoices_Filters]", ConnectionString, Params);
            return SharedFilterService.GroupedFilterItems(results);
        }

        public PurchaseInvoiceModel GetPurchaseInvoiceDetailsById(int InvoiceId)
        {
            return GetPurchaseInvoices_Data(new SearchFilterModel { PageSize = 25, CurrentPage = 1 }, InvoiceId)?.FirstOrDefault();

        }
        public ActionsResponseModel AddNewPurchaseInvoice(PurchaseInvoiceModel model)
        {
            try
            {
                PurchaseInvoice order_tbl = new PurchaseInvoice();
                int code = Context.PurchaseInvoices.Count() > 0 ? Context.PurchaseInvoices.Max(x => x.InvoiceNumber) + 1 : 1;
                order_tbl.InvoiceNumber = code;
                order_tbl.SerialNumber = DalHelper.GenerateSerialNumber(SerialType.PurchaseInvoice, code);


                order_tbl.DueDate = model.DueDate ?? DateTime.Now;
                order_tbl.CreatedDate = DateTime.Now;
                order_tbl.CreatedBy = model.CreatedBy;
                //order_tbl.IsCancelled = false;
                //order_tbl.IsLocked = false;
                order_tbl.Notes = model.Notes;
                order_tbl.InvoiceDate = model.OrderDate ?? DateTime.Now;
                order_tbl.TotalValue = model.OrderDetails?.Sum(x => x.TotalValue) ?? 0;
                order_tbl.SupplierId = model.SupplierId;
                order_tbl.InvoiceTypeId = model.OrderTypeId;
                order_tbl.DocNumber = model.DocNumber;
                order_tbl.Discount = model.Discount;
                order_tbl.DiscountPercent = model.DiscountPercent;
                order_tbl.Tax = model.Tax;
                order_tbl.TaxPercent = model.TaxPercent;
                order_tbl.WorkflowStatusId = (int)WorkflowStatus.Pending;
                order_tbl.NetValue = model.OrderDetails?.Sum(x => x.TotalValue) ?? 0;
                Context.PurchaseInvoices.Add(order_tbl);
                Context.SaveChanges();

                foreach (var item in model.OrderDetails)
                {
                    var detail = new PurchaseInvoiceDetails
                    {
                        Price = item.Price.GetValueOrDefault(),
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
                if(model.MaterialReceiptIds!=null && model.MaterialReceiptIds.Any())
                {
                    var updateReceiveOrderResponse = _inventoryService.AddInvoiceToMaterialReceipts(model.MaterialReceiptIds, order_tbl.PurchaseInvoiceId);
                }


                return new ActionsResponseModel
                {
                    Id = order_tbl.PurchaseInvoiceId,
                    Number = order_tbl.SerialNumber,
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
        public ActionsResponseModel EditPurchaseInvoice(int InvoiceId, PurchaseInvoiceModel model)
        {
            try
            {
                var order_tbl = Context.PurchaseInvoices.Where(i => i.PurchaseInvoiceId == InvoiceId).FirstOrDefault();
                if (order_tbl != null)
                {
                    order_tbl.DueDate = model?.DueDate ?? DateTime.Now; ;
                    //order_tbl.IsCancelled = model.IsCancelled != null ? model.IsCancelled ?? false : false;
                    //order_tbl.IsLocked = model.IsLocked !=null ? model.IsLocked ??false :false;
                    order_tbl.Notes = model.Notes;
                    order_tbl.InvoiceDate = model?.OrderDate ?? DateTime.Now;
                    order_tbl.TotalValue = model.OrderDetails?.Sum(x => x.TotalValue) ?? 0;
                    order_tbl.SupplierId = model.SupplierId;
                    order_tbl.InvoiceTypeId = model.OrderTypeId;
                    order_tbl.ReceiveOrderId = model.MaterialReceiptId;
                    order_tbl.DocNumber = model.DocNumber;

                    order_tbl.Discount = model.Discount;
                    order_tbl.DiscountPercent = model.DiscountPercent;
                    order_tbl.Tax = model.Tax;
                    order_tbl.TaxPercent = model.TaxPercent;
                    //order_tbl.WorkflowStatusId = model.WorkflowStatusId;
                    order_tbl.NetValue = model.OrderDetails?.Sum(x => x.TotalValue) ?? 0;

                    
                    order_tbl.ModifiedBy = model.ModifiedBy;
                    order_tbl.ModifiedDate = DateTime.Now;

                    Context.SaveChanges();

                    var PurchaseInvoiceDetails = Context.PurchaseInvoiceDetails.Where(x => x.PurchaseInvoiceId == InvoiceId).ToList();
                    Context.PurchaseInvoiceDetails.RemoveRange(PurchaseInvoiceDetails);
                    Context.SaveChanges();

                    foreach (var item in model.OrderDetails)
                    {
                        var detail = new PurchaseInvoiceDetails
                        {
                            Price = item.Price.GetValueOrDefault(),
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
                    if (model.MaterialReceiptIds != null && model.MaterialReceiptIds.Any())
                    {
                        var updateReceiveOrderResponse = _inventoryService.AddInvoiceToMaterialReceipts(model.MaterialReceiptIds, order_tbl.PurchaseInvoiceId);
                    }
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

        public List<GeneralOrderDetailsModel> GetPurchaseInvoiceProducts_Data(int InvoiceId)
        {

            var result = (from invoiceProduct in Context.PurchaseInvoiceDetails
                          join item in Context.Items on invoiceProduct.ItemId equals item.ItemId
                          join unit in Context.Units on item.UnitId equals unit.UnitId into jT2
                          from unit in jT2.DefaultIfEmpty()
                          where (invoiceProduct.PurchaseInvoiceId == InvoiceId)
                          select new GeneralOrderDetailsModel
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

            //JournalEntryService.SaveNewJournalEntry(entry);
        }

        public ActionsResponseModel CancelPurchaseInvoice(int InvoiceId)
        {
            var Invoice = Context.PurchaseInvoices.FirstOrDefault(x => x.PurchaseInvoiceId == InvoiceId);
            if (Invoice != null && Invoice.WorkflowStatusId != (int)WorkflowStatus.Cancelled)
            {
                Invoice.WorkflowStatusId = (int)WorkflowStatus.Cancelled;
                Invoice.ModifiedDate = DateTime.Now;

                Context.SaveChanges();
                return new ActionsResponseModel
                {
                    Id = InvoiceId,
                    IsSuccess = true,
                    Message = "تم الغاء الفاتوره بنجاح",
                    Status = 200,
                    Number = Invoice.InvoiceNumber.ToString()
                };
            }
            else
            {
                return new ActionsResponseModel
                {
                    Id = InvoiceId,
                    IsSuccess = false,
                    Message = "لا يمكن الغاء هذه الفاتوره",
                    Status = 100,
                    Number = Invoice.InvoiceNumber.ToString()
                };
            }

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


        public List<PurchaseReturnsModel> GetPurchaseReturns_Data(SearchFilterModel PagingFilter, int? OrderId = null)
        {
            var FilterListDt = SharedFilterService.MapFilterModelToDataTable(PagingFilter.FilterList);

            SqlParameter[] Params = new SqlParameter[4];

            Params[0] = new SqlParameter("@ReturnsId", OrderId);
            Params[1] = new SqlParameter("@CurrentPage", PagingFilter.CurrentPage);
            Params[2] = new SqlParameter("@PageSize", PagingFilter.PageSize);
            Params[3] = new SqlParameter("@FilterList", SqlDbType.Structured);
            Params[3].Value = FilterListDt;

            var result = SQLHelper.SQLQuery<PurchaseReturnsModel>("[dbo].[SP_GetPurchasesReturns_Data]", ConnectionString, Params);
            return result;
        }

        public PurchaseReturnsModel GetPurchaseReturnsDetailsById(int PurchaseReturnsId)
        {
            var result = GetPurchaseReturns_Data(new SearchFilterModel { PageSize = 25, CurrentPage = 1 }, PurchaseReturnsId)?.FirstOrDefault();
            if (result != null)
            {
                result.PreviousId = Context.PurchaseReturns
                                    .Where(p => p.PurchaseReturnsId < PurchaseReturnsId)
                                    .OrderByDescending(p => p.PurchaseReturnsId)
                                    .Select(p => p.PurchaseReturnsId)
                                    .FirstOrDefault();
                result.NextId = Context.PurchaseReturns
                                .Where(p => p.PurchaseReturnsId > PurchaseReturnsId)
                                .OrderBy(p => p.PurchaseReturnsId)
                                .Select(p => p.PurchaseReturnsId)
                                .FirstOrDefault();
            }
            return result;
        }

        public List<GeneralOrderDetailsModel> GetPurchaseReturnsProducts_Data(int OrderId)
        {
            var result = (from orderProduct in Context.PurchaseReturnsDetails
                          join item in Context.Items on orderProduct.ItemId equals item.ItemId
                          join unit in Context.Units on item.UnitId equals unit.UnitId into jT2
                          from unit in jT2.DefaultIfEmpty()
                          where (orderProduct.PurchaseReturnsId == OrderId)
                          select new GeneralOrderDetailsModel
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
        public ActionsResponseModel AddNewPurchaseReturns(PurchaseReturnsModel model)
        {
            try
            {

                PurchaseReturns order_tbl = new PurchaseReturns();
                int code = Context.PurchaseReturns.Count() > 0 ? Context.PurchaseReturns.Max(x => x.OrderNumber) + 1 : 1;
                order_tbl.OrderNumber = code;
                order_tbl.SerialNumber = DalHelper.GenerateSerialNumber(SerialType.PurchaseReturn, code);
                order_tbl.CreatedDate = DateTime.Now;
                order_tbl.ReturnsDate = DateTime.Now;//model.OrderDate;
                order_tbl.CreatedBy = model.CreatedBy;

                order_tbl.PurchaseInvoiceId = model.PurchaseInvoiceId ?? 0;
                order_tbl.Notes = model.Notes;
                order_tbl.DocNumber = model.DocNumber;
                order_tbl.TotalValue = model.OrderDetails != null ? model.OrderDetails.Sum(x => x.TotalValue) : 0;
                //order_tbl.SupplierId = (int)model?.SupplierId;
                //order_tbl.BranchId = (int)model?.BranchId;
                //order_tbl.InvoiceNumber = "po_" + (Context.PurchaseReturns.Count() > 0 ? Context.PurchaseReturns.Max(x => x.PurchaseReturnsID) + 1 : 1);

                Context.PurchaseReturns.Add(order_tbl);
                Context.SaveChanges();

                foreach (GeneralOrderDetailsModel item in model.OrderDetails)
                {
                    var detail = new PurchaseReturnsDetails
                    {
                        Price = item.Price.GetValueOrDefault(),
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
                    Message = "Purchase Returns Created",
                    Id = order_tbl.PurchaseReturnsId
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
        public ActionsResponseModel EditPurchaseReturns(int OrderId, PurchaseReturnsModel model)
        {
            try
            {
                var order_tbl = Context.PurchaseReturns.Where(i => i.PurchaseReturnsId == OrderId).FirstOrDefault();
                if (order_tbl != null)
                {
                    order_tbl.ModifiedDate = DateTime.Now;
                    order_tbl.ModifiedBy = model.ModifiedBy;

                    //order_tbl.ReturnsDate = model.OrderDate;

                    order_tbl.PurchaseInvoiceId = model.PurchaseInvoiceId ?? 0;
                    order_tbl.Notes = model.Notes;
                    order_tbl.DocNumber = model.DocNumber;
                    order_tbl.TotalValue = model.OrderDetails != null ? model.OrderDetails.Sum(x => x.TotalValue) : 0;
                    //order_tbl.SupplierId = (int)model?.SupplierId;
                    //order_tbl.BranchId = (int)model?.BranchId;

                    //order_tbl.InvoiceNumber = "po_" + (Context.PurchaseReturns.Count() > 0 ? Context.PurchaseReturns.Max(x => x.PurchaseReturnsID) + 1 : 1);

                    Context.SaveChanges();

                    var PurchaseReturnDetails = Context.PurchaseReturnsDetails.Where(x => x.PurchaseReturnsId == OrderId).ToList();
                    Context.PurchaseReturnsDetails.RemoveRange(PurchaseReturnDetails);
                    foreach (GeneralOrderDetailsModel item in model.OrderDetails)
                    {
                        var detail = new PurchaseReturnsDetails
                        {
                            Price = item.Price.GetValueOrDefault(),
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

        public ActionsResponseModel CancelPurchaseReturns(int ReturnsId)
        {
            var Invoice = Context.PurchaseReturns.FirstOrDefault(x => x.PurchaseReturnsId == ReturnsId);
            if (Invoice is null)
            {
                return new ActionsResponseModel { IsSuccess=false,Message="order not found"};
            }
            Context.PurchaseReturns.Remove(Invoice);

            Context.SaveChanges();
            return new ActionsResponseModel { Message = "deleted successfully !" };
        }
        public List<SupplierStatementModel> GetSupplierStatementData(int SupplierId, SearchFilterModel model)
        {
            DataTable FilterList = SharedFilterService.MapFilterModelToDataTable(model.FilterList);

            SqlParameter[] Params = new SqlParameter[4];
            Params[0] = new SqlParameter("@SupplierId", SupplierId);
            Params[1] = new SqlParameter("@CurrentPage", model.CurrentPage);
            Params[2] = new SqlParameter("@PageSize", model.PageSize);
            Params[3] = new SqlParameter("@FilterList", SqlDbType.Structured);
            Params[3].Value = FilterList;
            var results = SQLHelper.SQLQuery<SupplierStatementModel>("[dbo].[SP_GetSupplierAccountStatement]", ConnectionString, Params);
            return results;

        }

        public List<PurchaseInvoiceType> GetInvoiceTypesData()
        {
            return Context.PurchaseInvoiceTypes.ToList();
        }

        #region PurchaseInvoiceType
        public List<PurchaseInvoiceTypeModel> GetPurchaseInvoiceTypesData(SearchFilterModel searchModel, int? PurchaseInvoiceTypeId = null)
        {


            var query = from purchaseInvoice in Context.PurchaseInvoiceTypes
                        join debit in Context.AccountTrees on purchaseInvoice.AccountDebitId equals debit.AccountId into jT1
                        from debit in jT1.DefaultIfEmpty()
                        join credit in Context.AccountTrees on purchaseInvoice.AccountCreditId equals credit.AccountId into jT2
                        from credit in jT2.DefaultIfEmpty()
                        where PurchaseInvoiceTypeId == null || purchaseInvoice.PurchaseInvoiceTypeId == PurchaseInvoiceTypeId
                        select new PurchaseInvoiceTypeModel
                        {
                            PurchaseInvoiceTypeId = purchaseInvoice.PurchaseInvoiceTypeId,
                            NameAR = purchaseInvoice.NameAR,
                            NameEN = purchaseInvoice.NameEN,
                            Notes = purchaseInvoice.Notes,
                            IsActive = purchaseInvoice.IsActive,
                            IsBindToGeneralAccounting = purchaseInvoice.IsBindToGeneralAccounting,
                            AccountCreditId = purchaseInvoice.AccountCreditId,
                            AccountDebitId = purchaseInvoice.AccountDebitId,
                            DebitAccountNameEN = debit.NameEN,
                            DebitAccountNameAR = debit.NameAR,
                            CreditAccountNameEN = credit.NameEN,
                            CreditAccountNameAR = credit.NameAR,
                            CreatedBy = purchaseInvoice.CreatedBy,
                            CreatedDate = purchaseInvoice.CreatedDate,
                            ModifiedBy = purchaseInvoice.ModifiedBy,
                            ModifiedDate = purchaseInvoice.ModifiedDate,

                        };

            int totalCount = query.Count();
            if (searchModel.CurrentPage > 0 && searchModel.PageSize > 0)
            {
                int skip = (searchModel.CurrentPage - 1) * searchModel.PageSize;
                query = query.Skip(skip).Take(searchModel.PageSize);
            }

            var pagedResults = query.ToList();
            pagedResults.ForEach(x => x.TotalCount = totalCount);


            return pagedResults;
        }
        public PurchaseInvoiceTypeModel GetPurchaseInvoiceTypeById(int PurchaseInvoiceTypeId)
        {
            return GetPurchaseInvoiceTypesData(new SearchFilterModel { PageSize = 25, CurrentPage = 1 }, PurchaseInvoiceTypeId)?.FirstOrDefault();

        }



        public ActionsResponseModel CreateNewPurchaseInvoiceType(PurchaseInvoiceTypeModel Model)
        {
            try
            {
                var entity = Context.PurchaseInvoiceTypes.FirstOrDefault(i => i.NameEN == Model.NameEN || i.NameAR == Model.NameAR);
                if (entity != null)
                {
                    return new ActionsResponseModel
                    {
                        IsSuccess = false,
                        Message = "هذا الاسم موجود"
                    };
                }


                PurchaseInvoiceType tbl = new PurchaseInvoiceType();

                tbl.CreatedDate = DateTime.Now;
                tbl.CreatedBy = Model.CreatedBy;
                tbl.AccountDebitId = Model.AccountDebitId;
                tbl.AccountCreditId = Model.AccountCreditId;
                tbl.IsActive = Model.IsActive;
                tbl.IsBindToGeneralAccounting = Model.IsBindToGeneralAccounting;
                tbl.NameAR = Model.NameAR;
                tbl.NameEN = Model.NameEN;
                tbl.Notes = Model.Notes;


                Context.PurchaseInvoiceTypes.Add(tbl);
                Context.SaveChanges();


                return new ActionsResponseModel
                {
                    Message = "تم الحفظ  بنجاح"
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

        public ActionsResponseModel EditPurchaseInvoiceType(int PurchaseInvoiceTypeId, PurchaseInvoiceTypeModel Model)
        {

            try
            {
                var entity = Context.PurchaseInvoiceTypes.FirstOrDefault(i => i.PurchaseInvoiceTypeId == PurchaseInvoiceTypeId);
                if (entity != null)
                {

                    entity.ModifiedDate = DateTime.Now;
                    entity.ModifiedBy = Model.ModifiedBy;

                    entity.AccountDebitId = Model.AccountDebitId;
                    entity.AccountCreditId = Model.AccountCreditId;
                    entity.IsBindToGeneralAccounting = Model.IsBindToGeneralAccounting;

                    entity.IsActive = Model.IsActive;
                    entity.NameAR = Model.NameAR;
                    entity.NameEN = Model.NameEN;
                    entity.Notes = Model.Notes;
            

                    Context.SaveChanges();


                    return new ActionsResponseModel { Message = "Purchase Invoice Type Updated Successfully !" };
                }
                else
                    return new ActionsResponseModel { IsSuccess = false, Message = "Purchase Invoice Type not found" };
            }
            catch (Exception ex)
            {
                return new ActionsResponseModel { IsSuccess = false, Message = ex.InnerException?.Message ?? ex.Message };
            }

        }


        public ActionsResponseModel DeletePurchaseInvoiceType(int PurchaseInvoiceTypeId)
        {

            try
            {
                var entity = Context.PurchaseInvoiceTypes.FirstOrDefault(i => i.PurchaseInvoiceTypeId == PurchaseInvoiceTypeId);
                if (entity != null)
                {
                    Context.Remove(entity);
                    Context.SaveChanges();
                    return new ActionsResponseModel { Message = "deleted Successfully !" };
                }
                else
                    return new ActionsResponseModel { IsSuccess = false, Message = "not found" };
            }
            catch (Exception ex)
            {
                return new ActionsResponseModel { IsSuccess = false, Message = ex.InnerException?.Message ?? ex.Message };
            }

        }
        #endregion

        private JournalEntryModel PrepareInvoiceEntryModel(PurchaseInvoiceModel Model)
        {
            try
            {
                var invoiceType = Context.PurchaseInvoiceTypes.FirstOrDefault(x => x.PurchaseInvoiceTypeId == Model.OrderTypeId);
                //int generalSupplierId = Context.AccountTrees.Single(x => x.AccountTypeId == 5).AccountId;
                //int accountId = Model.AgencyTypeId == 2 ? generalSupplierId : (int)Model.AccountId;
                List<JournalEntryAccount> accounts = new List<JournalEntryAccount>();

                accounts.Add(new JournalEntryAccount
                {
                    AccountId = (int)invoiceType.AccountCreditId,
                    Credit = Model.NetValue,
                    Debit = 0,
                    CurrencyId = 1,
                    SupplierId = Model.SupplierId,
                    Description = Model.Notes,
                    CostCenterId = Context.AccountTrees.FirstOrDefault(x => x.AccountId == (int)invoiceType.AccountCreditId)?.CostCenterId
                });

                accounts.Add(new JournalEntryAccount
                {
                    AccountId = (int)invoiceType.AccountDebitId,//Context.AccountTrees.FirstOrDefault(x => x.AccountTypeId == 4 && x.IsParent == false).AccountId,
                    Credit = 0,
                    Debit = Model.NetValue,
                    CurrencyId = 1,
                    SupplierId = Model.SupplierId,
                    Description = Model.Notes,
                    CostCenterId = Context.AccountTrees.FirstOrDefault(x => x.AccountId == (int)invoiceType.AccountDebitId)?.CostCenterId
                });
                var invoiceDate = Model.OrderDate ?? DateTime.Now;
                JournalEntryModel entry = new JournalEntryModel
                {
                    //EntryNumber = GenerateNewEntryNumber(Model.ReleaseDate.Month, Model.ReleaseDate.Year);
                    DocNumber = Model.DocNumber,
                    EntryDate = invoiceDate,
                    Description = Model.Notes,
                    JournalTypeId = (int)EntryType.Cashing,
                    //PeriodId = Context.ReceiptLedgers.Single(x => x.ReceiptLedgerId == Model.ReceiptLedgerId).FinancialPeriodId,
                    ActionTypeId = (int)JournalActionType.CashPayment,
                    ActionId = Model.PurchaseInvoiceId,
                    Month = invoiceDate.Month,
                    Year = invoiceDate.Year,
                    JournalEntryAccounts = accounts
                };

                return entry;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.InnerException?.Message ?? ex.Message);
            }
        }

    }
}
