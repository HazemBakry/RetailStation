using ICU4N.Util;
using iText.Layout.Borders;
using MasterErp.Entities.Common;
using MasterErp.Entities.Common.Enums;
using MasterErp.Entities.Common.Finance.Purchases;
using MasterErp.Entities.Common.Inventory.ReceiveOrder;
using MasterErp.Entities.Common.SQLTabeType;
using MasterErp.Entities.DTOs.HR;
using MasterErp.Entities.DTOs.Inventory;
using MasterErp.Entities.Models;
using MasterErp.Entities.Models.Inventory;
using MasterErp.Entities.Models.Purchases;
using MasterErp.Interface.Common;
using MasterErp.Interface.Inventory;
using MasterErp.Service.Common;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Service.Inventory
{
    public class InventoryService : IInventoryService
    {

        private readonly DBContext Context;
        private readonly ISQLHelper SQLHelper;
        private readonly IConfiguration Configuration;
        private readonly ISharedFilterService SharedFilterService;
        private string ConnectionString;

        public InventoryService(DBContext Context, ISQLHelper SQLHelper,
            IConfiguration Configuration, ISharedFilterService SharedFilterService)
        {
            this.Context = Context;
            this.SQLHelper = SQLHelper;
            this.Configuration = Configuration;
            this.SharedFilterService = SharedFilterService;
            this.ConnectionString = Configuration.GetConnectionString("DBConnection");
        }

        public List<Store> GetInventoryList()
        {
            return Context.Stores.ToList();
        }
        public List<StatisticsCardSummary> GetInventoryStatistics()
        {
            SqlParameter[] Params = new SqlParameter[0];

            var result = SQLHelper.SQLQuery<StatisticsCardSummary>("[Inventory].[SP_GetInventoryStatistics]", ConnectionString, Params);
            return result;
        }
        public List<OrderModel> GetOrdersSearchData(int SupplierId, string OrderNumber, string OrderDate, int OrderId = 0)
        {
            SqlParameter[] param = new SqlParameter[4];
            param[0] = new SqlParameter("@SupplierId", SupplierId);
            param[1] = new SqlParameter("@OrderNumber", OrderNumber);
            param[2] = new SqlParameter("@OrderDate", !string.IsNullOrEmpty(OrderDate) ? DateTime.Parse(OrderDate) : DBNull.Value);
            param[3] = new SqlParameter("@OrderId", OrderId);

            var lst = SQLHelper.SQLQuery<PurchaseOrderItemsModel>("[dbo].[SP_GetOrdersSearchData]", ConnectionString, param);

            var result = lst.GroupBy(x => x.PurchaseOrderId).Select(p => new { Id = p.Key, lstOrders = p.Select(prt => prt).ToList() }).ToList();
            var finalRes = new List<OrderModel>();
            foreach (var item in result)
            {
                var obj = item.lstOrders;
                var order = new OrderModel
                {
                    OrderNumber = obj.FirstOrDefault().OrderNumber,
                    PurchaseOrderId = obj.FirstOrDefault().PurchaseOrderId,
                    SupplierId = obj.FirstOrDefault().SupplierId,
                    SupplierNameAR = obj.FirstOrDefault()?.SupplierNameAR,
                    SupplierNameEN = obj.FirstOrDefault()?.SupplierNameEN,
                    TotalValue = obj.FirstOrDefault().TotalValue,
                    OrderDate = (DateTime)obj.FirstOrDefault().OrderDate,
                    DueDate = obj.FirstOrDefault().DueDate,
                    IsLocked = obj.FirstOrDefault().IsLocked,
                    IsCancelled = obj.FirstOrDefault().IsCancelled,
                    OrderProducts = obj.Select(x => new OrderProductModel
                    {
                        ItemId = x.ItemId,
                        ItemNameAR = x.NameAR,
                        ItemNameEN = x.NameEN,
                        UnitId = x.UnitId,
                        Price = x.Cost,
                        Quantity = x.Quantity,
                        TotalValue = x.ItemTotalValue,
                        IsActive = x.IsActive,
                        UnitNameEN = x.UnitName,

                    }).ToList(),
                };
                finalRes.Add(order);
            }
            return finalRes;
        }

        #region Receive Orders

        public List<MaterialReceiptModel> GetMaterialReceipts_Data(SearchFilterModel PagingFilter, int? MaterialReceiptId = null)
        {
            var FilterListDt = SharedFilterService.MapFilterModelToDataTable(PagingFilter.FilterList);

            SqlParameter[] Params = new SqlParameter[4];

            Params[0] = new SqlParameter("@MaterialReceiptId", MaterialReceiptId);
            Params[1] = new SqlParameter("@CurrentPage", PagingFilter.CurrentPage);
            Params[2] = new SqlParameter("@PageSize", PagingFilter.PageSize);
            Params[3] = new SqlParameter("@FilterList", SqlDbType.Structured);
            Params[3].Value = FilterListDt;

            var result = SQLHelper.SQLQuery<MaterialReceiptModel>("[Inventory].[SP_GetMaterialReceipts_Data]", ConnectionString, Params);
            return result;
        }
        public List<FilterModel> GetMaterialReceipts_Filters(SearchFilterModel PagingFilter)
        {
            var FilterListDt = SharedFilterService.MapFilterModelToDataTable(PagingFilter.FilterList);

            SqlParameter[] Params = new SqlParameter[1];

            
            Params[0] = new SqlParameter("@FilterList", SqlDbType.Structured);
            Params[0].Value = FilterListDt;

            var results = SQLHelper.SQLQuery<FilterItem>("[Inventory].[SP_GetMaterialReceipts_Filters]", ConnectionString, Params);
            return SharedFilterService.GroupedFilterItems(results);
        }
        public MaterialReceiptModel GetMaterialReceiptDetailsById(int MaterialReceiptId)
        {
            var result = GetMaterialReceipts_Data(new SearchFilterModel { PageSize = 25, CurrentPage = 1 }, MaterialReceiptId)?.FirstOrDefault();
            if (result != null)
            {
                result.PreviousId = Context.MaterialReceipts
                                    .Where(p => p.MaterialReceiptId < MaterialReceiptId)
                                    .OrderByDescending(p => p.MaterialReceiptId)
                                    .Select(p => p.MaterialReceiptId)
                                    .FirstOrDefault();
                result.NextId = Context.MaterialReceipts
                                .Where(p => p.MaterialReceiptId > MaterialReceiptId)
                                .OrderBy(p => p.MaterialReceiptId)
                                .Select(p => p.MaterialReceiptId)
                                .FirstOrDefault();
            }
            return result;
        }
        public List<GeneralOrderDetailsModel> GetMaterialReceiptProducts_Data(List<int> MaterialReceiptIds)
        {
            var result = (from orderProduct in Context.MaterialReceiptDetails
                          join item in Context.Items on orderProduct.ItemId equals item.ItemId
                          join unit in Context.Units on item.UnitId equals unit.UnitId into jT2
                          from unit in jT2.DefaultIfEmpty()
                          where MaterialReceiptIds.Contains(orderProduct.MaterialReceiptId)
                          // where (orderProduct.MaterialReceiptId == MaterialReceiptId)
                          select new GeneralOrderDetailsModel
                          {
                              ItemId = item.ItemId,
                              ItemNameEN = item.NameEN,
                              ItemNameAR = item.NameAR,
                              Price = orderProduct.Price,
                              ExpireDate = orderProduct.ExpireDate,
                              Quantity = orderProduct.Quantity,
                              TotalValue = orderProduct.TotalValue,
                              UnitId = item.UnitId,
                              UnitNameAR = unit.NameAR,
                              UnitNameEN = unit.NameEN,
                              OrderId = orderProduct.MaterialReceiptId,

                          }).ToList();

            return result;

        }
        public ActionsResponseModel AddNewMaterialReceipt(MaterialReceiptModel model)
        {
            try
            {
                MaterialReceipt order_tbl = new MaterialReceipt();
                int code = (Context.MaterialReceipts.Count() > 0 ? Context.MaterialReceipts.Max(x => x.OrderNumber) + 1 : 1);
                order_tbl.OrderNumber = code;
                order_tbl.SerialNumber = DalHelper.GenerateSerialNumber(SerialType.MaterialReceipt, code);
                order_tbl.OrderDate = model.OrderDate ?? DateTime.Now;
                order_tbl.CreatedDate = DateTime.Now;
                order_tbl.DocNumber =   model.DocNumber;
                order_tbl.CreatedBy = model.CreatedBy;
                order_tbl.PurchaseOrderId = model.PurchaseOrderId;
                order_tbl.TotalValue = model.OrderDetails.Sum(x => x.TotalValue);
                order_tbl.Notes = model.Notes;
                order_tbl.SupplierId = (int)model.SupplierId;
                order_tbl.StoreId = model.StoreId;

                Context.MaterialReceipts.Add(order_tbl);
                Context.SaveChanges();

                foreach (var item in model.OrderDetails)
                {
                    var detail = new MaterialReceiptDetails
                    {
                        Price = item.Price.GetValueOrDefault(),
                        ItemId = item.ItemId,
                        Quantity = item.Quantity,
                        TotalValue = item.TotalValue,
                        MaterialReceiptId = order_tbl.MaterialReceiptId,
                        UnitId = item.UnitId,
                        ExpireDate = item.ExpireDate,
                        //RemainQuantity = 0,
                        //ItemBalance = 0,
                        //IsLocked = false,
                        Notes = model.Notes
                    };

                    Context.MaterialReceiptDetails.Add(detail);
                    Context.SaveChanges();
                }
                return new ActionsResponseModel
                {
                    Id = order_tbl.MaterialReceiptId,
                    Number = order_tbl.SerialNumber,
                    Message = "Material Receipt Created"
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
        public ActionsResponseModel EditMaterialReceipt(int MaterialReceiptId, MaterialReceiptModel model)
        {
            try
            {
                var order_tbl = Context.MaterialReceipts.Where(i => i.MaterialReceiptId == MaterialReceiptId).FirstOrDefault();
                if (order_tbl != null)
                {
                    order_tbl.OrderDate = model.OrderDate ?? DateTime.Now;
                    order_tbl.DocNumber = model.DocNumber;
                    order_tbl.PurchaseOrderId = model.PurchaseOrderId;
                    order_tbl.TotalValue = model.OrderDetails.Sum(x => x.TotalValue); ;
                    //order_tbl.IsCancelled = false;
                    //order_tbl.IsLocked = false;
                    order_tbl.Notes = model.Notes;
                    order_tbl.SupplierId = (int)model.SupplierId;
                    order_tbl.StoreId = model.StoreId;
                    order_tbl.ModifiedBy = model.ModifiedBy;
                    order_tbl.ModifiedDate = DateTime.Now;

                    Context.SaveChanges();

                    var MaterialReceiptDetails = Context.MaterialReceiptDetails.Where(x => x.MaterialReceiptId == MaterialReceiptId).ToList();
                    Context.MaterialReceiptDetails.RemoveRange(MaterialReceiptDetails);
                    Context.SaveChanges();

                    foreach (var item in model.OrderDetails)
                    {
                        var detail = new MaterialReceiptDetails
                        {
                            Price = item.Price.GetValueOrDefault(),
                            ItemId = item.ItemId,
                            Quantity = item.Quantity,
                            TotalValue = item.TotalValue,
                            MaterialReceiptId = order_tbl.MaterialReceiptId,
                            UnitId = item.UnitId,
                            ExpireDate = item.ExpireDate,
                            //RemainQuantity = 0,
                            //ItemBalance = 0,
                            //IsLocked = false,
                            Notes = model.Notes
                        };

                        Context.MaterialReceiptDetails.Add(detail);
                        Context.SaveChanges();
                    }

                    return new ActionsResponseModel { Message = "Receive Order Updated Successfly !" };
                }
                else
                    return new ActionsResponseModel { IsSuccess = false, Message = "can't find this receive order" };

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
        public ActionsResponseModel AddInvoiceToMaterialReceipts(List<int> MaterialReceiptIds, int InvoiceId)
        {
            try
            {
                var order_tbl = Context.MaterialReceipts.Where(i => MaterialReceiptIds.Contains(i.MaterialReceiptId)).ToList();
                if (order_tbl.Any())
                {

                    foreach (var order in order_tbl)
                    {
                        order.PurchaseInvoiceId = InvoiceId;
                        order.IsLocked = true;
                    }
                    Context.SaveChanges();

                    return new ActionsResponseModel { Message = "Receive Orders Updated Successfly !" };
                }
                else
                    return new ActionsResponseModel { IsSuccess = false, Message = "can't find this receive orders" };

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
        public ActionsResponseModel CancelMaterialReceipt(int MaterialReceiptId)
        {
            try
            {
                var order = Context.MaterialReceipts.FirstOrDefault(m => m.MaterialReceiptId == MaterialReceiptId);
                if (order != null)
                {
                    order.IsCancelled = true;
                    order.ModifiedDate = DateTime.Now;
                    order.ModifiedBy = "";

                    Context.SaveChanges();
                    return new ActionsResponseModel { Message = "Order Cancelled Successfly !" };
                }
                else
                    return new ActionsResponseModel { IsSuccess = false, Message = "Order not exist" };
            }
            catch (Exception ex)
            {
                return new ActionsResponseModel { IsSuccess = false, Message = ex.InnerException?.Message ?? ex.Message };
            }
        }

        #endregion

        #region Delivery Orders

        public List<OrderModel> GetDeliveryNotes_Data(SearchFilterModel model, int? OrderId = null)
        {
            DataTable dt = SharedFilterService.MapFilterModelToDataTable(model.FilterList);

            SqlParameter[] Params = new SqlParameter[4];

            Params[0] = new SqlParameter("@OrderId", OrderId);
            Params[1] = new SqlParameter("@CurrentPage", model.CurrentPage);
            Params[2] = new SqlParameter("@PageSize", model.PageSize);
            Params[3] = new SqlParameter("@FilterList", SqlDbType.Structured);
            Params[3].Value = dt;

            var result = SQLHelper.SQLQuery<OrderModel>("[Inventory].[SP_GetDeliveryNotes_Data]", ConnectionString, Params);
            return result;
        }

        public List<FilterModel> GetDeliveryNotes_Filters(SearchFilterModel PagingFilter)
        {
            var FilterListDt = SharedFilterService.MapFilterModelToDataTable(PagingFilter.FilterList);

            SqlParameter[] Params = new SqlParameter[1];


            Params[0] = new SqlParameter("@FilterList", SqlDbType.Structured);
            Params[0].Value = FilterListDt;

            var results = SQLHelper.SQLQuery<FilterItem>("[Inventory].[SP_GetDeliveryNotes_Filters]", ConnectionString, Params);
            return SharedFilterService.GroupedFilterItems(results);
        }

        public OrderModel GetDeliveryNoteDetailsById(int OrderId)
        {
            return GetDeliveryNotes_Data(new SearchFilterModel { PageSize = 25, CurrentPage = 1 }, OrderId)?.FirstOrDefault();
        }

        public List<OrderProductModel> GetDeliveryNoteProducts_Data(int OrderId)
        {
            var result = (from orderProduct in Context.DeliveryNoteDetails
                          join item in Context.Items on orderProduct.ItemId equals item.ItemId
                          join unit in Context.Units on item.UnitId equals unit.UnitId into jT2
                          from unit in jT2.DefaultIfEmpty()
                          where (orderProduct.DeliveryNoteId == OrderId)
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
                              OrderId = orderProduct.DeliveryNoteId,

                          }).ToList();

            return result;

        }
        public ActionsResponseModel AddNewDeliveryNote(OrderModel model)
        {
            try
            {
                DeliveryNote order_tbl = new DeliveryNote();

                order_tbl.OrderDate = model.OrderDate ?? DateTime.Now;
                order_tbl.CreatedDate = DateTime.Now;
                order_tbl.CreatedBy = model.CreatedBy;
                order_tbl.OrderNumber = (Context.DeliveryNotes.Count() > 0 ? Context.DeliveryNotes.Max(x => x.OrderNumber) + 1 : 1);
                order_tbl.DocNumber = model.DocNumber;
                order_tbl.TotalValue = model.OrderProducts.Sum(x => x.TotalValue);
                order_tbl.IsCancelled = false;
                order_tbl.IsLocked = false;
                order_tbl.Notes = model.Notes;
                order_tbl.BranchId = (int)model.BranchId;
                order_tbl.StoreId = (int)model.StoreId;

                Context.DeliveryNotes.Add(order_tbl);
                Context.SaveChanges();

                foreach (OrderProductModel item in model.OrderProducts)
                {
                    var detail = new DeliveryNoteDetails
                    {
                        Price = item.Price,
                        ItemId = item.ItemId,
                        Quantity = item.Quantity,
                        TotalValue = item.TotalValue,
                        DeliveryNoteId = order_tbl.DeliveryNoteId,
                        UnitId = item.UnitId,
                        Notes = model.Notes
                    };

                    Context.DeliveryNoteDetails.Add(detail);
                    Context.SaveChanges();
                }
                return new ActionsResponseModel
                {
                    Message = "Delivery Order Created",
                    Id = order_tbl.DeliveryNoteId,
                    Number = order_tbl.OrderNumber.ToString(),
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
        public ActionsResponseModel EditDeliveryNote(int OrderId, OrderModel model)
        {
            try
            {
                var order_tbl = Context.DeliveryNotes.Where(i => i.DeliveryNoteId == OrderId).FirstOrDefault();
                if (order_tbl != null)
                {
                    order_tbl.OrderDate = model.OrderDate ?? DateTime.Now;
                    order_tbl.DocNumber = model.DocNumber;
                    order_tbl.TotalValue = model.OrderProducts.Sum(x => x.TotalValue);
                    order_tbl.IsCancelled = model.IsCancelled;
                    order_tbl.IsLocked = model.IsLocked;
                    order_tbl.Notes = model.Notes;
                    order_tbl.BranchId = (int)model.BranchId;
                    order_tbl.StoreId = (int)model.StoreId;
                    order_tbl.ModifiedBy = model.ModifiedBy;
                    order_tbl.ModifiedDate = DateTime.Now;

                    Context.SaveChanges();

                    var DeliveryNoteDetails = Context.DeliveryNoteDetails.Where(x => x.DeliveryNoteId == OrderId).ToList();
                    Context.DeliveryNoteDetails.RemoveRange(DeliveryNoteDetails);
                    Context.SaveChanges();

                    foreach (OrderProductModel item in model.OrderProducts)
                    {
                        var detail = new DeliveryNoteDetails
                        {
                            Price = item.Price,
                            ItemId = item.ItemId,
                            Quantity = item.Quantity,
                            TotalValue = item.TotalValue,
                            DeliveryNoteId = order_tbl.DeliveryNoteId,
                            UnitId = item.UnitId,
                            Notes = model.Notes
                        };

                        Context.DeliveryNoteDetails.Add(detail);
                        Context.SaveChanges();
                    }

                    return new ActionsResponseModel { Message = "Delivery Order Updated Successfly !" };
                }
                else
                    return new ActionsResponseModel { IsSuccess = false, Message = "can't find this delivery order" };

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
        public ActionsResponseModel CancelDeliveryNote(int OrderId)
        {
            try
            {
                var order = Context.DeliveryNotes.FirstOrDefault(m => m.DeliveryNoteId == OrderId);
                if (order != null)
                {
                    order.IsCancelled = true;
                    order.ModifiedDate = DateTime.Now;
                    order.ModifiedBy = "";

                    Context.SaveChanges();
                    return new ActionsResponseModel { Message = "Order Cancelled Successfly !" };
                }
                else
                    return new ActionsResponseModel { IsSuccess = false, Message = "Order not exist" };
            }
            catch (Exception ex)
            {
                return new ActionsResponseModel { IsSuccess = false, Message = ex.InnerException?.Message ?? ex.Message };
            }
        }

        #endregion

        #region Material Issue

        public List<MaterialIssueModel> GetMaterialIssue_Data(SearchFilterModel model, int? MaterialIssueId = null)
        {
            DataTable dt = SharedFilterService.MapFilterModelToDataTable(model.FilterList);

            SqlParameter[] Params = new SqlParameter[4];

            Params[0] = new SqlParameter("@MaterialIssueId", MaterialIssueId);
            Params[1] = new SqlParameter("@CurrentPage", model.CurrentPage);
            Params[2] = new SqlParameter("@PageSize", model.PageSize);
            Params[3] = new SqlParameter("@FilterList", SqlDbType.Structured);
            Params[3].Value = dt;

            var result = SQLHelper.SQLQuery<MaterialIssueModel>("[Inventory].[SP_GetMaterialIssue_Data]", ConnectionString, Params);
            return result;
        }

        public List<FilterModel> GetMaterialIssue_Filters(SearchFilterModel PagingFilter)
        {
            var FilterListDt = SharedFilterService.MapFilterModelToDataTable(PagingFilter.FilterList);

            SqlParameter[] Params = new SqlParameter[1];


            Params[0] = new SqlParameter("@FilterList", SqlDbType.Structured);
            Params[0].Value = FilterListDt;

            var results = SQLHelper.SQLQuery<FilterItem>("[Inventory].[SP_GetMaterialIssue_Filters]", ConnectionString, Params);
            return SharedFilterService.GroupedFilterItems(results);
        }

        public MaterialIssueModel GetMaterialIssueDetailsById(int MaterialIssueId)
        {
            var result= GetMaterialIssue_Data(new SearchFilterModel { PageSize = 25, CurrentPage = 1 }, MaterialIssueId)?.FirstOrDefault();


            if (result != null)
            {
                result.PreviousId = Context.MaterialIssues
                                    .Where(p => p.MaterialIssueId < MaterialIssueId)
                                    .OrderByDescending(p => p.MaterialIssueId)
                                    .Select(p => p.MaterialIssueId)
                                    .FirstOrDefault();

                result.NextId = Context.MaterialIssues
                                .Where(p => p.MaterialIssueId > MaterialIssueId)
                                .OrderBy(p => p.MaterialIssueId)
                                .Select(p => p.MaterialIssueId)
                                .FirstOrDefault();
            }
            return result;
            
        }

        public List<GeneralOrderDetailsModel> GetMaterialIssueProducts_Data(int MaterialIssueId)
        {
            var result = (from orderProduct in Context.MaterialIssueDetails
                          join item in Context.Items on orderProduct.ItemId equals item.ItemId
                          join unit in Context.Units on item.UnitId equals unit.UnitId into jT2
                          from unit in jT2.DefaultIfEmpty()
                          where (orderProduct.MaterialIssueId == MaterialIssueId)
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
                              OrderId = orderProduct.MaterialIssueId,

                          }).ToList();

            return result;

        }
        public ActionsResponseModel AddNewMaterialIssue(MaterialIssueModel model)
        {
            try
            {
                MaterialIssue order_tbl = new MaterialIssue();

                order_tbl.OrderDate = model.OrderDate ?? DateTime.Now;
                order_tbl.CreatedDate = DateTime.Now;
                order_tbl.CreatedBy = model.CreatedBy;

                int code = (Context.MaterialIssues.Count() > 0 ? Context.MaterialIssues.Max(x => x.OrderNumber) + 1 : 1);
                order_tbl.OrderNumber = code;
                order_tbl.SerialNumber = DalHelper.GenerateSerialNumber(SerialType.MaterialIssue, code);

                order_tbl.DocNumber = model.DocNumber;
                order_tbl.TotalValue = model.OrderDetails.Sum(x => x.TotalValue);
                order_tbl.IsCancelled = false;
                order_tbl.IsLocked = false;
                order_tbl.Notes = model.Notes;
                order_tbl.BranchId = (int)model.BranchId;
                order_tbl.StoreId = (int)model.StoreId;
                order_tbl.WorkflowStatusId = (int)InventoryWorkflowStatus.Pending;
                Context.MaterialIssues.Add(order_tbl);
                Context.SaveChanges();

                foreach (var item in model.OrderDetails)
                {
                    var detail = new MaterialIssueDetails
                    {
                        Price = item.Price.GetValueOrDefault(),
                        ItemId = item.ItemId,
                        Quantity = item.Quantity,
                        TotalValue = item.TotalValue,
                        MaterialIssueId = order_tbl.MaterialIssueId,
                        UnitId = item.UnitId,
                        Notes = model.Notes
                    };

                    Context.MaterialIssueDetails.Add(detail);
                    Context.SaveChanges();
                }
                return new ActionsResponseModel
                {
                    Message = "Material Issue Order Created !",
                    Id = order_tbl.MaterialIssueId,
                    Number = order_tbl.SerialNumber,
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
        public ActionsResponseModel EditMaterialIssue(int MaterialIssueId, MaterialIssueModel model)
        {
            try
            {
                var order_tbl = Context.MaterialIssues.Where(i => i.MaterialIssueId == MaterialIssueId).FirstOrDefault();
                if (order_tbl != null)
                {
                    order_tbl.OrderDate = model.OrderDate ?? DateTime.Now;
                    order_tbl.DocNumber = model.DocNumber;
                    order_tbl.TotalValue = model.OrderDetails.Sum(x => x.TotalValue);
                    order_tbl.IsCancelled = model.IsCancelled;
                    order_tbl.IsLocked = model.IsLocked;
                    order_tbl.Notes = model.Notes;
                    order_tbl.BranchId = (int)model.BranchId;
                    order_tbl.StoreId = (int)model.StoreId;
                    order_tbl.ModifiedBy = model.ModifiedBy;
                    order_tbl.ModifiedDate = DateTime.Now;

                    Context.SaveChanges();

                    var MaterialIssueDetails = Context.MaterialIssueDetails.Where(x => x.MaterialIssueId == MaterialIssueId).ToList();
                    Context.MaterialIssueDetails.RemoveRange(MaterialIssueDetails);
                    Context.SaveChanges();

                    foreach (var item in model.OrderDetails)
                    {
                        var detail = new MaterialIssueDetails
                        {
                            Price = item.Price.GetValueOrDefault(),
                            ItemId = item.ItemId,
                            Quantity = item.Quantity,
                            TotalValue = item.TotalValue,
                            MaterialIssueId = order_tbl.MaterialIssueId,
                            UnitId = item.UnitId,
                            Notes = model.Notes
                        };

                        Context.MaterialIssueDetails.Add(detail);
                        Context.SaveChanges();
                    }

                    return new ActionsResponseModel { Message = "Delivery Order Updated Successfly !" };
                }
                else
                    return new ActionsResponseModel { IsSuccess = false, Message = "can't find this delivery order" };

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
        public ActionsResponseModel CancelMaterialIssue(int MaterialIssueId)
        {
            try
            {
                var order = Context.MaterialIssues.FirstOrDefault(m => m.MaterialIssueId == MaterialIssueId);
                if (order != null)
                {
                    order.IsCancelled = true;
                    order.WorkflowStatusId = (int)InventoryWorkflowStatus.Rejected;
                    order.ModifiedDate = DateTime.Now;
                    order.ModifiedBy = "";

                    Context.SaveChanges();
                    return new ActionsResponseModel { Message = "Order Cancelled Successfly !" };
                }
                else
                    return new ActionsResponseModel { IsSuccess = false, Message = "Order not exist" };
            }
            catch (Exception ex)
            {
                return new ActionsResponseModel { IsSuccess = false, Message = ex.InnerException?.Message ?? ex.Message };
            }
        }

        #endregion

        #region Material Requests


        public List<MaterialRequestModel> GetMaterialRequests_Data(SearchFilterModel model, int? MaterialRequestId = null)
        {
            DataTable dt = SharedFilterService.MapFilterModelToDataTable(model.FilterList);

            SqlParameter[] Params = new SqlParameter[4];

            Params[0] = new SqlParameter("@MaterialRequestId", MaterialRequestId);
            Params[1] = new SqlParameter("@CurrentPage", model.CurrentPage);
            Params[2] = new SqlParameter("@PageSize", model.PageSize);
            Params[3] = new SqlParameter("@FilterList", SqlDbType.Structured);
            Params[3].Value = dt;

            var result = SQLHelper.SQLQuery<MaterialRequestModel>("[Inventory].[SP_GetMaterialRequests_Data]", ConnectionString, Params);
            return result;
        }
        public MaterialRequestModel GetMaterialRequestDetailsById(int MaterialRequestId)
        {
            var result = GetMaterialRequests_Data(new SearchFilterModel { PageSize = 25, CurrentPage = 1 }, MaterialRequestId)?.FirstOrDefault();
            if(result !=null)
            {
                result.PreviousId = Context.MaterialRequests
                                    .Where(p => p.MaterialRequestId < MaterialRequestId)
                                    .OrderByDescending(p => p.MaterialRequestId)
                                    .Select(p => p.MaterialRequestId)
                                    .FirstOrDefault();

                result.NextId = Context.MaterialRequests
                                .Where(p => p.MaterialRequestId > MaterialRequestId)
                                .OrderBy(p => p.MaterialRequestId)
                                .Select(p => p.MaterialRequestId)
                                .FirstOrDefault();
            }
            return result;
        }


        public ActionsResponseModel CreateNewMaterialRequest(MaterialRequestModel model)
        {
            try
            {
                MaterialRequest tbl = new MaterialRequest();
                int code = (Context.MaterialRequests.Count() > 0 ? Context.MaterialRequests.Max(x => x.OrderNumber) + 1 : 1);
                tbl.OrderNumber = code;
                tbl.SerialNumber = DalHelper.GenerateSerialNumber(SerialType.MaterialRequest, code);

                tbl.CreatedDate = DateTime.Now;
                tbl.CreatedBy = model.CreatedBy;
                tbl.StoreId = model.StoreId;
                tbl.Notes = model.Notes;
                tbl.DocNumber = model.DocNumber;
                tbl.StatusId = model.StatusId;
                tbl.OrderDate = model?.OrderDate ?? DateTime.Now;
                tbl.DueDate = model.DueDate;
                tbl.PurposeId = model.PurposeId;
                Context.MaterialRequests.Add(tbl);
                Context.SaveChanges();

                foreach (var item in model.OrderDetails)
                {
                    var detail = new MaterialRequestDetails
                    {
                        ItemId = item.ItemId,
                        Notes = model.Notes,
                        Quantity = item.Quantity,
                        MaterialRequestId = tbl.MaterialRequestId,
                        UnitId = item.UnitId,
                        DueDate = item.DueDate,
                    };

                    Context.MaterialRequestDetails.Add(detail);
                    Context.SaveChanges();
                }

                return new ActionsResponseModel
                {
                    Id = tbl.MaterialRequestId,
                    Number = tbl.OrderNumber.ToString(),
                    Message = "تم حفظ طلب المشتريات بنجاح"
                };
            }
            catch (Exception ex)
            {
                return new ActionsResponseModel
                {
                    IsSuccess = false,
                    Message = ex.InnerException?.Message ?? ex.Message
                };
            }
        }


        public ActionsResponseModel EditMaterialRequest(int MaterialRequestId, MaterialRequestModel model)
        {
            try
            {
                var order_tbl = Context.MaterialRequests.Where(i => i.MaterialRequestId == MaterialRequestId).FirstOrDefault();
                if (order_tbl != null)
                {
                    order_tbl.OrderDate = model.OrderDate ?? DateTime.Now;
                    order_tbl.DueDate = model.DueDate;
                    order_tbl.DocNumber = model.DocNumber;
                    order_tbl.TotalValue = model.OrderDetails.Sum(x => x.TotalValue);
                    order_tbl.IsCancelled = model.IsCancelled;
                    order_tbl.IsLocked = model.IsLocked;
                    order_tbl.Notes = model.Notes;
                    order_tbl.PurposeId = model.PurposeId;
                    order_tbl.StoreId = model.StoreId;
                    order_tbl.ModifiedBy = model.ModifiedBy;
                    order_tbl.ModifiedDate = DateTime.Now;

                    Context.SaveChanges();

                    var MaterialRequestDetails = Context.MaterialRequestDetails.Where(x => x.MaterialRequestId == MaterialRequestId).ToList();
                    Context.MaterialRequestDetails.RemoveRange(MaterialRequestDetails);
                    Context.SaveChanges();

                    foreach (var item in model.OrderDetails)
                    {
                        var detail = new MaterialRequestDetails
                        {
                            ItemId = item.ItemId,
                            Notes = model.Notes,
                            Quantity = item.Quantity,
                            MaterialRequestId = MaterialRequestId,
                            UnitId = item.UnitId,
                            DueDate = item.DueDate,
                        };

                        Context.MaterialRequestDetails.Add(detail);
                        Context.SaveChanges();
                    }

                    return new ActionsResponseModel { Message = "Material Request Updated Successfly !" };
                }
                else
                    return new ActionsResponseModel { IsSuccess = false, Message = "can't find this material request" };

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
        public List<GeneralOrderDetailsModel> GetMaterialRequestProducts_Data(List<int> MaterialRequestIds)
        {
            var data = (from orderProduct in Context.MaterialRequestDetails
                          join item in Context.Items on orderProduct.ItemId equals item.ItemId
                          join unit in Context.Units on item.UnitId equals unit.UnitId into jT2
                          from unit in jT2.DefaultIfEmpty()
                          where MaterialRequestIds.Contains(orderProduct.MaterialRequestId)
                          //where orderProduct.MaterialRequestId == MaterialRequestId
                          select new GeneralOrderDetailsModel
                          {
                              ItemId = item.ItemId,
                              ItemNameEN = item.NameEN,
                              ItemNameAR = item.NameAR,
                              Price = item.Cost,
                              Quantity = orderProduct.Quantity,
                              TotalValue = orderProduct.Quantity > 0 ? orderProduct.Quantity * item.Cost : orderProduct.Quantity,
                              UnitId = item.UnitId,
                              UnitNameAR = unit.NameAR,
                              UnitNameEN = unit.NameEN,
                              OrderId = orderProduct.MaterialRequestId,
                              DueDate = orderProduct.DueDate,

                          }).ToList();

            var result =data.GroupBy(p => new { p.ItemId, p.ItemNameEN, p.ItemNameAR, p.UnitId, p.UnitNameAR, p.UnitNameEN })
                             .Select(g => new GeneralOrderDetailsModel
                             {
                                 ItemId = g.Key.ItemId,
                                 ItemNameEN = g.Key.ItemNameEN,
                                 ItemNameAR = g.Key.ItemNameAR,
                                 UnitId = g.Key.UnitId,
                                 UnitNameAR = g.Key.UnitNameAR,
                                 UnitNameEN = g.Key.UnitNameEN,
                                 Price = g.Sum(x => x.Price),
                                 Quantity = g.Sum(x => x.Quantity),
                                 TotalValue = g.Sum(x => x.TotalValue),
                                 OrderId = g.First().OrderId,
                                 DueDate = g.First().DueDate
                             }).ToList();

            return result;

        }



        public ActionsResponseModel CancelMaterialRequest(int MaterialRequestId)
        {
            try
            {
                var order = Context.MaterialRequests.FirstOrDefault(m => m.MaterialRequestId == MaterialRequestId);
                if (order != null)
                {
                    order.IsCancelled = true;
                    order.ModifiedDate = DateTime.Now;
                    order.ModifiedBy = "";

                    Context.SaveChanges();
                    return new ActionsResponseModel { Message = "Order Cancelled Successfly !" };
                }
                else
                    return new ActionsResponseModel { IsSuccess = false, Message = "Order not exist" };
            }
            catch (Exception ex)
            {
                return new ActionsResponseModel { IsSuccess = false, Message = ex.InnerException?.Message ?? ex.Message };
            }
        }


        public ActionsResponseModel UpdateMaterialRequestPurchaseOrder(int purchaseOrderId, List<int> materialRequestIds)
        {
            try
            {
                //var oldMaterial = Context.MaterialRequests
                //   .Where(m => m.PurchaseOrderId == purchaseOrderId)
                //   .ToList();

                //foreach (var order in oldMaterial)
                //{
                //    order.IsLocked = false;
                //    order.PurchaseOrderId = null;
                //    order.ModifiedDate = DateTime.Now;
                //    order.ModifiedBy = "";
                //}
                var orders = Context.MaterialRequests.Where(m => materialRequestIds.Contains(m.MaterialRequestId)).ToList();

                if (!orders.Any())
                    return new ActionsResponseModel { IsSuccess = false, Message = "Order not exist" };

                foreach (var order in orders)
                {
                    order.IsLocked = true;
                    order.PurchaseOrderId = purchaseOrderId;
                    order.ModifiedDate = DateTime.Now;
                    order.ModifiedBy = "";
                }

                Context.SaveChanges();
                return new ActionsResponseModel { IsSuccess = true, Message = "Material request updated successfully!" };
            }
            catch (Exception ex)
            {
                return new ActionsResponseModel { IsSuccess = false, Message = "Error: " + ex.Message };
            }
        }


        #endregion

        #region Supplier Vouchers

        public List<OrderModel> GetSupplierVouchers_Data(SearchFilterModel model, int? OrderId = null)
        {
            DataTable dt = SharedFilterService.MapFilterModelToDataTable(model.FilterList);

            SqlParameter[] Params = new SqlParameter[4];

            Params[0] = new SqlParameter("@OrderId", OrderId);
            Params[1] = new SqlParameter("@CurrentPage", model.CurrentPage);
            Params[2] = new SqlParameter("@PageSize", model.PageSize);
            Params[3] = new SqlParameter("@FilterList", SqlDbType.Structured);
            Params[3].Value = dt;

            var result = SQLHelper.SQLQuery<OrderModel>("[Inventory].[SP_GetSupplierVouchers_Data]", ConnectionString, Params);
            return result;
        }

        public ActionsResponseModel CancelSupplierVoucher(int OrderId)
        {
            try
            {
                var order = Context.SupplierReturnsVouchers.FirstOrDefault(m => m.SupplierReturnsVoucherId == OrderId);
                if (order != null)
                {
                    order.IsCancelled = true;
                    order.ModifiedDate = DateTime.Now;
                    order.ModifiedBy = "";

                    Context.SaveChanges();
                    return new ActionsResponseModel { Message = "Order Cancelled Successfly !" };
                }
                else
                    return new ActionsResponseModel { IsSuccess = false, Message = "Order not exist" };
            }
            catch (Exception ex)
            {
                return new ActionsResponseModel { IsSuccess = false, Message = ex.InnerException?.Message ?? ex.Message };
            }
        }


        #endregion

    }
}
