using MasterErp.Entities.Common;
using MasterErp.Entities.Common.Finance.Purchases;
using MasterErp.Entities.Models;
using MasterErp.Interface.Common;
using MasterErp.Interface.Finance.GeneralAccounts;
using MasterErp.Interface.Finance.Purchase;
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

namespace MasterErp.Service.Finance.Purchase
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
        public DataTable GetPurchasesOrdersData(FilterModel model)
        {
            SqlParameter[] param = new SqlParameter[2];

            param[0] = new SqlParameter("@CurrentPage", (object)model.CurrentPage ?? DBNull.Value);
            param[1] = new SqlParameter("@PageSize", (object)model.PageSize ?? DBNull.Value);

            var result = SQLHelper.ExecuteDataTable("[dbo].[SP_GetPurchasesOrdersData]", ConnectionString, param);
            return result;

        }

        public CreateModifyReturnsModel SaveNewPurchaseOrder(PurchaseOrderModel model)
        {
            try
            {
                PurchaseOrder order_tbl = new PurchaseOrder();

                order_tbl.DueDate = DateTime.Now;
                order_tbl.InsertDate = DateTime.Now;
                order_tbl.InsertUser = string.Empty;
                order_tbl.IsCancelled = false;
                order_tbl.IsLocked = false;
                order_tbl.Notes = model.Notes;
                order_tbl.OrderDate = DateTime.Now;
                order_tbl.TotalValue = model.Items != null ? model.Items.Sum(x => x.TotalValue) : 0;
                order_tbl.SupplierID = model.SupplierId;
                order_tbl.OrderNumber = (Context.PurchaseOrders.Count() > 0 ? Context.PurchaseOrders.Max(x => x.PurchaseOrderID) + 1 : 1);

                Context.PurchaseOrders.Add(order_tbl);
                Context.SaveChanges();

                foreach (ItemModel item in model.Items)
                {
                    var detail = new PurchaseOrderDetails
                    {
                        Price = item.Price,
                        ItemID = item.ItemId,
                        Notes = model.Notes,
                        Quantity = item.Quantity,
                        TotalValue = item.TotalValue,
                        PurchaseOrderID = order_tbl.PurchaseOrderID,
                        UnitID = item.UnitId
                    };

                    Context.PurchaseOrderDetails.Add(detail);
                    Context.SaveChanges();
                }

                return new CreateModifyReturnsModel
                {
                    Status = 1,
                    Message = "Purchase Order Created"
                };
            }
            catch (Exception ex)
            {
                return new CreateModifyReturnsModel
                {
                    Status = 0,
                    Message = ex.Message
                };
            }
        }

        public bool CancelPurchaseOrder(int OrderId)
        {

            var Invoice = Context.PurchaseOrders.FirstOrDefault(x => x.PurchaseOrderID == OrderId);
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
