using RetailStation.Entities.DTOs.Roles;
using RetailStation.Entities.Models.Auth;
using RetailStation.Interface.Roles;
using RetailStation.Interfaces.Subscription;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace RetailStation.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]

    public class RolesController : Controller
    {

        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IRolesService _rolesService;
        private readonly ISubscribersService _subscribersService;

        public RolesController(RoleManager<IdentityRole> roleManager, UserManager<ApplicationUser> userManager, IRolesService rolesService, ISubscribersService subscribersService)
        {
            _roleManager = roleManager;
            _userManager = userManager;
            _rolesService = rolesService;
            _subscribersService = subscribersService;
        }

        [HttpGet]
        [Route("GetUserAuthorizedPages")]
        public IActionResult GetUserAuthorizedPages()
        {
            string UserId = User.Claims.FirstOrDefault(c => c.Type == "UserId")?.Value;
            if (string.IsNullOrEmpty(UserId))
                return BadRequest("can't find User");
            var result = _rolesService.GetUserAuthorizedPages(UserId);
            return Ok(result);
        }
        [HttpGet]
        [Route("GetSubscriberRolePages")]
        public IActionResult GetSubscriberRolePages(string RoleId)
        {
            string SubscriberId = User.Claims.FirstOrDefault(c => c.Type == "SubscriberId")?.Value;
            if (string.IsNullOrEmpty(SubscriberId))
                return BadRequest("can't find subscriber");
            var result = _rolesService.GetSubscriberRolePages(SubscriberId, RoleId);
            return Ok(result);
        }
        [HttpPost]
        [Route("SaveSubscriberRolePages")]
        public IActionResult SaveSubscriberRolePages(string RoleId, List<int> PageActionIds)
        {
            string SubscriberId = User.Claims.FirstOrDefault(c => c.Type == "SubscriberId")?.Value;
            if (string.IsNullOrEmpty(SubscriberId))
                return BadRequest("can't find subscriber");
            var results = _rolesService.SaveSubscriberRolePages(SubscriberId, RoleId, PageActionIds);
            return Ok(results);
        }


        [HttpGet]
        [Route("GetUserRoles")]
        public async Task<List<IdentityRole>> GetUserRoles()
        {
            return await _roleManager.Roles.ToListAsync();
        }

        [HttpGet]
        [Route("AddRole")]
        public async Task<string> Add(string RoleName)
        {
            string Message = "";
            if (await _roleManager.RoleExistsAsync(RoleName))
            {
                await _roleManager.Roles.ToListAsync();
                Message = "Role Name Is Exist";
                return JsonConvert.SerializeObject(Message);
            }

            await _roleManager.CreateAsync(new IdentityRole(RoleName.Trim()));
            Message = "Add Role Success";
            return JsonConvert.SerializeObject(Message);
        }

        [HttpGet]
        [Route("GetRolesByUserId")]
        public async Task<IList<string>> GetRolesByUserId(string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);

            return await _userManager.GetRolesAsync(user);
        }

        [HttpGet]
        [Route("GetPermissionsByRole")]
        public List<PagePermissionModel> GetPermissionsByRole(string RoleName)
        {
            return _rolesService.GetPermissionsByRole(RoleName);
        }




        [HttpGet]
        [Route("GetMenuListByRoleName")]
        public DataTable GetMenuListByRoleName(string RoleName, string GroupName)
        {
            return _rolesService.GetSideMenuItemsByRole(RoleName, GroupName);
        }

        [HttpGet]
        [Route("CheckComponentPermission")]
        public bool CheckComponentPermission(string RoleName, string ComponentName)
        {
            return _rolesService.CheckComponentPermission(RoleName, ComponentName);
        }

        [HttpGet("GetUserApplications")]
        public IActionResult GetUserApplications()
        {
            string SubscriberId = User.Claims.FirstOrDefault(c => c.Type == "SubscriberId")?.Value;
            if (string.IsNullOrEmpty(SubscriberId))
                return BadRequest("can't find subscriber");
            var data = _subscribersService.GetSubscriberApplications(SubscriberId);
            return Ok(data);
        }
    }
}
