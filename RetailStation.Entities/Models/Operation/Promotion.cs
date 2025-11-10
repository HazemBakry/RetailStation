using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RetailStation.Entities.Models.Operation
{
    [Table("Promotions", Schema = "Operation")]

    public class Promotion : CreatorModel
    {
        public int PromotionId { get; set; }
        public int MerchantId { get; set; }
        public int MerchantItemId { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string Image { get; set; }
        public decimal OfferPrice { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public decimal? MinQty { get; set; }
        public decimal? MaxQty { get; set; }
        public bool IsActive { get; set; } = true;
        public bool IsAdminApproved { get; set; } = false;

    }
}
