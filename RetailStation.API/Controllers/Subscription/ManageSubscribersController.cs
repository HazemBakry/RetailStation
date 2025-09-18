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
using RetailStation.Interface.Branches;
using RetailStation.Entities.Models.Subscription;
using RetailStation.Entities.DTOs.Lookups;
using Entities.DTOs.Auth;
using RetailStation.Entities.DTOs.Website;

namespace RetailStation.API.Controllers.Subscription
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class ManageSubscribersController : ControllerBase
    {
        private readonly ISubscribersService _subscribersService;
        private readonly IAuthService _authService;
        private readonly IBranchesService _branchesService;
        private readonly IUsersService _usersService;
        public ManageSubscribersController(ISubscribersService subscribersService, IAuthService authService, IUsersService usersService, IBranchesService branchesService)
        {
            _subscribersService = subscribersService;
            _authService = authService;
            _usersService = usersService;
            _branchesService = branchesService;
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

            var result = await _subscribersService.EditSubscriber(SubscriberId, model);
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
        public IActionResult EditSubscriberApplications(string SubscriberId, List<SubscriberApplicationDto> ApplicationList)
        {
            var data = _subscribersService.EditSubscriberApplications(SubscriberId, ApplicationList);
            return Ok(data);
        }


        [HttpPost("GetSubscriberUsers")]
        public IActionResult GetUsersForSubscriber(SearchFilterModel Model, string SubscriberId)
        {
            var data = _usersService.GetUsers(SubscriberId,Model);
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
        public async Task<IActionResult> GetUsers(string SubscriberId,[FromBody] SearchFilterModel Model)
        {
            var users = await _usersService.GetUsersAsync(SubscriberId, Model);
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
        public async Task<IActionResult> GetUserById(string SubscriberId, string userId)
        {

            var user = await _usersService.GetUserByIdAsync(SubscriberId, userId);
            if (user == null)
                return NotFound();
            return Ok(user);

        }
        [HttpPost("AddUser")]
        public async Task<IActionResult> AddNewUserAsync(string SubscriberId,[FromForm] AddUserModel model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            model.SubscriberId = SubscriberId;
            try
            {
                var result = await _usersService.AddNewUserAsync(SubscriberId,model);
                return Ok(result);
            }
            catch (Exception ex)
            {

                return BadRequest(ex?.Message);
            }

        }
        [HttpPost("EditUser")]
        public async Task<IActionResult> EditUser(string SubscriberId,string UserId, [FromForm] AddUserModel model)
        {

            if (!ModelState.IsValid || string.IsNullOrEmpty(model.UserId))
                return BadRequest(ModelState);
            model.SubscriberId = SubscriberId;
            try
            {
                var result = await _usersService.EditUserAsync(SubscriberId, model);
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
        public async Task<IActionResult> AssignUserRoleAsync(string SubscriberId, string UserId,[FromBody] AddUserRoleModel model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            var result = await _usersService.AssignUserRoleAsync(SubscriberId, UserId, model);

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
            var result = await _usersService.DeleteUserAsync(SubscriberId, userId);
            if (result is null)
            {
                return BadRequest("user not found");
            }
            return Ok(result);
        }
        #endregion

        #region Branches
        [HttpPost("GetBranches")]
        public IActionResult GetBranchs(string SubscriberId, [FromBody] SearchFilterModel Model)
        {
            var branches =  _branchesService.GetBranches(SubscriberId, Model);
            var result = new PagedResponseModel<BranchDto>
            {
                Results = branches,
                TotalCount = branches.FirstOrDefault()?.TotalCount ?? 0,
                PageSize = Model.PageSize,
                CurrentPage = Model.CurrentPage

            };
            return Ok(result);

        }
        [HttpPost("GetBranchById")]
        public IActionResult GetBranchById(string SubscriberId, int BranchId)
        {

            var Branch =  _branchesService.GetBranchById(SubscriberId, BranchId);
            if (Branch == null)
                return NotFound();
            return Ok(Branch);

        }
        [HttpPost("AddBranch")]
        public IActionResult AddNewBranch(string SubscriberId, [FromForm] BranchDto model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            string UserId = User.Claims.FirstOrDefault(c => c.Type == "UserId")?.Value;
            model.SubscriberId = SubscriberId;
            model.CreatedBy = UserId;
            try
            {
                var result =  _branchesService.AddNewBranch(SubscriberId, model);
                return Ok(result);
            }
            catch (Exception ex)
            {

                return BadRequest(ex?.Message);
            }

        }
        [HttpPost("EditBranch")]
        public IActionResult EditBranch(string SubscriberId, int BranchId, [FromForm] BranchDto model)
        {

            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            string UserId = User.Claims.FirstOrDefault(c => c.Type == "UserId")?.Value;
            model.SubscriberId = SubscriberId;
            model.ModifiedBy = UserId; 
            try
            {
                var result = _branchesService.EditBranch(SubscriberId,BranchId, model);
                return Ok(result);
            }
            catch (Exception ex)
            {

                return BadRequest(ex?.Message);
            }


        }

        
        [HttpGet("DeleteBranch")]
        public IActionResult DeleteBranch(string SubscriberId,int BranchId)
        {
            var result = _branchesService.DeleteBranch(SubscriberId, BranchId);
            if (result is null)
            {
                return BadRequest("branch not found");
            }
            return Ok(result);
        }
        #endregion


        #region SubscribeRequests

        [HttpPost]
        [Route("EditSubscribeRequest")]
        public IActionResult EditSubscribeRequest(string SubscribeRequestId, [FromForm] SubscribeRequestModel model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var result = _subscribersService.EditSubscribeRequest(SubscribeRequestId, model);
            return Ok(result);
        }

        [HttpGet]
        [Route("DeleteSubscribeRequest")]
        public IActionResult DeleteSubscribeRequest(string SubscribeRequestId)
        {
            var result = _subscribersService.DeleteSubscribeRequest(SubscribeRequestId);
            return Ok(result);
        }

        [HttpPost("GetSubscribeRequests_Data")]
        public IActionResult GetSubscribeRequests_Data(SearchFilterModel Model)
        {
            var data = _subscribersService.GetSubscribeRequests_Data(Model);
            var result = new PagedResponseModel<SubscribeRequestModel>
            {
                Results = data,
                TotalCount = data.FirstOrDefault()?.TotalCount ?? 0,
                PageSize = Model.PageSize,
                CurrentPage = Model.CurrentPage
            };
            return Ok(result);
        }
        [HttpPost]
        [Route("ApproveSubscribeRequest")]
        public IActionResult ApproveSubscribeRequest(string SubscribeRequestId, SubscriberRegistrationModel model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            var result = _subscribersService.ApproveSubscribeRequest(SubscribeRequestId, model);
            return Ok(result);
        }
        #endregion
    }
}
