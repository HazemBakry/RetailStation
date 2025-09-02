using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RetailStation.Entities.DTOs.Auth
{
    public class RoleDto
    {
        public string RoleId { get; set; }
        public string RoleName { get; set; }
        public string RoleNormalizedName { get; set; }
        public int? TotalCount { get; set; }
    }
}
