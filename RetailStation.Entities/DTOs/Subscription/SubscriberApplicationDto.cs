using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RetailStation.Entities.DTOs.Subscription
{
    public class SubscriberApplicationDto
    {
        public int SubscriberApplicationId { get; set; }

        public string SubscriberId { get; set; }
        public string SubscriberName { get; set; }

        public string ApplicationId { get; set; }

        public DateTime? StartDate { get; set; }

        public DateTime? EndDate { get; set; }

        public int? SubscriberStatusId { get; set; }

        public int? SubscriberCategoryId { get; set; }

        public string ApplicationName { get; set; }

        public string ApplicationLogo { get; set; }

        public string ApplicationCode { get; set; }

        public string ApplicationUrl { get; set; }
        public string ApplicationColor { get; set; }
        public string ApplicationStyle { get; set; }

        public int? DisplayOrder { get; set; }

        public bool? IsDisplay { get; set; }
        public bool? IsActive { get; set; }

       
    }
}
