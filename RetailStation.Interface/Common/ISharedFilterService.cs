using MasterErp.Entities.Common;
using System.Collections.Generic;
using System.Data;

namespace MasterErp.Interface.Common
{
    public interface ISharedFilterService
    {
        List<FilterModel> GroupedFilter(DataTable dt);
        List<FilterModel> GroupedFilterItems(List<FilterItem> Filters);
        DataTable MapFilterModelToDataTable(List<FilterItem> Items);

    }
}
