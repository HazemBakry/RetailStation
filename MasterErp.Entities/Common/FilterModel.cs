using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Entities.Common
{
    public class SearchFilterModel
    {
        public DateTime? FromDate { get; set; }
        public DateTime? ToDate { get; set; }
        public int? BranchID { get; set; }
        public string UserName { get; set; }
        public int CurrentPage { get; set; }
        public int PageSize { get; set; }
        public string SearchText { get; set; }
        public string SearchType { get; set; }
        public string SearchLevel { get; set; }
        public bool? HideEmptyAccounts { get; set; }
        public bool IsExport { get; set; }
        public List<FilterItem> FilterItems { get; set; }

    }

    public class FilterModel
    {
        public int CurrentPage { get; set; }
        public int PageSize { get; set; }
        public string CategoryDisplayName { get; set; }
        public List<FilterItem> FilterItems { get; set; }
    }

    public class FilterItem
    {
        public string CategoryDisplayName { get; set; }
        public string CategoryName { get; set; }
        public string ItemKey { get; set; }
        public string ItemFlag { get; set; }
        public string ItemValue { get; set; }
        public bool IsChecked { get; set; }
        public FilterItem()
        {
            IsChecked = false;
        }
    }
}
