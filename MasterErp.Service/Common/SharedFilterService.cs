using MasterErp.Entities.Common;
using MasterErp.Interface.Common;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Service.Common
{
    public class SharedFilterService: ISharedFilterService
    {
        public List<FilterModel> GroupedFilter(DataTable dt)
        {
            List<FilterModel> List = dt.AsEnumerable().GroupBy(y => new
            {
                CategoryDisplayName = y.Field<string>("CategoryDisplayName"),
            }).Select(x => new FilterModel
            {
                CategoryDisplayName = x.Key.CategoryDisplayName,
                FilterItems = x.Select(s => new FilterItem
                {
                    CategoryDisplayName = s.Field<string>("CategoryDisplayName"),
                    CategoryName = s.Field<string>("CategoryName"),
                    ItemValue = s.Field<string>("ItemValue"),
                    ItemKey = s.Field<string>("ItemKey"),
                    ItemFlag = s.Field<string>("ItemFlag")
                }).ToList()
            }).ToList();
            return List;
        }
    }
}
