using RetailStation.Entities.Common;
using RetailStation.Entities.DTOs.Auth;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using System;
using RetailStation.Interface.Auth;
using System.Linq;
using RetailStation.Interface.Users;
using RetailStation.Entities.DTOs.Subscription;
using RetailStation.Interfaces.Subscription;
using RetailStation.Entities.DTOs.Lookups;
using Entities.DTOs.Auth;

namespace RetailStation.API.Controllers.AccountManager
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class AccountManagerController : ControllerBase
    {
        private readonly ISubscribersService _subscribersService;

        private readonly IAuthService _authService;
        private readonly IUsersService _usersService;
        public AccountManagerController(IAuthService authService, IUsersService usersService, ISubscribersService subscribersService)
        {
            _authService = authService;
            _usersService = usersService;
            _subscribersService = subscribersService;
        }
        [HttpPost]
        [Route("EditSubscriber")]
        public async Task<IActionResult> EditSubscriber( [FromForm] SubscriberDto model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            string SubscriberId = User.Claims.FirstOrDefault(c => c.Type == "SubscriberId")?.Value;
            if (string.IsNullOrEmpty(SubscriberId))
                return BadRequest("can't find SubscriberId");
            var result = await _subscribersService.EditSubscriber(SubscriberId,model);
            return Ok(result);
        }
        [HttpGet("GetMySubscriberData")]
        public IActionResult GetSubscriberById()
        {
            string SubscriberId = User.Claims.FirstOrDefault(c => c.Type == "SubscriberId")?.Value;
            if (string.IsNullOrEmpty(SubscriberId))
                return BadRequest("can't find SubscriberId");
            var data = _subscribersService.GetSubscriberById(SubscriberId);

            return Ok(data);
        }
        [HttpPost("AddUser")]
        public async Task<IActionResult> AddNewUserAsync([FromForm] AddUserModel model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                var result = await _usersService.AddNewUserAsync(model);
                return Ok(result);
            }
            catch (Exception ex)
            {

                return BadRequest(ex?.Message);
            }

        }
        [HttpPost("EditUser")]
        public async Task<IActionResult> EditUser(string UserId,[FromForm] AddUserModel model)
        {
            if (!ModelState.IsValid || string.IsNullOrEmpty(model.UserId))
                return BadRequest(ModelState);

            try
            {
                var result = await _usersService.EditUserAsync(UserId, model);
                return Ok(result);
            }
            catch (Exception ex)
            {

                return BadRequest(ex?.Message);
            }


        }

        [Authorize]
        [HttpPost("GetUsers")]
        public async Task<IActionResult> GetUsers([FromBody] SearchFilterModel model)
        {
            string SubscriberId = User.Claims.FirstOrDefault(c => c.Type == "SubscriberId")?.Value;
            if (string.IsNullOrEmpty(SubscriberId))
                return BadRequest("can't find SubscriberId");

            var users = await _usersService.GetUsersAsync(model);
            var result = new PagedResponseModel<UserDto>
            {
                Results = users,
                TotalCount = users.FirstOrDefault()?.TotalCount ?? 0,


            };
            return Ok(result);

        }
        [HttpPost("GetUserById")]
        public async Task<IActionResult> GetUserById( string userId)
        {
            string SubscriberId = User.Claims.FirstOrDefault(c => c.Type == "SubscriberId")?.Value;
            if (string.IsNullOrEmpty(SubscriberId))
                return BadRequest("can't find SubscriberId");

            var user = await _usersService.GetUserByIdAsync(userId);
            if (user == null)
                return NotFound();
            return Ok(user);

        }

        [HttpPost("GetRoles")]
        public async Task<IActionResult> GetRoles([FromBody] SearchFilterModel model)
        {
            string SubscriberId = User.Claims.FirstOrDefault(c => c.Type == "SubscriberId")?.Value;
            if (string.IsNullOrEmpty(SubscriberId))
                return BadRequest("can't find SubscriberId");
            var roles = await _authService.GetRolesAsync(model);
            var result = new PagedResponseModel<RoleDto>
            {
                Results = roles,
                TotalCount = roles.FirstOrDefault()?.TotalCount ?? 0,

            };
            return Ok(result);

        }
        [HttpPost("AssignUserRole")]
        public async Task<IActionResult> AssignUserRoleAsync(string UserId,[FromBody] AddUserRoleModel model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            string SubscriberId = User.Claims.FirstOrDefault(c => c.Type == "SubscriberId")?.Value;
            if (string.IsNullOrEmpty(SubscriberId))
                return BadRequest("can't find SubscriberId");

            var result = await _usersService.AssignUserRoleAsync(UserId, model);

            return Ok(result);

        }
        [HttpGet("AddNewRole")]
        public async Task<IActionResult> AddNewRole(string Role)
        {
            string SubscriberId = User.Claims.FirstOrDefault(c => c.Type == "SubscriberId")?.Value;
            if (string.IsNullOrEmpty(SubscriberId))
                return BadRequest("can't find SubscriberId");

            var result = await _authService.AddRoleAsync(Role);

            return Ok(result);
        }
        [HttpGet("DeleteUser")]
        public async Task<IActionResult> DeleteUser(string userId)
        {
            string SubscriberId = User.Claims.FirstOrDefault(c => c.Type == "SubscriberId")?.Value;
            if (string.IsNullOrEmpty(SubscriberId))
                return BadRequest("can't find SubscriberId");
            var result = await _usersService.DeleteUserAsync(userId);
            if (result is null)
            {
                return BadRequest("user not found");
            }
            return Ok(result);
        }
    }
}
