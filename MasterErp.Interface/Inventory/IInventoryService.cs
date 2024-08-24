using MasterErp.Entities.Common;
using MasterErp.Entities.Common.Finance.Purchases;
using MasterErp.Entities.Common.Inventory.ReceiveOrder;
using MasterErp.Entities.DTOs.HR;
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

        List<Store> GetInventoryList();
        List<StatisticsCardSummary> GetInventoryStatistics();
        List<OrderModel> GetReceiveOrdersSummary(FilterModel model);
        ActionsResponseModel SaveNewReceiveOrder(OrderModel model);
        List<OrderModel> GetDeliveryOrdersSummary(FilterModel model);
        ActionsResponseModel SaveNewDeliveryOrder(OrderModel model);
        List<OrderModel> GetOrdersSearchData(int SupplierId, string OrderNumber, string OrderDate,int OrderId=0);
    }
}
