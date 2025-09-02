using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RetailStation.Entities.Models.Finance
{
    [Table("FinancialPeriods", Schema = "Finance")]

    public class FinancialPeriod : CreatorModel
    {
        public int FinancialPeriodId { get; set; }
        public string Code { get; set; }
        public string NameAR { get; set; }
        public string NameEN { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public bool IsLocked { get; set; }
        public bool IsActive { get; set; }
        public string Notes { get; set; }
    }
}
