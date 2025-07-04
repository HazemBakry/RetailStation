using MasterErp.Entities.Common;
using MasterErp.Entities.DTOs.HR;
using MasterErp.Entities.Models.HR;
using MasterErp.Interface.HR;
using MasterErp.Service.HR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;

namespace MasterErp.API.Controllers.HR
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class SalariesController : ControllerBase
    {
        private readonly ISalariesService _salariesService;

        public SalariesController(ISalariesService salariesService)
        {
            _salariesService = salariesService;
        }


        #region Salaries based on attendance
        [HttpPost]
        [Route("GetEmployeeSalarySummary")]
        public IActionResult GetEmployeeSalarySummary(int Year, int Month, SearchFilterModel SearchModel)
        {
            var data = _salariesService.GetEmployeeSalarySummary(Year, Month, SearchModel);
            var result = new PagedResponseModel<EmployeeSalarySummaryModel>
            {
                Results = data,
                TotalCount = data.FirstOrDefault()?.TotalCount ?? 0,
                PageSize = SearchModel.PageSize,
                CurrentPage = SearchModel.CurrentPage

            };
            return Ok(result);
        }         
        [HttpPost]
        [Route("GetEmployeeSalarySummary_Export")]
        public IActionResult GetEmployeeSalarySummary_Export(int Year, int Month, SearchFilterModel SearchModel)
        {
            var result = _salariesService.GetEmployeeSalarySummary_Export(Year, Month, SearchModel);
            
            return Ok(result);
        } 
        [HttpPost]
        [Route("ApproveMonthlySalary")]
        public IActionResult ApproveMonthlySalary(int Year, int Month, SearchFilterModel SearchModel)
        {
            var result = _salariesService.ApproveMonthlySalary(Year, Month, SearchModel);
            return Ok(result);
        }
        #endregion

        #region Employee Dues

        [HttpPost]
        [Route("GetEmployeeDues")]
        public IActionResult GetEmployeeDues(int EmployeeId, SearchFilterModel SearchModel)
        {
            var data = _salariesService.GetEmployeeDues(EmployeeId, SearchModel);
            var result = new PagedResponseModel<EmployeeDueModel>
            {
                Results = data,
                TotalCount = data.FirstOrDefault()?.TotalCount ?? 0,
                PageSize = SearchModel.PageSize,
                CurrentPage = SearchModel.CurrentPage

            };
            return Ok(result);
        }


        [HttpGet]
        [Route("GetEmployeeDueStartDate")]
        public IActionResult GetEmployeeDueStartDate(int EmployeeId)
        {
            var result = _salariesService.GetEmployeeDueStartDate(EmployeeId);
            
            return Ok(result);
        }
        [HttpPost]
        [Route("CalculateEmployeeDue")]
        public IActionResult CalculateEmployeeDue(int EmployeeId, EmployeeDueModel Model)
        {
            var result = _salariesService.CalculateEmployeeDue(EmployeeId, Model);
            
            return Ok(result);
        }

        [HttpPost]
        [Route("SaveEmployeeDue")]
        public IActionResult SaveEmployeeDue(int EmployeeId, EmployeeDueModel Model)
        {
            var result = _salariesService.SaveEmployeeDue(EmployeeId, Model);

            return Ok(result);
        }
        #endregion

    }
}
