using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Entities.DTOs.HR
{
    public class StatisticsCardSummary
    {
        public string Title { get; set; }
        public double Number { get; set; }
        public string Status { get; set; }
        public string StatusIcon { get; set; }
        public int Subscribers { get; set; }
        public string StatusBgClass { get; set; }
    }
}
