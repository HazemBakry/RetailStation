using RetailStation.Entities.Common.Enums;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RetailStation.Entities.Models.Operation
{
    [Table("MerchantRequests", Schema = "Website")]

    public class MerchantRequest
    {
        [Key]
        [MaxLength(128)]
        public string MerchantRequestId { get; set; }
        [MaxLength(128)]
        public string MerchantId { get; set; }

        [MaxLength(50)]
        public string MerchantName { get; set; }

        [MaxLength(50)]
        public string Email { get; set; }
        [MaxLength(50)]
        public string PhoneNumber { get; set; }

        public SubscriberType? MerchantTypeId { get; set; }
        public int? WorkflowStatusId { get; set; }
        public DateTime RequestDate { get; set; } = DateTime.Now;
        public string CommercialRegister { get; set; }
        public string TaxNumber { get; set; }
        public string BankAccountNumber { get; set; }
        public string Address { get; set; }
        public string UserName { get; set; }
        public string BrandName { get; set; }
    }
}
