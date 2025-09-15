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
        ActionsResponseModel CreateNewOrder(WebsiteOrderModel model);
        ActionsResponseModel CancelOrder(int OrderId);
    }
}
