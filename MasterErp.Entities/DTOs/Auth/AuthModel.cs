using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Entities.DTOs.Auth
{
    public class AuthModel
    {
        public string Message { get; set; }
        public bool IsAuthenticated { get; set; }
        public string UserName { get; set; }
        public string UserId { get; set; }
        public string FullName { get; set; }
        public string BranchNameAr { get; set; }
        public string BranchNameEn { get; set; }
        public string PhoneNumber { get; set; }
        public string Email { get; set; }
        public string ImageUrl { get; set; }
        public string Token { get; set; }
        public int? EmployeeId { get; set; }
        public DateTime ExpireOn { get; set; }
        public string SubscriberId { get; set; }
        public List<string> Roles { get; set; }
    }
}
