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


        #region TopPartners


        [HttpPost]
        [Route("GetTopPartners_Data")]
        public IActionResult GetTopPartners_Data(SearchFilterModel SearchModel)
        {
            var data = _adminService.GetTopPartners_Data(SearchModel);
            var result = new PagedResponseModel<TopPartnerModel>
            {
                Results = data,
                TotalCount = data.FirstOrDefault()?.TotalCount ?? 0,
                PageSize = SearchModel.PageSize,
                CurrentPage = SearchModel.CurrentPage
            };
            return Ok(result);
        }

        [HttpGet]
        [Route("GetTopPartnerDetailsById")]
        public IActionResult GetTopPartnerDetailsById(int TopPartnerId)
        {
            var results = _adminService.GetTopPartnerById(TopPartnerId);
            return Ok(results);
        }

        [HttpPost]
        [Route("AddNewTopPartner")]
        public async Task<IActionResult> AddNewTopPartner([FromForm] TopPartnerModel model)
        {
            var results = await _adminService.AddTopPartner(model);
            return Ok(results);
        }

        [HttpPost]
        [Route("EditTopPartner")]
        public async Task<IActionResult> EditTopPartner(int TopPartnerId, [FromForm] TopPartnerModel model)
        {
            var results = await _adminService.EditTopPartner(TopPartnerId, model);
            return Ok(results);
        }

        [HttpGet]
        [Route("DeleteTopPartner")]
        public IActionResult DeleteTopPartner(int TopPartnerId)
        {
            var results = _adminService.DeleteTopPartner(TopPartnerId);
            return Ok(results);
        }

        [HttpGet]
        [Route("ChangeTopPartnerActiveStatus")]
        public ActionsResponseModel ChangeTopPartnerActiveStatus(int TopPartnerId)
        {
            return _adminService.ChangeTopPartnerActiveStatus(TopPartnerId);
        }
        #endregion

        #region BestSellerItems

        [HttpGet]
        [Route("GetBestSellerItems_Data")]
        public IActionResult GetBestSellerItems_Data()
        {
            var data = _adminService.GetBestSellerItems_Data();
            return Ok(data);
        }


        [HttpPost]
        [Route("UpdateBestSellerItems")]
        public ActionsResponseModel UpdateBestSellerItems(List<BestSellerItemModel> BestSellerItems)
        {
            return _adminService.UpdateBestSellerItems(BestSellerItems);
        }
        #endregion
    }
}
