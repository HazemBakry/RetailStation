using MasterErp.Entities.Common;
using MasterErp.Entities.DTOs.HR;
using MasterErp.Entities.Models;
using MasterErp.Interface.Common;
using MasterErp.Interface.HR;
using MasterErp.Interface.Shared;
using MasterErp.Service.Common;
using MasterErp.Service.Shared;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Service.HR
{
    public class VacationService : IVacationService
    {
        private readonly DBContext Context;
        private readonly IConfiguration Configuration;
        private readonly ISQLHelper SQLHelper;
        private readonly ISharedService SharedService;
        private readonly string ConnectionString;

        public VacationService(DBContext Context, ISQLHelper SQLHelper, ISharedService SharedService, IConfiguration Configuration)
        {
            this.Context = Context;
            this.SQLHelper = SQLHelper;
            this.SharedService = SharedService;
            this.Configuration = Configuration;
            ConnectionString = Configuration.GetConnectionString("DBConnection");
        }


        public List<EmployeeVacation> GetEmployeeVacations(SearchFilterModel model)
        {
            DataTable dt = SharedService.MapFilterModelToDataTable(model?.FilterModel?.FilterItems);

            SqlParameter[] Params = new SqlParameter[4];
            Params[0] = new SqlParameter("@CurrentPage", model.CurrentPage);
            Params[1] = new SqlParameter("@PageSize", model.PageSize);
            Params[2] = new SqlParameter("@SearchText", model.SearchText);
            Params[3] = new SqlParameter("@FilterList", SqlDbType.Structured);
            Params[3].Value = dt;

            var result = SQLHelper.SQLQuery<EmployeeVacation>("[HR].[SP_GetEmployeeVacations]", ConnectionString, Params);
            return result;

            //var results = (from emp in Context.Employees.ToList()
            //               join vacation in Context.Vacations.ToList() on emp.EmployeeId equals vacation.EmployeeID
            //               select new
            //               {
            //                   EmployeeId = emp.EmployeeId,
            //                   EmployeeName = emp.FullNameEN,
            //                   VacationId = vacation.VacationID,
            //                   AlternativeAvailable = vacation.AlternativeAvailable,
            //                   AlternativeEmployee = vacation.AlternativeEmployee,
            //                   FromDate = vacation.FromDate,
            //                   ToDate = vacation.ToDate,
            //                   LastDayWork = vacation.LastDayWork,
            //                   Period = vacation.Period,
            //               }).ToList().ToDataTable();
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
