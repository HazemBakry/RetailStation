using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using RetailStation.Entities.Common;
using RetailStation.Entities.DTOs.Website;
using RetailStation.Interface.Operation;
using RetailStation.Interface.Website;
using RetailStation.Service.Website;
using System.Linq;

namespace RetailStation.API.Controllers.Website
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]

    public class OrderController : ControllerBase
    {


        private readonly IOrderService _orderService;

        public OrderController(IOrderService OrderService)
        {
            _orderService = OrderService;
        }


        [HttpPost]
        [Route("CreateNewOrder")]
        public IActionResult CreateNewOrder([FromBody] WebsiteOrderModel order)
        {
            string SubscriberId = User.Claims.FirstOrDefault(c => c.Type == "SubscriberId")?.Value;
            string UserId = User.Claims.FirstOrDefault(c => c.Type == "UserId")?.Value;
            string SupplierId = User.Claims.FirstOrDefault(c => c.Type == "SupplierId")?.Value;
            if (string.IsNullOrEmpty(SubscriberId))
                return BadRequest("No Supplier assigned");
            return Ok(_orderService.CreateNewOrder(order));
        }

        [HttpGet]
        [Route("CancelOrder")]
        public IActionResult CancelOrder(int OrderId)
        {
            return Ok(_orderService?.CancelOrder(OrderId));

        }


    }
}
