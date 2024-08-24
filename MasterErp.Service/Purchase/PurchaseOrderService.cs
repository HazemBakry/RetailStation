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

        private string ConnectionString
        {
            get
            {
                return Configuration.GetConnectionString("DBConnection");
            }
        }

        public PurchaseOrderService(DBContext dBContext, ISQLHelper iSQLHelper, IConfiguration _configuration, IJournalEntryService _journalEntryService)
        {
            Context = dBContext;
            SQLHelper = iSQLHelper;
            Configuration = _configuration;
            JournalEntryService = _journalEntryService;
        }
        public List<OrderModel> GetPurchaseOrders_Data(SearchFilterModel PagingFilter,int? OrderId=null)
        {
            var FilterList = PagingFilter?.FilterList?.Select(f=>new FilterList_TableType {ItemKey=string.Empty ,CategoryName = f.CategoryName ,ItemValue=f.ItemFlag}).ToList();
            SqlParameter[] param = new SqlParameter[4];

            param[0] = new SqlParameter("@OrderId", OrderId);
            param[1] = new SqlParameter("@FilterList", SqlDbType.Structured);
            param[1].Value = FilterList.ToDataTable();
            param[2] = new SqlParameter("@CurrentPage",PagingFilter.CurrentPage);
            param[3] = new SqlParameter("@PageSize", PagingFilter.PageSize);

            var result = SQLHelper.SQLQuery<OrderModel>("[dbo].[SP_GetPurchaseOrders_Data]", ConnectionString, param);
            return result;

        }

        public DataTable GetPurchasesOrdersData(FilterModel model)
        {
            SqlParameter[] param = new SqlParameter[2];

            param[0] = new SqlParameter("@CurrentPage", (object)model.CurrentPage ?? DBNull.Value);
            param[1] = new SqlParameter("@PageSize", (object)model.PageSize ?? DBNull.Value);

            var result = SQLHelper.ExecuteDataTable("[dbo].[SP_GetPurchasesOrdersData]", ConnectionString, param);
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
