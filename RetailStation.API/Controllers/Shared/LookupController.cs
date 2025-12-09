using RetailStation.Entities.Common;
using RetailStation.Interface.Shared;
using RetailStation.Service.Shared;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;

namespace RetailStation.API.Controllers.Shared
{

    [Route("api/[controller]")]
    [ApiController]
    //[Authorize]

    public class LookupController : ControllerBase
    {
        private readonly ILookupService lookupService;
        public LookupController(ILookupService _lookupService)
        {
            lookupService = _lookupService;
        }

        #region Global Lookups
        [HttpGet]
        [Route("GetPaymentMethods")]
        public IActionResult GetPaymentMethods()
        {
            var results = lookupService.GetPaymentMethods();
            return Ok(results);
        }


        #endregion

    }
}