using Microsoft.AspNetCore.Routing;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RetailStation.Entities.DTOs.Roles
{
    public class PagePermissionModel
    {
        public string ApplicationId { get; set; }
        public string ApplicationName { get; set; }
        public int? PageId { get; set; }
        public string PageName { get; set; }
        public string DisplayNameAR { get; set; }
        public string DisplayNameEN { get; set; }
        public int? ParentId { get; set; }
        public int? DisplayOrder { get; set; }
        public int? ActionId { get; set; }
        public int? PageActionId { get; set; }
        public bool? HasChild { get; set; }
        public bool? IsActive { get; set; }
        public bool? IsChecked { get; set; }
        public string Icon { get; set; }
        public string Route { get; set; }
        public string GroupName { get; set; }
        public string ActionName { get; set; }
        public bool? IsSelected { get; set; }
        public int? PageLevel { get; set; }
        public List<PagePermissionModel> SubPages { get; set; }
        public List<PageActionModel> Actions { get; set; }

    }

    public class PageActionModel
    {
        public int? ActionId { get; set; }
        public int? PageActionId { get; set; }
        public bool IsChecked { get; set; }
        public string ActionName { get; set; }

    }
}
