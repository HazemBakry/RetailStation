using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RetailStation.Entities.Models.Purchases
{
    [Table("Suppliers", Schema = "Operation")]

    public class Supplier : CreatorModel
    {
        [Key]
        public int SupplierId { get; set; }
        public string Code { get; set; }
        public string NameAR { get; set; }
        public string NameEN { get; set; }
        public string Phone { get; set; }
        public string Mobile { get; set; }
        public int? CountryId { get; set; }
        public int? CityId { get; set; }
        public int? RegionId { get; set; }
        public string Address { get; set; }
        public string CommercialRegister { get; set; }
        public string TaxNumber { get; set; }
        public decimal? BeginningBalance { get; set; }
        public decimal? DeliveryCost { get; set; }
        public double? DeliveryTime { get; set; }
        public int? PaymentMethodId { get; set; }
        public string BalanceType { get; set; }
        public int? SupplierGroupId { get; set; }
        public string ContactPerson { get; set; }
        public string ContactMobile { get; set; }
        public string Notes { get; set; }
        public string SubscriberId { get; set; }
        public bool IsActive { get; set; }
    }
}
