using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RetailStation.Entities.Models.SystemAdmin
{
    [Table("TotalValuePromotions", Schema = "dbo")]

    public class TotalValuePromotion : CreatorModel
    {
        public int TotalValuePromotionId { get; set; }

        public string Code { get; set; }

        public string Title { get; set; } = string.Empty;

        public string Description { get; set; }
        public string Image { get; set; } = string.Empty;
        public decimal DiscountValue { get; set; }
        public bool IsPercentage { get; set; } = false;
        public string ValueType { get; set; } = string.Empty; // Constraint: 'PERCENT' or 'FIXED_AMOUNT'
        public int? MaxUsesGlobal { get; set; }

        public int? MaxUsesPerCustomer { get; set; }
        public decimal? MinValue { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public bool IsActive { get; set; } = true;

    }
}
