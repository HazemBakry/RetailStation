using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RetailStation.Entities.Models.Subscription
{
    public class ApplicationModel
    {
        [Key]
        [Required]
        [MaxLength(128)]
        public string ApplicationId { get; set; }

        [Required]
        [MaxLength(200)]
        public string ApplicationName { get; set; }

        [Required]
        [MaxLength(500)]
        public string ApplicationLogo { get; set; }

        [Required]
        [MaxLength(50)]
        public string ApplicationCode { get; set; }

        [MaxLength(500)]
        public string ApplicationUrl { get; set; }

        public int? DisplayOrder { get; set; }

        [Required]
        public bool IsDisplay { get; set; }

        [MaxLength(200)]
        public string RedirectUri { get; set; }

        [MaxLength(200)]
        public string LogoutRedirectUri { get; set; }

        [MaxLength(50)]
        public string ApplicationColour { get; set; }

        [MaxLength(50)]
        public string ApplicationStyle { get; set; }

        [Required]
        public bool IsSubscriber { get; set; }
    }
}
