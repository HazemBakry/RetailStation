using MasterErp.Entities.Common;
using MasterErp.Entities.Common.Enums;
using MasterErp.Entities.Common.SQLTabeType;
using MasterErp.Entities.DTOs.HR;
using MasterErp.Entities.DTOs.Purchases;
using MasterErp.Entities.Models;
using MasterErp.Entities.Models.HR;
using MasterErp.Entities.Models.Purchases;
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

        public VacationService(DBContext Context, ISQLHelper SQLHelper, ISharedService SharedService, IConfiguration Configuration)
        {
            this.Context = Context;
            this.SQLHelper = SQLHelper;
            this.SharedService = SharedService;
            this.Configuration = Configuration;
            //ConnectionString = Configuration.GetConnectionString("DBConnection");
        }


        public List<EmployeeVacationDto> GetAllEmployeeVacationsData(SearchFilterModel SearchModel, int? EmployeeId = null, int? ManagerId = null)
        {
            var FilterList = SearchModel?.FilterList?.Select(f => new FilterList_TableType { ItemKey = string.Empty, CategoryName = f.CategoryName, ItemValue = f.ItemFlag }).ToList();
            SqlParameter[] param = new SqlParameter[3];

            param[0] = new SqlParameter("@CurrentPage", SearchModel.CurrentPage);
            param[1] = new SqlParameter("@PageSize", SearchModel.PageSize);
            param[2] = new SqlParameter("@FilterList", SqlDbType.Structured);
            param[2].Value = FilterList.ToDataTable();

            var result = SQLHelper.SQLQuery<EmployeeVacationDto>("[HR].[SP_GetEmployeeVacationsData]", null, param);
            return result;
        }

        public List<EmployeeVacationDto> GetVacationsByEmployeeId(int employeeId, SearchFilterModel SearchModel)
        {
            var query = from vacation in Context.Vacations
                        join emp in Context.Employees on vacation.EmployeeId equals emp.EmployeeId
                        join branch in Context.Branches on emp.BranchId equals branch.BranchId
                        join alternativeEmp in Context.Employees on vacation.AlternativeEmployeeId equals alternativeEmp.EmployeeId into jT
                        from alternativeEmp in jT.DefaultIfEmpty()
                        where vacation.EmployeeId == employeeId
                        select new EmployeeVacationDto
                        {
                            EmployeeId = emp.EmployeeId,
                            EmployeeName = emp.FullNameAR,
                            VacationId = vacation.VacationId,
                            VacationTypeId = vacation.VacationTypeId,
                            BranchName = branch.NameAR,
                            AlternativeEmployeeId = vacation.AlternativeEmployeeId,
                            AlternativeEmployeeName = alternativeEmp.FullNameAR,
                            IsAlternativeAvailable = vacation.IsAlternativeAvailable,
                            WorkflowStatusId = vacation.WorkflowStatusId,
                            FromDate = vacation.FromDate,
                            ToDate = vacation.ToDate,
                            LastDayWork = vacation.LastDayWork,
                            Period = vacation.Period, //(x.ToDate - x.FromDate).Days
                        };
            int totalCount = query.Count();
            if (SearchModel.CurrentPage>0 && SearchModel.PageSize >0)
            {
                int skip = (SearchModel.CurrentPage - 1) * SearchModel.PageSize;
                query = query.Skip(skip).Take(SearchModel.PageSize);
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
                vacation.CreatedDate = DateTime.Now;
                vacation.CreatedBy = model.CreatedBy;
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
                    vacation.ModifiedDate = DateTime.Now;
                    vacation.ModifiedBy = model.ModifiedBy;
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


        public ActionsResponseModel ApproveEmployeeVacation(int VacationId, int EmployeeId, bool ApproveStatus)
        {

            try
            {
                var vacation = Context.Vacations.FirstOrDefault(i => i.VacationId == VacationId && i.EmployeeId == EmployeeId);

                if (vacation != null)
                {
                    vacation.WorkflowStatusId = ApproveStatus ? (int)HRWorkflowStatus.Approved : (int)HRWorkflowStatus.Rejected; ;
                    vacation.ModifiedBy = string.Empty;
                    vacation.ModifiedDate = DateTime.Now;

                    Context.SaveChanges();
                    return new ActionsResponseModel { Message = "Vacation Status changed successfly !" };
                }
                else
                    return new ActionsResponseModel { IsSuccess = false, Message = "Vacation not found" }; ;
            }
            catch (Exception ex)
            {
                return new ActionsResponseModel { IsSuccess = false, Message = ex.InnerException?.Message ?? ex.Message };
            }

        }
    }
}
