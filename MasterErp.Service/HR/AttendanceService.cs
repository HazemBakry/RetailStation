using MasterErp.Entities.Models;
using MasterErp.Interface.HR;
using MasterErp.Service.Common;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Service.HR
{
    public class AttendanceService : IAttendanceService
    {
        private readonly DBContext Context;

        public AttendanceService(DBContext context)
        {
            Context = context;
        }

        public DataTable GetAttendanceData()
        {
            var results = (from emp in Context.Employee.ToList()
                           join attendance in Context.Attendance.ToList() on emp.EmployeeId equals attendance.EmployeeID
                           select new
                           {
                               EmployeeId = emp.EmployeeId,
                               EmployeeName = emp.FirstNameEN + " " + emp.LastNameEN,
                               AttendanceID = attendance.AttendanceID,
                               RequestDate = attendance.RequestDate,
                               Type = attendance.Type,
                               FromDate = attendance.FromDate,
                               ToDate = attendance.ToDate,
                               NoOfDays = attendance.NoOfDays,
                               MoneyAmount = attendance.MoneyAmount,
                               ExecutionDate = attendance.ExecutionDate,
                               IsActive = attendance.IsActive
                           }).ToList().ToDataTable();
            return results;

        }

        public bool AddNewAttendance(Attendance model)
        {
            try
            {
                Context.Attendance.Add(new Attendance
                {
                    EmployeeID = model.EmployeeID,
                    ExecutionDate = model.ExecutionDate,
                    FromDate = model.FromDate,
                    ToDate = model.ToDate,
                    RequestDate = model.RequestDate,
                    Type = model.Type,
                    NoOfDays = model.NoOfDays,
                    MoneyAmount = model.MoneyAmount,
                    InserDate = DateTime.Now
                });

                Context.SaveChanges();
                return true;
            }
            catch (Exception ex)
            {
                return false;
            }

        }

        public bool EditAttendance(Attendance model)
        {
            try
            {
                var Attendance = Context.Attendance.FirstOrDefault(i => i.AttendanceID == model.AttendanceID);
                if (Attendance != null)
                {
                    Attendance.ExecutionDate = model.ExecutionDate;
                    Attendance.FromDate = model.FromDate;
                    Attendance.ToDate = model.ToDate;
                    Attendance.RequestDate = model.RequestDate;
                    Attendance.Type = model.Type;
                    Attendance.NoOfDays = model.NoOfDays;
                    Attendance.MoneyAmount = model.MoneyAmount;
                    Attendance.UpdateDate = DateTime.Now;

                    Context.SaveChanges();
                    return true;
                }
                else
                    return false;

            }
            catch (Exception)
            {
                return false;
            }

        }

        public bool DeleteAttendance(int AttendanceId)
        {
            try
            {
                var Attendance = Context.Attendance.FirstOrDefault(i => i.AttendanceID == AttendanceId);
                if (Attendance != null)
                {
                    Context.Remove(Attendance);
                    Context.SaveChanges();
                    return true;
                }
                else
                    return false;
            }
            catch (Exception)
            {
                return false;
            }

        }
    }
}
