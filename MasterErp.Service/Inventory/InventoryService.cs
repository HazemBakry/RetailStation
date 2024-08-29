using MasterErp.Entities.Common;
using MasterErp.Entities.Common.Finance.Purchases;
using MasterErp.Entities.Common.Inventory.ReceiveOrder;
using MasterErp.Entities.Common.SQLTabeType;
using MasterErp.Entities.DTOs.HR;
using MasterErp.Entities.Models;
using MasterErp.Entities.Models.Inventory;
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

        public List<OrderModel> GetReceiveOrders_Data(SearchFilterModel PagingFilter, int? OrderId = null)
        {
            var FilterListDt = SharedFilterService.MapFilterModelToDataTable(PagingFilter.FilterList);

            SqlParameter[] Params = new SqlParameter[4];

            Params[0] = new SqlParameter("@OrderId", OrderId);
            Params[1] = new SqlParameter("@CurrentPage", PagingFilter.CurrentPage);
            Params[2] = new SqlParameter("@PageSize", PagingFilter.PageSize);
            Params[3] = new SqlParameter("@FilterList", SqlDbType.Structured);
            Params[3].Value = FilterListDt;

            var result = SQLHelper.SQLQuery<OrderModel>("[Inventory].[SP_GetReceiveOrders_Data]", ConnectionString, Params);
            return result;
        }        
        
        public OrderModel GetReceiveOrderDetailsById(int OrderId)
        {
            return GetReceiveOrders_Data(new SearchFilterModel{PageSize =25,CurrentPage=1}, OrderId)?.FirstOrDefault();
        }

        public List<OrderProductModel> GetReceiveOrderProducts_Data(int OrderId)
        {
            var result = (from orderProduct in Context.ReceiveOrderDetails
                          join item in Context.Items on orderProduct.ItemId equals item.ItemId
                          join unit in Context.Units on item.UnitId equals unit.UnitId into jT2
                          from unit in jT2.DefaultIfEmpty()
                          where (orderProduct.ReceiveOrderId == OrderId)
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
                              OrderId = orderProduct.ReceiveOrderId,

                          }).ToList();

            return result;

        }
        public ActionsResponseModel AddNewReceiveOrder(OrderModel model)
        {
            try
            {
                ReceiveOrder order_tbl = new ReceiveOrder();

                order_tbl.ReceiveDate = DateTime.Now;
                order_tbl.CreatedDate = DateTime.Now;
                order_tbl.OrderNumber = (Context.ReceiveOrders.Count() > 0 ? Context.ReceiveOrders.Max(x => x.OrderNumber) + 1 : 1);
                order_tbl.DocNumber = string.Empty;
                order_tbl.CreatedBy = string.Empty;
                order_tbl.PurchaseOrderId = model.PurchaseOrderId;
                order_tbl.TotalValue = model.OrderProducts.Sum(x=>x.TotalValue);
                order_tbl.IsCancelled = false;
                order_tbl.IsLocked = false;
                order_tbl.Notes = model.Notes;
                order_tbl.SupplierId = (int)model.SupplierId;
                order_tbl.StoreId = model.StoreId;

                Context.ReceiveOrders.Add(order_tbl);
                Context.SaveChanges();

                foreach (OrderProductModel item in model.OrderProducts)
                {
                    var detail = new ReceiveOrderDetails
                    {
                        Price = item.Price,
                        ItemId = item.ItemId,
                        Quantity = item.Quantity,
                        TotalValue = item.TotalValue,
                        ReceiveOrderId = order_tbl.ReceiveOrderId,
                        UnitId = item.UnitId,
                        RemainQuantity = 0,
                        ItemBalance = 0,
                        IsLocked = false,
                        Notes = model.Notes
                    };

                    Context.ReceiveOrderDetails.Add(detail);
                    Context.SaveChanges();
                }
                return new ActionsResponseModel
                {
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
        public ActionsResponseModel EditReceiveOrder(int OrderId, OrderModel model)
        {
            try
            {
                var order_tbl = Context.ReceiveOrders.Where(i => i.ReceiveOrderId == OrderId).FirstOrDefault();
                if (order_tbl != null)
                {
                    order_tbl.DocNumber = string.Empty;
                    order_tbl.PurchaseOrderId = model.PurchaseOrderId;
                    order_tbl.TotalValue = model.OrderProducts.Sum(x => x.TotalValue); ;
                    //order_tbl.IsCancelled = false;
                    //order_tbl.IsLocked = false;
                    order_tbl.Notes = model.Notes;
                    order_tbl.SupplierId = (int)model.SupplierId;
                    order_tbl.StoreId = model.StoreId;
                    order_tbl.ModifiedBy = model.ModifiedBy;
                    order_tbl.ModifiedDate = DateTime.Now;
                    
                    Context.SaveChanges();

                    var ReceiveOrderDetails = Context.ReceiveOrderDetails.Where(x => x.ReceiveOrderId == OrderId).ToList();
                    Context.ReceiveOrderDetails.RemoveRange(ReceiveOrderDetails);
                    Context.SaveChanges();

                    foreach (OrderProductModel item in model.OrderProducts)
                    {
                        var detail = new ReceiveOrderDetails
                        {
                            Price = item.Price,
                            ItemId = item.ItemId,
                            Quantity = item.Quantity,
                            TotalValue = item.TotalValue,
                            ReceiveOrderId = order_tbl.ReceiveOrderId,
                            UnitId = item.UnitId,
                            RemainQuantity = 0,
                            ItemBalance = 0,
                            IsLocked = false,
                            Notes = model.Notes
                        };

                        Context.ReceiveOrderDetails.Add(detail);
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


        #region Delivery Orders
        public List<OrderModel> GetDeliveryOrders_Data(SearchFilterModel model , int? OrderId=null)
        {
            DataTable dt = SharedFilterService.MapFilterModelToDataTable(model.FilterList);

            SqlParameter[] Params = new SqlParameter[4];

            Params[0] = new SqlParameter("@OrderId", OrderId);
            Params[1] = new SqlParameter("@CurrentPage", model.CurrentPage);
            Params[2] = new SqlParameter("@PageSize", model.PageSize);
            Params[3] = new SqlParameter("@FilterList", SqlDbType.Structured);
            Params[3].Value = dt;

            var result = SQLHelper.SQLQuery<OrderModel>("[Inventory].[SP_GetDeliveryOrders_Data]", ConnectionString, Params);
            return result;
        }
        public OrderModel GetDeliveryOrderDetailsById(int OrderId)
        {
            return GetDeliveryOrders_Data(new SearchFilterModel { PageSize = 25, CurrentPage = 1 }, OrderId)?.FirstOrDefault();
        }

        public List<OrderProductModel> GetDeliveryOrderProducts_Data(int OrderId)
        {
            var result = (from orderProduct in Context.DeliveryOrderDetails
                          join item in Context.Items on orderProduct.ItemId equals item.ItemId
                          join unit in Context.Units on item.UnitId equals unit.UnitId into jT2
                          from unit in jT2.DefaultIfEmpty()
                          where (orderProduct.DeliveryOrderId == OrderId)
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
                              OrderId = orderProduct.DeliveryOrderId,

                          }).ToList();

            return result;

        }
        public ActionsResponseModel AddNewDeliveryOrder(OrderModel model)
        {
            try
            {
                DeliveryOrder order_tbl = new DeliveryOrder();

                order_tbl.DeliveryDate = model.OrderDate;
                order_tbl.CreatedDate = DateTime.Now;
                order_tbl.CreatedBy =model.CreatedBy;
                order_tbl.OrderNumber = (Context.DeliveryOrders.Count() > 0 ? Context.DeliveryOrders.Max(x => x.OrderNumber) + 1 : 1);
                order_tbl.DocNumber = model.DocNumber;
                order_tbl.TotalValue = model.OrderProducts.Sum(x => x.TotalValue);
                order_tbl.IsCancelled = false;
                order_tbl.IsLocked = false;
                order_tbl.Notes = model.Notes;
                order_tbl.BranchId = (int)model.BranchId;
                order_tbl.StoreId = (int)model.StoreId;

                Context.DeliveryOrders.Add(order_tbl);
                Context.SaveChanges();

                foreach (OrderProductModel item in model.OrderProducts)
                {
                    var detail = new DeliveryOrderDetails
                    {
                        Price = item.Price,
                        ItemId = item.ItemId,
                        Quantity = item.Quantity,
                        TotalValue = item.TotalValue,
                        DeliveryOrderId = order_tbl.DeliveryOrderId,
                        UnitId = item.UnitId,
                        Notes = model.Notes
                    };

                    Context.DeliveryOrderDetails.Add(detail);
                    Context.SaveChanges();
                }
                return new ActionsResponseModel
                {
                    Message = "Delivery Order Created" ,
                    Id= order_tbl.DeliveryOrderId ,
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
        public ActionsResponseModel EditDeliveryOrder(int OrderId, OrderModel model)
        {
            try
            {
                var order_tbl = Context.DeliveryOrders.Where(i => i.DeliveryOrderId == OrderId).FirstOrDefault();
                if (order_tbl != null)
                {
                    order_tbl.DeliveryDate = model.OrderDate;
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

                    var DeliveryOrderDetails = Context.DeliveryOrderDetails.Where(x => x.DeliveryOrderId == OrderId).ToList();
                    Context.DeliveryOrderDetails.RemoveRange(DeliveryOrderDetails);
                    Context.SaveChanges();

                    foreach (OrderProductModel item in model.OrderProducts)
                    {
                        var detail = new DeliveryOrderDetails
                        {
                            Price = item.Price,
                            ItemId = item.ItemId,
                            Quantity = item.Quantity,
                            TotalValue = item.TotalValue,
                            DeliveryOrderId = order_tbl.DeliveryOrderId,
                            UnitId = item.UnitId,
                            Notes = model.Notes
                        };

                        Context.DeliveryOrderDetails.Add(detail);
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


        #endregion

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
    }
}
