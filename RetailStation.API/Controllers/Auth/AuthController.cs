using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using RetailStation.Interface.Auth;
using RetailStation.Entities.DTOs.Auth;
using Microsoft.AspNetCore.Authorization;
using System.Linq;
using RetailStation.Entities.DTOs.Website;

namespace RetailStation.API.Controllers.Auth
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("Login")]
        public async Task<IActionResult> LoginAsync([FromBody] LoginModel model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            var result = await _authService.LoginAsync(model);

            return Ok(result);

        }
        [HttpPost("Register")]
        public async Task<IActionResult> RegisterAsync([FromBody] SubscriberRegistrationModel model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            var result = await _authService.RegisterAsync(model);

            return Ok(result);

        }
        [HttpPost("ChangePassword")]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordModel model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            var result = await _authService.ChangePasswordAsync(model);

            return Ok(result);

        }
        [HttpGet("GetLoggedInUser")]
        [Authorize]
        public async Task<IActionResult> GetLoggedInUserAsync()
        {
            string UserId = User.Claims.FirstOrDefault(c => c.Type == "UserId")?.Value;
            if (string.IsNullOrEmpty(UserId))
                return BadRequest("can't find User");
            var result = await _authService.GetLoggedInUserAsync(UserId);

            return Ok(result);

        }

        [HttpGet("AddNewRole")]
        public async Task<IActionResult> AddNewRole(string Role)
        {
            var result = await _authService.AddRoleAsync(Role);

            return Ok(result);
        }


        [HttpPost("ApplyMerchantRequest")]
        public IActionResult ApplyMerchantRequest([FromBody] MerchantRequestModel model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            var result =  _authService.ApplyMerchantRequest(model);

            return Ok(result);

        }
    }

}
