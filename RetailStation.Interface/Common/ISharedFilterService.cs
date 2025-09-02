using RetailStation.Entities.Common;
using System.Collections.Generic;
using System.Data;

namespace RetailStation.Interface.Common
{
    public interface ISharedFilterService
    {
        List<FilterModel> GroupedFilter(DataTable dt);
        List<FilterModel> GroupedFilterItems(List<FilterItem> Filters);
        DataTable MapFilterModelToDataTable(List<FilterItem> Items);

    }
}
