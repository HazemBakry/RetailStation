using MasterErp.Entities.Common;
using MasterErp.Entities.DTOs.Auth;
using MasterErp.Entities.Models;
using MasterErp.Interface.Auth;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
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



        public AuthService(UserManager<ApplicationUser> userManager, JWT jwt, RoleManager<IdentityRole> roleManager)
        {
            _userManager = userManager;
            _jwt = jwt;
            _roleManager = roleManager;
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

        public async Task<AuthModel> LoginAsync(LoginModel model)
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
    }
}
