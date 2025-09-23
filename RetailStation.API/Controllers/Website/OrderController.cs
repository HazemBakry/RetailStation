using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using RetailStation.Entities.Common;
using RetailStation.Entities.DTOs.Website;
using RetailStation.Interface.Operation;
using RetailStation.Interface.Website;
using RetailStation.Service.Website;
using System.Linq;
using System.Threading.Tasks;

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
        [Route("GetOrders_Data")]
        public IActionResult GetOrders_Data(SearchFilterModel model)
        {
            var data = _orderService.GetOrders_Data(model);
            var result = new PagedResponseModel<WebsiteOrderModel>
            {
                Results = data,
                TotalCount = data.FirstOrDefault()?.TotalCount ?? 0,
                PageSize = model.PageSize,
                CurrentPage = model.CurrentPage
            };
            return Ok(result);
        }
        [HttpGet]
        [Route("GetOrder_Items")]
        public IActionResult GetOrder_Items(int OrderId)
        {
            var result = _orderService.GetOrder_Items(OrderId);
           
            return Ok(result);
        }

        [HttpPost]
        [Route("GetOrders_Filters")]
        public IActionResult GetOrders_Filters(SearchFilterModel model)
        {
            return Ok(_orderService.GetOrders_Filters(model));
        }

        [HttpGet]
        [Route("GetOrderDetailsById")]
        public IActionResult GetOrderDetailsById(int OrderId)
        {
            var result = _orderService.GetOrderDetailsById(OrderId);

            return Ok(result);
        }

        [HttpPost]
        [Route("CreateNewOrder")]
        public IActionResult CreateNewOrder([FromBody] CreateOrderModel order)
        {
            string SubscriberId = User.Claims.FirstOrDefault(c => c.Type == "SubscriberId")?.Value;
            string UserId = User.Claims.FirstOrDefault(c => c.Type == "UserId")?.Value;
            if (string.IsNullOrEmpty(SubscriberId))
                return BadRequest("No Subscriber assigned");
            order.CreatedBy = UserId;
            return Ok(_orderService.CreateNewOrder(SubscriberId,order));
        }
        
        [HttpPost]
        [Route("EditOrder")]
        public IActionResult EditOrder(int OrderId, [FromBody] WebsiteOrderModel order)
        {
            string SubscriberId = User.Claims.FirstOrDefault(c => c.Type == "SubscriberId")?.Value;
            string UserId = User.Claims.FirstOrDefault(c => c.Type == "UserId")?.Value;
            if (string.IsNullOrEmpty(SubscriberId))
                return BadRequest("No Subscriber assigned");
            return Ok(_orderService.EditOrder(OrderId,order));
        }

        [HttpGet]
        [Route("CancelOrder")]
        public IActionResult CancelOrder(int OrderId)
        {
            return Ok(_orderService?.CancelOrder(OrderId));

        }


    }
}
