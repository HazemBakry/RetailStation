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
    public class OverTimeService : IOverTimeService
    {
        private readonly DBContext Context;

        public OverTimeService(DBContext context)
        {
            Context = context;
        }

        public DataTable GetOverTimeData()
        {
            var results = (from emp in Context.Employee.ToList()
                           join overtime in Context.OverTime.ToList() on emp.EmployeeId equals overtime.EmployeeID
                           select new
                           {
                               EmployeeId = emp.EmployeeId,
                               EmployeeName = emp.FirstNameEN + " " + emp.LastNameEN,
                               OverTimeId = overtime.OverTimeID,
                               NoHours = overtime.NoHours,
                               MoneyAmount = overtime.MoneyAmount,
                               ExecutionDate = overtime.ExecutionDate,
                               RequestDate = overtime.RequestDate,
                               IsActive = overtime.IsActive
                           }).ToList().ToDataTable();
            return results;

        }

        public bool AddNewOverTime(OverTime model)
        {
            try
            {
                Context.OverTime.Add(new OverTime
                {
                    EmployeeID = model.EmployeeID,
                    ExecutionDate = model.ExecutionDate,
                    RequestDate = model.RequestDate,
                    NoHours = model.NoHours,
                    MoneyAmount = model.MoneyAmount,
                    InsertDate = DateTime.Now
                });

                Context.SaveChanges();
                return true;
            }
            catch (Exception ex)
            {
                return false;
            }

        }

        public bool EditOverTime(OverTime model)
        {
            try
            {
                var OverTime = Context.OverTime.FirstOrDefault(i => i.OverTimeID == model.OverTimeID);
                if (OverTime != null)
                {
                    OverTime.ExecutionDate = model.ExecutionDate;
                    OverTime.RequestDate = model.RequestDate;
                    OverTime.NoHours = model.NoHours;
                    OverTime.MoneyAmount = model.MoneyAmount;
                    OverTime.UpdateDate = DateTime.Now;

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

        public bool DeleteOverTime(int OverTimeId)
        {
            try
            {
                var OverTime = Context.OverTime.FirstOrDefault(i => i.OverTimeID == OverTimeId);
                if (OverTime != null)
                {
                    Context.Remove(OverTime);
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
