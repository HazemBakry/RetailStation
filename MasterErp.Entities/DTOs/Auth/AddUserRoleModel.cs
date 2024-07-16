using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Entities.DTOs.Auth
{
    public class AddUserRoleModel
    {
        public string UserId { get; set; }
        public List<RoleDto> Roles { get; set; }
    }
}
