using Microsoft.AspNetCore.Mvc;
using RetailStation.Entities.Common;
using RetailStation.Entities.Models.SystemAdmin;
using RetailStation.Interface.SystemAdmin;
using System.Data;
using System.Threading.Tasks;

namespace RetailStation.API.Controllers.SystemAdmin
{
    [Route("api/[controller]")]
    [ApiController]
    public class NotificationController : ControllerBase
    {
        private readonly INotificationService _userNotificationService;
        public NotificationController(INotificationService userNotificationService)
        {
            _userNotificationService = userNotificationService;
        }

        [HttpPost]
        [Route("GetNotificationsBySubscriberID")]
        public DataTable GetNotificationsBySubscriberID(FilterModel model)
        {
            var subscriberID = "46fa6fee-897f-41f8-95aa-f008666e1baa";
            return _userNotificationService.GetNotificationsBySubscriberID(subscriberID, model);
        }

        [HttpGet]
        [Route("GetRecipientsByNotificationID")]
        public async Task<IActionResult> GetRecipientsByNotificationID(int notificationID)
        {
            var subscriberID = "46fa6fee-897f-41f8-95aa-f008666e1baa";
            var result = await _userNotificationService.GetRecipientsByNotificationID(subscriberID, notificationID);

            return Ok(result);
        }
        [HttpGet("GetCustomers")]
        public IActionResult GetCustomers(string? search, int take = 20)
        {
            var result = _userNotificationService.GetCustomers(search, take);
            return Ok(result);
        }

        [HttpPost("SaveNotification")]
        public async Task<ActionResult<(int StatusCode, string Message)>> SaveNotification([FromBody] CreateNotificationDto dto)
        {
            var subscriberID = "46fa6fee-897f-41f8-95aa-f008666e1baa";
            var result = await _userNotificationService.SaveNotification(dto, subscriberID);
            return Ok(result);
        }
        [HttpPost("UpdateNotification")]
        public async Task<ActionResult<(int StatusCode, string Message)>> UpdateNotification([FromBody] CreateNotificationDto dto)
        {
            var subscriberID = "46fa6fee-897f-41f8-95aa-f008666e1baa";
            var result = await _userNotificationService.UpdateNotification(dto, subscriberID);
            return Ok(result);
        }
        [HttpPost("UpdateNotificationStatus")]
        public async Task<ActionResult<(int StatusCode, string Message)>> UpdateNotificationStatus(int id, [FromBody] bool isActive)
        {
            var subscriberID = "46fa6fee-897f-41f8-95aa-f008666e1baa";
            var result = await _userNotificationService.UpdateNotificationStatus(id, isActive, subscriberID);
            return Ok(result);
        }
    }
}

