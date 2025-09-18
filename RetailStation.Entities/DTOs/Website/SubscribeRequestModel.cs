using RetailStation.Entities.Common.Enums;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RetailStation.Entities.DTOs.Website
{
    public class SubscribeRequestModel
    {
        public string SubscribeRequestId { get; set; }
        public string SubscriberId { get; set; }


        [MaxLength(50)]
        public string SubscriberName { get; set; }

        [MaxLength(50)]
        public string Email { get; set; }
        [MaxLength(50)]
        public string PhoneNumber { get; set; }

        public SubscriberType? SubscriberTypeId { get; set; }
        public int? WorkflowStatusId { get; set; }
        public string WorkflowStatusNameEN { get; set; }
        public string WorkflowStatusNameAR { get; set; }

        public DateTime RequestDate { get; set; } = DateTime.Now;
        public int? TotalCount { get; set; }
    }
}
