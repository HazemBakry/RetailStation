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

    public class OverTimeController : ControllerBase
    {
        private readonly IOverTimeService _overTimeService;

        public OverTimeController(IOverTimeService overTimeService)
        {
            _overTimeService = overTimeService;
        }

        [HttpGet]
        [Route("GetAllEmployeeOverTime")]
        public IActionResult GetAllEmployeeOverTime(SearchFilterModel SearchModel)
        {
            var data= _overTimeService.GetAllEmployeeOverTime(SearchModel);
            var result = new PagedResponseModel<EmployeeOverTimeDto>
            {
                Results = data,
                TotalCount = data.FirstOrDefault()?.TotalCount ?? 0,
                PageSize = SearchModel.PageSize,
                CurrentPage = SearchModel.CurrentPage

            };
            return Ok(result);
        }

        [HttpPost]
        [Route("GetOverTimeByEmployeeId")]
        public IActionResult GetOverTimeByEmployeeId(int EmployeeId, SearchFilterModel SearchModel)
        {
            var data = _overTimeService.GetOverTimeByEmployeeId(EmployeeId, SearchModel);
            var result = new PagedResponseModel<EmployeeOverTimeDto>
            {
                Results = data,
                TotalCount = data.FirstOrDefault()?.TotalCount ?? 0,
                PageSize = SearchModel.PageSize,
                CurrentPage = SearchModel.CurrentPage

            };
            return Ok(result);
        }
        [HttpPost]
        [Route("AddNewEmployeeOverTime")]
        public IActionResult AddNewEmployeeOverTime(int EmployeeId, EmployeeOverTimeDto model)
        {
            var result = _overTimeService.AddNewEmployeeOverTime(EmployeeId, model);
            return Ok(result);
        }

        [HttpPost]
        [Route("EditEmployeeOverTime")]
        public IActionResult EditEmployeeOverTime(int EmployeeId, EmployeeOverTimeDto model)
        {
            var result = _overTimeService.EditEmployeeOverTime(EmployeeId, model);

            return Ok(result);
        }

        [HttpGet]
        [Route("DeleteEmployeeOverTime")]
        public IActionResult DeleteEmployeeOverTime(int OverTimeId)
        {
            var result = _overTimeService.DeleteEmployeeOverTime(OverTimeId);
            return Ok(result);
        }


        [HttpPost]
        [Route("ApproveEmployeeOverTime")]
        public IActionResult ApproveEmployeeOverTime(bool IsApproved, List<int> RowsId)
        {
            var result = _overTimeService.ApproveEmployeeOverTime(IsApproved, RowsId);
            return Ok(result);
        }

    }
}
