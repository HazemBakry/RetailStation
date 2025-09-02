using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RetailStation.Entities.Models.HR
{
    [Table("Departments", Schema = "HR")]

    public class Department : CreatorModel
    {
        public int? DepartmentId { get; set; }
        public int? BranchId { get; set; }
        public string Code { get; set; }
        public string NameAR { get; set; }
        public string NameEN { get; set; }
        public string Location { get; set; }
        public bool? IsSystem { get; set; }
        public string Description { get; set; }
        public int? ManagerId { get; set; }


    }
}
