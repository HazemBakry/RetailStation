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
