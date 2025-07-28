using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Entities.Models.HR
{
    [Table("EmployeeStatus", Schema = "HR")]

    public class EmployeeStatus:CreatorModel
    {
        [Key]
        public int EmployeeStatusId { get; set; }
        public string StatusNameEN { get; set; }
        public string StatusNameAR { get; set; }
        public string Notes { get; set; }
        public bool? IsActive { get; set; }
    }
}

