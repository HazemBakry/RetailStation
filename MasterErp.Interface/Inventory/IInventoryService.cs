using MasterErp.Entities.Common;
using MasterErp.Entities.Common.Finance.Purchases;
using MasterErp.Entities.Common.Inventory.ReceiveOrder;
using MasterErp.Entities.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Interface.Inventory
{
    public interface IInventoryService
    {

        DataTable GetReceiveOrdersSummary(FilterModel model);
        List<Store> GetInventoryList();
        List<OrdersSearchDTO> GetOrdersSearchData(int SupplierId, string OrderNumber, string OrderDate,int OrderId=0);
        ActionsResponseModel SaveNewReceiveOrder(ReceiveOrderModel model);
    }
}
