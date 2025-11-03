using Microsoft.AspNetCore.Http;
using RetailStation.Entities.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RetailStation.Entities.DTOs.Operation
{
    public class TopPartnerModel:CreatorModel
    {
        public int? TopPartnerId { get; set; }

        public string Name { get; set; }
        public string DisplayName { get; set; }
        public IFormFile Image { get; set; }
        public string ImageURL { get; set; }
        public string Description { get; set; }
        public bool IsActive { get; set; } = true;
        public int? DisplayOrder { get; set; }
        public int? TotalCount { get; set; }
    }
}
