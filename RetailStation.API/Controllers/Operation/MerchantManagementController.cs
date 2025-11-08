using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using RetailStation.Entities.Common;
using RetailStation.Entities.DTOs.Operation;
using RetailStation.Entities.DTOs.Website;
using RetailStation.Entities.Models.Operation;
using RetailStation.Interface.Operation;
using RetailStation.Interface.Website;
using RetailStation.Service.Operation;
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


        //[HttpPost]
        //[Route("GetMerchantItemsData")]
        //public IActionResult GetMerchantItemsData(SearchFilterModel SearchModel)
        //{
        //    string UserId = User.Claims.FirstOrDefault(c => c.Type == "UserId")?.Value;
        //    int.TryParse(User.Claims.FirstOrDefault(c => c.Type == "MerchantId")?.Value, out int MerchantId);
        //    if (MerchantId <= 0)
        //        return BadRequest("No Merchant assigned");
        //    var data = _merchantManagementService.GetMerchantItems_Data(MerchantId, SearchModel);
        //    var result = new PagedResponseModel<MerchantItemModel>
        //    {
        //        Results = data,
        //        TotalCount = data.FirstOrDefault()?.TotalCount ?? 0,
        //        PageSize = SearchModel.PageSize,
        //        CurrentPage = SearchModel.CurrentPage
        //    };
        //    return Ok(result);
        //}

        [HttpPost]
        [Route("GetMerchantItems_Data")]
        public IActionResult GetMerchantItems_Data([FromBody] SearchFilterModel searchModel, int? MerchantId = null)
        {
            int finalMerchantId;
            if (MerchantId.HasValue)
            {
                finalMerchantId = MerchantId.Value;
            }
            else
            {
                var userMerchant = User.Claims.FirstOrDefault(c => c.Type == "MerchantId")?.Value;

                if (string.IsNullOrWhiteSpace(userMerchant) || !int.TryParse(userMerchant, out finalMerchantId))
                    return BadRequest("No merchant assigned to the this user.");
            }

            var data = _merchantManagementService.GetMerchantItems_Data(finalMerchantId, searchModel);
            var result = new PagedResponseModel<MerchantItemModel>
            {
                Results = data,
                TotalCount = data.FirstOrDefault()?.TotalCount ?? 0,
                PageSize = searchModel.PageSize,
                CurrentPage = searchModel.CurrentPage
            };

            return Ok(result);
        }


        [HttpPost]
        [Route("GetMerchantItems_Filters")]
        public IActionResult GetMerchantItems_Filters(SearchFilterModel PagingFilter)
        {
            int MerchantId;
            var userMerchant = User.Claims.FirstOrDefault(c => c.Type == "MerchantId")?.Value;

            if (string.IsNullOrWhiteSpace(userMerchant) || !int.TryParse(userMerchant, out MerchantId))
                return BadRequest("No merchant assigned to the this user.");

            var result = _merchantManagementService.GetMerchantItems_Filters(MerchantId, PagingFilter);

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
            var data = _merchantManagementService.GetOrders_Data(model, MerchantId);
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
            int.TryParse(User.Claims.FirstOrDefault(c => c.Type == "MerchantId")?.Value, out int MerchantId);
            if (MerchantId <= 0)
                return BadRequest("No Merchant assigned");
            var result = _merchantManagementService.GetOrder_Items(MerchantId,OrderId);

            return Ok(result);
        }

        [HttpPost]
        [Route("GetOrders_Filters")]
        public IActionResult GetOrders_Filters(SearchFilterModel model)
        {
            int.TryParse(User.Claims.FirstOrDefault(c => c.Type == "MerchantId")?.Value, out int MerchantId);
            if (MerchantId <= 0)
                return BadRequest("No Merchant assigned");
            return Ok(_merchantManagementService.GetOrders_Filters(model, MerchantId));
        }

        [HttpGet]
        [Route("GetOrderDetailsById")]
        public IActionResult GetOrderDetailsById(int OrderId)
        {
            int.TryParse(User.Claims.FirstOrDefault(c => c.Type == "MerchantId")?.Value, out int MerchantId);
            if (MerchantId <= 0)
                return BadRequest("No Merchant assigned");
            var result = _merchantManagementService.GetOrderDetailsById(MerchantId, OrderId);

            return Ok(result);
        }
        [HttpGet]
        [Route("CancelOrder")]
        public IActionResult CancelOrder(int OrderId)
        {
            int.TryParse(User.Claims.FirstOrDefault(c => c.Type == "MerchantId")?.Value, out int MerchantId);
            if (MerchantId <= 0)
                return BadRequest("No Merchant assigned");
            return Ok(_merchantManagementService.CancelOrder(MerchantId,OrderId));

        }
        #endregion

        #region Branch

        [HttpPost]
        [Route("GetBranches_Data")]
        public IActionResult GetBranches_Data(SearchFilterModel searchModel)
        {
            string UserId = User.Claims.FirstOrDefault(c => c.Type == "UserId")?.Value;
            int.TryParse(User.Claims.FirstOrDefault(c => c.Type == "MerchantId")?.Value, out int MerchantId);
            if (MerchantId <= 0)
                return BadRequest("No Merchant assigned");
            var data = _merchantManagementService.GetBranches_Data(MerchantId, searchModel);
            var result = new PagedResponseModel<BranchModel>
            {
                Results = data,
                TotalCount = data.FirstOrDefault()?.TotalCount ?? 0,
                PageSize = searchModel.PageSize,
                CurrentPage = searchModel.CurrentPage
            };
            return Ok(result);
        }

        [HttpGet]
        [Route("GetBranchById")]
        public IActionResult GetBranchById(int branchId)
        {
            string UserId = User.Claims.FirstOrDefault(c => c.Type == "UserId")?.Value;
            int.TryParse(User.Claims.FirstOrDefault(c => c.Type == "MerchantId")?.Value, out int MerchantId);
            if (MerchantId <= 0)
                return BadRequest("No Merchant assigned");
            var result = _merchantManagementService.GetBranchById(MerchantId, branchId);
            return Ok(result);
        }

        [HttpPost]
        [Route("AddBranch")]
        public async Task<IActionResult> AddBranch([FromForm] BranchModel model)
        {
            string UserId = User.Claims.FirstOrDefault(c => c.Type == "UserId")?.Value;
            int.TryParse(User.Claims.FirstOrDefault(c => c.Type == "MerchantId")?.Value, out int MerchantId);
            if (MerchantId <= 0)
                return BadRequest("No Merchant assigned");
            var result = await _merchantManagementService.AddBranch(MerchantId, model);
            return Ok(result);
        }

        [HttpPost]
        [Route("EditBranch")]
        public async Task<IActionResult> EditBranch(int branchId, [FromForm] BranchModel model)
        {
            string UserId = User.Claims.FirstOrDefault(c => c.Type == "UserId")?.Value;
            int.TryParse(User.Claims.FirstOrDefault(c => c.Type == "MerchantId")?.Value, out int MerchantId);
            if (MerchantId <= 0)
                return BadRequest("No Merchant assigned");
            var result = await _merchantManagementService.EditBranch(MerchantId, branchId, model);
            return Ok(result);
        }

        [HttpGet]
        [Route("DeleteBranch")]
        public IActionResult DeleteBranch(int branchId)
        {
            string UserId = User.Claims.FirstOrDefault(c => c.Type == "UserId")?.Value;
            int.TryParse(User.Claims.FirstOrDefault(c => c.Type == "MerchantId")?.Value, out int MerchantId);
            if (MerchantId <= 0)
                return BadRequest("No Merchant assigned");
            var result = _merchantManagementService.DeleteBranch(MerchantId, branchId);
            return Ok(result);
        }

        [HttpGet]
        [Route("ChangeBranchActiveStatus")]
        public IActionResult ChangeBranchActiveStatus(int branchId)
        {
            string UserId = User.Claims.FirstOrDefault(c => c.Type == "UserId")?.Value;
            int.TryParse(User.Claims.FirstOrDefault(c => c.Type == "MerchantId")?.Value, out int MerchantId);
            if (MerchantId <= 0)
                return BadRequest("No Merchant assigned");
            return Ok(_merchantManagementService.ChangeBranchActiveStatus(MerchantId,branchId));
        }
        #endregion


        #region Promotions


        [HttpPost]
        [Route("GetPromotionsData")]
        public IActionResult GetPromotionsData(SearchFilterModel SearchModel)
        {
            string UserId = User.Claims.FirstOrDefault(c => c.Type == "UserId")?.Value;
            int.TryParse(User.Claims.FirstOrDefault(c => c.Type == "MerchantId")?.Value, out int MerchantId);
            if (MerchantId <= 0)
                return BadRequest("No Merchant assigned");
            var data = _merchantManagementService.GetPromotionsData(MerchantId,SearchModel);
            var result = new PagedResponseModel<PromotionModel>
            {
                Results = data,
                TotalCount = data.FirstOrDefault()?.TotalCount ?? 0,
                PageSize = SearchModel.PageSize,
                CurrentPage = SearchModel.CurrentPage
            };
            return Ok(result);
        }

        [HttpGet]
        [Route("GetPromotionDetailsById")]
        public IActionResult GetPromotionDetailsById(int PromotionId)
        {
            string UserId = User.Claims.FirstOrDefault(c => c.Type == "UserId")?.Value;
            int.TryParse(User.Claims.FirstOrDefault(c => c.Type == "MerchantId")?.Value, out int MerchantId);
            if (MerchantId <= 0)
                return BadRequest("No Merchant assigned");
            var results = _merchantManagementService.GetPromotionById(MerchantId, PromotionId);
            return Ok(results);
        }

        [HttpPost]
        [Route("AddNewPromotion")]
        public async Task<IActionResult> AddNewPromotion([FromForm] PromotionModel model)
        {
            string UserId = User.Claims.FirstOrDefault(c => c.Type == "UserId")?.Value;
            int.TryParse(User.Claims.FirstOrDefault(c => c.Type == "MerchantId")?.Value, out int MerchantId);
            if (MerchantId <= 0)
                return BadRequest("No Merchant assigned");
            var results = await _merchantManagementService.AddPromotion(MerchantId, model);
            return Ok(results);
        }

        [HttpPost]
        [Route("EditPromotion")]
        public async Task<IActionResult> EditPromotion(int PromotionId, [FromForm] PromotionModel model)
        {
            string UserId = User.Claims.FirstOrDefault(c => c.Type == "UserId")?.Value;
            int.TryParse(User.Claims.FirstOrDefault(c => c.Type == "MerchantId")?.Value, out int MerchantId);
            if (MerchantId <= 0)
                return BadRequest("No Merchant assigned");
            var results = await _merchantManagementService.EditPromotion(MerchantId, PromotionId, model);
            return Ok(results);
        }

        [HttpGet]
        [Route("DeletePromotion")]
        public IActionResult DeletePromotion(int PromotionId)
        {
            string UserId = User.Claims.FirstOrDefault(c => c.Type == "UserId")?.Value;
            int.TryParse(User.Claims.FirstOrDefault(c => c.Type == "MerchantId")?.Value, out int MerchantId);
            if (MerchantId <= 0)
                return BadRequest("No Merchant assigned");
            var results = _merchantManagementService.DeletePromotion(MerchantId, PromotionId);
            return Ok(results);
        }

        [HttpGet]
        [Route("ChangePromotionActiveStatus")]
        public IActionResult ChangePromotionActiveStatus(int PromotionId)
        {
            string UserId = User.Claims.FirstOrDefault(c => c.Type == "UserId")?.Value;
            int.TryParse(User.Claims.FirstOrDefault(c => c.Type == "MerchantId")?.Value, out int MerchantId);
            if (MerchantId <= 0)
                return BadRequest("No Merchant assigned");
            return Ok(_merchantManagementService.ChangePromotionActiveStatus(MerchantId, PromotionId));
        }
        #endregion

    }
}
