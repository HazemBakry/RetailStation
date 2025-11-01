using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using RetailStation.Entities.Common;
using RetailStation.Entities.DTOs.Operation;
using RetailStation.Entities.DTOs.Website;
using RetailStation.Entities.Models.Operation;
using RetailStation.Interface.Operation;
using RetailStation.Interface.SupplierManagement;
using RetailStation.Interface.Website;
using System.Linq;
using System.Threading.Tasks;

namespace RetailStation.API.Controllers.SupplierManagement
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class SupplierManagementController : ControllerBase
    {
        private readonly ISupplierManagementService _supplierManagementService;
        private readonly IOrderService _orderService;
        public SupplierManagementController(ISupplierManagementService supplierManagementService, IOrderService orderService)
        {
            _supplierManagementService = supplierManagementService;
            _orderService = orderService;
        }



        [HttpPost]
        [Route("GetSupplierItemsData")]
        public IActionResult GetSupplierItemsData(SearchFilterModel SearchModel)
        {
            string SubscriberId = User.Claims.FirstOrDefault(c => c.Type == "SubscriberId")?.Value;
            string UserId = User.Claims.FirstOrDefault(c => c.Type == "UserId")?.Value;
            int.TryParse(User.Claims.FirstOrDefault(c => c.Type == "SupplierId")?.Value, out int SupplierId);
            if (SupplierId <= 0)
                return BadRequest("No Supplier assigned");
            var data = _supplierManagementService.GetSupplierItemsData(SupplierId, SearchModel);
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
        [Route("GetSupplierItemDetailsById")]
        public IActionResult GetSupplierItemDetailsById(int SupplierItemId)
        {
            string SubscriberId = User.Claims.FirstOrDefault(c => c.Type == "SubscriberId")?.Value;
            string UserId = User.Claims.FirstOrDefault(c => c.Type == "UserId")?.Value;
            int.TryParse(User.Claims.FirstOrDefault(c => c.Type == "SupplierId")?.Value, out int SupplierId);
            if (SupplierId <= 0)
                return BadRequest("No Supplier assigned");
            var results = _supplierManagementService.GetSupplierItemDetailsById(SupplierId, SupplierItemId);
            return Ok(results);
        }

        [HttpPost]
        [Route("AddNewSupplierItem")]
        public async Task<IActionResult> AddNewSupplierItem([FromForm] SupplierItemModel model)
        {
            string SubscriberId = User.Claims.FirstOrDefault(c => c.Type == "SubscriberId")?.Value;
            string UserId = User.Claims.FirstOrDefault(c => c.Type == "UserId")?.Value;
            int.TryParse(User.Claims.FirstOrDefault(c => c.Type == "SupplierId")?.Value, out int SupplierId);
            if (SupplierId <= 0)
                return BadRequest("No Supplier assigned");
            var results = await _supplierManagementService.AddNewSupplierItem(SupplierId, model);
            return Ok(results);
        }

        [HttpPost]
        [Route("EditSupplierItem")]
        public async Task<IActionResult> EditSupplierItem(int SupplierItemId, [FromForm] SupplierItemModel model)
        {
            string SubscriberId = User.Claims.FirstOrDefault(c => c.Type == "SubscriberId")?.Value;
            string UserId = User.Claims.FirstOrDefault(c => c.Type == "UserId")?.Value;
            int.TryParse(User.Claims.FirstOrDefault(c => c.Type == "SupplierId")?.Value, out int SupplierId);
            if (SupplierId <= 0)
                return BadRequest("No Supplier assigned");
            var results = await _supplierManagementService.EditSupplierItem(SupplierId, SupplierItemId, model);
            return Ok(results);
        }

        [HttpGet]
        [Route("DeleteSupplierItem")]
        public IActionResult DeleteSupplierItem(int SupplierItemId)
        {
            string SubscriberId = User.Claims.FirstOrDefault(c => c.Type == "SubscriberId")?.Value;
            string UserId = User.Claims.FirstOrDefault(c => c.Type == "UserId")?.Value;
            int.TryParse(User.Claims.FirstOrDefault(c => c.Type == "SupplierId")?.Value, out int SupplierId);
            if (SupplierId <= 0)
                return BadRequest("No Supplier assigned");
            var results = _supplierManagementService.DeleteSupplierItem(SupplierId, SupplierItemId);
            return Ok(results);
        }
        [HttpGet]
        [Route("ChangeSupplierItemActiveStatus")]
        public IActionResult ChangeItemStatus(int SupplierItemId)
        {
            string SubscriberId = User.Claims.FirstOrDefault(c => c.Type == "SubscriberId")?.Value;
            string UserId = User.Claims.FirstOrDefault(c => c.Type == "UserId")?.Value;
            int.TryParse(User.Claims.FirstOrDefault(c => c.Type == "SupplierId")?.Value, out int SupplierId);
            if (SupplierId <= 0)
                return BadRequest("No Supplier assigned");
            return Ok(_supplierManagementService.ChangeSupplierItemActiveStatus(SupplierId, SupplierItemId));
        }
        [HttpGet]
        [Route("ItemQuickUpdate")]
        public IActionResult ItemQuickUpdate(int SupplierItemId, decimal Price, int UnitId)
        {
            string SubscriberId = User.Claims.FirstOrDefault(c => c.Type == "SubscriberId")?.Value;
            string UserId = User.Claims.FirstOrDefault(c => c.Type == "UserId")?.Value;
            int.TryParse(User.Claims.FirstOrDefault(c => c.Type == "SupplierId")?.Value, out int SupplierId);
            if (SupplierId <= 0)
                return BadRequest("No Supplier assigned");
            return Ok(_supplierManagementService.ItemQuickUpdate(SupplierId, SupplierItemId, Price, UnitId));
        }
        [HttpPost]
        [Route("ExportSupplierItem")]
        public IActionResult ExportSupplierItem(SearchFilterModel SearchModel)
        {
            string SubscriberId = User.Claims.FirstOrDefault(c => c.Type == "SubscriberId")?.Value;
            string UserId = User.Claims.FirstOrDefault(c => c.Type == "UserId")?.Value;
            int.TryParse(User.Claims.FirstOrDefault(c => c.Type == "SupplierId")?.Value, out int SupplierId);
            if (SupplierId <= 0)
                return BadRequest("No Supplier assigned");
            string UserName = string.Empty;
            var results = _supplierManagementService.ExportSupplierItem(SupplierId, UserName, SearchModel);
            return Ok(results);
        }




        [HttpPost]
        [Route("GetSupplierItems_Data")]
        public IActionResult GetSupplierItems_Data(int SupplierId,SearchFilterModel SearchModel)
        {
            string UserId = User.Claims.FirstOrDefault(c => c.Type == "UserId")?.Value;
            var data = _supplierManagementService.GetSupplierItemsData(SupplierId, SearchModel);
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
        [Route("MapSupplierItem")]
        public async Task<IActionResult> MapSupplierItem(int SupplierId,int SupplierItemId,int? ItemId)
        {
            var results = await _supplierManagementService.MapSupplierItem(SupplierId, SupplierItemId, ItemId);
            return Ok(results);
        }
        
        [HttpGet]
        [Route("MarkItemAsBestSeller")]
        public async Task<IActionResult> MarkItemAsBestSeller(int SupplierItemId)
        {
            var results = await _supplierManagementService.MarkItemAsBestSeller(SupplierItemId);
            return Ok(results);
        }


        [HttpPost]
        [Route("ImportSupplierItemsFile")]
        public async Task<IActionResult> ImportSupplierItemsFile(string ImporterName,[FromForm] IFormFile ImportFile)
        {
            int.TryParse(User.Claims.FirstOrDefault(c => c.Type == "SupplierId")?.Value, out int SupplierId);
            if (SupplierId <= 0)
                return BadRequest("No Supplier assigned");
            var results = await _supplierManagementService.ImportSupplierItemsFile(SupplierId,ImporterName, ImportFile);
            return Ok(results);
        }




        #region Orders
        [HttpPost]
        [Route("GetOrders_Data")]
        public IActionResult GetOrders_Data(SearchFilterModel model)
        {
            int.TryParse(User.Claims.FirstOrDefault(c => c.Type == "SupplierId")?.Value, out int SupplierId);
            if (SupplierId <= 0)
                return BadRequest("No Supplier assigned");

            model.FilterList.Add(new FilterItem
            {
                CategoryName = "SupplierId",
                ItemFlag = SupplierId.ToString(),
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
            int.TryParse(User.Claims.FirstOrDefault(c => c.Type == "SupplierId")?.Value, out int SupplierId);
            if (SupplierId <= 0)
                return BadRequest("No Supplier assigned");
            model.FilterList.Add(new FilterItem
            {
                CategoryName = "SupplierId",
                ItemFlag = SupplierId.ToString(),
            });
            return Ok(_orderService.GetOrders_Filters(model));
        }
        #endregion
    }
}
