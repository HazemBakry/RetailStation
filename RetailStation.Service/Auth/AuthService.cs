using Azure.Core;
using RetailStation.Entities.Common;
using RetailStation.Entities.DTOs.Auth;
using RetailStation.Entities.Models;
using RetailStation.Interface.Auth;
using RetailStation.Interface.Common;
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
using RetailStation.Interface.Shared;
using RetailStation.Entities.Models;
using RetailStation.Entities.Models.Auth;
using RetailStation.Entities.DTOs.Auth;
using RetailStation.Entities.Common.Enums;
using RetailStation.Entities.Models.Subscription;
using RetailStation.Entities.DTOs.Website;
using RetailStation.Entities.Models.Operation;
using ICU4N.Util;
using RetailStation.Entities.DTOs.Operation;
using static Azure.Core.HttpHeader;
using RetailStation.Interface.Operation;

namespace RetailStation.Service.Auth
{
    public class AuthService : IAuthService
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly JWT _jwt;
        private readonly IFileService _fileService;
        private readonly ISharedService _sharedService;
        private readonly ISuppliersService _supplierService;
        public readonly string UserImagesFolder;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly DBContext Context;

        public AuthService(UserManager<ApplicationUser> userManager, JWT jwt, RoleManager<IdentityRole> roleManager, IHttpContextAccessor httpContextAccessor, IFileService fileService, ISharedService sharedService, DBContext context, ISuppliersService supplierService)
        {
            _userManager = userManager;
            _jwt = jwt;
            _roleManager = roleManager;
            UserImagesFolder = "UserImages";
            _httpContextAccessor = httpContextAccessor;
            _fileService = fileService;
            _sharedService = sharedService;
            Context = context;
            _supplierService = supplierService;
        }


        public async Task<AuthModel> LoginAsync(LoginModel model)
        {
            var authModel = new AuthModel();
            ApplicationUser user = null;

            // Check if Email or Username is provided
            if (!string.IsNullOrEmpty(model.Email))
            {
                user = await _userManager.FindByEmailAsync(model.Email);
            }
            else if (!string.IsNullOrEmpty(model.Username))
            {
                user = await _userManager.FindByNameAsync(model.Username);
            }

            // If the user doesn't exist or password is incorrect
            if (user == null || !await _userManager.CheckPasswordAsync(user, model.Password))
            {
                authModel.Message = "Invalid email/username or password";
                return authModel;
            }

            authModel = await GetAuthModel(user);
            return authModel;
        }
        public async Task<ActionsResponseModel> RegisterAsync(SubscriberRegistrationModel model)
        {
            //if (model.SubscriberTypeId == SubscriberType.Customer)
            //{
            //    model.SubscriberName = string.Concat([model.FirstName, " ", model.LastName, " ", model.UserName]);
            //    model.SubscriberEmail = model.Email;
            //}
            //if (await Context.Subscribers.AnyAsync(t => t.SubscriberName == model.SubscriberName || t.Email == model.SubscriberEmail))
            //{
            //    if (await Context.Subscribers.AnyAsync(t => t.SubscriberName == model.SubscriberName))
            //        return new ActionsResponseModel { IsSuccess = false, Message = "Subscriber name already exists." };
            //    if (await Context.Subscribers.AnyAsync(t => t.Email == model.SubscriberEmail))
            //        return new ActionsResponseModel { IsSuccess = false, Message = "Email already exists." };
            //}

            if (await _userManager.Users.AnyAsync(u => u.Email == model.Email || u.UserName == model.UserName))
            {
                if (await _userManager.FindByNameAsync(model.UserName) is not null)
                    return new ActionsResponseModel { Message = "Username already exists.", IsSuccess = false };
                if (await _userManager.FindByEmailAsync(model.Email) is not null)
                    return new ActionsResponseModel { Message = "Email already exists.", IsSuccess = false };
            }
            if (string.IsNullOrEmpty(model.Password) || model.Password.Length < 4)
            {
                return new ActionsResponseModel
                {
                    IsSuccess = false,
                    Message = "Password is required with 4 char."
                };
            }

            // Create and save the new subscriber
            //var subscriber = new SubscriberModel
            //{
            //    SubscriberId = Guid.NewGuid().ToString(),
            //    SubscriberName = model.SubscriberName,
            //    Email = model.SubscriberEmail,
            //    DomainName = string.Empty,
            //    SubscriberTypeId = (SubscriberType)model.SubscriberTypeId,
            //    CreatedDate = DateTime.Now,
            //    IsActive = false,
            //    IsApproved = false
            //};
            //Context.Subscribers.Add(subscriber);
            //await Context.SaveChangesAsync();

            // Create and save the new user
            var user = new ApplicationUser
            {
                UserName = model.UserName,
                Email = model.Email,
                FirstName = model.FirstName,
                LastName = model.LastName,
                //SubscriberId = subscriber.SubscriberId,
                MerchantId = model.MerchantId,
                StartDate = DateTime.Now,
                EndDate = DateTime.Now.AddYears(1),
                IsActive = true
            };

            var result = await _userManager.CreateAsync(user, model.Password);
            if (!result.Succeeded)
            {
                var errors = string.Join(" , ", result.Errors.Select(e => e.Description));
                return new ActionsResponseModel { IsSuccess = false, Message = errors };
            }
            string defaultRole = "BasicUser";
            if(model.SubscriberTypeId == SubscriberType.Supplier)
            {
                //defaultRole = "SupplierAdmin";
                defaultRole = "Merchant";
                //var supplier = new SupplierDto
                //{
                //    Code = model.UserName,
                //    NameAR = model.SubscriberName,
                //    NameEN = model.SubscriberName,
                //    BeginningBalance = 0,
                //    BalanceType = string.Empty,
                //    SubscriberId = subscriber.SubscriberId,
                //};
                //_supplierService.AddNewSupplier(supplier);

            }
            else if(model.SubscriberTypeId == SubscriberType.Customer)
            {
                //defaultRole = "CustomerAdmin";                
                defaultRole = "Customer";
            }
            // Add user to the default role
            await AddAndAssignRoleAsync(user, defaultRole);

            return new ActionsResponseModel { IsSuccess = true, Message = "User created successfully!" };
        }
        public async Task<ActionsResponseModel> ChangePasswordAsync(ChangePasswordModel model)
        {
            var response = new ActionsResponseModel();
            ApplicationUser user = null;

            if (model.NewPassword != model.ConfirmNewPassword)
            {
                response.IsSuccess = false;
                response.Message = "Invalid password confirmation !";
                return response;
            }
            // Check if Email or Username is provided
            if (!string.IsNullOrEmpty(model.Email))
            {
                user = await _userManager.FindByEmailAsync(model.Email);
            }
            else if (!string.IsNullOrEmpty(model.Username))
            {
                user = await _userManager.FindByNameAsync(model.Username);
            }

            // If the user doesn't exist or password is incorrect
            if (user == null || !await _userManager.CheckPasswordAsync(user, model.OldPassword))
            {
                response.IsSuccess = false;
                response.Message = "Invalid email/username or password";
                return response;
            }
            var result = await _userManager.ChangePasswordAsync(user, model.OldPassword, model.NewPassword);
            if (!result.Succeeded)
            {
                var errors = string.Empty;
                foreach (var error in result.Errors)
                {
                    errors += $"{error.Description} , ";
                }
                response.IsSuccess = false;
                response.Message = errors;
                return response;
            }
            response.Message = "Password Changed Successuful";
            return response;
        }

        public async Task<AuthModel> GetLoggedInUserAsync(string UserId)
        {
            var authModel = new AuthModel();

            var user = await _userManager.FindByIdAsync(UserId);
            if (user == null)
            {
                authModel.Message = "user not found";
                return authModel;
            }

            authModel = await GetAuthModel(user);

            return authModel;
        }
        private async Task<AuthModel> GetAuthModel(ApplicationUser user)
        {
            var authModel = new AuthModel();

            if (user.SubscriberId is not null)
            {
                var subscriber = Context.Subscribers.FirstOrDefault(x => x.SubscriberId == user.SubscriberId);
                var supplier = Context.Suppliers.FirstOrDefault(x => x.SubscriberId == user.SubscriberId);
                authModel.SubscriberName = subscriber?.SubscriberName;
                authModel.SupplierId = supplier?.SupplierId;
                user.SupplierId = authModel.SupplierId.GetValueOrDefault();
            }
            // Generate JWT Token
            var jwtSecurityToken = await CreateJwtToken(user);
            var roleList = await _userManager.GetRolesAsync(user);

            // Fill AuthModel with user info and token
            authModel.UserId = user.Id;
            authModel.Email = user.Email;
            authModel.PhoneNumber = user.PhoneNumber;
            authModel.FullName = $"{user.FirstName} {user.LastName}";
            authModel.IsAuthenticated = true;
            authModel.ExpireOn = jwtSecurityToken.ValidTo;
            authModel.Token = new JwtSecurityTokenHandler().WriteToken(jwtSecurityToken);
            authModel.UserName = user.UserName;
            authModel.SubscriberId = user.SubscriberId;
            authModel.Roles = roleList.ToList();
            authModel.BranchId = user.BranchId;
            authModel.ImageUrl = _fileService.GetFileDownloadUrl(user.ImageUrl);

            //var userBranch = _sharedService.GetBranchById(user.SubscriberId, user.BranchId);
            //if (userBranch is not null)
            //{
            //    authModel.BranchNameAR = userBranch.NameAR;
            //    authModel.BranchNameEN = userBranch.NameEN;
            //}
            


            return authModel;
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
            if (User.SubscriberId is not null)
            {
                var supplier = Context.Suppliers.FirstOrDefault(x => x.SubscriberId == User.SubscriberId);
                authModel.SupplierId = supplier?.SupplierId;
                User.SupplierId = authModel.SupplierId.GetValueOrDefault();
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
            authModel.SubscriberId = User.SubscriberId;
            authModel.ImageUrl = _fileService.GetFileDownloadUrl(User.ImageUrl);
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
            if (User.SubscriberId is not null)
            {
                var supplier = Context.Suppliers.FirstOrDefault(x => x.SubscriberId == User.SubscriberId);
                authModel.SupplierId = supplier?.SupplierId;
                User.SupplierId = authModel.SupplierId.GetValueOrDefault();
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
            authModel.SubscriberId = User.SubscriberId;
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
                new Claim("SubscriberId",user.SubscriberId),
                new Claim("BranchId",user.BranchId.ToString()),
                new Claim("SupplierId",user.SupplierId.ToString()),
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
        public async Task<List<RoleDto>> GetRolesAsync(SearchFilterModel model)
        {
            var Roles = await _roleManager.Roles.ToListAsync();

            return Roles.Select(r => new RoleDto
            {
                RoleId = r.Id,
                RoleName = r.Name,
                RoleNormalizedName = r.NormalizedName
            }).ToList();

        }

        public async Task<ActionsResponseModel> AddRoleAsync(string roleName)
        {
            if (await _roleManager.RoleExistsAsync(roleName))
            {
                return new ActionsResponseModel { Message = "Role already exists", IsSuccess = false };
            }

            var role = new IdentityRole(roleName);
            var result = await _roleManager.CreateAsync(role);

            return result.Succeeded ? new ActionsResponseModel { Message = "role added successfully" }
                                               : new ActionsResponseModel { Message = "can't add role", IsSuccess = false };
        }
        private async Task<bool> AddAndAssignRoleAsync(ApplicationUser user,string roleName)
        {
            var Succeeded = true;
            if (!await _roleManager.RoleExistsAsync(roleName))
            { 
                var role = new IdentityRole(roleName);
                var result = await _roleManager.CreateAsync(role);
                Succeeded = result.Succeeded;
            }

            if(Succeeded)
            {
                await _userManager.AddToRoleAsync(user, roleName);

            }
            return Succeeded;
        }


        public ActionsResponseModel ApplyMerchantRequest(MerchantRequestModel model)
        {
            try
            {

                Context.Add(new MerchantRequest
                {
                    MerchantRequestId = Guid.NewGuid().ToString(),
                    MerchantName = model.MerchantName,
                    Email = model.Email,
                    UserName = model.UserName,
                    CommercialRegister = model.CommercialRegister,
                    TaxNumber = model.TaxNumber,
                    BankAccountNumber = model.BankAccountNumber,
                    PhoneNumber = model.PhoneNumber,
                    Address = model.Address,
                    BrandName = model.BrandName,
                    MerchantTypeId = model.MerchantTypeId,
                    WorkflowStatusId = (int)WorkflowStatus.Pending
                });

                Context.SaveChanges();
                return new ActionsResponseModel
                {
                    Message = "تم حفظ البيانات بنجاح"
                };
            }
            catch (Exception ex)
            {
                return new ActionsResponseModel
                {
                    IsSuccess = false,
                    Message = ex.InnerException?.Message ?? ex.Message
                };
            }
        }
    }
}
