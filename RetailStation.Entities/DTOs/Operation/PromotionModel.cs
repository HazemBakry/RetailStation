using Microsoft.AspNetCore.Http;
using RetailStation.Entities.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RetailStation.Entities.DTOs.Operation
{
    public class PromotionModel :  MerchantItemModel
    {
        public int? PromotionId { get; set; }
        public int? MerchantId { get; set; }
        public int? MerchantItemId { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string ImageURL { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public decimal OfferPrice { get; set; }
        public decimal? MinQty { get; set; }
        public decimal? MaxQty { get; set; }
        public IFormFile ImageFile { get; set; }
        public bool IsAdminApproved { get; set; }


    }
}
