using MasterErp.Entities.Common;
using MasterErp.Entities.DTOs.Inventory;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Interface.Inventory
{
    public interface IInventoryReportsService
    {
        List<OrderDetailsDto> GetItemsPricesFollowUp_Data(DateTime FromDate, DateTime ToDate, SearchFilterModel model);
        List<FilterModel> GetItemsPricesFollowUp_Filters(DateTime FromDate, DateTime ToDate, SearchFilterModel model);
        ActionsResponseModel GetItemsPricesFollowUp_Export(DateTime FromDate, DateTime ToDate, SearchFilterModel model);

        List<OrderDetailsDto> GetReceivedItemsReport_Data(DateTime FromDate, DateTime ToDate, SearchFilterModel model);
        List<FilterModel> GetReceivedItemsReport_Filters(DateTime FromDate, DateTime ToDate, SearchFilterModel model);
        ActionsResponseModel GetReceivedItemsReport_Export(DateTime FromDate, DateTime ToDate, SearchFilterModel model);
        

    }
}
