using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using RetailStation.Entities.Common;
using RetailStation.Entities.DTOs.Operation;
using RetailStation.Interface.Dashboard;
using RetailStation.Interface.SupplierManagement;
using RetailStation.Service.SupplierManagement;
using System.Linq;

namespace RetailStation.API.Controllers.Dashboard
{
    [Route("api/[controller]")]
    [ApiController]
    public class DashboardController1 : ControllerBase
    {

        private readonly IDashboardService _dashboardService;
        public const int SupplierId = 1;
        public DashboardController1(IDashboardService dashboardService)
        {
            _dashboardService = dashboardService;
        }


        [HttpPost]
        [Route("GetDashboardItems_Data")]
        public IActionResult GetDashboardItems_Data(SearchFilterModel SearchModel)
        {
            var data = _dashboardService.GetDashboardItems_Data(SearchModel);
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
        [Route("GetDashboardItems_Filters")]
        public IActionResult GetDashboardItems_Filters(SearchFilterModel SearchModel)
        {
            var data = _dashboardService.GetDashboardItems_Filters(SearchModel);
            return Ok(data);
        }

        [HttpGet]
        [Route("GetSupplierItemDetailsById")]
        public IActionResult GetSupplierItemDetailsById(int SupplierItemId)
        {
            var results = _dashboardService.GetDashboardItemDetailsById(SupplierItemId);
            return Ok(results);
        }


    }
}
