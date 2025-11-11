using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RetailStation.Entities.DTOs.Operation
{
    public class OrderStatusStatisticModel
    {
        public int? Pending { get; set; }
        public int? Cancelled { get; set; }
        public int? Rejected { get; set; }
        public int? Approved { get; set; }
        public int? Completed { get; set; }
        public int? TotalCount { get; set; }
    }
}
