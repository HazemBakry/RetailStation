using RetailStation.Entities.Common;
using RetailStation.Entities.DTOs.HR;
using RetailStation.Entities.Models.HR;
using RetailStation.Interface.HR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;

namespace RetailStation.API.Controllers.HR
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
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


    }
}
