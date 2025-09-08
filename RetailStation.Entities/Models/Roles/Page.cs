using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RetailStation.Entities.Models
{
    public class Page
    {
        public int PageId { get; set; }
        public string DisplayNameAR { get; set; }
        public string DisplayNameEN { get; set; }
        public string PageName { get; set; }
        public int? ParentId { get; set; }
        public string ParentName { get; set; }
        public bool? HasChild { get; set; }
        public string Icon { get; set; }
        public string Route { get; set; }
        public int DisplayOrder { get; set; }
        public string GroupName { get; set; }
        public bool IsActive { get; set; }
        public string ApplicationId { get; set; }


    }
}
