using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Entities.Models.HR
{
    [Table("Jobs", Schema = "HR")]
    public class Job : CreatorModel
    {
        public int JobId { get; set; }
        public string Code { get; set; }
        public bool IsActive { get; set; }
        public string NameAR { get; set; }
        public string NameEN { get; set; }
        public string Notes { get; set; }
        [NotMapped]
        public int? TotalCount { get; set; }
        public int? TotalTime_Saturday { get; set; }
        public int? TotalTime_Sunday { get; set; }
        public int? TotalTime_Monday { get; set; }
        public int? TotalTime_Tuesday { get; set; }
        public int? TotalTime_Wednesday { get; set; }
        public int? TotalTime_Thursday { get; set; }
        public int? TotalTime_Friday { get; set; }
    }
}
