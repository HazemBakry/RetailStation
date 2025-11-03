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
using RetailStation.Entities.Models.Operation;

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

        [HttpGet]
        [Route("GetWebsiteMainSlider")]
        public IActionResult GetWebsiteMainSlider()
        {
            var result = _websiteService.GetWebsiteMainSlider();
            return Ok(result);
        }

        [HttpGet]
        [Route("GetWebsiteHomeCategories")]
        public IActionResult GetWebsiteHomeCategories()
        {
            var data = _websiteService.GetWebsiteHomeCategories();
            var result = new PagedResponseModel<ItemCategoryModel>
            {
                Results = data,
                TotalCount = data.FirstOrDefault()?.TotalCount ?? 0,
                PageSize = 0,
                CurrentPage = 0
            };
            return Ok(result);
        }

        [HttpPost]
        [Route("GetItemsByCategoryId")]
        public IActionResult GetItemsByCategoryId(int CategoryId, SearchFilterModel model)
        {
            var data = _websiteService.GetItemsByCategoryId(CategoryId, model);
            var result = new PagedResponseModel<ItemDto>
            {
                Results = data,
                TotalCount = data.FirstOrDefault()?.TotalCount ?? 0,
                PageSize = 0,
                CurrentPage = 0

            };
            return Ok(result);
        }

        [HttpPost]
        [Route("GetWebsiteItems_Data")]
        public IActionResult GetWebsiteItems_Data(SearchFilterModel SearchModel)
        {
            string UserId = User.Claims.FirstOrDefault(c => c.Type == "UserId")?.Value ?? string.Empty;
            var data = _websiteService.GetWebsiteItems_Data(UserId, SearchModel);
            var result = new PagedResponseModel<MerchantItemModel>
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
        public IActionResult GetSupplierItemDetailsById(int MerchantItemId)
        {
            var results = _websiteService.GetWebsiteItemDetailsById(MerchantItemId);
            return Ok(results);
        }


        [HttpPost]
        [Route("GetWebsitePromotionItems")]
        public IActionResult GetWebsitePromotionItems(SearchFilterModel SearchModel)
        {
            var data = _websiteService.GetWebsitePromotionItems(SearchModel);
            var result = new PagedResponseModel<PromotionModel>
            {
                Results = data,
                TotalCount = data.FirstOrDefault()?.TotalCount ?? 0,
                PageSize = SearchModel.PageSize,
                CurrentPage = SearchModel.CurrentPage
            };
            return Ok(result);
        }


        #region Orders

        [HttpPost]
        [Route("CreateNewOrder")]
        public IActionResult CreateNewOrder([FromBody] CreateOrderModel order)
        {
            string SubscriberId = User.Claims.FirstOrDefault(c => c.Type == "SubscriberId")?.Value;
            string UserId = User.Claims.FirstOrDefault(c => c.Type == "UserId")?.Value;
            if (string.IsNullOrEmpty(SubscriberId))
                return BadRequest("No Subscriber assigned");
            order.CreatedBy = UserId;
            return Ok(_orderService.CreateNewOrder(UserId, order));
        }


        [HttpPost]
        [Route("GetOrders_Data")]
        public IActionResult GetOrders_Data(SearchFilterModel model)
        {
            string SubscriberId = User.Claims.FirstOrDefault(c => c.Type == "SubscriberId")?.Value;
            string UserId = User.Claims.FirstOrDefault(c => c.Type == "UserId")?.Value;
            if (string.IsNullOrEmpty(SubscriberId))
                return BadRequest("No Subscriber assigned");
            model.FilterList.Add(new FilterItem
            {
                CategoryName = "SubscriberId",
                ItemFlag = SubscriberId.ToString(),
            });
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
        [HttpPost]
        [Route("GetOrders_Filters")]
        public IActionResult GetOrders_Filters(SearchFilterModel model)
        {
            string SubscriberId = User.Claims.FirstOrDefault(c => c.Type == "SubscriberId")?.Value;
            string UserId = User.Claims.FirstOrDefault(c => c.Type == "UserId")?.Value;
            if (string.IsNullOrEmpty(SubscriberId))
                return BadRequest("No Subscriber assigned");
            model.FilterList.Add(new FilterItem
            {
                CategoryName = "SubscriberId",
                ItemFlag = SubscriberId.ToString(),
            });
            return Ok(_orderService.GetOrders_Filters(model));
        }
        #endregion

        [HttpGet]
        [Route("GetTopPartners")]
        public IActionResult GetTopPartners()
        {
            var result = _websiteService.GetTopPartners();
            return Ok(result);
        }
        [HttpGet]
        [Route("ToggleFavorite")]
        public IActionResult ToggleFavorite(int MerchantItemId)
        {
            string UserId = User.Claims.FirstOrDefault(c => c.Type == "UserId")?.Value;
            if (string.IsNullOrEmpty(UserId))
            {
                var res = new ActionsResponseModel
                {
                    IsSuccess = false,
                    Message = "يرجي تسجيل الدخول لأتمام العمليه"
                };
                return Ok(res);

            }
            var result = _websiteService.ToggleFavorite(UserId, MerchantItemId);
            return Ok(result);
        }        
        [HttpGet]
        [Route("SearchAutoComplete")]
        public IActionResult SearchAutoComplete(string SearchText)
        {
           
            var result = _websiteService.SearchAutoComplete(SearchText);
            return Ok(result);
        }

    }
}
