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
    public class PenaltyService : IPenaltyService
    {
        private readonly DBContext Context;

        public PenaltyService(DBContext context)
        {
            Context = context;
        }

        public DataTable GetPenaltyData()
        {
            var results = (from emp in Context.Employee.ToList()
                           join penalty in Context.Penalty.ToList() on emp.EmployeeId equals penalty.EmployeeID
                           select new
                           {
                               EmployeeId = emp.EmployeeId,
                               EmployeeName = emp.FirstNameEN + " " + emp.LastNameEN,
                               PenaltyId = penalty.PenaltyID,
                               PenaltyDate = penalty.PenaltyDate,
                               MoneyAmount = penalty.MoneyAmount,
                               ExecutionDate = penalty.ExecutionDate,
                               IsActive = penalty.IsActive,
                               DeductionByDays = penalty.DeductionByDays,
                               DeductionAmount = penalty.DeductionAmount,
                               Reason = penalty.Reason,
                           }).ToList().ToDataTable();
            return results;

        }

        public bool AddNewPenalty(Penalty model)
        {
            try
            {
                Context.Penalty.Add(new Penalty
                {
                    EmployeeID = model.EmployeeID,
                    PenaltyDate = model.PenaltyDate,
                    MoneyAmount = model.MoneyAmount,
                    ExecutionDate = model.ExecutionDate,
                    DeductionByDays = model.DeductionByDays,
                    DeductionAmount = model.DeductionAmount,
                    Reason = model.Reason,
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

        public bool EditPenalty(Penalty model)
        {
            try
            {
                var Penalty = Context.Penalty.FirstOrDefault(i => i.PenaltyID == model.PenaltyID);
                if (Penalty != null)
                {
                    Penalty.PenaltyDate = model.PenaltyDate;
                    Penalty.MoneyAmount = model.MoneyAmount;
                    Penalty.ExecutionDate = model.ExecutionDate;
                    Penalty.DeductionByDays = model.DeductionByDays;
                    Penalty.DeductionAmount = model.DeductionAmount;
                    Penalty.Reason = model.Reason;
                    Penalty.UpdateDate = DateTime.Now;

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

        public bool DeletePenalty(int PenaltyId)
        {
            try
            {
                var Penalty = Context.Penalty.FirstOrDefault(i => i.PenaltyID == PenaltyId);
                if (Penalty != null)
                {
                    Context.Remove(Penalty);
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
