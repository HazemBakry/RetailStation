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
using RetailStation.Interface.Operation;
using RetailStation.Entities.DTOs.Operation;

namespace RetailStation.API.Controllers.Operation
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]

    public class AdminController : Controller
    {
        private readonly IAdminService _adminService;

        public AdminController(IAdminService adminService)
        {
            _adminService = adminService;
        }

        #region Slider

        [HttpPost]
        [Route("GetSlidersData")]
        public IActionResult GetSlidersData(SearchFilterModel searchModel)
        {
            var data = _adminService.GetSlidersData(searchModel);
            var result = new PagedResponseModel<SliderModel>
            {
                Results = data,
                TotalCount = data.FirstOrDefault()?.TotalCount ?? 0,
                PageSize = searchModel.PageSize,
                CurrentPage = searchModel.CurrentPage
            };
            return Ok(result);
        }

        [HttpGet]
        [Route("GetSliderById")]
        public IActionResult GetSliderById(int sliderId)
        {
            var result = _adminService.GetSliderById(sliderId);
            return Ok(result);
        }

        [HttpPost]
        [Route("AddSlider")]
        public async Task<IActionResult> AddSlider([FromForm] SliderModel model)
        {
            var result = await _adminService.AddSlider(model);
            return Ok(result);
        }

        [HttpPost]
        [Route("EditSlider")]
        public async Task<IActionResult> EditSlider(int sliderId, [FromForm] SliderModel model)
        {
            var result = await _adminService.EditSlider(sliderId, model);
            return Ok(result);
        }

        [HttpGet]
        [Route("DeleteSlider")]
        public IActionResult DeleteSlider(int sliderId)
        {
            var result = _adminService.DeleteSlider(sliderId);
            return Ok(result);
        }

        [HttpGet]
        [Route("ChangeSliderActiveStatus")]
        public ActionsResponseModel ChangeSliderActiveStatus(int sliderId)
        {
            return _adminService.ChangeSliderActiveStatus(sliderId);
        }
        #endregion
        #region Promotions


        [HttpPost]
        [Route("GetPromotionsData")]
        public IActionResult GetPromotionsData(SearchFilterModel SearchModel)
        {
            var data = _adminService.GetPromotionsData(SearchModel);
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
            var results = _adminService.GetPromotionById(PromotionId);
            return Ok(results);
        }

        [HttpPost]
        [Route("AddNewPromotion")]
        public async Task<IActionResult> AddNewPromotion([FromForm] PromotionModel model)
        {
            var results = await _adminService.AddPromotion(model);
            return Ok(results);
        }

        [HttpPost]
        [Route("EditPromotion")]
        public async Task<IActionResult> EditPromotion(int PromotionId, [FromForm] PromotionModel model)
        {
            var results = await _adminService.EditPromotion(PromotionId, model);
            return Ok(results);
        }

        [HttpGet]
        [Route("DeletePromotion")]
        public IActionResult DeletePromotion(int PromotionId)
        {
            var results = _adminService.DeletePromotion(PromotionId);
            return Ok(results);
        }

        [HttpGet]
        [Route("ChangePromotionActiveStatus")]
        public ActionsResponseModel ChangePromotionActiveStatus(int PromotionId)
        {
            return _adminService.ChangePromotionActiveStatus(PromotionId);
        }
        #endregion
    }
}
