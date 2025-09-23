using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using RetailStation.Entities.Common;
using RetailStation.Entities.DTOs.Operation;
using RetailStation.Interface.Website;
using RetailStation.Interface.SupplierManagement;
using RetailStation.Service.SupplierManagement;
using System.Linq;
using RetailStation.Service.Website;
using RetailStation.Entities.DTOs.Website;
using System.Threading.Tasks;

namespace RetailStation.API.Controllers.Website
{
    [Route("api/[controller]")]
    [ApiController]
    public class WebsiteController : ControllerBase
    {

        private readonly IWebsiteService _websiteService;
        private readonly IOrderService _orderService;
        public const int SupplierId = 1;
        public WebsiteController(IWebsiteService websiteService, IOrderService orderService)
        {
            _websiteService = websiteService;
            _orderService = orderService;
        }


        [HttpPost]
        [Route("GetWebsiteItems_Data")]
        public IActionResult GetWebsiteItems_Data(SearchFilterModel SearchModel)
        {
            var data = _websiteService.GetWebsiteItems_Data(SearchModel);
            var result = new PagedResponseModel<SupplierItemModel>
            {
                Results = data,
                TotalCount = data.FirstOrDefault()?.TotalCount ?? 0,
                PageSize = SearchModel.PageSize,
                CurrentPage = SearchModel.CurrentPage
            };
            return Ok(result);
        }
        [HttpPost]
        [Route("GetWebsiteItems_Filters")]
        public IActionResult GetWebsiteItems_Filters(SearchFilterModel SearchModel)
        {
            var data = _websiteService.GetWebsiteItems_Filters(SearchModel);
            return Ok(data);
        }

        [HttpGet]
        [Route("GetSupplierItemDetailsById")]
        public IActionResult GetSupplierItemDetailsById(int SupplierItemId)
        {
            var results = _websiteService.GetWebsiteItemDetailsById(SupplierItemId);
            return Ok(results);
        }


        [HttpPost]
        [Route("GetWebsitePromotionItems")]
        public IActionResult GetWebsitePromotionItems(SearchFilterModel SearchModel)
        {
            var data = _websiteService.GetWebsitePromotionItems(SearchModel);
            var result = new PagedResponseModel<SupplierItemModel>
            {
                Results = data,
                TotalCount = data.FirstOrDefault()?.TotalCount ?? 0,
                PageSize = SearchModel.PageSize,
                CurrentPage = SearchModel.CurrentPage
            };
            return Ok(result);
        }
        [HttpGet]
        [Route("GetWebsiteMainSlider")]
        public IActionResult GetWebsiteMainSlider()
        {
            var result = _websiteService.GetWebsiteMainSlider();
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
            return Ok(_orderService.CreateNewOrder(SubscriberId, order));
        }
    }
}
