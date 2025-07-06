using MasterErp.Entities.Common;
using MasterErp.Entities.Common.Enums;
using MasterErp.Entities.Common.Finance.Purchases;
using MasterErp.Entities.Common.SQLTabeType;
using MasterErp.Entities.DTOs.Inventory;
using MasterErp.Entities.DTOs.Purchases;
using MasterErp.Entities.DTOs.Shared;
using MasterErp.Entities.Models;
using MasterErp.Entities.Models.Inventory;
using MasterErp.Entities.Models.Purchases;
using MasterErp.Interface.Common;
using MasterErp.Interface.GeneralAccounts;
using MasterErp.Interface.Inventory;
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
        private readonly IInventoryService InventoryService;
        private readonly string ConnectionString;

        public PurchaseOrderService(DBContext Context,
            ISQLHelper SQLHelper,
            IConfiguration Configuration,
            IJournalEntryService JournalEntryService,
            ISharedFilterService sharedFilterService,
            IInventoryService inventoryService)
        {
            this.Context = Context;
            this.SQLHelper = SQLHelper;
            this.Configuration = Configuration;
            this.JournalEntryService = JournalEntryService;
            this.ConnectionString = Configuration.GetConnectionString("DBConnection");
            SharedFilterService = sharedFilterService;
            InventoryService = inventoryService;
        }

        public List<PurchaseOrderModel> GetPurchaseOrders_Data(SearchFilterModel PagingFilter, int? PurchaseOrderId = null)
        {
            DataTable FilterList = SharedFilterService.MapFilterModelToDataTable(PagingFilter.FilterList);

            SqlParameter[] param = new SqlParameter[4];

            param[0] = new SqlParameter("@PurchaseOrderId", PurchaseOrderId);
            param[1] = new SqlParameter("@CurrentPage", PagingFilter.CurrentPage);
            param[2] = new SqlParameter("@PageSize", PagingFilter.PageSize);
            param[3] = new SqlParameter("@FilterList", SqlDbType.Structured);
            param[3].Value = FilterList;

            var result = SQLHelper.SQLQuery<PurchaseOrderModel>("[dbo].[SP_GetPurchaseOrders_Data]", ConnectionString, param);
            return result;
        }
        public List<FilterModel> GetPurchaseOrders_Filters(SearchFilterModel PagingFilter)
        {
            var FilterListDt = SharedFilterService.MapFilterModelToDataTable(PagingFilter.FilterList);

            SqlParameter[] Params = new SqlParameter[1];


            Params[0] = new SqlParameter("@FilterList", SqlDbType.Structured);
            Params[0].Value = FilterListDt;

            var results = SQLHelper.SQLQuery<FilterItem>("[dbo].[SP_GetPurchaseOrders_Filters]", ConnectionString, Params);
            return SharedFilterService.GroupedFilterItems(results);
        }
        public List<GeneralOrderDetailsModel> GetPurchaseOrderProducts_Data(int PurchaseOrderId)
        {
            var result = (from orderProduct in Context.PurchaseOrderDetails
                          join item in Context.Items on orderProduct.ItemId equals item.ItemId
                          join unit in Context.Units on orderProduct.UnitId equals unit.UnitId into jT2
                          from unit in jT2.DefaultIfEmpty()
                          where (orderProduct.PurchaseOrderId == PurchaseOrderId)
                          select new GeneralOrderDetailsModel
                          {
                              ItemId = item.ItemId,
                              ItemNameEN = item.NameEN,
                              ItemNameAR = item.NameAR,
                              Price = orderProduct.Price,
                              Quantity = orderProduct.Quantity,
                              TotalValue = orderProduct.TotalValue,
                              UnitId = orderProduct.UnitId,
                              UnitNameAR = unit.NameAR,
                              UnitNameEN = unit.NameAR,
                              OrderId = orderProduct.PurchaseOrderId,

                          }).ToList();

            return result;

        }
        public PurchaseOrderModel GetPurchaseOrderDetailsById(int PurchaseOrderId)
        {
            var result = GetPurchaseOrders_Data(new SearchFilterModel { PageSize = 25, CurrentPage = 1 }, PurchaseOrderId)?.FirstOrDefault();
            if (result != null)
            {
                result.PreviousId = Context.PurchaseOrders
                                    .Where(p => p.PurchaseOrderId < PurchaseOrderId)
                                    .OrderByDescending(p => p.PurchaseOrderId)
                                    .Select(p => p.PurchaseOrderId)
                                    .FirstOrDefault();
                result.NextId = Context.PurchaseOrders
                                .Where(p => p.PurchaseOrderId > PurchaseOrderId)
                                .OrderBy(p => p.PurchaseOrderId)
                                .Select(p => p.PurchaseOrderId)
                                .FirstOrDefault();
            }
            return result;
        }
        public ActionsResponseModel AddNewPurchaseOrder(PurchaseOrderModel model)
        {
            try
            {
                PurchaseOrder order_tbl = new PurchaseOrder();
                int code = Context.PurchaseOrders.Count() > 0 ? Context.PurchaseOrders.Max(x => x.PurchaseOrderId) + 1 : 1;
                order_tbl.OrderNumber = code;
                order_tbl.SerialNumber = DalHelper.GenerateSerialNumber(SerialType.PurchaseOrder, code);
                order_tbl.DueDate = DateTime.Now;
                order_tbl.CreatedDate = DateTime.Now;
                order_tbl.CreatedBy = string.Empty;
                order_tbl.IsCancelled = false;
                order_tbl.IsLocked = false;
                order_tbl.DocNumber = model.DocNumber;
                order_tbl.Notes = model.Notes;
                order_tbl.OrderDate = DateTime.Now;
                order_tbl.TotalValue = (double)(model.OrderDetails != null ? model.OrderDetails.Sum(x => x.TotalValue) : 0);
                order_tbl.SupplierId = (int)model?.SupplierId;
                

                Context.PurchaseOrders.Add(order_tbl);
                Context.SaveChanges();

                foreach (var item in model.OrderDetails)
                {
                    var detail = new PurchaseOrderDetails
                    {
                        Price = item.Price.GetValueOrDefault(),
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
                if(model.MaterialRequestIds != null && model.MaterialRequestIds.Any())
                {
                    InventoryService.UpdateMaterialRequestPurchaseOrder(order_tbl.PurchaseOrderId, model.MaterialRequestIds);
                }

                return new ActionsResponseModel
                {
                    Id = order_tbl.PurchaseOrderId,
                    Number = order_tbl.SerialNumber,
                    Message = "Purchase Order Created"
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


        public ActionsResponseModel EditPurchaseOrder(int PurchaseOrderId, PurchaseOrderModel model)
        {
            try
            {
                var order_tbl = Context.PurchaseOrders.Where(i => i.PurchaseOrderId == PurchaseOrderId).FirstOrDefault();
                if (order_tbl != null)
                {
                    order_tbl.ModifiedDate = DateTime.Now;
                    order_tbl.ModifiedBy = string.Empty;
                    order_tbl.DocNumber = model.DocNumber;
                    order_tbl.Notes = model.Notes;
                    order_tbl.TotalValue = (double)(model.OrderDetails != null ? model.OrderDetails.Sum(x => x.TotalValue) : 0);
                    order_tbl.SupplierId = (int)model?.SupplierId;


                    Context.SaveChanges();

                    var PurchaseOrderDetails = Context.PurchaseOrderDetails.Where(x => x.PurchaseOrderId == PurchaseOrderId).ToList();
                    Context.PurchaseOrderDetails.RemoveRange(PurchaseOrderDetails);
                    foreach (var item in model.OrderDetails)
                    {
                        var detail = new PurchaseOrderDetails
                        {
                            Price = item.Price.GetValueOrDefault(),
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
                    if (model.MaterialRequestIds != null && model.MaterialRequestIds.Any())
                    {
                        InventoryService.UpdateMaterialRequestPurchaseOrder(order_tbl.PurchaseOrderId, model.MaterialRequestIds);
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

        public ActionsResponseModel CancelPurchaseOrder(int PurchaseOrderId)
        {

            var Invoice = Context.PurchaseOrders.FirstOrDefault(x => x.PurchaseOrderId == PurchaseOrderId);
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
                ord.SerialNumber,
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
                SerialNumber = ord.Key.SerialNumber,
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

                int code = Context.PurchaseQuotations.Count() > 0 ? Context.PurchaseQuotations.Max(x => x.PurchaseQuotationId) + 1 : 1;
                tbl.QuotationNumber = code;
                tbl.SerialNumber = DalHelper.GenerateSerialNumber(SerialType.PurchaseQuotation, code);


                tbl.CreatedDate = DateTime.Now;
                tbl.CreatedBy = model.CreatedBy;
                tbl.QuotationDate = DateTime.Now;
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
        public ActionsResponseModel DeletePurchaseQuotation(int PurchaseQuotationId)
        {
            try
            {
                var tbl = Context.PurchaseQuotations.Where(i => i.PurchaseQuotationId == PurchaseQuotationId).FirstOrDefault();
                if (tbl != null)
                {
                    Context.PurchaseQuotations.Remove(tbl);
                    

                    var PurchaseReturnDetails = Context.PurchaseQuotationDetails.Where(x => x.PurchaseQuotationId == PurchaseQuotationId).ToList();

                    if(PurchaseReturnDetails.Count > 0)
                        Context.PurchaseQuotationDetails.RemoveRange(PurchaseReturnDetails);
                    Context.SaveChanges();

                    return new ActionsResponseModel { Message = "Purchase Quotation Removed Successfly !" };
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
