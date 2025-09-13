using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using RetailStation.Entities.Common;
using RetailStation.Entities.DTOs.Operation;
using RetailStation.Entities.Models.Operation;
using RetailStation.Interface.Operation;
using RetailStation.Interface.SupplierManagement;
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
        public const int SupplierId = 1;
        public SupplierManagementController(ISupplierManagementService supplierManagementService)
        {
            _supplierManagementService = supplierManagementService;
        }



        [HttpPost]
        [Route("GetSupplierItemsData")]
        public IActionResult GetSupplierItemsData(SearchFilterModel SearchModel)
        {
            var data = _supplierManagementService.GetSupplierItemsData(SupplierId,SearchModel);
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
            var results = _supplierManagementService.GetSupplierItemDetailsById(SupplierId, SupplierItemId);
            return Ok(results);
        }

        [HttpPost]
        [Route("AddNewSupplierItem")]
        public async Task<IActionResult> AddNewSupplierItem([FromForm] SupplierItemModel model)
        {
            var results = await _supplierManagementService.AddNewSupplierItem(SupplierId, model);
            return Ok(results);
        }

        [HttpPost]
        [Route("EditSupplierItem")]
        public async Task<IActionResult> EditSupplierItem(int SupplierItemId,[FromForm] SupplierItemModel model)
        {
            var results = await _supplierManagementService.EditSupplierItem(SupplierId, SupplierItemId, model);
            return Ok(results);
        }

        [HttpGet]
        [Route("DeleteSupplierItem")]
        public IActionResult DeleteSupplierItem(int SupplierItemId)
        {
            var results = _supplierManagementService.DeleteSupplierItem(SupplierId, SupplierItemId);
            return Ok(results);
        }
        [HttpGet]
        [Route("ChangeSupplierItemActiveStatus")]
        public ActionsResponseModel ChangeItemStatus(int SupplierItemId)
        {
            return _supplierManagementService.ChangeSupplierItemActiveStatus(SupplierId, SupplierItemId);
        }
        [HttpGet]
        [Route("ItemQuickUpdate")]
        public ActionsResponseModel ItemQuickUpdate(int SupplierItemId, decimal Price, int UnitId)
        {
            return _supplierManagementService.ItemQuickUpdate(SupplierId, SupplierItemId, Price, UnitId);
        }
        [HttpPost]
        [Route("ExportSupplierItem")]
        public IActionResult ExportSupplierItem(SearchFilterModel SearchModel)
        {
            string UserName = string.Empty;
            var results = _supplierManagementService.ExportSupplierItem(SupplierId, UserName, SearchModel);
            return Ok(results);
        }
    }
}
