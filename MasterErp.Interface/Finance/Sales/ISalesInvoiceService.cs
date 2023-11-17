using MasterErp.Entities.Common;
using MasterErp.Entities.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Interface.Finance.Sales
{
    public interface ISalesInvoiceService
    {
        PagedResponseDTO<SalesInvoice> GetSalesInvoicesData(FilterModel model);
        ActionsResponseModel CreateNewSalesInvoice(SalesInvoiceModel model);
    }
}
