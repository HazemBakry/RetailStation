using RetailStation.Entities.Common;
using Microsoft.AspNetCore.Mvc;
using System;
using Microsoft.AspNetCore.Authorization;
using RetailStation.Interface.Inventory;
using RetailStation.Entities.DTOs.Inventory;
using System.Linq;

namespace RetailStation.API.Controllers.Inventory
{

    [Route("api/[controller]")]
    [ApiController]
    [Authorize]

    public class InventoryReportsController : Controller

    {
        private readonly IInventoryReportsService InvReportService;
        public InventoryReportsController(IInventoryReportsService _InvReportService)
        {
            InvReportService = _InvReportService;
        }

        [HttpPost("GetItemsPricesFollowUp_Data")]
        public IActionResult GetItemsPricesFollowUp_Data(DateTime? FromDate, DateTime? ToDate, SearchFilterModel model)
        {
            var data = InvReportService.GetItemsPricesFollowUp_Data(FromDate, ToDate, model);
            var result = new PagedResponseModel<OrderReportModel>
            {
                Results = data,
                TotalCount = data.FirstOrDefault()?.TotalCount ?? 0,
                PageSize = model.PageSize,
                CurrentPage = model.CurrentPage
            };
            return Ok(result);
        }

        [HttpPost("GetItemsPricesFollowUp_Export")]
        public IActionResult GetItemsPricesFollowUp_Export(DateTime? FromDate, DateTime? ToDate, SearchFilterModel model)
        {
            var result = InvReportService.GetItemsPricesFollowUp_Export(FromDate, ToDate, model);

            return Ok(result);
        }

        [HttpPost("GetItemsPricesFollowUp_Filters")]
        public IActionResult GetItemsPricesFollowUp_Filters(DateTime? FromDate, DateTime? ToDate, SearchFilterModel model)
        {
            var result = InvReportService.GetItemsPricesFollowUp_Filters(FromDate, ToDate, model);

            return Ok(result);
        }



        [HttpPost("GetReceivedItemsSummaryReport_Data")]
        public IActionResult GetReceivedItemsSummaryReport_Data(DateTime? FromDate, DateTime? ToDate, [FromBody] SearchFilterModel model)
        {
            var data = InvReportService.GetReceivedItemsSummaryReport_Data(FromDate, ToDate, model);
            var result = new PagedResponseModel<OrderDetailsReportModel>
            {
                Results = data,
                TotalCount = data.FirstOrDefault()?.TotalCount ?? 0,
                PageSize = model.PageSize,
                CurrentPage = model.CurrentPage
            };
            return Ok(result);
        }

        [HttpPost("GetReceivedItemsSummaryReport_Filters")]
        public IActionResult GetReceivedItemsSummaryReport_Filters(DateTime? FromDate, DateTime? ToDate, [FromBody] SearchFilterModel model)
        {
            var result = InvReportService.GetReceivedItemsSummaryReport_Filters(FromDate, ToDate, model);
            return Ok(result);
        }

        [HttpPost("GetReceivedItemsSummaryReport_Export")]
        public IActionResult GetReceivedItemsSummaryReport_Export(DateTime? FromDate, DateTime? ToDate, [FromBody] SearchFilterModel model)
        {
            var result = InvReportService.GetReceivedItemsSummaryReport_Export(FromDate, ToDate, model);
            return Ok(result);
        }

        [HttpPost("GetReceivedItemsDetailsReport_Data")]
        public IActionResult GetReceivedItemsDetailsReport_Data(DateTime? FromDate, DateTime? ToDate, [FromBody] SearchFilterModel model)
        {
            var data = InvReportService.GetReceivedItemsDetailsReport_Data(FromDate, ToDate, model);
            var result = new PagedResponseModel<OrderReportModel>
            {
                Results = data,
                TotalCount = data.FirstOrDefault()?.TotalCount ?? 0,
                PageSize = model.PageSize,
                CurrentPage = model.CurrentPage
            };
            return Ok(result);
        }

        [HttpPost("GetReceivedItemsDetailsReport_Filters")]
        public IActionResult GetReceivedItemsDetailsReport_Filters(DateTime? FromDate, DateTime? ToDate, [FromBody] SearchFilterModel model)
        {
            var result = InvReportService.GetReceivedItemsDetailsReport_Filters(FromDate, ToDate, model);
            return Ok(result);
        }

        [HttpPost("GetReceivedItemsDetailsReport_Export")]
        public IActionResult GetReceivedItemsDetailsReport_Export(DateTime? FromDate, DateTime? ToDate, [FromBody] SearchFilterModel model)
        {
            var result = InvReportService.GetReceivedItemsDetailsReport_Export(FromDate, ToDate, model);
            return Ok(result);
        }

        [HttpPost("GetMaterialReceiptsReport_Data")]
        public IActionResult GetMaterialReceiptsReport_Data(DateTime? FromDate, DateTime? ToDate, [FromBody] SearchFilterModel model)
        {
            var data = InvReportService.GetMaterialReceiptsReport_Data(FromDate,ToDate, model);
            var result = new PagedResponseModel<OrderReportModel>
            {
                Results = data,
                TotalCount = data.FirstOrDefault()?.TotalCount ?? 0,
                PageSize = model.PageSize,
                CurrentPage = model.CurrentPage
            };
            return Ok(result);
        }

        [HttpPost("GetMaterialReceiptsReport_Filters")]
        public IActionResult GetMaterialReceiptsReport_Filters(DateTime? FromDate, DateTime? ToDate, [FromBody] SearchFilterModel model)
        {
            var result = InvReportService.GetMaterialReceiptsReport_Filters(FromDate, ToDate, model);
            return Ok(result);
        }

        [HttpPost("GetMaterialReceiptsReport_Export")]
        public IActionResult GetMaterialReceiptsReport_Export(DateTime? FromDate, DateTime? ToDate, [FromBody] SearchFilterModel model)
        {
            var result = InvReportService.GetMaterialReceiptsReport_Export(FromDate, ToDate, model);
            return Ok(result);
        }

    }
}


