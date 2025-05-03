using MasterErp.Entities.Common;
using MasterErp.Entities.Common.SQLTabeType;
using MasterErp.Interface.Common;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static NuGet.Packaging.PackagingConstants;

namespace MasterErp.Service.Common
{
    public class SharedFilterService : ISharedFilterService
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
        public List<FilterModel> GroupedFilterItems(List<FilterItem> Filters)
        {

            List<FilterModel> List = Filters.GroupBy(x => x.CategoryDisplayName)
            .Select(x => new FilterModel
            {
                CategoryDisplayName = x.Key,
                FilterItems = x.Select(s => new FilterItem
                {
                    CategoryDisplayName = x.Key,
                    CategoryName = s.CategoryName,
                    ItemValue = s.ItemValue,
                    ItemKey = s.ItemKey,
                    ItemFlag = s.ItemFlag
                }).ToList()
            }).ToList();
            return List;
        }
        public DataTable MapFilterModelToDataTable(List<FilterItem> Items)
        {
            //DataTable dt = new DataTable();
            //dt.Clear();
            //dt.Columns.Add("CategoryDisplayName");
            //dt.Columns.Add("CategoryName");
            //dt.Columns.Add("ItemKey");
            //dt.Columns.Add("ItemFlag");
            //dt.Columns.Add("ItemValue");

            //foreach (FilterItem item in Items)
            //{
            //    DataRow row = dt.NewRow();

            //    row["CategoryDisplayName"] = item.CategoryDisplayName;
            //    row["CategoryName"] = item.CategoryName;
            //    row["ItemKey"] = item.ItemKey;
            //    row["ItemFlag"] = item.ItemFlag;
            //    row["ItemValue"] = item.ItemValue;
            //    dt.Rows.Add(row);
            //}

            //return dt;

            return Items.Select(f => new FilterList_TableType
            {
                ItemKey = string.Empty,
                CategoryName = f.CategoryName,
                ItemFlag = f.ItemFlag,
                ItemValue = f.ItemValue,
                CategoryDisplayName = f.CategoryDisplayName,
                DisplayOrder = f.DisplayOrder
            }).ToList().ToDataTable();

        }
    }
}
