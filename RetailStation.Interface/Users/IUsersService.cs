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
        Task<List<UserDto>> GetUsersAsync(string SubscriberId, SearchFilterModel model);
        List<UserDto> GetUsers(string SubscriberId, SearchFilterModel model);
        Task<UserDto> GetUserByIdAsync(string SubscriberId, string userId);
        Task<ActionsResponseModel> AddNewUserAsync(string SubscriberId, AddUserModel model);
        Task<ActionsResponseModel> EditUserAsync(string SubscriberId, AddUserModel model);
        Task<ActionsResponseModel> AssignUserRoleAsync(string SubscriberId, string userId, AddUserRoleModel model);
        Task<ActionsResponseModel> DeleteUserAsync(string SubscriberId, string userId);

    }
}
