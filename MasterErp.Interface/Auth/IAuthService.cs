using MasterErp.Entities.Common;
using MasterErp.Entities.DTOs.Auth;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Interface.Auth
{
    public interface IAuthService
    {
        Task<ActionsResponseModel> Register(AddUserModel model);
        Task<ActionsResponseModel> EditUserAsync(AddUserModel model);
        Task<AuthModel> LoginByEmailAsync(LoginModel model);
        Task<AuthModel> LoginByUserNameAsync(LoginModel model);
        Task<string> AddRoleAsync(AddRoleModel model);

        Task<List<UserDto>> GetUsersAsync(SearchFilterModel model);
        Task<UserDto> GetUserByIdAsync(string userId);
        Task<ActionsResponseModel> DeleteUserAsync(string userId);
    }
}
