using RetailStation.Entities.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RetailStation.Entities.DTOs.HR
{
    public class EmployeeStatusModel : CreatorModel
    {
        public int? EmployeeStatusId { get; set; }
        public string StatusNameEN { get; set; }
        public string StatusNameAR { get; set; }
        public string Notes { get; set; }
        public bool? IsActive { get; set; }
        public int? TotalCount { get; set; }
    }
}
