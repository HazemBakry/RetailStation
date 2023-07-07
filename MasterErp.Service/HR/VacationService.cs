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
    public class VacationService: IVacationService
    {
        private readonly DBContext Context;

        public VacationService(DBContext context)
        {
            Context = context;
        }


        public DataTable GetVacationData()
        {
            var results = (from emp in Context.Employees.ToList()
                           join vacation in Context.Vacations.ToList() on emp.EmployeeId equals vacation.EmployeeID
                           select new
                           {
                               EmployeeId = emp.EmployeeId,
                               EmployeeName = emp.FullNameEN,
                               VacationId = vacation.VacationID,
                               AlternativeAvailable = vacation.AlternativeAvailable,
                               AlternativeEmployee = vacation.AlternativeEmployee,
                               FromDate = vacation.FromDate,
                               ToDate = vacation.ToDate,
                               LastDayWork = vacation.LastDayWork,
                               Period = vacation.Period,
                           }).ToList().ToDataTable();
            return results;

        }

        public bool AddNewVacation(Vacation model)
        {
            try
            {
                Context.Vacations.Add(new Vacation
                {
                    EmployeeID = model.EmployeeID,
                    AlternativeEmployee = model.AlternativeEmployee,
                    FromDate = model.FromDate,
                    ToDate = model.ToDate,
                    LastDayWork = model.LastDayWork,
                    Period = model.Period,
                    InsertDate = DateTime.Now
                });

                Context.SaveChanges();
                return true;
            }
            catch (Exception)
            {
                return false;
            }

        }

        public bool EditVacation(Vacation model)
        {
            try
            {
                var Vacation = Context.Vacations.FirstOrDefault(i => i.VacationID == model.VacationID);
                if (Vacation != null)
                {
                    Vacation.AlternativeEmployee = model.AlternativeEmployee;
                    Vacation.FromDate = model.FromDate;
                    Vacation.ToDate = model.ToDate;
                    Vacation.LastDayWork = model.LastDayWork;
                    Vacation.Period = model.Period;
                    Vacation.UpdateDate = DateTime.Now;

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

        public bool DeleteVacation(int VacationId)
        {
            try
            {
                var Vacation = Context.Vacations.FirstOrDefault(i => i.VacationID == VacationId);
                if (Vacation != null)
                {
                    Context.Remove(Vacation);
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
