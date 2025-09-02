using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RetailStation.Entities.Common.SQLTabeType
{
    public class FilterList_TableType 
    {

        public int? CategoryId { get; set; }
        public string CategoryName { get; set; }
        public string CategoryDisplayName { get; set; }
        public string ItemKey { get; set; }
        public string ItemFlag { get; set; }
        public string ItemValue { get; set; }
        public string ItemFrom { get; set; }
        public string ItemTo { get; set; }
        public int? DisplayOrder { get; set; }
    }
}
