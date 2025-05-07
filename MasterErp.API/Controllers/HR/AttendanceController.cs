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


        [HttpGet]
        [Route("GetAttendance_Data")]
        public DataTable GetAttendance_Data()
        {
            return _attendanceService.GetAttendance_Data();
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
