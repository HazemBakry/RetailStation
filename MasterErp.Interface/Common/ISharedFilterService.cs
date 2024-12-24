using MasterErp.Entities.Common;
using System.Collections.Generic;
using System.Data;

namespace MasterErp.Interface.Common
{
    public interface ISharedFilterService
    {
        List<FilterModel> GroupedFilter(DataTable dt);
        DataTable MapFilterModelToDataTable(List<FilterItem> Items);

    }
}
