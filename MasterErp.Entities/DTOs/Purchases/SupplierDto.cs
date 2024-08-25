using MasterErp.Entities.Common.Enums;
using MasterErp.Entities.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Entities.DTOs.Purchases
{
    public class SupplierDto :CreatorModel
    {
        public int? SupplierId { get; set; }
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
        public double? BeginningBalance { get; set; }
        public BalanceType? BalanceTypeId { get; set; }
        public string BalanceType { get; set; }
        public int? SupplierGroupId { get; set; }
        public string SupplierGroupName { get; set; }
        public string ContactPerson { get; set; }
        public string ContactMobile { get; set; }
        public string Notes { get; set; }
        public bool IsActive { get; set; }
        public int? TotalCount { get; set; }
    }
}
