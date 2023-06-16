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
    public class SickLeaveService : ISickLeaveService
    {
        private readonly DBContext Context;

        public SickLeaveService(DBContext context)
        {
            Context = context;
        }

        public DataTable GetSickLeaveData()
        {
            var results = (from emp in Context.Employee.ToList()
                           join sickleave in Context.SickLeave.ToList() on emp.EmployeeId equals sickleave.EmployeeID
                           select new
                           {
                               EmployeeId = emp.EmployeeId,
                               EmployeeName = emp.FullNameEN,
                               SickLeaveId = sickleave.SickLeaveID,
                               RequestDate = sickleave.RequestDate,
                               ExecutionDate = sickleave.ExecutionDate,
                               NoDays = sickleave.NoDays,
                               MoneyAmount = sickleave.MoneyAmount,
                               IsActive = sickleave.IsActive,
                           }).ToList().ToDataTable();
            return results;

        }

        public bool AddNewSickLeave(SickLeave model)
        {
            try
            {
                Context.SickLeave.Add(new SickLeave
                {
                    EmployeeID = model.EmployeeID,
                    RequestDate = model.RequestDate,
                    ExecutionDate = model.ExecutionDate,
                    NoDays = model.NoDays,
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

        public bool EditSickLeave(SickLeave model)
        {
            try
            {
                var SickLeave = Context.SickLeave.FirstOrDefault(i => i.SickLeaveID == model.SickLeaveID);
                if (SickLeave != null)
                {
                    SickLeave.RequestDate = model.RequestDate;
                    SickLeave.ExecutionDate = model.ExecutionDate;
                    SickLeave.NoDays = model.NoDays;
                    SickLeave.MoneyAmount = model.MoneyAmount;
                    SickLeave.UpdateDate = DateTime.Now;

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

        public bool DeleteSickLeave(int SickLeaveId)
        {
            try
            {
                var SickLeave = Context.SickLeave.FirstOrDefault(i => i.SickLeaveID == SickLeaveId);
                if (SickLeave != null)
                {
                    Context.Remove(SickLeave);
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
