using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using RetailStation.Entities.Common.Enums;

namespace RetailStation.Entities.Models.Subscription
{
    public class SubscriberModel
    {
        [Key]
        [Required]
        [MaxLength(128)]
        public string SubscriberId { get; set; }

        [MaxLength(50)]
        public string SubscriberName { get; set; }

        [MaxLength(50)]
        public string Email { get; set; }

        public Guid? ParentId { get; set; }

        public string DomainName { get; set; }
        public bool IsApproved { get; set; }
        public bool IsActive { get; set; } = true;
        public SubscriberType? SubscriberTypeId { get; set; }


        [Required]
        public bool IsSSO { get; set; }

        [Required]
        public bool IsDeleted { get; set; }

        [MaxLength(128)]
        public string CreatedBy { get; set; }

        public DateTime? CreatedDate { get; set; }

        [MaxLength(128)]
        public string ModifiedBy { get; set; }

        public DateTime? ModifiedDate { get; set; }

        public int? SubscriptionUsersType { get; set; }

        [Required]
        public bool SendNotificationMail { get; set; }
    }
}

