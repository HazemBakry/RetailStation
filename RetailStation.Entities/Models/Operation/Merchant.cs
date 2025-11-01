using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RetailStation.Entities.Models.Operation
{
    [Table("Merchants", Schema = "Operation")]

    public class Merchant : CreatorModel
    {
        [Key]
        public int MerchantId { get; set; }
        public string Code { get; set; }
        public string NameAR { get; set; }
        public string NameEN { get; set; }
        public string Phone { get; set; }
        public string Email { get; set; }
        public string Mobile { get; set; }
        public int? RegionId { get; set; }
        public string Address { get; set; }
        public string CommercialRegister { get; set; }
        public string TaxNumber { get; set; }
        public string BankAccountNumber { get; set; }
        public string BrandName { get; set; }
        public decimal? DeliveryCost { get; set; }
        public double? DeliveryTime { get; set; }
        public int? PaymentMethodId { get; set; }
        public decimal? Rate { get; set; }
        public string ContactPerson { get; set; }
        public string ContactMobile { get; set; }
        public string Notes { get; set; }
        public bool IsActive { get; set; }
    }
}
