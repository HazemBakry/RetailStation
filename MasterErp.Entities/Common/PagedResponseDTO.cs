using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Entities.Common
{
    public class PagedResponseDTO<T>
    {
        public bool Success { get; set; }
        public string Message { get; set; }
        public int PageNumber { get; set; }
        public int PageSize { get; set; }
        public int TotalCount { get; set; }
        public bool IsExport { get; set; }
        public int TotalPages => (int)Math.Ceiling((double)TotalCount / PageSize);
        public DateTime FromDate { get; set; }
        public DateTime ToDate { get; set; }
        public string CustomerId { get; set; }

        public List<T> Results { get; set; }
        public List<FilterItem> FilterList { get; set; }
    }
}
