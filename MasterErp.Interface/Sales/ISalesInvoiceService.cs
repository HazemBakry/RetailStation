using MasterErp.Entities.Common;
using MasterErp.Entities.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Interface.Sales
{
    public interface ISalesInvoiceService
    {
        PagedResponseModel<SalesInvoice> GetSalesInvoicesData(FilterModel model);
        ActionsResponseModel CreateNewSalesInvoice(SalesInvoiceModel model);
    }
}
