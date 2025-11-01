using RetailStation.Entities.Common.Enums;
using RetailStation.Entities.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RetailStation.Entities.DTOs.Operation
{
    public class MerchantModel : CreatorModel
    {
        public int? MerchantId { get; set; }
        public string Code { get; set; }
        public string NameAR { get; set; }
        public string NameEN { get; set; }
        public string Phone { get; set; }
        public string Mobile { get; set; }
        public int? CountryId { get; set; }
        public string CountryName { get; set; }
        public int? CityId { get; set; }
        public string CityName { get; set; }
        public int? RegionId { get; set; }
        public string RegionName { get; set; }
        public string Address { get; set; }
        public string CommercialRegister { get; set; }
        public string TaxNumber { get; set; }
        public string BankAccountNumber { get; set; }
        public string BrandName { get; set; }
        public decimal? BeginningBalance { get; set; }
        public decimal? DeliveryCost { get; set; }
        public double? DeliveryTime { get; set; }
        public int? PaymentMethodId { get; set; }
        public string PaymentMethod { get; set; }
        public string ContactPerson { get; set; }
        public string ContactMobile { get; set; }
        public string Notes { get; set; }
        public bool IsActive { get; set; }
        public decimal? Rate { get; set; }
        public int? TotalCount { get; set; }
    }
}
