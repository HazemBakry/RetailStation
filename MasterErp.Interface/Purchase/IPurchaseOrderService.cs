using MasterErp.Entities.Common;
using MasterErp.Entities.Common.Finance.Purchases;
using MasterErp.Entities.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Interface.Purchase
{
    public interface IPurchaseOrderService
    {
        DataTable GetPurchasesOrdersData(FilterModel model);
        ActionsResponseModel CreateNewPurchaseOrder(OrderModel model);
        bool CancelPurchaseOrder(int OrderId);

    }
}
