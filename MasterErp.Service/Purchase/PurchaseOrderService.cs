using MasterErp.Entities.Common;
using MasterErp.Entities.Common.Finance.Purchases;
using MasterErp.Entities.Common.SQLTabeType;
using MasterErp.Entities.DTOs.Shared;
using MasterErp.Entities.Models;
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
        private readonly string ConnectionString;

        public PurchaseOrderService(DBContext Context, 
            ISQLHelper SQLHelper, 
            IConfiguration Configuration, 
            IJournalEntryService JournalEntryService)
        {
            this.Context = Context;
            this.SQLHelper = SQLHelper;
            this.Configuration = Configuration;
            this.JournalEntryService = JournalEntryService;
            this.ConnectionString  = Configuration.GetConnectionString("DBConnection");
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

        public ActionsResponseModel CreateNewPurchaseOrder(OrderModel model)
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

        public bool CancelPurchaseOrder(int OrderId)
        {

            var Invoice = Context.PurchaseOrders.FirstOrDefault(x => x.PurchaseOrderId == OrderId);
            if (Invoice is null)
            {
                return false;
            }
            //Context.PurchaseInvoices.Remove(Invoice);
            Invoice.IsCancelled = true;
            Context.SaveChanges();
            return true;
        }

    }
}
