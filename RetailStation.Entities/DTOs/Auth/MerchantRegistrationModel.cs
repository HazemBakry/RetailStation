using RetailStation.Entities.Common.Enums;
using RetailStation.Entities.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RetailStation.Entities.DTOs.Auth
{
    public class MerchantRegistrationModel : CreatorModel
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string UserName { get; set; }
        public string Password { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        public SubscriberType MerchantTypeId { get; set; }
        public string Address { get; set; }

        public string MerchantName { get; set; }
        public string MerchantEmail { get; set; }
    }
}
