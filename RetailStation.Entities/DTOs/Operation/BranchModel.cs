using Microsoft.AspNetCore.Http;
using RetailStation.Entities.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RetailStation.Entities.DTOs.Operation
{
    public class BranchModel : CreatorModel
    {
        public int? BranchId { get; set; }
        public string NameAR { get; set; }
        public string NameEN { get; set; }
        public string Phone { get; set; }
        public string Address { get; set; }
        public int? RegionId { get; set; }
        public bool IsActive { get; set; } = true;
        public IFormFile Image { get; set; }
        public string ImageURL { get; set; }

        public TimeSpan? OpeningTimeFrom { get; set; }
        public TimeSpan? OpeningTimeTo { get; set; }

        public string WorkingTimeAR { get; set; }
        public string WorkingTimeEN { get; set; }
        public int MerchantId { get; set; }
        public int? TotalCount { get; set; }
    }
}
