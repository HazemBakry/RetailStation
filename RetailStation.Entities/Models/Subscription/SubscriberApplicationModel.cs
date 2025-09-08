using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RetailStation.Entities.Models.Subscription
{
    public class SubscriberApplicationModel
    {
        [Key]
        public int SubscriberApplicationId { get; set; }

        [Required]
        [MaxLength(128)]
        public string SubscriberId { get; set; }

        [Required]
        [MaxLength(128)]
        public string ApplicationId { get; set; }

        [Required]
        public DateTime StartDate { get; set; }

        [Required]
        public DateTime EndDate { get; set; }

        public int? SubscriberStatusId { get; set; }

        public int? SubscriberCategoryId { get; set; }
        public bool? IsActive { get; set; }
    }
}
