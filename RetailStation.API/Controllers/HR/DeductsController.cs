using RetailStation.Entities.Common;
using RetailStation.Entities.DTOs.HR;
using RetailStation.Interface.HR;
using RetailStation.Service.HR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;

namespace RetailStation.API.Controllers.HR
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]

    public class DeductsController : ControllerBase
    {
        private readonly IDeductsService _deductssService;
        public DeductsController(IDeductsService deductssService)
        {
            _deductssService = deductssService;
        }

        [HttpGet]
        [Route("GetAllEmployeeDeducts")]
        public IActionResult GetAllEmployeeDeducts(SearchFilterModel SearchModel)
        {
            var data = _deductssService.GetAllEmployeeDeducts(SearchModel);
            var result = new PagedResponseModel<EmployeeDeductDto>
            {
                Results = data,
                TotalCount = data.FirstOrDefault()?.TotalCount ?? 0,
                PageSize = SearchModel.PageSize,
                CurrentPage = SearchModel.CurrentPage

            };
            return Ok(result);
        }

        [HttpPost]
        [Route("GetDeductsByEmployeeId")]
        public IActionResult GetDeductsByEmployeeId(int EmployeeId, SearchFilterModel SearchModel)
        {
            var data = _deductssService.GetDeductsByEmployeeId(EmployeeId, SearchModel);
            var result = new PagedResponseModel<EmployeeDeductDto>
            {
                Results = data,
                TotalCount = data.FirstOrDefault()?.TotalCount ?? 0,
                PageSize = SearchModel.PageSize,
                CurrentPage = SearchModel.CurrentPage

            };
            return Ok(result);
        }
        [HttpPost]
        [Route("AddNewEmployeeDeduct")]
        public IActionResult AddNewEmployeeDeduct(int EmployeeId, EmployeeDeductDto model)
        {
            var result = _deductssService.AddNewEmployeeDeduct(EmployeeId, model);
            return Ok(result);
        }

        [HttpPost]
        [Route("EditEmployeeDeduct")]
        public IActionResult EditEmployeeDeduct(int EmployeeId, EmployeeDeductDto model)
        {
            var result = _deductssService.EditEmployeeDeduct(EmployeeId, model);

            return Ok(result);
        }

        [HttpGet]
        [Route("DeleteEmployeeDeduct")]
        public IActionResult DeleteEmployeeDeduct(int DeductId)
        {
            var result = _deductssService.DeleteEmployeeDeduct(DeductId);
            return Ok(result);
        }


        [HttpGet]
        [Route("GetDeductTypesSelector")]
        public IActionResult GetDeductTypesSelector()
        {
            var result = _deductssService.GetDeductTypesSelector();
            return Ok(result);
        }

        [HttpPost]
        [Route("ApproveEmployeeDeducts")]
        public IActionResult ApproveEmployeeDeducts(bool IsApproved,List<int> RowsId)
        {
            var result = _deductssService.ApproveEmployeeDeducts(IsApproved,RowsId);
            return Ok(result);
        }

    }
}
