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

    public class SuppliersController : Controller
    {
        private readonly ISuppliersService _suppliersService;

        public SuppliersController(ISuppliersService suppliersService)
        {
            _suppliersService = suppliersService;
        }

        [HttpPost]
        [Route("GetSuppliers_Data")]
        public IActionResult GetSuppliers_Data(SearchFilterModel model)
        {
            var data = _suppliersService.GetSuppliers_Data(model);
            var result = new PagedResponseModel<SupplierDto>
            {
                Results = data,
                TotalCount = data.FirstOrDefault()?.TotalCount ?? 0,
                PageSize = model.PageSize,
                CurrentPage = model.CurrentPage
            };
            return Ok(result);
        }

        [HttpPost]
        [Route("GetSupplierDetailsById")]
        public IActionResult GetSupplierDetailsById(SearchFilterModel model, int SupplierId)
        {
            var result = _suppliersService.GetSupplierDetailsById(model, SupplierId);
            return Ok(result);
        }

        [HttpGet]
        [Route("GetSuppliersByItemId")]
        public IActionResult GetSuppliersByItemId(int ItemId)
        {
            var data = _suppliersService.GetSuppliersByItemId(ItemId);
            var result = new PagedResponseModel<SupplierDto>
            {
                Results = data,
                TotalCount = data.FirstOrDefault()?.TotalCount ?? 0
            };
            return Ok(result);
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
