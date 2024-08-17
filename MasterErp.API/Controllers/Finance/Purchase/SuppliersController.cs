using MasterErp.Entities.Common;
using MasterErp.Entities.Common.Finance.Purchases;
using MasterErp.Entities.DTOs.Purchases;
using MasterErp.Entities.Models;
using MasterErp.Interface.Finance.Purchase;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;

namespace MasterErp.API.Controllers.Finance.Purchase
{
    [Route("api/[controller]")]
    [ApiController]
    public class SuppliersController : Controller
    {
        private readonly ISuppliersService _suppliersService;

        public SuppliersController(ISuppliersService suppliersService)
        {
            _suppliersService = suppliersService;
        }

        [HttpGet]
        [Route("GetSuppliersData")]
        public IActionResult GetSuppliersData()
        {
            var results = _suppliersService.GetAllSuppliers();
            return Ok(results);
        }
        [HttpGet]
        [Route("GetSupplierById")]
        public IActionResult GetSupplierById(int SupplierId)
        {
            var results = _suppliersService.GetSupplierById(SupplierId);
            return Ok(results);
        }

        [HttpPost]
        [Route("AddNewSupplier")]
        public IActionResult AddNewSupplier(SupplierDto model)
        {
           var results = _suppliersService.AddNewSupplier(model);
            return Ok(results);
        }

        [HttpPost]
        [Route("EditSupplier")]
        public IActionResult EditSupplier(int SupplierId, SupplierDto model)
        {
            var results = _suppliersService.EditSupplier(SupplierId, model);
            return Ok(results);
        }

        [HttpGet]
        [Route("DeleteSupplier")]
        public IActionResult DeleteSupplier(int SupplierId)
        {
            var results = _suppliersService.DeleteSupplier(SupplierId);
            return Ok(results);
        }

    }
}
