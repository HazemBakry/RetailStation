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
        public int? JobId { get; set; }
        public string NameAR { get; set; }
        public string NameEN { get; set; }
        public bool IsActive { get; set; }
        [NotMapped]
        public int? TotalCount { get; set; }
    }
}
