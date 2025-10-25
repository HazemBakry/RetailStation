using RetailStation.Entities.Models.Subscription;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RetailStation.Entities.Models.SystemAdmin
{
    public class Notification
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int ID { get; set; }
        public string Subject { get; set; }
        public string Content { get; set; }
        public bool isActive { get; set; }
        [ForeignKey("Status")]
        public int StatusID { get; set; }
        [MaxLength(128)]
        public string SubscriberId { get; set; }
        public virtual NotificationStatus Status { get; set; }

        public DateTime CreatedDate { get; private set; }
        public List<NotificationRecipient> Recipients { get; set; } = new();
    }

    public class UserNotificationDTO
    {
        public UserNotificationDTO(Notification userNotification)
        {

        }
        public int ID { get; set; }
        public string Subject { get; set; }
        public string Content { get; set; }
        public bool isActive { get; set; }
        public int StatusID { get; set; }
    }

    public class NotificationRecipient
    {
        public int NotificationRecipientId { get; set; }
        public int NotificationId { get; set; }
        public string SubscriberId { get; set; }
        public Notification Notification { get; set; }
        public SubscriberModel Subscriber { get; set; }
    }

    public class NotificationStatus
    {
        [Key]
        public int StatusID { get; set; }

        [Required, MaxLength(50)]
        public string Name { get; set; }
    }

    public class CreateNotificationDto
    {
        public int id { get; set; }
        public string title { get; set; }
        public string content { get; set; }
        public List<string> subscriberIds { get; set; }

    }

}
