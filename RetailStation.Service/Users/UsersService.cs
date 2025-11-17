using RetailStation.Entities.Models.Auth;
using RetailStation.Entities.Common;
using RetailStation.Entities.DTOs.Auth;
using RetailStation.Interface.Auth;
using RetailStation.Interface.Common;
using RetailStation.Interface.Shared;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.Data;
using System.IdentityModel.Tokens.Jwt;
using System.IO;
using System.Linq;
using System.Linq.Expressions;
using System.Net.Http;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using RetailStation.Interface.Users;
using Microsoft.Extensions.Configuration;
using RetailStation.Entities.Models;
using Microsoft.Data.SqlClient;
using Entities.DTOs.Auth;
using static OpenQA.Selenium.BiDi.Modules.Script.EvaluateResult;
namespace RetailStation.Service.Users
{
    public class UsersService: IUsersService
    {

        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly IFileService _fileService;
        private readonly ISharedService _sharedService;
        public readonly string UserImagesFolder;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly ISQLHelper _sQLHelper;
        private readonly IConfiguration _configuration;
        private readonly DBContext Context;
        private readonly ISharedFilterService SharedFilterService;
        private readonly string ConnectionString;

        public UsersService(UserManager<ApplicationUser> userManager, 
            RoleManager<IdentityRole> roleManager,
            IHttpContextAccessor httpContextAccessor,
            IFileService fileService,
            ISharedService sharedService,
            ISQLHelper sQLHelper, IConfiguration configuration,
            ISharedFilterService sharedFilterService, DBContext context)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            UserImagesFolder = "UserImages";
            _httpContextAccessor = httpContextAccessor;
            _fileService = fileService;
            _sharedService = sharedService;
            _sQLHelper = sQLHelper;
            _configuration = configuration;
            ConnectionString = _configuration.GetConnectionString("DBConnection");
            SharedFilterService = sharedFilterService;
            Context = context;
        }



        public async Task<List<UserDto>> GetUsersAsync(SearchFilterModel model)
        {
            Expression<Func<ApplicationUser, bool>> criteria = c => (c.UserName.Contains(model.SearchText) || c.FirstName.Contains(model.SearchText) || string.IsNullOrEmpty(model.SearchText));

            int totalCount = await _userManager.Users.Where(criteria).CountAsync();

            var data = await _userManager.Users
                                            .Where(criteria)
                                            .Skip((model.CurrentPage - 1) * model.PageSize)
                                            .Take(model.PageSize).ToListAsync();
            var results = new List<UserDto>();
            foreach (var user in data)
            {
                var roles = await _userManager.GetRolesAsync(user);
                user.ImageUrl = _fileService.GetFileDownloadUrl(user.ImageUrl);
                results.Add(new UserDto
                {
                    FullName = $"{user.FirstName} {user.LastName}",
                    UserId = user.Id,
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    UserName = user.UserName,
                    Email = user.Email,
                    PhoneNumber = user.PhoneNumber,
                    ImageUrl = user.ImageUrl,
                    SubscriberId = user.SubscriberId,
                    Roles = roles.ToList(),
                    StartDate = user.StartDate,
                    EndDate = user.EndDate,
                    IsActive = user.IsActive ?? false,
                    TotalCount = totalCount
                });
            }
            return results;

        }
        public List<UserDto> GetUsers(SearchFilterModel Model)
        {
            var Params = new SqlParameter[4];
            Params[0] = new SqlParameter("@PageSize", Model.PageSize);
            Params[1] = new SqlParameter("@CurrentPage", Model.CurrentPage);
            Params[2] = new SqlParameter("@SearchText", Model.SearchText);
            Params[3] = new SqlParameter("@SubscriberId", DBNull.Value);
            var results = _sQLHelper.SQLQuery<UserDto>("dbo.SP_GetUsersForSubscriber", ConnectionString, Params);
            return results;
        }
        public async Task<UserDto> GetUserByIdAsync(string userId)
        {

            var user = await _userManager.Users.FirstOrDefaultAsync(u => u.Id == userId);

            if (user is not null)
            {
                var roles = await _userManager.GetRolesAsync(user);
                return new UserDto
                {
                    FullName = $"{user.FirstName} {user.LastName}",
                    UserId = user.Id,
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    UserName = user.UserName,
                    Email = user.Email,
                    PhoneNumber = user.PhoneNumber,
                    SubscriberId = user.SubscriberId,
                    StartDate = user.StartDate,
                    EndDate = user.EndDate,
                    IsActive = user.IsActive ?? false,
                    ImageUrl = _fileService.GetFileDownloadUrl(user.ImageUrl),
                    Roles = roles.ToList(),

                };
            }

            return null;
        }

        public async Task<ActionsResponseModel> AddNewUserAsync(AddUserModel model)
        {
            if (await _userManager.FindByEmailAsync(model.Email) is not null)
                return new ActionsResponseModel { Message = "Email already exists", IsSuccess = false };
            if (await _userManager.FindByNameAsync(model.UserName) is not null)
                return new ActionsResponseModel { Message = "UserName already exists", IsSuccess=false };
            //if (model.SubscriberId != null && await _userManager.Users.FirstOrDefaultAsync(x => x.SubscriberId == model.SubscriberId) is not null)
            //    return new ActionsResponseModel { Message = "employee already has account" };
            var User = new ApplicationUser
            {
                UserName = model.UserName,
                Email = model.Email,
                FirstName = model.FirstName,
                LastName = model.LastName,
                SubscriberId = model.SubscriberId,
                StartDate = model.StartDate,
                EndDate = model.EndDate,
                IsActive = model.IsActive,
            };
            if (model.Image != null)
            {
                var uploadResponse = await _fileService.UploadFileAsync(model.Image, UserImagesFolder, FileType.Image);
                if (uploadResponse.IsUploaded)
                    User.ImageUrl = uploadResponse.FilePath;
                else
                    return new ActionsResponseModel { Message = uploadResponse.Message, IsSuccess = false };


            }

            var result = await _userManager.CreateAsync(User, model.Password);
            if (!result.Succeeded)
            {
                var errors = string.Empty;
                foreach (var error in result.Errors)
                {
                    errors += $"{error.Description} , ";
                }
                return new ActionsResponseModel { Message = errors };
            }
            await _userManager.AddToRoleAsync(User, "User");
            //var jwtSecurityToken = await CreateJwtToken(User);
            //return new AuthModel
            //{
            //    Email = User.Email,
            //    IsAuthunticated = true,
            //    ExpireOn = jwtSecurityToken.ValidTo,
            //    Token = new JwtSecurityTokenHandler().WriteToken(jwtSecurityToken),
            //    UserName = User.UserName,
            //    Roles = new List<string> { "User" }
            //};
            return new ActionsResponseModel { Message = "user created successfully !" };


        }
        public async Task<ActionsResponseModel> EditUserAsync(string userId, AddUserModel model)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                return new ActionsResponseModel { Message = "user not found", IsSuccess = false };
            }
            if (await _userManager.FindByEmailAsync(model.Email) is not null && user.Id != userId)
                return new ActionsResponseModel { Message = "invalid email", IsSuccess = false };
            if (await _userManager.FindByNameAsync(model.UserName) is not null && user.Id != userId)
                return new ActionsResponseModel { Message = "invalid username", IsSuccess = false };
            //if (model.EmployeeId != null && await _userManager.Users.FirstOrDefaultAsync(x => x.EmployeeId == model.EmployeeId&&x.Id!=model.UserId) is not null)
            //    return new ActionsResponseModel { Message = "employee already has account", IsSuccess = false };
            user.FirstName = model.FirstName;
            user.LastName = model.LastName;
            user.UserName = model.UserName;
            user.Email = model.Email;
            user.PhoneNumber = model.PhoneNumber;
            user.SubscriberId = model.SubscriberId;
            user.StartDate = model.StartDate;
            user.EndDate = model.EndDate;
            user.IsActive = model.IsActive;
            if (model.Image != null)
            {
                var uploadResponse = await _fileService.UploadFileAsync(model.Image, UserImagesFolder, FileType.Image);
                if (uploadResponse.IsUploaded)
                {
                    user.ImageUrl = uploadResponse.FilePath;
                }
                else
                {
                    return new ActionsResponseModel { Message = uploadResponse.Message, IsSuccess = false };
                }

            }

            var result = await _userManager.UpdateAsync(user);

            return new ActionsResponseModel { Message = "user updated successfully !" };
        }

        public async Task<ActionsResponseModel> DeleteUserAsync(string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                return null;
            }


            var result = await _userManager.DeleteAsync(user);
            if (!result.Succeeded)
            {
                return new ActionsResponseModel { Message = "error", IsSuccess = false };
            }
            return new ActionsResponseModel { Message = "user deleted" };
        }

        public async Task<ActionsResponseModel> AssignUserRoleAsync(string userId, AddUserRoleModel model)
        {
            var user = await _userManager.FindByIdAsync(model.UserId);

            if (user == null)
            {
                return new ActionsResponseModel { Message = "Invalid User Id", IsSuccess = false };
            }

            var userRoles = await _userManager.GetRolesAsync(user);
            var rolesToAdd = model.Roles.Select(r => r.RoleName).Except(userRoles)
                    .Except(new[] { "SuperAdmin" }, StringComparer.OrdinalIgnoreCase);

            var rolesToRemove = userRoles.Except(model.Roles.Select(r => r.RoleName))
                    .Except(new[] { "SuperAdmin" }, StringComparer.OrdinalIgnoreCase);


            // Remove roles that are no longer assigned
            foreach (var role in rolesToRemove)
            {
                var removeResult = await _userManager.RemoveFromRoleAsync(user, role);
                if (!removeResult.Succeeded)
                {
                    return new ActionsResponseModel { Message = "Failed to remove roles", IsSuccess = false };
                }
            }

            // Add new roles
            foreach (var role in rolesToAdd)
            {
                if (!await _roleManager.RoleExistsAsync(role))
                {
                    return new ActionsResponseModel { Message = $"Invalid Role: {role}", IsSuccess = false };
                }

                var addResult = await _userManager.AddToRoleAsync(user, role);
                if (!addResult.Succeeded)
                {
                    return new ActionsResponseModel { Message = "Failed to add roles", IsSuccess = false };
                }
            }

            return new ActionsResponseModel { Message = "Roles assigned successfully", IsSuccess = true };
        }
    }
}
