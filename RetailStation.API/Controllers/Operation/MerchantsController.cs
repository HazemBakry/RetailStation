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

namespace RetailStation.API.Controllers.Operation
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]

    public class MerchantsController : Controller
    {
        private readonly IMerchantsService _merchantsService;

        public MerchantsController(IMerchantsService merchantsService)
        {
            _merchantsService = merchantsService;
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
        public IActionResult GetMerchantDetailsById(SearchFilterModel model, int MerchantId)
        {
            var result = _merchantsService.GetMerchantDetailsById(model, MerchantId);
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



    }
}
