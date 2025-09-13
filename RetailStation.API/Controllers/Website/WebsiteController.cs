using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using RetailStation.Entities.Common;
using RetailStation.Entities.DTOs.Operation;
using RetailStation.Interface.Website;
using RetailStation.Interface.SupplierManagement;
using RetailStation.Service.SupplierManagement;
using System.Linq;

namespace RetailStation.API.Controllers.Website
{
    [Route("api/[controller]")]
    [ApiController]
    public class WebsiteController : ControllerBase
    {

        private readonly IWebsiteService _dashboardService;
        public const int SupplierId = 1;
        public WebsiteController(IWebsiteService dashboardService)
        {
            _dashboardService = dashboardService;
        }


        [HttpPost]
        [Route("GetWebsiteItems_Data")]
        public IActionResult GetWebsiteItems_Data(SearchFilterModel SearchModel)
        {
            var data = _dashboardService.GetWebsiteItems_Data(SearchModel);
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
            var data = _dashboardService.GetWebsiteItems_Filters(SearchModel);
            return Ok(data);
        }

        [HttpGet]
        [Route("GetSupplierItemDetailsById")]
        public IActionResult GetSupplierItemDetailsById(int SupplierItemId)
        {
            var results = _dashboardService.GetWebsiteItemDetailsById(SupplierItemId);
            return Ok(results);
        }


    }
}
