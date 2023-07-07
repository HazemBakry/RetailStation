using MasterErp.Entities.Common;
using MasterErp.Entities.Models;
using MasterErp.Interface.Common;
using MasterErp.Interface.Finance.Purchase;
using MasterErp.Service.Common;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Service.Finance.Purchase
{
    public class PurchaseInvoiceService : IPurchaseInvoiceService
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

        public PurchaseInvoiceService(DBContext dBContext, ISQLHelper iSQLHelper, IConfiguration _configuration)
        {
            Context = dBContext;
            SQLHelper = iSQLHelper;
            Configuration = _configuration;
        }

        public List<PurchaseInvoice> GetPurchaseInvoiceData()
        {
            return Context.PurchaseInvoices.ToList();
        }

        public List<Supplier> GetSuppliersData()
        {
            return Context.Suppliers.ToList();
        }

        public List<Branch> GetBranchesData()
        {
            return Context.Branches.ToList();
        }

        public List<ItemLookups> GetItemLookupsData()
        {
            return Context.ItemLookups.ToList();
        }

        public DataTable GetItemsData()
        {
            var results = (from item in Context.Items.ToList()
                           join unit in Context.Units.ToList() on item.UnitID equals unit.UnitId
                           select new
                           {
                               ItemId = item.ItemID,
                               NameEN = item.NameEN,
                               NameAR = item.NameAR,
                               Cost = item.Cost,
                               UnitId = item.UnitID,
                               UnitName = unit.UnitNameEn
                           }).ToList().ToDataTable();

            return results;
        }

        public DataTable GetItemsBySupplierId(int SupplierId)
        {
            SqlParameter[] param = new SqlParameter[1];
            param[0] = new SqlParameter("@SupplierId", SupplierId);

            var dt = SQLHelper.ExecuteDataTable("[dbo].[SP_GetItemsBySupplierId]", ConnectionString, param);
            return dt;
        }

        public DataTable GetItemsByLookupId(int LookupId)
        {
            SqlParameter[] param = new SqlParameter[1];
            param[0] = new SqlParameter("@LookupId", LookupId);

            var dt = SQLHelper.ExecuteDataTable("[dbo].[SP_GetItemsByLookupId]", ConnectionString, param);
            return dt;
        }

        public (bool HasError, string InvoiceNumber) SaveNewPurchaseInvoice(PurchaseInvoiceModel model)
        {
            try
            {
                PurchaseInvoice order_tbl = new PurchaseInvoice();

                order_tbl.DueDate = DateTime.Now;
                order_tbl.InsertDate = DateTime.Now;
                order_tbl.InsertUser = model.UserId;
                order_tbl.IsCancelled = false;
                order_tbl.IsLocked = false;
                order_tbl.Notes = model.Notes;
                order_tbl.InvoiceDate = DateTime.Now;
                order_tbl.InvoiceTotalValue = model.Items != null ? model.Items.Sum(x => x.TotalValue) : 0;
                order_tbl.SupplierID = model.SupplierId;
                order_tbl.InvoiceNumber = "po_" + (Context.PurchaseInvoices.Count() > 0 ? Context.PurchaseInvoices.Max(x => x.PurchaseInvoiceID) + 1 : 1);

                Context.PurchaseInvoices.Add(order_tbl);
                Context.SaveChanges();

                foreach (PurchaseInvoiceDetails item in model.Items)
                {
                    var detail = new PurchaseInvoiceDetails
                    {
                        Price = item.Price,
                        ItemID = item.ItemID,
                        Notes = item.Notes,
                        Quantity = item.Quantity,
                        TotalValue = item.TotalValue,
                        PurchaseInvoiceID = order_tbl.PurchaseInvoiceID,
                        UnitID = item.UnitID
                    };

                    Context.PurchaseInvoiceDetails.Add(detail);
                    Context.SaveChanges();
                }

                return (true, order_tbl.InvoiceNumber);
            }
            catch (Exception ex)
            {
                return (false, "0");
            }
        }
    }
}
