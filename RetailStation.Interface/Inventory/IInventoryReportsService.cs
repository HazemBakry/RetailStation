using RetailStation.Entities.Common;
using RetailStation.Entities.DTOs.Inventory;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RetailStation.Interface.Inventory
{
    public interface IInventoryReportsService
    {
        List<OrderReportModel> GetItemsPricesFollowUp_Data(DateTime? FromDate, DateTime? ToDate, SearchFilterModel model);
        List<FilterModel> GetItemsPricesFollowUp_Filters(DateTime? FromDate, DateTime? ToDate, SearchFilterModel model);
        ActionsResponseModel GetItemsPricesFollowUp_Export(DateTime? FromDate, DateTime? ToDate, SearchFilterModel model);
        // Received Items Summary Report
        List<OrderDetailsReportModel> GetReceivedItemsSummaryReport_Data(DateTime? FromDate, DateTime? ToDate, SearchFilterModel model);
        List<FilterModel> GetReceivedItemsSummaryReport_Filters(DateTime? FromDate, DateTime? ToDate, SearchFilterModel model);
        ActionsResponseModel GetReceivedItemsSummaryReport_Export(DateTime? FromDate, DateTime? ToDate, SearchFilterModel model);
        // Received Items Details Report
        List<OrderReportModel> GetReceivedItemsDetailsReport_Data(DateTime? FromDate, DateTime? ToDate, SearchFilterModel model);
        List<FilterModel> GetReceivedItemsDetailsReport_Filters(DateTime? FromDate, DateTime? ToDate, SearchFilterModel model);
        ActionsResponseModel GetReceivedItemsDetailsReport_Export(DateTime? FromDate, DateTime? ToDate, SearchFilterModel model);

        // Material Receipts Report
        List<OrderReportModel> GetMaterialReceiptsReport_Data(DateTime? FromDate, DateTime? ToDate, SearchFilterModel model);
        List<FilterModel> GetMaterialReceiptsReport_Filters(DateTime? FromDate, DateTime? ToDate, SearchFilterModel model);
        ActionsResponseModel GetMaterialReceiptsReport_Export(DateTime? FromDate, DateTime? ToDate, SearchFilterModel model);

    }
}
