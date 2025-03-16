using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Entities.Common.Reports
{
    public class SearchReportModel
    {
        public string ControllerName { get; set; }
        public string ApiName { get; set; }
        public string MethodType { get; set; }
        public string CompanyName { get; set; }
        public string PageName { get; set; }
        public string SectionName { get; set; }
        public bool IsLandScape { get; set; }
        public List<FilterItem> FilterItems { get; set; }
    }
}
