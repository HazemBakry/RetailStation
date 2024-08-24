using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Entities.Common.SQLTabeType
{
    public class FilterList_TableType 
    {
        public string CategoryDisplayName { get; set; }
        public string CategoryName { get; set; }
        public string ItemKey { get; set; }
        public string ItemValue { get; set; }
        public int? DisplayOrder { get; set; }
    }
}
