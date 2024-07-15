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
        Task<AuthModel> LoginAsync(LoginModel model);
        Task<string> AddRoleAsync(AddRoleModel model);
    }
}
