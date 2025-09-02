using MasterErp.Entities.Common;
using MasterErp.Entities.DTOs.HR;
using MasterErp.Entities.Models.HR;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Interface.HR
{
    public interface IAttendanceService
    {
        List<EmployeeAttendanceModel> GetAttendanceReport_Data(DateTime? FromDate, DateTime? ToDate, SearchFilterModel SearchModel);
        List<EmployeeAdvancedAttendanceModel> GetAdvancedAttendanceReport_Data(DateTime? FromDate, DateTime? ToDate, SearchFilterModel SearchModel);
        ActionsResponseModel ApproveEmployeesAttendance(DateTime? FromDate, DateTime? ToDate, SearchFilterModel SearchModel);
        List<EmployeeAttendanceModel> GetAttendance_Data(SearchFilterModel SearchModel);
        bool AddNewAttendance(Attendance model);
        bool EditAttendance(Attendance model);
        bool DeleteAttendance(int AttendanceId);

    }
}
