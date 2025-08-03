using MasterErp.Entities.Common;
using MasterErp.Entities.DTOs.HR;
using MasterErp.Interface.HR;
using Microsoft.AspNetCore.Mvc;
using System.Data;
using System;
using Microsoft.AspNetCore.Authorization;
using MasterErp.Interface.Inventory;
using MasterErp.Service.HR;
using OfficeOpenXml.Table.PivotTable;
using MasterErp.Entities.DTOs.Inventory;
using System.Linq;

namespace MasterErp.API.Controllers.Inventory
{

    [Route("api/[controller]")]
    [ApiController]
    [Authorize]

    public class InventoryReportsController : Controller

    {
        private readonly IInventoryReportsService InvReportService;
        public InventoryReportsController(IInventoryReportsService _invReportService)
        {
            InvReportService = _invReportService;
        }

        [HttpPost("GetItemsPricesFollowUp_Data")]
        public IActionResult GetItemsPricesFollowUp_Data(DateTime FromDate, DateTime ToDate, SearchFilterModel model)
        {
            var data = InvReportService.GetItemsPricesFollowUp_Data(FromDate, ToDate, model);
            var result = new PagedResponseModel<OrderDetailsDto>
            {
                Results = data,
                TotalCount = data.FirstOrDefault()?.TotalCount ?? 0,
                PageSize = model.PageSize,
                CurrentPage = model.CurrentPage
            };
            return Ok(result);
        }

        [HttpPost("GetItemsPricesFollowUp_Export")]
        public IActionResult GetItemsPricesFollowUp_Export(DateTime FromDate, DateTime ToDate, SearchFilterModel model)
        {
            var result = InvReportService.GetItemsPricesFollowUp_Export(FromDate, ToDate, model);

            return Ok(result);
        }

        [HttpPost("GetItemsPricesFollowUp_Filters")]
        public IActionResult GetItemsPricesFollowUp_Filters(DateTime FromDate, DateTime ToDate, SearchFilterModel model)
        {
            var result = InvReportService.GetItemsPricesFollowUp_Filters(FromDate, ToDate, model);

            return Ok(result);
        }



        [HttpPost("GetReceivedItemsReport_Data")]
        public IActionResult GetReceivedItemsReport_Data(DateTime FromDate, DateTime ToDate, SearchFilterModel model)
        {
            var data = InvReportService.GetReceivedItemsReport_Data(FromDate, ToDate, model);
            var result = new PagedResponseModel<OrderDetailsDto>
            {
                Results = data,
                TotalCount = data.FirstOrDefault()?.TotalCount ?? 0,
                PageSize = model.PageSize,
                CurrentPage = model.CurrentPage
            };
            return Ok(result);
        }

        [HttpPost("GetReceivedItemsReport_Export")]
        public IActionResult GetReceivedItemsReport_Export(DateTime FromDate, DateTime ToDate, SearchFilterModel model)
        {
            var result = InvReportService.GetReceivedItemsReport_Export(FromDate, ToDate, model);

            return Ok(result);
        }

        [HttpPost("GetReceivedItemsReport_Filters")]
        public IActionResult GetReceivedItemsReport_Filters(DateTime FromDate, DateTime ToDate, SearchFilterModel model)
        {
            var result = InvReportService.GetReceivedItemsReport_Filters(FromDate, ToDate, model);

            return Ok(result);
        }
    }
}