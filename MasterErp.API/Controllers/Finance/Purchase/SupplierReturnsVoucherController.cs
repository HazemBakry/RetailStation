using MasterErp.Entities.Common;
using MasterErp.Entities.Common.Finance.Purchases;
using MasterErp.Entities.Models;
using MasterErp.Interface.Purchase;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Data;

namespace MasterErp.API.Controllers.Finance.Purchase
{
    [Route("api/[controller]")]
    [ApiController]
    public class SupplierReturnsVoucherController : ControllerBase
    {
        private readonly ISupplierReturnsVoucherService _SupplierReturnsVoucherService;
        public SupplierReturnsVoucherController(ISupplierReturnsVoucherService SupplierReturnsVoucherService)
        {
            _SupplierReturnsVoucherService= SupplierReturnsVoucherService;

        }


        [HttpPost]
        [Route("GetSupplierReturnsVoucherData")]
        public IActionResult GetSupplierReturnsVoucherData(FilterModel model)
        {
            var results= _SupplierReturnsVoucherService.GetSupplierReturnsVoucherData(model);
        
            return Ok(results);
        }

        [HttpPost]
        [Route("CreateNewSupplierReturnsVoucher")]
        public IActionResult CreateNewSupplierReturnsVoucher(OrderModel Model)
        {
            var results = _SupplierReturnsVoucherService.CreateNewSupplierReturnsVoucher(Model);
            return Ok(results);
        }
    }
}
