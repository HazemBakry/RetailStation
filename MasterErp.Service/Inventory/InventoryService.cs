using MasterErp.Entities.Common;
using MasterErp.Entities.Common.Finance.Purchases;
using MasterErp.Entities.Common.Inventory.ReceiveOrder;
using MasterErp.Entities.DTOs.HR;
using MasterErp.Entities.Models;
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

        public List<OrderModel> GetReceiveOrdersSummary(FilterModel model)
        {
            DataTable dt = SharedFilterService.MapFilterModelToDataTable(model.FilterItems);

            SqlParameter[] Params = new SqlParameter[3];

            Params[0] = new SqlParameter("@CurrentPage", (object)model.CurrentPage ?? DBNull.Value);
            Params[1] = new SqlParameter("@PageSize", (object)model.PageSize ?? DBNull.Value);
            Params[2] = new SqlParameter("@FilterList", SqlDbType.Structured);
            Params[2].Value = dt;

            var result = SQLHelper.SQLQuery<OrderModel>("[Inventory].[SP_GetReceiveOrdersSummary]", ConnectionString, Params);
            return result;
        }

        public ActionsResponseModel SaveNewReceiveOrder(OrderModel model)
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
                order_tbl.TotalValue = model.TotalValue;
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

        public List<OrderModel> GetDeliveryOrdersSummary(FilterModel model)
        {
            DataTable dt = SharedFilterService.MapFilterModelToDataTable(model.FilterItems);

            SqlParameter[] Params = new SqlParameter[3];

            Params[0] = new SqlParameter("@CurrentPage", (object)model.CurrentPage ?? DBNull.Value);
            Params[1] = new SqlParameter("@PageSize", (object)model.PageSize ?? DBNull.Value);
            Params[2] = new SqlParameter("@FilterList", SqlDbType.Structured);
            Params[2].Value = dt;

            var result = SQLHelper.SQLQuery<OrderModel>("[Inventory].[SP_GetDeliveryOrdersSummary]", ConnectionString, Params);
            return result;
        }

        public ActionsResponseModel SaveNewDeliveryOrder(OrderModel model)
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
                order_tbl.TotalValue = model.TotalValue;
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
                        Notes = model.Notes,

                    };

                    Context.ReceiveOrderDetails.Add(detail);
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
