using RetailStation.Entities.Common;
using RetailStation.Entities.DTOs.Auth;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RetailStation.Interface.Auth
{
    public interface IAuthService
    {
        Task<ActionsResponseModel> Register(AddUserModel model);
        Task<ActionsResponseModel> EditUserAsync(AddUserModel model);
        Task<AuthModel> LoginByEmailAsync(LoginModel model);
        Task<AuthModel> LoginByUserNameAsync(LoginModel model);
        Task<ActionsResponseModel> AssignUserRoleAsync(AddUserRoleModel model);
        Task<List<RoleDto>> GetRolesAsync(SearchFilterModel model);
        Task<ActionsResponseModel> AddRoleAsync(string roleName);
        Task<List<UserDto>> GetUsersAsync(SearchFilterModel model);
        Task<UserDto> GetUserByIdAsync(string userId);
        Task<ActionsResponseModel> DeleteUserAsync(string userId);
    }
}
