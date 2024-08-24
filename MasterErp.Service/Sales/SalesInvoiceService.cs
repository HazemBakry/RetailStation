using MasterErp.Entities.Common;
using MasterErp.Entities.Models;
using MasterErp.Interface.Common;
using MasterErp.Interface.Sales;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Service.Sales
{
    public class SalesInvoiceService : ISalesInvoiceService
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

        public PagedResponseModel<SalesInvoice> GetSalesInvoicesData(FilterModel model)
        {
            //var data= Context.SalesInvoices.ToList();

            int totalCount = Context.SalesInvoices.Count();

            int skip = (model.CurrentPage - 1) * model.PageSize;

            var data = Context.SalesInvoices
                .OrderByDescending(e => e.InvoiceDate)
                .Skip(skip)
                .Take(model.PageSize)
                .ToList();


            return new PagedResponseModel<SalesInvoice>
            {
                TotalCount = totalCount,
                Results = data,
                CurrentPage = model.CurrentPage,
                PageSize = model.PageSize
            };
        }

        public ActionsResponseModel CreateNewSalesInvoice(OrderModel model)
        {
            try
            {
                SalesInvoice order_tbl = new SalesInvoice();

                order_tbl.InsertDate = DateTime.Now;
                order_tbl.InsertUser = string.Empty;
                order_tbl.InvoiceDate = model.OrderDate;
                order_tbl.IsCancelled = false;
                order_tbl.Notes = model.Notes;
                order_tbl.TaxPercent = model.TaxPercent;
                order_tbl.SubTotal = model.SubTotal;
                order_tbl.Discount = model.Discount;
                order_tbl.DiscountPercent = model.DiscountPercent;
                order_tbl.DocNumber = model.DocNumber;
                order_tbl.TotalValue = model.TotalValue;
                //order_tbl.TotalValue = model.Items != null ? model.Items.Sum(x => x.TotalValue) : 0;
                order_tbl.InvoiceNumber = Context.SalesInvoices.Count() > 0 ? Context.SalesInvoices.Max(x => x.SalesInvoiceId) + 1 : 1;

                Context.SalesInvoices.Add(order_tbl);
                Context.SaveChanges();

                foreach (OrderProductModel item in model.OrderProducts)
                {
                    var detail = new SalesInvoiceDetails
                    {
                        Price = item.Price,
                        ItemId = item.ItemId,
                        Quantity = item.Quantity,
                        TotalValue = item.TotalValue,
                        SalesInvoiceId = order_tbl.SalesInvoiceId,
                    };

                    Context.SalesInvoiceDetails.Add(detail);
                    Context.SaveChanges();
                }
                return new ActionsResponseModel
                {
                    Id = order_tbl.InvoiceNumber,
                    Status = 1,
                    Message = "Sales Invoice Created"
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
