using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Entities.Models.HR
{
    [Table("EmployeeCareers", Schema = "HR")]

    public class EmployeeCareer : CreatorModel
    {
        public int EmployeeCareerId { get; set; }
        public int EmployeeId { get; set; }
        public int JobId { get; set; }
        public int BranchId { get; set; }
        public int WorkStatusId { get; set; }
        public DateTime ExecutionDate { get; set; }
        public string Notes { get; set; }


    }
}
