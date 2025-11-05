using RetailStation.Entities.Common;
using RetailStation.Entities.DTOs.Website;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RetailStation.Interface.Website
{
    public interface IOrderService
    {
        List<WebsiteOrderModel> GetOrders_Data(SearchFilterModel model, int? OrderId = null);
        List<WebsiteOrderItemModel> GetOrder_Items(int OrderId);
        List<FilterModel> GetOrders_Filters(SearchFilterModel PagingFilter);
        WebsiteOrderModel GetOrderDetailsById(int OrderId);
        ActionsResponseModel CreateNewOrder(string UserId, CreateOrderModel model);
        ActionsResponseModel EditOrder(int OrderId, WebsiteOrderModel model);
        ActionsResponseModel CancelOrder(int OrderId);

    }
}
