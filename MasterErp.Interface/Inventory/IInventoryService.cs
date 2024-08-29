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
        List<OrderModel> GetReceiveOrders_Data(SearchFilterModel model ,int? OrderId=null);
        OrderModel GetReceiveOrderDetailsById(int OrderId);
        List<OrderProductModel> GetReceiveOrderProducts_Data(int OrderId);

        ActionsResponseModel AddNewReceiveOrder(OrderModel model);
        ActionsResponseModel EditReceiveOrder(int OrderId,OrderModel model);
        List<OrderModel> GetDeliveryOrders_Data(SearchFilterModel model, int? OrderId = null);
        OrderModel GetDeliveryOrderDetailsById(int OrderId);

        List<OrderProductModel> GetDeliveryOrderProducts_Data(int OrderId);

        ActionsResponseModel AddNewDeliveryOrder(OrderModel model);
        ActionsResponseModel EditDeliveryOrder(int OrderId, OrderModel model);
        List<OrderModel> GetOrdersSearchData(int SupplierId, string OrderNumber, string OrderDate,int OrderId=0);
    }
}
