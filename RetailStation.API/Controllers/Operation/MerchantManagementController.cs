using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using RetailStation.Entities.Common;
using RetailStation.Entities.DTOs.Operation;
using RetailStation.Entities.DTOs.Website;
using RetailStation.Entities.Models.Operation;
using RetailStation.Interface.Operation;
using RetailStation.Interface.Website;
using System.Linq;
using System.Threading.Tasks;

namespace RetailStation.API.Controllers.Operation
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class MerchantManagementController : ControllerBase
    {
        private readonly IMerchantManagementService _merchantManagementService;
        private readonly IOrderService _orderService;
        public MerchantManagementController(IMerchantManagementService merchantManagementService, IOrderService orderService)
        {
            _merchantManagementService = merchantManagementService;
            _orderService = orderService;
        }



        [HttpPost]
        [Route("GetMerchantItemsData")]
        public IActionResult GetMerchantItemsData(SearchFilterModel SearchModel)
        {
            string UserId = User.Claims.FirstOrDefault(c => c.Type == "UserId")?.Value;
            int.TryParse(User.Claims.FirstOrDefault(c => c.Type == "MerchantId")?.Value, out int MerchantId);
            if (MerchantId <= 0)
                return BadRequest("No Merchant assigned");
            var data = _merchantManagementService.GetMerchantItemsData(MerchantId, SearchModel);
            var result = new PagedResponseModel<MerchantItemModel>
            {
                Results = data,
                TotalCount = data.FirstOrDefault()?.TotalCount ?? 0,
                PageSize = SearchModel.PageSize,
                CurrentPage = SearchModel.CurrentPage
            };
            return Ok(result);
        }

        [HttpGet]
        [Route("GetMerchantItemDetailsById")]
        public IActionResult GetMerchantItemDetailsById(int MerchantItemId)
        {
            string UserId = User.Claims.FirstOrDefault(c => c.Type == "UserId")?.Value;
            int.TryParse(User.Claims.FirstOrDefault(c => c.Type == "MerchantId")?.Value, out int MerchantId);
            if (MerchantId <= 0)
                return BadRequest("No Merchant assigned");
            var results = _merchantManagementService.GetMerchantItemDetailsById(MerchantId, MerchantItemId);
            return Ok(results);
        }

        [HttpPost]
        [Route("AddNewMerchantItem")]
        public async Task<IActionResult> AddNewMerchantItem([FromForm] MerchantItemModel model)
        {
            string UserId = User.Claims.FirstOrDefault(c => c.Type == "UserId")?.Value;
            int.TryParse(User.Claims.FirstOrDefault(c => c.Type == "MerchantId")?.Value, out int MerchantId);
            if (MerchantId <= 0)
                return BadRequest("No Merchant assigned");
            var results = await _merchantManagementService.AddNewMerchantItem(MerchantId, model);
            return Ok(results);
        }

        [HttpPost]
        [Route("EditMerchantItem")]
        public async Task<IActionResult> EditMerchantItem(int MerchantItemId, [FromForm] MerchantItemModel model)
        {
            string UserId = User.Claims.FirstOrDefault(c => c.Type == "UserId")?.Value;
            int.TryParse(User.Claims.FirstOrDefault(c => c.Type == "MerchantId")?.Value, out int MerchantId);
            if (MerchantId <= 0)
                return BadRequest("No Merchant assigned");
            var results = await _merchantManagementService.EditMerchantItem(MerchantId, MerchantItemId, model);
            return Ok(results);
        }

        [HttpGet]
        [Route("DeleteMerchantItem")]
        public IActionResult DeleteMerchantItem(int MerchantItemId)
        {
            string UserId = User.Claims.FirstOrDefault(c => c.Type == "UserId")?.Value;
            int.TryParse(User.Claims.FirstOrDefault(c => c.Type == "MerchantId")?.Value, out int MerchantId);
            if (MerchantId <= 0)
                return BadRequest("No Merchant assigned");
            var results = _merchantManagementService.DeleteMerchantItem(MerchantId, MerchantItemId);
            return Ok(results);
        }
        [HttpGet]
        [Route("ChangeMerchantItemActiveStatus")]
        public IActionResult ChangeItemStatus(int MerchantItemId)
        {
            string UserId = User.Claims.FirstOrDefault(c => c.Type == "UserId")?.Value;
            int.TryParse(User.Claims.FirstOrDefault(c => c.Type == "MerchantId")?.Value, out int MerchantId);
            if (MerchantId <= 0)
                return BadRequest("No Merchant assigned");
            return Ok(_merchantManagementService.ChangeMerchantItemActiveStatus(MerchantId, MerchantItemId));
        }
        [HttpGet]
        [Route("ItemQuickUpdate")]
        public IActionResult ItemQuickUpdate(int MerchantItemId, decimal Price, int UnitId)
        {
            string UserId = User.Claims.FirstOrDefault(c => c.Type == "UserId")?.Value;
            int.TryParse(User.Claims.FirstOrDefault(c => c.Type == "MerchantId")?.Value, out int MerchantId);
            if (MerchantId <= 0)
                return BadRequest("No Merchant assigned");
            return Ok(_merchantManagementService.ItemQuickUpdate(MerchantId, MerchantItemId, Price, UnitId));
        }
        [HttpPost]
        [Route("ExportMerchantItem")]
        public IActionResult ExportMerchantItem(SearchFilterModel SearchModel)
        {
            string UserId = User.Claims.FirstOrDefault(c => c.Type == "UserId")?.Value;
            int.TryParse(User.Claims.FirstOrDefault(c => c.Type == "MerchantId")?.Value, out int MerchantId);
            if (MerchantId <= 0)
                return BadRequest("No Merchant assigned");
            string UserName = string.Empty;
            var results = _merchantManagementService.ExportMerchantItem(MerchantId, UserName, SearchModel);
            return Ok(results);
        }




        [HttpPost]
        [Route("GetMerchantItems_Data")]
        public IActionResult GetMerchantItems_Data(int MerchantId, SearchFilterModel SearchModel)
        {
            string UserId = User.Claims.FirstOrDefault(c => c.Type == "UserId")?.Value;
            var data = _merchantManagementService.GetMerchantItemsData(MerchantId, SearchModel);
            var result = new PagedResponseModel<MerchantItemModel>
            {
                Results = data,
                TotalCount = data.FirstOrDefault()?.TotalCount ?? 0,
                PageSize = SearchModel.PageSize,
                CurrentPage = SearchModel.CurrentPage
            };
            return Ok(result);
        }


        [HttpGet]
        [Route("MapMerchantItem")]
        public async Task<IActionResult> MapMerchantItem(int MerchantId, int MerchantItemId, int? ItemId)
        {
            var results = await _merchantManagementService.MapMerchantItem(MerchantId, MerchantItemId, ItemId);
            return Ok(results);
        }

        [HttpGet]
        [Route("MarkItemAsBestSeller")]
        public async Task<IActionResult> MarkItemAsBestSeller(int MerchantItemId)
        {
            var results = await _merchantManagementService.MarkItemAsBestSeller(MerchantItemId);
            return Ok(results);
        }


        [HttpPost]
        [Route("ImportMerchantItemsFile")]
        public async Task<IActionResult> ImportMerchantItemsFile(string ImporterName, [FromForm] IFormFile ImportFile)
        {
            int.TryParse(User.Claims.FirstOrDefault(c => c.Type == "MerchantId")?.Value, out int MerchantId);
            if (MerchantId <= 0)
                return BadRequest("No Merchant assigned");
            var results = await _merchantManagementService.ImportMerchantItemsFile(MerchantId, ImporterName, ImportFile);
            return Ok(results);
        }




        #region Orders
        [HttpPost]
        [Route("GetOrders_Data")]
        public IActionResult GetOrders_Data(SearchFilterModel model)
        {
            int.TryParse(User.Claims.FirstOrDefault(c => c.Type == "MerchantId")?.Value, out int MerchantId);
            if (MerchantId <= 0)
                return BadRequest("No Merchant assigned");

            model.FilterList.Add(new FilterItem
            {
                CategoryName = "MerchantId",
                ItemFlag = MerchantId.ToString(),
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
            int.TryParse(User.Claims.FirstOrDefault(c => c.Type == "MerchantId")?.Value, out int MerchantId);
            if (MerchantId <= 0)
                return BadRequest("No Merchant assigned");
            model.FilterList.Add(new FilterItem
            {
                CategoryName = "MerchantId",
                ItemFlag = MerchantId.ToString(),
            });
            return Ok(_orderService.GetOrders_Filters(model));
        }
        #endregion
    }
}
