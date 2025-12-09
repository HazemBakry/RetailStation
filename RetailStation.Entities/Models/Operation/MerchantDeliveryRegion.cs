using RetailStation.Entities.Models.SystemAdmin;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RetailStation.Entities.Models.Operation
{
    [Table("MerchantDeliveryRegions", Schema = "Operation")]
    public class MerchantDeliveryRegion:CreatorModel
    {
        [Key]
        public int MerchantDeliveryRegionId { get; set; }
        public int MerchantId { get; set; }
        public int CountryId { get; set; }
        public int? CityId { get; set; }
        public int? RegionId { get; set; }
        public decimal Cost { get; set; }
        public int DeliveryTime { get; set; }
        public string DeliveryTimeUnit { get; set; }
        public bool IsActive { get; set; } = true;

    }
}
