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
    [Table("SubscribeRequests", Schema = "Website")]

    public class SubscribeRequest
    {
        [Key]
        [MaxLength(128)]
        public string SubscribeRequestId { get; set; }
        [MaxLength(128)]
        public string SubscriberId { get; set; }

        [MaxLength(50)]
        public string SubscriberName { get; set; }

        [MaxLength(50)]
        public string Email { get; set; }
        [MaxLength(50)]
        public string PhoneNumber { get; set; }

        public SubscriberType? SubscriberTypeId { get; set; }
        public int? WorkflowStatusId { get; set; }
        public DateTime RequestDate { get; set; } = DateTime.Now;
    }
}
