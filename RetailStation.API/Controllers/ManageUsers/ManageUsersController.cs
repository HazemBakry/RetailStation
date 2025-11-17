using RetailStation.Entities.Common;
using RetailStation.Entities.DTOs.Auth;
using RetailStation.Interface.Auth;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using RetailStation.Entities.DTOs.Subscription;
using RetailStation.Interfaces.Subscription;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using RetailStation.Interface.Users;
using RetailStation.Entities.DTOs.Lookups;
using Entities.DTOs.Auth;
using RetailStation.Entities.DTOs.Website;
using RetailStation.Entities.Models.Subscription;

namespace RetailStation.API.Controllers.Subscription
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class ManageUsersController : ControllerBase
    {
        private readonly ISubscribersService _subscribersService;
        private readonly IAuthService _authService;
        private readonly IUsersService _usersService;
        public ManageUsersController(ISubscribersService subscribersService,
            IAuthService authService, IUsersService usersService)
        {
            _subscribersService = subscribersService;
            _authService = authService;
            _usersService = usersService;
        }


        [HttpPost]
        [Route("CreateNewSubscriber")]
        public async Task<IActionResult> CreateNewSubscriber([FromForm] SubscriberDto model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var result = await _subscribersService.CreateNewSubscriber(model);
            return Ok(result);
        }

        [HttpPost]
        [Route("EditSubscriber")]
        public async Task<IActionResult> EditSubscriber(string SubscriberId, [FromForm] SubscriberDto model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var result = await _subscribersService.EditSubscriber(SubscriberId,model);
            return Ok(result);
        }

        [HttpPost("GetAllSubscribers_Data")]
        public IActionResult GetAllSubscribers_Data(SearchFilterModel Model)
        {
            var data = _subscribersService.GetAllSubscribers_Data(Model);
            var result = new PagedResponseModel<SubscriberDto>
            {
                Results = data,
                TotalCount = data.FirstOrDefault()?.TotalCount ?? 0,
                PageSize = Model.PageSize,
                CurrentPage = Model.CurrentPage
            };
            return Ok(result);
        }
        [HttpGet("GetSubscriberById")]
        public IActionResult GetSubscriberById(string SubscriberId)
        {
            var data = _subscribersService.GetSubscriberById(SubscriberId);

            return Ok(data);
        }
        [HttpGet("GetSubscriberApplications")]
        public IActionResult GetSubscriberApplications(string SubscriberId)
        {
            var data = _subscribersService.GetSubscriberApplications(SubscriberId);
            return Ok(data);
        }
        [HttpPost("EditSubscriberApplications")]
        public IActionResult EditSubscriberApplications( List<SubscriberApplicationDto> ApplicationList)
        {
            var data = _subscribersService.EditSubscriberApplications("",ApplicationList);
            return Ok(data);
        }


        [HttpPost("GetSubscriberUsers")]
        public IActionResult GetUsersForSubscriber(SearchFilterModel Model, string SubscriberId)
        {
            var data = _usersService.GetUsers(Model);
            var result = new PagedResponseModel<UserDto>
            {
                Results = data,
                TotalCount = data.FirstOrDefault()?.TotalCount ?? 0,
                PageSize = Model.PageSize,
                CurrentPage = Model.CurrentPage
            };
            return Ok(result);
        }

        #region Users
        [HttpPost("GetUsers")]
        public async Task<IActionResult> GetUsers([FromBody] SearchFilterModel Model)
        {
            var users = await _usersService.GetUsersAsync(Model);
            var result = new PagedResponseModel<UserDto>
            {
                Results = users,
                TotalCount = users.FirstOrDefault()?.TotalCount ?? 0,
                PageSize = Model.PageSize,
                CurrentPage = Model.CurrentPage

            };
            return Ok(result);

        }
        [HttpPost("GetUserById")]
        public async Task<IActionResult> GetUserById( string userId)
        {

            var user = await _usersService.GetUserByIdAsync(userId);
            if (user == null)
                return NotFound();
            return Ok(user);

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
        public async Task<IActionResult> EditUser(string UserId, [FromForm] AddUserModel model)
        {

            if (!ModelState.IsValid || string.IsNullOrEmpty(model.UserId))
                return BadRequest(ModelState);
            try
            {
                var result = await _usersService.EditUserAsync(UserId,model);
                return Ok(result);
            }
            catch (Exception ex)
            {

                return BadRequest(ex?.Message);
            }


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
        public async Task<IActionResult> AssignUserRoleAsync( string UserId,[FromBody] AddUserRoleModel model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            var result = await _usersService.AssignUserRoleAsync(UserId, model);

            return Ok(result);

        }
        [HttpGet("AddNewRole")]
        public async Task<IActionResult> AddNewRole(string Role)
        {
            var result = await _authService.AddRoleAsync(Role);

            return Ok(result);
        }
        [HttpGet("DeleteUser")]
        public async Task<IActionResult> DeleteUser(string userId,string SubscriberId)
        {
            var result = await _usersService.DeleteUserAsync(userId);
            if (result is null)
            {
                return BadRequest("user not found");
            }
            return Ok(result);
        }
        #endregion

        #region MerchantRequests

        [HttpPost]
        [Route("EditMerchantRequest")]
        public IActionResult EditMerchantRequest(string MerchantRequestId, [FromForm] MerchantRequestModel model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var result = _subscribersService.EditMerchantRequest(MerchantRequestId, model);
            return Ok(result);
        }

        [HttpGet]
        [Route("DeleteMerchantRequest")]
        public IActionResult DeleteMerchantRequest(string MerchantRequestId)
        {
            var result = _subscribersService.DeleteMerchantRequest(MerchantRequestId);
            return Ok(result);
        }

        [HttpPost("GetMerchantRequests_Data")]
        public IActionResult GetMerchantRequests_Data(SearchFilterModel Model)
        {
            var data = _subscribersService.GetMerchantRequests_Data(Model);
            var result = new PagedResponseModel<MerchantRequestModel>
            {
                Results = data,
                TotalCount = data.FirstOrDefault()?.TotalCount ?? 0,
                PageSize = Model.PageSize,
                CurrentPage = Model.CurrentPage
            };
            return Ok(result);
        }
        [HttpPost]
        [Route("ApproveMerchantRequest")]
        public IActionResult ApproveMerchantRequest(string MerchantRequestId, MerchantRequestModel model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            var result = _subscribersService.ApproveMerchantRequest(MerchantRequestId, model);
            return Ok(result);
        }
        #endregion
    }
}
