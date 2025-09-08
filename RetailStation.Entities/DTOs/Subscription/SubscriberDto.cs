using RetailStation.Entities.Models;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using RetailStation.Entities.Common.Enums;

namespace RetailStation.Entities.DTOs.Subscription
{
    public class SubscriberDto : CreatorModel
    {
        public string SubscriberId { get; set; }
        public string SubscriberName { get; set; }
        public string Email { get; set; }
        public string ParentId { get; set; }
        public string DomainName { get; set; }
        public bool IsApproved { get; set; }
        public bool IsActive { get; set; } = true;
        public bool? IsSSO { get; set; }
        public bool? IsDeleted { get; set; }
        public int SubscriberTypeId { get; set; }
        public int? SubscriptionUsersType { get; set; }
        public bool? SendNotificationMail { get; set; }
        public int? TotalCount { get; set; }
        public List<IFormFile> SubscriberFiles { get; set; }

    }
}
