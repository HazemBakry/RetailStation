using RetailStation.Entities.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RetailStation.Entities.DTOs.Operation
{
    public class MerchantDeliveryRegionModel : CreatorModel
    {
        public int? MerchantDeliveryRegionId { get; set; }
        public int? MerchantId { get; set; }
        public int CountryId { get; set; }
        public int? CityId { get; set; }
        public int? RegionId { get; set; }
        public decimal Cost { get; set; }
        public int DeliveryTime { get; set; }
        public string DeliveryTimeUnit { get; set; }
        public bool IsActive { get; set; } = true;
        public string CountryNameAR { get; set; }
        public string CountryNameEN { get; set; }
        public string CityNameAR { get; set; }
        public string CityNameEN { get; set; }
        public string RegionNameAR { get; set; }
        public string RegionNameEN { get; set; }
        public int? TotalCount { get; set; }


    }
}
