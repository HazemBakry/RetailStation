using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RetailStation.Entities.Models
{
    public class RolePermission
    {
        public int RolePermissionId { get; set; }
        public string RoleId { get; set; }
        public int PageActionId { get; set; }
        public string SubscriberId { get; set; }

    }
}
