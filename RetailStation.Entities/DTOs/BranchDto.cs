using RetailStation.Entities.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RetailStation.Entities.DTOs.Lookups
{
    public class BranchDto : CreatorModel
    {
        public int? BranchId { get; set; }
        public string SubscriberId { get; set; }
        public string Code { get; set; }
        public int? DisplayOrder { get; set; }
        public string NameAR { get; set; }
        public string NameEN { get; set; }
        public bool IsActive { get; set; }=false;
        public bool IsAdminBranch { get; set; } = false;
        public int? CityId { get; set; }
        public int? DrawingsCostCenterId { get; set; }
        public int? ExpensesCostCenterId { get; set; }
        public string Phone { get; set; }
        public string Email { get; set; }
        public string Fax { get; set; }
        public string Address { get; set; }
        public string Notes { get; set; }
        public int? TotalCount { get; set; }
    }
}
