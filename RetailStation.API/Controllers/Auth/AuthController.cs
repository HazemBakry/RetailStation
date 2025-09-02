using RetailStation.Entities.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using System;
using RetailStation.Interface.Auth;
using RetailStation.Entities.DTOs.Auth;
using Microsoft.AspNetCore.Authorization;
using RetailStation.Entities.Common;
using System.Linq;

namespace RetailStation.API.Controllers.Auth
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        //private readonly SignInManager<ApplicationUser> _signInManager;



        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }


        [HttpPost("AddUser")]
        public async Task<IActionResult> RegisterAsync([FromForm] AddUserModel model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            try
            {
                var result = await _authService.Register(model);
                return Ok(result);
            }
            catch (Exception ex)
            {

                return BadRequest(ex?.Message);
            }

        }
        [HttpPost("EditUser")]
        public async Task<IActionResult> EditUser([FromForm] AddUserModel model)
        {
            if (!ModelState.IsValid || string.IsNullOrEmpty(model.UserId))
                return BadRequest(ModelState);
            try
            {
                var result = await _authService.EditUserAsync(model);
                return Ok(result);
            }
            catch (Exception ex)
            {

                return BadRequest(ex?.Message);
            }


        }

        [HttpPost("Login")]
        public async Task<IActionResult> LoginAsync([FromBody] LoginModel model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            var result = await _authService.LoginByUserNameAsync(model);

            return Ok(result);

        }
        [HttpPost("GetUsers")]
        public async Task<IActionResult> GetUsers([FromBody] SearchFilterModel model)
        {
            var users = await _authService.GetUsersAsync(model);
            var result = new PagedResponseModel<UserDto>
            {
                Results = users,
                TotalCount = users.FirstOrDefault()?.TotalCount ?? 0,
                
                
            };
            return Ok(result);

        }
        [HttpPost("GetUserById")]
        public async Task<IActionResult> GetUserById(string userId)
        {
           
            var user = await _authService.GetUserByIdAsync(userId);
            if (user == null)
                return NotFound();
            return Ok(user);

        }

        [HttpPost("GetRoles")]
        public async Task<IActionResult> GetRoles([FromBody] SearchFilterModel model)
        {
            var roles = await _authService.GetRolesAsync(model);
            var result = new PagedResponseModel<RoleDto>
            {
                Results = roles,
                TotalCount = roles.FirstOrDefault()?.TotalCount ?? 0,

            };
            return Ok(result);

        }
        [HttpPost("AssignUserRole")]
        public async Task<IActionResult> AssignUserRoleAsync([FromBody] AddUserRoleModel model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            var result = await _authService.AssignUserRoleAsync(model);

            return Ok(result);

        }
        [HttpGet("AddNewRole")]
        public async Task<IActionResult> AddNewRole(string Role)
        {
            var result = await _authService.AddRoleAsync(Role);
            
            return Ok(result);
        }
        [HttpGet("DeleteUser")]
        public async Task<IActionResult> DeleteUser(string userId)
        {
            var result = await _authService.DeleteUserAsync(userId);
            if (result is null)
            {
                return BadRequest("user not found");
            }
            return Ok(result);
        }
    }
}
