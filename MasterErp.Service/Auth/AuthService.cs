using MasterErp.Entities.Common;
using MasterErp.Entities.DTOs.Auth;
using MasterErp.Entities.Models;
using MasterErp.Interface.Auth;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.IO;
using System.Linq;
using System.Linq.Expressions;
using System.Net.Http;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Service.Auth
{
    public class AuthService : IAuthService
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly JWT _jwt;

        public readonly string UserImagesFolder;
        private readonly IHttpContextAccessor _httpContextAccessor;
        public AuthService(UserManager<ApplicationUser> userManager, JWT jwt, RoleManager<IdentityRole> roleManager, IHttpContextAccessor httpContextAccessor)
        {
            _userManager = userManager;
            _jwt = jwt;
            _roleManager = roleManager;
            UserImagesFolder = "UserImages";
            _httpContextAccessor = httpContextAccessor;
        }

        public async Task<ActionsResponseModel> Register(AddUserModel model)
        {
            if (await _userManager.FindByEmailAsync(model.Email) is not null)
                return new ActionsResponseModel { Message = "Email already registered" };
            if (await _userManager.FindByNameAsync(model.UserName) is not null)
                return new ActionsResponseModel { Message = "UserName already registered" };

            var User = new ApplicationUser
            {
                UserName = model.UserName,
                Email = model.Email,
                FirstName = model.FirstName,
                LastName = model.LastName
            };
            if (model.Image != null)
            {
                if (IsFileExtensionSupported(model.Image.FileName))
                    return new ActionsResponseModel { Message = "invalid image extention" };

                User.ImageUrl = await UploadUserImage(model.Image);
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
        public async Task<ActionsResponseModel> EditUserAsync(AddUserModel model)
        {
            var user = await _userManager.FindByIdAsync(model.UserId);
            if (user == null)
            {
                return new ActionsResponseModel { Message = "user not found" };
            }
            if (await _userManager.FindByEmailAsync(model.Email) is not null && user.Id!=model.UserId)
                return new ActionsResponseModel { Message = "invalid email" };
            if (await _userManager.FindByNameAsync(model.UserName) is not null && user.Id != model.UserId)
                return new ActionsResponseModel { Message = "invalid username" };
            user.FirstName = model.FirstName;
            user.LastName = model.LastName;
            user.UserName = model.UserName;
            user.Email = model.Email;
            user.PhoneNumber = model.PhoneNumber;

            if (model.Image != null)
            {
                if (IsFileExtensionSupported(model.Image.FileName))
                    return new ActionsResponseModel { Message = "invalid image extention" };

                user.ImageUrl =await UploadUserImage(model.Image);
            }
            var result = await _userManager.UpdateAsync(user);

            return new ActionsResponseModel { Message = "user updated successfully !" };
        }
        public async Task<AuthModel> LoginByEmailAsync(LoginModel model)
        {
            var authModel = new AuthModel();
            var User = await _userManager.FindByEmailAsync(model.Email);
            if (User is null || !await _userManager.CheckPasswordAsync(User, model.Password))
            {
                authModel.Message = "Invalid email or password";
                return authModel;
            }

            var jwtSecurityToken = await CreateJwtToken(User);
            var roleList = await _userManager.GetRolesAsync(User);

            authModel.UserId = User.Id;
            authModel.Email = User.Email;
            authModel.PhoneNumber = User.PhoneNumber;
            authModel.FullName = $"{User.FirstName} {User.LastName}";
            authModel.IsAuthenticated = true;
            authModel.ExpireOn = jwtSecurityToken.ValidTo;
            authModel.Token = new JwtSecurityTokenHandler().WriteToken(jwtSecurityToken);
            authModel.UserName = User.UserName;
            authModel.ImageUrl = GetImagePath(User.ImageUrl);
            authModel.Roles = roleList.ToList();

            return authModel;

        }
        public async Task<AuthModel> LoginByUserNameAsync(LoginModel model)
        {
            var authModel = new AuthModel();
            var User = await _userManager.FindByNameAsync(model.Username);
            if (User is null || !await _userManager.CheckPasswordAsync(User, model.Password))
            {
                authModel.Message = "Invalid email or password";
                return authModel;
            }

            var jwtSecurityToken = await CreateJwtToken(User);
            var roleList = await _userManager.GetRolesAsync(User);

            authModel.UserId = User.Id;
            authModel.Email = User.Email;
            authModel.PhoneNumber = User.PhoneNumber;
            authModel.FullName = $"{User.FirstName} {User.LastName}";
            authModel.IsAuthenticated = true;
            authModel.ExpireOn = jwtSecurityToken.ValidTo;
            authModel.Token = new JwtSecurityTokenHandler().WriteToken(jwtSecurityToken);
            authModel.UserName = User.UserName;
            authModel.Roles = roleList.ToList();

            return authModel;

        }
        public async Task<JwtSecurityToken> CreateJwtToken(ApplicationUser user)
        {
            var userClaims = await _userManager.GetClaimsAsync(user);
            var roles = await _userManager.GetRolesAsync(user);

            var roleClaims = new List<Claim>();
            foreach (var role in roles)
                roleClaims.Add(new Claim("roles", role));

            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub,user.UserName),
                new Claim(JwtRegisteredClaimNames.Jti,Guid.NewGuid().ToString()),
                new Claim(JwtRegisteredClaimNames.Email,user.Email),
                new Claim("UserId",user.Id),
            }.Union(userClaims).Union(roleClaims);

            var symmetricSecurityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwt.Key));
            var signinCredentials = new SigningCredentials(symmetricSecurityKey, SecurityAlgorithms.HmacSha256);
            var jwtSecurityToken = new JwtSecurityToken
            (
                issuer: _jwt.Issuer,
                audience: _jwt.Audience,
                claims: claims,
                expires: DateTime.Now.AddDays(_jwt.DurationInDays),
                signingCredentials: signinCredentials
            );

            return jwtSecurityToken;
        }

        public async Task<string> AddRoleAsync(AddRoleModel model)
        {
            var User = await _userManager.FindByIdAsync(model.UserId);

            if (User == null)
                return "Ivalid User Id";

            if (!await _roleManager.RoleExistsAsync(model.Role))
                return "Invalid Role";

            if (await _userManager.IsInRoleAsync(User, model.Role))
                return "User Assigned to this role";

            var result = await _userManager.AddToRoleAsync(User, model.Role);

            if (result.Succeeded)
                return string.Empty;
            return "wrong";
        }
        public async Task<List<UserDto>> GetUsersAsync(SearchFilterModel model)
        {
            Expression<Func<ApplicationUser, bool>> criteria = c => c.UserName.Contains(model.SearchText) || c.FirstName.Contains(model.SearchText) || string.IsNullOrEmpty(model.SearchText);

            int totalCount = await _userManager.Users.Where(criteria).CountAsync();

            var results = await _userManager.Users
                                            .Where(criteria)
                                            .Skip((model.CurrentPage - 1) * model.PageSize)
                                            .Take(model.PageSize)
                                            .Select(u => new UserDto
                                            {
                                                FullName = $"{u.FirstName} {u.LastName}",
                                                UserId = u.Id,
                                                FirstName = u.FirstName,
                                                LastName = u.LastName,
                                                UserName = u.UserName,
                                                Email = u.Email,
                                                PhoneNumber = u.PhoneNumber,
                                                ImageUrl=u.ImageUrl,
                                                TotalCount = totalCount
                                            })
                                            .ToListAsync();
            foreach (var user in results)
            {
                user.ImageUrl = GetImagePath(user.ImageUrl);
            }
            return results;

        }        
        public async Task<UserDto> GetUserByIdAsync(string userId)
        {

            var user = await _userManager.Users.FirstOrDefaultAsync(u => u.Id == userId);
                                            
            if (user is not null) {
                return new UserDto
                {
                    FullName = $"{user.FirstName} {user.LastName}",
                    UserId = user.Id,
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    UserName = user.UserName,
                    Email = user.Email,
                    PhoneNumber = user.PhoneNumber,
                    ImageUrl = GetImagePath(user.ImageUrl),
                };
            }

            return null;

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
                return new ActionsResponseModel { Message = "error" ,IsSuccess=false };
            }
            return  new ActionsResponseModel { Message = "user deleted" };
        }
        private bool IsFileExtensionSupported(string fileName)
        {
            var SupportedFileExtentions = new[] { "png", "jpg" };
            var fileExtension = Path.GetExtension(fileName);
            return SupportedFileExtentions.Contains(fileExtension, StringComparer.OrdinalIgnoreCase);
        }
        private async Task<string> UploadUserImage(IFormFile Image)
        {
            string imagePath = string.Empty;
            try
            {
                var uniqueFileName = Guid.NewGuid().ToString() + "_" + Image.FileName;
                imagePath = Path.Combine(UserImagesFolder, uniqueFileName);
                string filePath = Path.Combine("wwwroot", imagePath);
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await Image.CopyToAsync(stream);
                }
            }
            catch (Exception)
            {

                throw;
            }
            
            return imagePath;
        }

        private string GetImagePath(string FileName)
        {
            string URL=string.Empty;
            if (!string.IsNullOrEmpty(FileName))
            {
                var request = _httpContextAccessor.HttpContext.Request;
                URL = string.Format("{0}://{1}//{2}", request.Scheme, request.Host, FileName);
            }
            
            return URL;
        }
    }
}
