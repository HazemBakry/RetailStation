using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RetailStation.Entities.DTOs.Auth
{
    public class AuthModel
    {
        public string Message { get; set; }
        public bool IsAuthenticated { get; set; }
        public string UserName { get; set; }
        public string UserId { get; set; }
        public string FullName { get; set; }
        public int? BranchId { get; set; }
        public string BranchNameAR { get; set; }
        public string BranchNameEN { get; set; }
        public bool IsAdminBranch { get; set; } = false;
        public string PhoneNumber { get; set; }
        public string Email { get; set; }
        public string ImageUrl { get; set; }
        public string Token { get; set; }
        public string SubscriberId { get; set; }
        public string SubscriberName { get; set; }
        public DateTime ExpireOn { get; set; }
        public List<string> Roles { get; set; }
    }
}
