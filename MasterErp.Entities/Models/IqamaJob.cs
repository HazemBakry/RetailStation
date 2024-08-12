using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Entities.Models
{
    [Table("IqamaJobs", Schema = "HR")]
    public class IqamaJob : CreatorModel
    {
        public int IqamaJobId { get; set; }
        public string NameAR { get; set; }
        public string NameEN { get; set; }
        public string Code { get; set; }
        public string Notes { get; set; }
    }
}
