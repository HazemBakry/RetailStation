using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RetailStation.Entities.Models
{
    public class ApplicationUser : IdentityUser
    {
        //[Required, MaxLength(50)]
        public string FirstName { get; set; }
        //[Required, MaxLength(50)]
        public string LastName { get; set; }
        public string FullName { get; set; }
        public string ImageUrl { get; set; }
        public int? EmployeeId { get; set; }
        public int? BranchId { get; set; }
        public string SubscriberId { get; set; }
    }
}
