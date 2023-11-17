using MasterErp.Entities.Common;
using MasterErp.Entities.Common.Finance.Purchases;
using MasterErp.Entities.Common.Inventory.ReceiveOrder;
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

        private string ConnectionString
        {
            get
            {
                return Configuration.GetConnectionString("DBConnection");
            }
        }

        public InventoryService(DBContext dBContext, ISQLHelper iSQLHelper, IConfiguration _configuration)
        {
            Context = dBContext;
            SQLHelper = iSQLHelper;
            Configuration = _configuration;
        }


        public DataTable GetReceiveOrdersSummary(FilterModel model)
        {
            SqlParameter[] param = new SqlParameter[2];

            param[0] = new SqlParameter("@CurrentPage", (object)model.CurrentPage ?? DBNull.Value);
            param[1] = new SqlParameter("@PageSize", (object)model.PageSize ?? DBNull.Value);

            var result = SQLHelper.ExecuteDataTable("[dbo].[SP_GetReceiveOrdersSummary]", ConnectionString, param);
            return result;

            //var result = Context.ReceiveOrders.Join(Context.Suppliers,
            //         o => o.SupplierId,
            //         s => s.SupplierId,
            //         (o, s) => new
            //         {
            //             OrderNumber = o.OrderNumber,
            //             ReceiveDate = o.ReceiveDate,
            //             DocNumber = o.DocNumber,
            //             IsLocked = o.IsLocked,
            //             PurchaseOrderId = o.PurchaseOrderId,
            //             ReceiveOrderId = o.ReceiveOrderId,
            //             TotalValue = o.TotalValue,
            //             SupplierName = s.NameAR
            //         }).ToList().ToDataTable();

            //return result;
        }

        public List<InventoryDataModel> GetInventoryList()
        {
            return Context.Inventory.ToList();
        }
        public List<OrdersSearchDTO> GetOrdersSearchData(int SupplierId, string OrderNumber, string OrderDate, int OrderId = 0)
        {


            SqlParameter[] param = new SqlParameter[4];
            param[0] = new SqlParameter("@SupplierId", SupplierId);
            param[1] = new SqlParameter("@OrderNumber", OrderNumber);
            param[2] = new SqlParameter("@OrderDate", !string.IsNullOrEmpty(OrderDate) ? DateTime.Parse(OrderDate) : DBNull.Value);
            param[3] = new SqlParameter("@OrderId", OrderId);

            var lst = SQLHelper.SQLQuery<PurchaseOrderItemsModel>("[dbo].[SP_GetOrdersSearchData]", ConnectionString, param);

            var result = lst.GroupBy(x => x.PurchaseOrderId).Select(p => new { Id = p.Key, lstOrders = p.Select(prt => prt).ToList() }).ToList();
            var finalRes = new List<OrdersSearchDTO>();
            foreach (var item in result)
            {
                var obj = item.lstOrders;
                var order = new OrdersSearchDTO
                {
                    OrderNumber = obj.FirstOrDefault().OrderNumber,
                    PurchaseOrderId = obj.FirstOrDefault().PurchaseOrderId,
                    SupplierId = obj.FirstOrDefault().SupplierId,
                    SupplierNameAR = obj.FirstOrDefault()?.SupplierNameAR,
                    SupplierNameEN = obj.FirstOrDefault()?.SupplierNameEN,
                    TotalValue = obj.FirstOrDefault().TotalValue,
                    OrderDate = obj.FirstOrDefault().OrderDate,
                    DueDate = obj.FirstOrDefault().DueDate,
                    IsLocked = obj.FirstOrDefault().IsLocked,
                    IsCancelled = obj.FirstOrDefault().IsCancelled,
                    Items = obj.Select(x => new ItemModel
                    {
                        ItemId = x.ItemId,
                        ItemNameAr = x.NameAR,
                        ItemNameEn = x.NameEN,
                        UnitId = x.UnitId,
                        Price = x.Cost,
                        Quantity = x.Quantity,
                        //Price= x.Cost,
                        TotalValue = x.ItemTotalValue,
                        IsActive = x.IsActive,
                        UnitNameEn = x.UnitName,

                    }).ToList(),

                };
                finalRes.Add(order);
            }


            return finalRes;
        }


        public ActionsResponseModel SaveNewReceiveOrder(ReceiveOrderModel model)
        {
            try
            {
                ReceiveOrder order_tbl = new ReceiveOrder();

                order_tbl.ReceiveDate = DateTime.Now;
                order_tbl.InsertDate = DateTime.Now;
                order_tbl.OrderNumber = (Context.ReceiveOrders.Count() > 0 ? Context.ReceiveOrders.Max(x => x.OrderNumber) + 1 : 1);
                order_tbl.DocNumber = string.Empty;
                order_tbl.InsertUser = string.Empty;
                order_tbl.PurchaseOrderId = model.PurchaseOrderId;
                order_tbl.TotalValue = model.TotalValue;
                order_tbl.IsCancelled = false;
                order_tbl.IsLocked = false;
                order_tbl.Notes = model.Notes;
                order_tbl.SupplierId = model.SupplierId;
                order_tbl.InventoryId = model.InventoryId;

                Context.ReceiveOrders.Add(order_tbl);
                Context.SaveChanges();

                foreach (ItemModel item in model.Items)
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



    }
}
