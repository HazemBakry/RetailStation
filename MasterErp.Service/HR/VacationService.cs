using MasterErp.Entities.Common;
using MasterErp.Entities.DTOs.HR;
using MasterErp.Entities.Models;
using MasterErp.Interface.Common;
using MasterErp.Interface.HR;
using MasterErp.Interface.Shared;
using MasterErp.Service.Common;
using MasterErp.Service.Shared;
using Microsoft.CodeAnalysis;
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


        public List<EmployeeVacationDto> GetEmployeeVacations(SearchFilterModel model)
        {
            DataTable dt = SharedService.MapFilterModelToDataTable(model?.FilterModel?.FilterItems);

            SqlParameter[] Params = new SqlParameter[4];
            Params[0] = new SqlParameter("@CurrentPage", model.CurrentPage);
            Params[1] = new SqlParameter("@PageSize", model.PageSize);
            Params[2] = new SqlParameter("@SearchText", model.SearchText);
            Params[3] = new SqlParameter("@FilterList", SqlDbType.Structured);
            Params[3].Value = dt;

            var result = SQLHelper.SQLQuery<EmployeeVacationDto>("[HR].[SP_GetEmployeeVacations]", ConnectionString, Params);
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
        
        
        public List<EmployeeVacationDto> GetVacationsByEmployeeId(int employeeId, SearchFilterModel searchModel)
        {
            var query = from vacation in Context.Vacations
                        join emp in Context.Employees on vacation.EmployeeId equals emp.EmployeeId
                        join vacationType in Context.VacationTypes on vacation.VacationTypeId equals vacationType.VacationTypeId
                        join alternativeEmp in Context.Employees on vacation.AlternativeEmployeeId equals alternativeEmp.EmployeeId into jT
                        from alternativeEmp in jT.DefaultIfEmpty()
                        where vacation.EmployeeId == employeeId
                        select new EmployeeVacationDto
                        {
                            EmployeeId = emp.EmployeeId,
                            EmployeeName = emp.FullNameEN,
                            VacationId = vacation.VacationId,
                            VacationTypeId = vacation.VacationTypeId,
                            VacationType = vacationType.NameEN,
                            AlternativeEmployeeId = vacation.AlternativeEmployeeId,
                            AlternativeEmployeeName = alternativeEmp.FullNameEN,
                            IsAlternativeAvailable = vacation.IsAlternativeAvailable,
                            FromDate = vacation.FromDate,
                            ToDate = vacation.ToDate,
                            LastDayWork = vacation.LastDayWork,
                            Period = vacation.Period, //(x.ToDate - x.FromDate).Days
                        };
            int totalCount = query.Count();
            if (searchModel.CurrentPage>0 && searchModel.PageSize >0)
            {
                int skip = (searchModel.CurrentPage - 1) * searchModel.PageSize;
                query = query.Skip(skip).Take(searchModel.PageSize);
            }

            var results = query.ToList();
            results.ForEach(x => x.TotalCount = totalCount);
            return results;
        }
        public ActionsResponseModel AddNewEmployeeVacation(int EmployeeId,EmployeeVacationDto model)
        {
            try
            {
                var vacation = new Vacation();
                vacation.EmployeeId = EmployeeId;
                vacation.FromDate=model.FromDate;
                vacation.ToDate=model.ToDate;
                vacation.LastDayWork=model.LastDayWork;
                vacation.VacationTypeId=model.VacationTypeId;
                vacation.Period = (model.ToDate - model.FromDate).Days;
                vacation.Notes=model.Notes;
                vacation.InsertDate = DateTime.Now;
                vacation.InsertUser = string.Empty;
                vacation.IsAlternativeAvailable=model.IsAlternativeAvailable;
                if (model.IsAlternativeAvailable)
                    vacation.AlternativeEmployeeId = model.AlternativeEmployeeId;
                Context.Vacations.Add(vacation);
                var result = Context.SaveChanges();

                
                return new ActionsResponseModel { Message = "Vacation Applied Successfly !" };
            }
            catch (Exception ex)
            {
                return new ActionsResponseModel { IsSuccess=false,Message=ex.InnerException?.Message ?? ex.Message};
            }

        }

        public ActionsResponseModel EditVacation(int EmployeeId, EmployeeVacationDto model)
        {
            try
            {
                var vacation = Context.Vacations.FirstOrDefault(i => i.VacationId == model.VacationId);
                if (vacation != null)
                {
                    //vacation.EmployeeId = EmployeeId;
                    vacation.FromDate = model.FromDate;
                    vacation.ToDate = model.ToDate;
                    vacation.LastDayWork = model.LastDayWork;
                    vacation.Period = (model.ToDate - model.FromDate).Days;
                    vacation.Notes = model.Notes;
                    vacation.UpdateDate = DateTime.Now;
                    vacation.UpdateUser = string.Empty;
                    vacation.IsAlternativeAvailable = model.IsAlternativeAvailable;
                    if (model.IsAlternativeAvailable)
                        vacation.AlternativeEmployeeId = model.AlternativeEmployeeId;
                    else
                        vacation.AlternativeEmployeeId = null;

                    Context.SaveChanges();


                    return new ActionsResponseModel { Message = "Vacation Updated Successfly !" };
                }
                else
                    return new ActionsResponseModel { IsSuccess = false, Message = "Vacation not found" };
            }
            catch (Exception ex)
            {
                return new ActionsResponseModel { IsSuccess = false, Message = ex.InnerException?.Message ?? ex.Message };
            }

        }
        public List<SelectorDataModel> GetVacationTypesSelector()
        {
            var result = Context.VacationTypes.Select(vt => new SelectorDataModel
            {
                Id = vt.VacationTypeId,
                Name = vt.NameEN
            }).ToList();

            return result;
        }

        public ActionsResponseModel DeleteVacation(int VacationId)
        {
            try
            {
                var Vacation = Context.Vacations.FirstOrDefault(i => i.VacationId == VacationId);
                if (Vacation != null)
                {
                    Context.Remove(Vacation);
                    Context.SaveChanges();
                    return new ActionsResponseModel { Message = "Vacation deleted successfly !" };
                }
                else
                    return  new ActionsResponseModel { IsSuccess = false, Message = "Vacation not found" }; ;
            }
            catch (Exception ex)
            {
                return new ActionsResponseModel { IsSuccess = false, Message = ex.InnerException?.Message ?? ex.Message };
            }

        }
    }
}
