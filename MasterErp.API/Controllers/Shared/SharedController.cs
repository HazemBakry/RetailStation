using MasterErp.Entities.Models;
using MasterErp.Interface.Shared;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;

namespace MasterErp.API.Controllers.Shared
{
    [Route("api/[controller]")]
    [ApiController]
    public class SharedController : ControllerBase
    {
        private readonly ISharedService _sharedService;
        public SharedController(ISharedService sharedService)
        {
            _sharedService = sharedService;

        }
        [HttpGet]
        [Route("GetCustomersData")]
        public IActionResult GetCustomersData() 
        {
            var results=_sharedService.GetCustomersData();  
            return Ok(results);
        }


        [HttpGet]
        [Route("GetReceiptLedgersData")]
        public IActionResult GetReceiptLedgersData()
        {
            var results = _sharedService.GetReceiptLedgersData();
            return Ok(results);
        }

        [HttpGet]
        [Route("GetAccountsList")]
        public List<AccountTree> GetAccountsList(bool IsParent)
        {
            return _sharedService.GetAccountsList(IsParent);
        }
        [HttpGet]
        [Route("GetAccountsByTypeId")]
        public List<AccountTree> GetAccountsByTypeId(int TypeId)
        {
            return _sharedService.GetAccountsByTypeId(TypeId);
        }
    }
}
