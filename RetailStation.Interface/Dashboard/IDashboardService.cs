using RetailStation.Entities.Common;
using RetailStation.Entities.DTOs.Operation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RetailStation.Interface.Dashboard
{
    public interface IDashboardService
    {
        List<SupplierItemModel> GetDashboardItems_Data(SearchFilterModel FilterModel);
        List<FilterModel> GetDashboardItems_Filters(SearchFilterModel FilterModel);
        SupplierItemModel GetDashboardItemDetailsById(int SupplierItemId);

    }
}
