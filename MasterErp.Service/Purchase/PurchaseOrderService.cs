using MasterErp.Entities.Common;
using MasterErp.Entities.Common.Finance.Purchases;
using MasterErp.Entities.Common.SQLTabeType;
using MasterErp.Entities.DTOs.Purchases;
using MasterErp.Entities.DTOs.Shared;
using MasterErp.Entities.Models;
using MasterErp.Entities.Models.Purchases;
using MasterErp.Interface.Common;
using MasterErp.Interface.GeneralAccounts;
using MasterErp.Interface.Purchase;
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
    public class PurchaseOrderService : IPurchaseOrderService
    {
        private readonly DBContext Context;
        private readonly ISQLHelper SQLHelper;
        private readonly IConfiguration Configuration;
        private readonly IJournalEntryService JournalEntryService;
        private readonly ISharedFilterService SharedFilterService;
        private readonly string ConnectionString;

        public PurchaseOrderService(DBContext Context,
            ISQLHelper SQLHelper,
            IConfiguration Configuration,
            IJournalEntryService JournalEntryService,
            ISharedFilterService sharedFilterService)
        {
            this.Context = Context;
            this.SQLHelper = SQLHelper;
            this.Configuration = Configuration;
            this.JournalEntryService = JournalEntryService;
            this.ConnectionString = Configuration.GetConnectionString("DBConnection");
            SharedFilterService = sharedFilterService;
        }

        public List<OrderModel> GetPurchaseOrders_Data(SearchFilterModel PagingFilter, int? OrderId = null)
        {
            var FilterList = PagingFilter?.FilterList?.Select(f => new FilterList_TableType { ItemKey = string.Empty, CategoryName = f.CategoryName, ItemValue = f.ItemFlag }).ToList();
            SqlParameter[] param = new SqlParameter[4];

            param[0] = new SqlParameter("@OrderId", OrderId);
            param[1] = new SqlParameter("@CurrentPage", PagingFilter.CurrentPage);
            param[2] = new SqlParameter("@PageSize", PagingFilter.PageSize);
            param[3] = new SqlParameter("@FilterList", SqlDbType.Structured);
            param[3].Value = FilterList.ToDataTable();

            var result = SQLHelper.SQLQuery<OrderModel>("[dbo].[SP_GetPurchaseOrders_Data]", ConnectionString, param);
            return result;
        }

        public List<OrderProductModel> GetPurchaseOrderProducts_Data(int OrderId)
        {
            var result = (from orderProduct in Context.PurchaseOrderDetails
                          join item in Context.Items on orderProduct.ItemId equals item.ItemId
                          join unit in Context.Units on item.UnitId equals unit.UnitId into jT2
                          from unit in jT2.DefaultIfEmpty()
                          where (orderProduct.PurchaseOrderId == OrderId)
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
                              OrderId = orderProduct.PurchaseOrderId,
                              PurchaseOrderId = orderProduct.PurchaseOrderId,

                          }).ToList();

            return result;

        }
        public OrderModel GetPurchaseOrderDetailsById(int OrderId)
        {
            return GetPurchaseOrders_Data(new SearchFilterModel { PageSize = 25, CurrentPage = 1 }, OrderId)?.FirstOrDefault();
        }
        public ActionsResponseModel AddNewPurchaseOrder(OrderModel model)
        {
            try
            {
                PurchaseOrder order_tbl = new PurchaseOrder();

                order_tbl.DueDate = DateTime.Now;
                order_tbl.CreatedDate = DateTime.Now;
                order_tbl.CreatedBy = string.Empty;
                order_tbl.IsCancelled = false;
                order_tbl.IsLocked = false;
                order_tbl.Notes = model.Notes;
                order_tbl.OrderDate = DateTime.Now;
                order_tbl.TotalValue = (double)(model.OrderProducts != null ? model.OrderProducts.Sum(x => x.TotalValue) : 0);
                order_tbl.SupplierId = (int)model?.SupplierId;
                order_tbl.OrderNumber = Context.PurchaseOrders.Count() > 0 ? Context.PurchaseOrders.Max(x => x.PurchaseOrderId) + 1 : 1;

                Context.PurchaseOrders.Add(order_tbl);
                Context.SaveChanges();

                foreach (OrderProductModel item in model.OrderProducts)
                {
                    var detail = new PurchaseOrderDetails
                    {
                        Price = item.Price,
                        ItemId = item.ItemId,
                        Notes = model.Notes,
                        Quantity = item.Quantity,
                        TotalValue = item.TotalValue,
                        PurchaseOrderId = order_tbl.PurchaseOrderId,
                        UnitId = item.UnitId
                    };

                    Context.PurchaseOrderDetails.Add(detail);
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


        public ActionsResponseModel EditPurchaseOrder(int OrderId, OrderModel model)
        {
            try
            {
                var order_tbl = Context.PurchaseOrders.Where(i => i.PurchaseOrderId == OrderId).FirstOrDefault();
                if (order_tbl != null)
                {
                    order_tbl.ModifiedDate = DateTime.Now;
                    order_tbl.ModifiedBy = string.Empty;
                    order_tbl.Notes = model.Notes;
                    order_tbl.TotalValue = (double)(model.OrderProducts != null ? model.OrderProducts.Sum(x => x.TotalValue) : 0);
                    order_tbl.SupplierId = (int)model?.SupplierId;


                    Context.SaveChanges();

                    var PurchaseOrderDetails = Context.PurchaseOrderDetails.Where(x => x.PurchaseOrderId == OrderId).ToList();
                    Context.PurchaseOrderDetails.RemoveRange(PurchaseOrderDetails);
                    foreach (OrderProductModel item in model.OrderProducts)
                    {
                        var detail = new PurchaseOrderDetails
                        {
                            Price = item.Price,
                            ItemId = item.ItemId,
                            Notes = model.Notes,
                            Quantity = item.Quantity,
                            TotalValue = item.TotalValue,
                            PurchaseOrderId = order_tbl.PurchaseOrderId,
                            UnitId = item.UnitId
                        };

                        Context.PurchaseOrderDetails.Add(detail);
                        Context.SaveChanges();
                    }

                    return new ActionsResponseModel { Message = "Purchase Order Updated Successfly !" };
                }
                else
                    return new ActionsResponseModel { IsSuccess = false, Message = "can't find this purchase order" };

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

        public ActionsResponseModel CancelPurchaseOrder(int OrderId)
        {

            var Invoice = Context.PurchaseOrders.FirstOrDefault(x => x.PurchaseOrderId == OrderId);
            if (Invoice is null)
            {
                return new ActionsResponseModel { IsSuccess = false, Message = "can't find this purchase order" };
            }
            //Context.PurchaseInvoices.Remove(Invoice);
            Invoice.IsCancelled = true;
            Context.SaveChanges();
            return new ActionsResponseModel { Message = "Purchase Order Cancelled Successfly !" };
        }



        #region MyRegion

        public List<PurchaseQuotationModel> GetPurchaseQuotations_Data(SearchFilterModel PagingFilter, int? OrderId = null)
        {
            var FilterListDt = SharedFilterService.MapFilterModelToDataTable(PagingFilter.FilterList);

            SqlParameter[] Params = new SqlParameter[4];

            Params[0] = new SqlParameter("@PurchaseQuotationId", OrderId);
            Params[1] = new SqlParameter("@CurrentPage", PagingFilter.CurrentPage);
            Params[2] = new SqlParameter("@PageSize", PagingFilter.PageSize);
            Params[3] = new SqlParameter("@FilterList", SqlDbType.Structured);
            Params[3].Value = FilterListDt;

            var result = SQLHelper.SQLQuery<PurchaseQuotationModel>("[dbo].[SP_GetPurchaseQuotations_Data]", ConnectionString, Params);
            return GroupPurchaseQuotations(result);
        }
        private List<PurchaseQuotationModel> GroupPurchaseQuotations(List<PurchaseQuotationModel> QuotationList)
        {
            var groupdData = QuotationList.GroupBy(ord=>new
            { 
                ord.PurchaseQuotationId,
                ord.QuotationDate,
                ord.QuotationNumber,
                ord.CreatedDate,
                ord.CreatedBy,
                ord.ModifiedBy,
                ord.ModifiedDate,
                ord.Notes,
                ord.TotalCount,
            }).Select(ord=>new PurchaseQuotationModel
            {
                PurchaseQuotationId=ord.Key.PurchaseQuotationId,
                QuotationDate=ord.Key.QuotationDate,
                QuotationNumber=ord.Key.QuotationNumber,
                CreatedDate=ord.Key.CreatedDate,
                CreatedBy=ord.Key.CreatedBy,
                ModifiedBy=ord.Key.ModifiedBy,
                ModifiedDate=ord.Key.ModifiedDate,
                Notes=ord.Key.Notes,
                TotalCount=ord.Key.TotalCount,
                QuotationProducts =ord.Select(prod=>new PurchaseQuotationDetailsModel
                {
                    ItemId = prod.ItemId,
                    ItemNameEN = prod.ItemNameAR,
                    ItemNameAR = prod.ItemNameAR,
                    Price = prod.Price,
                    UnitId = prod.UnitId,
                    UnitNameAR = prod.UnitNameAR,
                    UnitNameEN = prod.UnitNameEN,
                    SupplierId = prod.SupplierId,
                    SupplierNameAR = prod.SupplierNameAR,
                    SupplierNameEN = prod.SupplierNameEN,
                    PurchaseQuotationId = prod.PurchaseQuotationId,
                    PurchaseQuotationDetailsId = prod.PurchaseQuotationDetailsId,

                }).ToList()
            }).ToList();
            return groupdData;
        }
        public PurchaseQuotationModel GetPurchaseQuotationDetailsById(int OrderId)
        {
            return GetPurchaseQuotations_Data(new SearchFilterModel { PageSize = 25, CurrentPage = 1 }, OrderId)?.FirstOrDefault();
        }

        public List<PurchaseQuotationDetailsModel> GetPurchaseQuotationProducts_Data(int PurchaseQuotationId)
        {
            var result = (from quotationProduct in Context.PurchaseQuotationDetails
                          join item in Context.Items on quotationProduct.ItemId equals item.ItemId
                          join supplier in Context.Suppliers on quotationProduct.SupplierId equals supplier.SupplierId
                          join unit in Context.Units on item.UnitId equals unit.UnitId into jT2
                          from unit in jT2.DefaultIfEmpty()
                          where (quotationProduct.PurchaseQuotationId == PurchaseQuotationId)
                          select new PurchaseQuotationDetailsModel
                          {
                              ItemId = item.ItemId,
                              ItemNameEN = item.NameEN,
                              ItemNameAR = item.NameAR,
                              Price = quotationProduct.Price,
                              UnitId = item.UnitId,
                              UnitNameAR = unit.NameAR,
                              UnitNameEN = unit.NameEN,
                              SupplierId = quotationProduct.SupplierId,
                              SupplierNameAR = supplier.NameAR,
                              SupplierNameEN = supplier.NameEN,
                              PurchaseQuotationId = quotationProduct.PurchaseQuotationId,

                          }).ToList();

            return result;

        }
        public ActionsResponseModel AddNewPurchaseQuotation(PurchaseQuotationModel model)
        {
            try
            {

                PurchaseQuotation tbl = new PurchaseQuotation();

                tbl.CreatedDate = DateTime.Now;
                tbl.CreatedBy = model.CreatedBy;
                tbl.QuotationDate = DateTime.Now;
                tbl.QuotationNumber = Context.PurchaseQuotations.Count() > 0 ? Context.PurchaseQuotations.Max(x => x.PurchaseQuotationId) + 1 : 1;
                tbl.Notes = model.Notes;

                Context.PurchaseQuotations.Add(tbl);
                Context.SaveChanges();

                foreach (PurchaseQuotationDetailsModel item in model.QuotationProducts)
                {
                    var detail = new PurchaseQuotationDetails
                    {
                        Price = item.Price,
                        ItemId = item.ItemId,
                        Notes = model.Notes,
                        SupplierId = item.SupplierId,
                        PurchaseQuotationId = tbl.PurchaseQuotationId,
                    };

                    Context.PurchaseQuotationDetails.Add(detail);
                    Context.SaveChanges();
                }
                return new ActionsResponseModel
                {
                    Message = "Purchase Quotation Created"
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
        public ActionsResponseModel EditPurchaseQuotation(int PurchaseQuotationId, PurchaseQuotationModel model)
        {
            try
            {
                var tbl = Context.PurchaseQuotations.Where(i => i.PurchaseQuotationId == PurchaseQuotationId).FirstOrDefault();
                if (tbl != null)
                {
                    tbl.ModifiedDate = DateTime.Now;
                    tbl.ModifiedBy = model.ModifiedBy;

                    tbl.Notes = model.Notes;

                    Context.SaveChanges();

                    var PurchaseReturnDetails = Context.PurchaseQuotationDetails.Where(x => x.PurchaseQuotationId == PurchaseQuotationId).ToList();
                    Context.PurchaseQuotationDetails.RemoveRange(PurchaseReturnDetails);
                    foreach (PurchaseQuotationDetailsModel item in model.QuotationProducts)
                    {
                        var detail = new PurchaseQuotationDetails
                        {
                            Price = item.Price,
                            ItemId = item.ItemId,
                            Notes = model.Notes,
                            SupplierId = item.SupplierId,
                            PurchaseQuotationId = tbl.PurchaseQuotationId,
                        };

                        Context.PurchaseQuotationDetails.Add(detail);
                        Context.SaveChanges();
                    }

                    return new ActionsResponseModel { Message = "Purchase Quotation Updated Successfly !" };
                }
                else
                    return new ActionsResponseModel { IsSuccess = false, Message = "can't find this purchase quotation" };

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
        #endregion

    }
}
