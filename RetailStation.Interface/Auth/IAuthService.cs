using RetailStation.Entities.DTOs.Auth;
using RetailStation.Entities.Common;
using RetailStation.Entities.DTOs.Auth;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using RetailStation.Entities.DTOs.Website;

namespace RetailStation.Interface.Auth
{
    public interface IAuthService
    {
        Task<AuthModel> LoginAsync(LoginModel model);
        Task<ActionsResponseModel> RegisterAsync(SubscriberRegistrationModel model);
        Task<ActionsResponseModel> ChangePasswordAsync(ChangePasswordModel model);
        Task<AuthModel> GetLoggedInUserAsync(string UserId);
        Task<AuthModel> LoginByEmailAsync(LoginModel model);
        Task<AuthModel> LoginByUserNameAsync(LoginModel model);
        Task<List<RoleDto>> GetRolesAsync(SearchFilterModel model);
        Task<ActionsResponseModel> AddRoleAsync(string roleName);

        ActionsResponseModel ApplyMerchantRequest(MerchantRequestModel model);
    }
}
