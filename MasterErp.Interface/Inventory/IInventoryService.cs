using MasterErp.Entities.Common;
using MasterErp.Entities.Common.Finance.Purchases;
using MasterErp.Entities.Common.Inventory.ReceiveOrder;
using MasterErp.Entities.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Interface.Inventory
{
    public interface IInventoryService
    {

        List<ReceiveOrder> GetReceiveOrdersData();
        List<InventoryDataModel> GetInventoryList();
        List<OrdersSearchDTO> GetOrdersSearchData(int SupplierId, string OrderNumber, string OrderDate,int OrderId=0);
        CreateModifyReturnsModel SaveNewReceiveOrder(ReceiveOrderModel model);
    }
}
