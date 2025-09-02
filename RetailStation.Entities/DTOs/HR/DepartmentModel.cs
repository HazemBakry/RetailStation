using RetailStation.Entities.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RetailStation.Entities.DTOs.HR
{
    public class DepartmentModel : CreatorModel
    {
        public int? DepartmentId { get; set; }
        public int? BranchId { get; set; }
        public string BranchNameAR { get; set; }
        public string BranchNameEN { get; set; }
        public string Code { get; set; }
        public string NameAR { get; set; }
        public string NameEN { get; set; }
        public string Location { get; set; }
        public bool? IsSystem { get; set; }
        public string Description { get; set; }
        public int? ManagerId { get; set; }

        public string ManagerNameAR { get; set; }
        public string ManagerNameEN { get; set; }
        public int? TotalCount { get; set; }

    }
}
