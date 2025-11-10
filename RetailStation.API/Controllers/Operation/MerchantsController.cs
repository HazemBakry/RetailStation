using RetailStation.Entities.Common;
using RetailStation.Entities.Common.Finance.Purchases;
using RetailStation.Entities.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using RetailStation.Entities.DTOs.Operation;
using RetailStation.Interface.Operation;
using RetailStation.Service.Operation;

namespace RetailStation.API.Controllers.Operation
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]

    public class MerchantsController : Controller
    {
        private readonly IMerchantsService _merchantsService;
        private readonly IMerchantManagementService _merchantManagementService;

        public MerchantsController(IMerchantsService merchantsService, IMerchantManagementService merchantManagementService)
        {
            _merchantsService = merchantsService;
            _merchantManagementService = merchantManagementService;
        }

        [HttpPost]
        [Route("GetMerchants_Data")]
        public IActionResult GetMerchants_Data(SearchFilterModel model)
        {
            var data = _merchantsService.GetMerchants_Data(model);
            var result = new PagedResponseModel<MerchantModel>
            {
                Results = data,
                TotalCount = data.FirstOrDefault()?.TotalCount ?? 0,
                PageSize = model.PageSize,
                CurrentPage = model.CurrentPage
            };
            return Ok(result);
        }

        [HttpPost]
        [Route("GetMerchantDetailsById")]
        public IActionResult GetMerchantDetailsById(int MerchantId)
        {
            var result = _merchantsService.GetMerchantDetailsById(MerchantId);
            return Ok(result);
        }

        [HttpPost]
        [Route("GetLoggedMerchantDetails")]
        public IActionResult GetLoggedMerchantDetails()
        {
            int finalMerchantId;

            var userMerchant = User.Claims.FirstOrDefault(c => c.Type == "MerchantId")?.Value;

            if (string.IsNullOrWhiteSpace(userMerchant) || !int.TryParse(userMerchant, out finalMerchantId))
                return BadRequest("No merchant assigned to the this user.");

            var result = _merchantsService.GetMerchantDetailsById(finalMerchantId);
            return Ok(result);
        }


        [HttpPost]
        [Route("AddNewMerchant")]
        public IActionResult AddNewMerchant(MerchantModel model)
        {
            var results = _merchantsService.AddNewMerchant(model);
            return Ok(results);
        }

        [HttpPost]
        [Route("EditMerchant")]
        public IActionResult EditMerchant(int MerchantId, MerchantModel model)
        {
            var results = _merchantsService.EditMerchant(MerchantId, model);
            return Ok(results);
        }

        [HttpGet]
        [Route("DeleteMerchant")]
        public IActionResult DeleteMerchant(int MerchantId)
        {
            var results = _merchantsService.DeleteMerchant(MerchantId);
            return Ok(results);
        }






        [HttpPost]
        [Route("GetPromotions_Data")]
        public IActionResult GetPromotions_Data(int MerchantId,SearchFilterModel SearchModel)
        {
            var data = _merchantManagementService.GetPromotions_Data(MerchantId, SearchModel);
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
        [Route("ApprovePromotionToDisplay")]
        public async Task<IActionResult> ApprovePromotionToDisplay(int MerchantId,int PromotionId)
        {
            var results = await _merchantManagementService.ApprovePromotionToDisplay(MerchantId,PromotionId);
            return Ok(results);
        }

    }
}
