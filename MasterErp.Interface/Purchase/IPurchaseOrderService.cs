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
        List<OrderModel> GetPurchaseOrders_Data(SearchFilterModel PagingFilter, int? OrderId=null);
        List<OrderProductModel> GetPurchaseOrderProducts_Data(int OrderId);
        ActionsResponseModel CreateNewPurchaseOrder(OrderModel model);
        bool CancelPurchaseOrder(int OrderId);

    }
}
