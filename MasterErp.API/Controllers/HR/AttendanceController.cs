using MasterErp.Entities.Common;
using MasterErp.Entities.DTOs.HR;
using MasterErp.Entities.Models.HR;
using MasterErp.Interface.HR;
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
    public class AttendanceController : ControllerBase
    {
        private readonly IAttendanceService _attendanceService;

        public AttendanceController(IAttendanceService attendanceService)
        {
            _attendanceService = attendanceService;
        }

        [HttpPost]
        [Route("GetAttendanceReport_Data")]
        public IActionResult GetAttendanceReport_Data(DateTime? FromDate, DateTime? ToDate, SearchFilterModel SearchModel)
        {
            var data = _attendanceService.GetAttendanceReport_Data(FromDate, ToDate, SearchModel);
            var result = new PagedResponseModel<EmployeeAttendanceModel>
            {
                Results = data,
                TotalCount = data.FirstOrDefault()?.TotalCount ?? 0,
                PageSize = SearchModel.PageSize,
                CurrentPage = SearchModel.CurrentPage

            };
            return Ok(result);
        }
        [HttpPost]
        [Route("GetAdvancedAttendanceReport_Data")]
        public IActionResult GetAdvancedAttendanceReport_Data(DateTime? FromDate, DateTime? ToDate, SearchFilterModel SearchModel)
        {
            var data = _attendanceService.GetAdvancedAttendanceReport_Data(FromDate,ToDate,SearchModel);
            var result = new PagedResponseModel<EmployeeAdvancedAttendanceModel>
            {
                Results = data,
                TotalCount = data.FirstOrDefault()?.TotalCount ?? 0,
                PageSize = SearchModel.PageSize,
                CurrentPage = SearchModel.CurrentPage

            };
            return Ok(result);
        }
        [HttpPost]
        [Route("ApproveEmployeesAttendance")]
        public IActionResult ApproveEmployeesAttendance(DateTime? FromDate, DateTime? ToDate, SearchFilterModel SearchModel)
        {
            var result = _attendanceService.ApproveEmployeesAttendance(FromDate,ToDate,SearchModel);
            return Ok(result);
        }

        [HttpPost]
        [Route("GetAttendance_Data")]
        public IActionResult GetAttendance_Data(SearchFilterModel SearchModel)
        {
            var data = _attendanceService.GetAttendance_Data(SearchModel);
            var result = new PagedResponseModel<EmployeeAttendanceModel>
            {
                Results = data,
                TotalCount = data.FirstOrDefault()?.TotalCount ?? 0,
                PageSize = SearchModel.PageSize,
                CurrentPage = SearchModel.CurrentPage

            };
            return Ok(result);
        }


        [HttpPost]
        [Route("AddNewAttendance")]
        public bool AddNewAttendance(Attendance model)
        {
            return _attendanceService.AddNewAttendance(model);
        }

        [HttpPost]
        [Route("EditAttendance")]
        public bool EditAttendance(Attendance model)
        {
            return _attendanceService.EditAttendance(model);
        }

        [HttpGet]
        [Route("DeleteAttendance")]
        public bool DeleteAttendance(int AttendanceId)
        {
            return _attendanceService.DeleteAttendance(AttendanceId);
        }


        #region Salaries based on attendance
        [HttpPost]
        [Route("GetEmployeeSalarySummary")]
        public IActionResult GetEmployeeSalarySummary(int Year, int Month, SearchFilterModel SearchModel)
        {
            var data = _attendanceService.GetEmployeeSalarySummary(Year, Month, SearchModel);
            var result = new PagedResponseModel<EmployeeSalarySummaryModel>
            {
                Results = data,
                TotalCount = data.FirstOrDefault()?.TotalCount ?? 0,
                PageSize = SearchModel.PageSize,
                CurrentPage = SearchModel.CurrentPage

            };
            return Ok(result);
        }
        #endregion

        #region Employee Dues

        [HttpPost]
        [Route("GetEmployeeDues")]
        public IActionResult GetEmployeeDues(int EmployeeId, SearchFilterModel SearchModel)
        {
            var data = _attendanceService.GetEmployeeDues(EmployeeId, SearchModel);
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
            var result = _attendanceService.GetEmployeeDueStartDate(EmployeeId);
            
            return Ok(result);
        }
        [HttpPost]
        [Route("CalculateEmployeeDue")]
        public IActionResult CalculateEmployeeDue(int EmployeeId, EmployeeDueModel Model)
        {
            var result = _attendanceService.CalculateEmployeeDue(EmployeeId, Model);
            
            return Ok(result);
        }

        [HttpPost]
        [Route("SaveEmployeeDue")]
        public IActionResult SaveEmployeeDue(int EmployeeId, EmployeeDueModel Model)
        {
            var result = _attendanceService.SaveEmployeeDue(EmployeeId, Model);

            return Ok(result);
        }
        #endregion

    }
}
