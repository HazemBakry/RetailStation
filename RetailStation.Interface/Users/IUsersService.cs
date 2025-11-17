using Entities.DTOs.Auth;
using RetailStation.Entities.Common;
using RetailStation.Entities.DTOs.Auth;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RetailStation.Interface.Users
{
    public interface IUsersService
    {
        Task<List<UserDto>> GetUsersAsync(SearchFilterModel model);
        List<UserDto> GetUsers(SearchFilterModel model);
        Task<UserDto> GetUserByIdAsync(string userId);
        Task<ActionsResponseModel> AddNewUserAsync(AddUserModel model);
        Task<ActionsResponseModel> EditUserAsync(string userId, AddUserModel model);
        Task<ActionsResponseModel> AssignUserRoleAsync(string userId, AddUserRoleModel model);
        Task<ActionsResponseModel> DeleteUserAsync(string userId);

    }
}
