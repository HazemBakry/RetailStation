using RetailStation.Entities.Common.Enums;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RetailStation.Entities.DTOs.Website
{
    public class MerchantRequestModel
    {
        public string MerchantRequestId { get; set; }
        public string MerchantId { get; set; }


        [MaxLength(50)]
        public string MerchantName { get; set; }

        [MaxLength(50)]
        public string Email { get; set; }
        [MaxLength(50)]
        public string PhoneNumber { get; set; }

        public SubscriberType? MerchantTypeId { get; set; }
        public int? WorkflowStatusId { get; set; }
        public string WorkflowStatusNameEN { get; set; }
        public string WorkflowStatusNameAR { get; set; }
        public string CommercialRegister { get; set; }
        public string TaxNumber { get; set; }
        public string BankAccountNumber { get; set; }
        public string Address { get; set; }
        public string UserName { get; set; }
        public string Password { get; set; }
        public string BrandName { get; set; }

        public DateTime RequestDate { get; set; } = DateTime.Now;
        public int? TotalCount { get; set; }
    }
}
