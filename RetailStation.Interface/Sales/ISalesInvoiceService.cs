using RetailStation.Entities.Common;
using RetailStation.Entities.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RetailStation.Interface.Sales
{
    public interface ISalesInvoiceService
    {
        PagedResponseModel<SalesInvoice> GetSalesInvoicesData(FilterModel model);
        ActionsResponseModel CreateNewSalesInvoice(OrderModel model);
    }
}
