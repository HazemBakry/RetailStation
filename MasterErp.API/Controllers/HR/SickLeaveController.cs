using MasterErp.Entities.Common;
using MasterErp.Entities.DTOs.HR;
using MasterErp.Entities.Models;
using MasterErp.Interface.HR;
using MasterErp.Service.HR;
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
    public class SickLeaveController : ControllerBase
    {
        private readonly ISickLeaveService _sickLeaveService;

        public SickLeaveController(ISickLeaveService sickLeaveService)
        {
            _sickLeaveService = sickLeaveService;
        }

        [HttpGet]
        [Route("GetAllEmployeeSickLeaves")]
        public IActionResult GetAllEmployeeSickLeaves(SearchFilterModel SearchModel)
        {
            var data = _sickLeaveService.GetAllEmployeeSickLeaves(SearchModel);
            var result = new PagedResponseModel<EmployeeSickLeaveDto>
            {
                Results = data,
                TotalCount = data.FirstOrDefault()?.TotalCount ?? 0,
                PageSize = SearchModel.PageSize,
                CurrentPage = SearchModel.CurrentPage

            };
            return Ok(result);
        }

        [HttpPost]
        [Route("GetSickLeavesByEmployeeId")]
        public IActionResult GetSickLeavesByEmployeeId(int EmployeeId, SearchFilterModel SearchModel)
        {
            var data = _sickLeaveService.GetSickLeavesByEmployeeId(EmployeeId, SearchModel);
            var result = new PagedResponseModel<EmployeeSickLeaveDto>
            {
                Results = data,
                TotalCount = data.FirstOrDefault()?.TotalCount ?? 0,
                PageSize = SearchModel.PageSize,
                CurrentPage = SearchModel.CurrentPage

            };
            return Ok(result);
        }
        [HttpPost]
        [Route("AddNewEmployeeSickLeave")]
        public IActionResult AddNewEmployeeSickLeave(int EmployeeId, EmployeeSickLeaveDto model)
        {
            var result = _sickLeaveService.AddNewEmployeeSickLeave(EmployeeId, model);
            return Ok(result);
        }

        [HttpPost]
        [Route("EditEmployeeSickLeave")]
        public IActionResult EditEmployeeSickLeave(int EmployeeId, EmployeeSickLeaveDto model)
        {
            var result = _sickLeaveService.EditEmployeeSickLeave(EmployeeId, model);

            return Ok(result);
        }

        [HttpGet]
        [Route("DeleteEmployeeSickLeave")]
        public IActionResult DeleteEmployeeSickLeave(int SickLeaveId)
        {
            var result = _sickLeaveService.DeleteEmployeeSickLeave(SickLeaveId);
            return Ok(result);
        }
        [HttpPost]
        [Route("ApproveEmployeeSickLeaves")]
        public IActionResult ApproveEmployeeSickLeaves(bool IsApproved, List<int> RowsId)
        {
            var result = _sickLeaveService.ApproveEmployeeSickLeaves(IsApproved, RowsId);
            return Ok(result);
        }
    }
}
