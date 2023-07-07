using MasterErp.Entities.Common;
using MasterErp.Entities.Models;
using MasterErp.Interface.Common;
using MasterErp.Interface.Finance.Sales;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Service.Finance.Sales
{
    public class SalesInvoiceService: ISalesInvoiceService
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

        public SalesInvoiceService(DBContext dBContext, ISQLHelper iSQLHelper, IConfiguration _configuration)
        {
            Context = dBContext;
            SQLHelper = iSQLHelper;
            Configuration = _configuration;
        }

        public List<SalesInvoice> GetSalesInvoiceData()
        {
            return Context.SalesInvoices.ToList();
        }

        public (bool HasError, int InvoiceNumber) SaveNewSalesInvoice(SalesInvoiceModel model)
        {
            try
            {
                SalesInvoice order_tbl = new SalesInvoice();

                order_tbl.InsertDate = DateTime.Now;
                order_tbl.InsertUser = model.UserId;
                order_tbl.InvoiceDate = DateTime.Now;
                order_tbl.IsCancelled = false;
                order_tbl.Notes = model.Notes;
                order_tbl.InvoiceDate = DateTime.Now;
                order_tbl.TotalValue = model.Items != null ? model.Items.Sum(x => x.TotalValue) : 0;
                order_tbl.InvoiceNumber = (Context.SalesInvoices.Count() > 0 ? Context.SalesInvoices.Max(x => x.SalesInvoiceID) + 1 : 1);

                Context.SalesInvoices.Add(order_tbl);
                Context.SaveChanges();

                foreach (SalesInvoiceDetails item in model.Items)
                {
                    var detail = new SalesInvoiceDetails
                    {
                        Price = item.Price,
                        ItemID = item.ItemID,
                        Notes = item.Notes,
                        Quantity = item.Quantity,
                        TotalValue = item.TotalValue,
                        SalesInvoiceID = order_tbl.SalesInvoiceID,
                    };

                    Context.SalesInvoiceDetails.Add(detail);
                    Context.SaveChanges();
                }

                return (true, order_tbl.InvoiceNumber);
            }
            catch (Exception ex)
            {
                return (false, 0);
            }
        }
    }
}
