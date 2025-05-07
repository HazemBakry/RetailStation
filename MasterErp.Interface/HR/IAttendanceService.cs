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
        DataTable GetAttendance_Data();
        bool AddNewAttendance(Attendance model);
        bool EditAttendance(Attendance model);
        bool DeleteAttendance(int AttendanceId);
    }
}
