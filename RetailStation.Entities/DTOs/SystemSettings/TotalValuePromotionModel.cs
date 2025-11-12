using Microsoft.AspNetCore.Http;
using RetailStation.Entities.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RetailStation.Entities.DTOs.SystemSettings
{
    public class TotalValuePromotionModel:CreatorModel
    {
        public int? TotalValuePromotionId { get; set; }
        public string Code { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; }

        public string ImageURL { get; set; }
        public IFormFile? Image { get; set; }

        public decimal DiscountValue { get; set; }
        public bool IsPercentage { get; set; }
        public string ValueType { get; set; } = string.Empty;

        public int? MaxUsesGlobal { get; set; }
        public int? MaxUsesPerCustomer { get; set; }

        public decimal? MinValue { get; set; }

        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public bool IsActive { get; set; }

        public int? TotalCount { get; set; }
    }
}
