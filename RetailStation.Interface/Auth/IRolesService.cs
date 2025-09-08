using RetailStation.Entities.DTOs.Roles;
using RetailStation.Entities.Common;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RetailStation.Interface.Roles
{
    public interface IRolesService
    {
        List<PagePermissionModel> GetUserAuthorizedPages(string UserId);

        List<ApplicationPageModel> GetSubscriberRolePages(string SubscriberId, string RoleId);
        List<PagePermissionModel> GetPermissionsByRole(string RoleName);
        ActionsResponseModel SaveSubscriberRolePages(string SubscriberId, string RoleId, List<int> PageActionIds);
        bool CheckComponentPermission(string RoleName, string ComponentName);
        DataTable GetSideMenuItemsByRole(string RoleName,string GroupName);
        List<CustomerApplicationModel> GetCustomerApplications(string CustomerId);
    }
}
