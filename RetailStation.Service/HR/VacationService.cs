using MasterErp.Entities.Common;
using MasterErp.Entities.Common.Enums;
using MasterErp.Entities.Common.Export;
using MasterErp.Entities.Common.Lookups;
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
using Microsoft.AspNetCore.Mvc;
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
        private readonly ISharedFilterService sharedFilterService;
        private readonly IExportService _exportService;
        private readonly LookupsDbContext LookupsDbContext;

        public VacationService(DBContext Context, ISQLHelper SQLHelper, ISharedService SharedService, IConfiguration Configuration, LookupsDbContext lookupsDbContext, ISharedFilterService sharedFilterService, IExportService exportService)
        {
            this.Context = Context;
            this.SQLHelper = SQLHelper;
            this.SharedService = SharedService;
            this.Configuration = Configuration;
            LookupsDbContext = lookupsDbContext;
            this.sharedFilterService = sharedFilterService;
            _exportService = exportService;
            //ConnectionString = Configuration.GetConnectionString("DBConnection");
        }


        public List<EmployeeVacationDto> GetAllEmployeeVacationsData(SearchFilterModel SearchModel, int? EmployeeId = null, int? ManagerId = null)
        {
            var FilterListTable = sharedFilterService.MapFilterModelToDataTable(SearchModel?.FilterList);
            int? VacationId = null;
            SqlParameter[] param = new SqlParameter[5];

            param[0] = new SqlParameter("@EmployeeId", EmployeeId);
            param[1] = new SqlParameter("@VacationId", VacationId);
            param[2] = new SqlParameter("@CurrentPage", SearchModel.CurrentPage);
            param[3] = new SqlParameter("@PageSize", SearchModel.PageSize);
            param[4] = new SqlParameter("@FilterList", SqlDbType.Structured);
            param[4].Value = FilterListTable;

            var result = SQLHelper.SQLQuery<EmployeeVacationDto>("[HR].[SP_GetEmployeeVacationsData]", null, param);
            return result;
        }
        public ActionsResponseModel GetEmployeeVacation_Export(SearchFilterModel SearchModel)
        {
            string url = string.Empty;
            try
            {
                SearchModel.CurrentPage = 1;
                SearchModel.PageSize = 990000;
                var Data = GetAllEmployeeVacationsData(SearchModel);

                var result = Data.Select(x => new EmployeeVacationExportModel
                {
                    EmployeeCode = x.EmployeeCode,
                    EmployeeName = x.EmployeeName,
                    BranchName = x.BranchName,
                    JobName = x.JobNameAR ?? x.JobNameEN,
                    VacationType = x.VacationType,
                    FromDate = x.FromDate.ToString("MM/dd/yyyy"),
                    ToDate = x.ToDate.ToString("MM/dd/yyyy"),
                    LastDayWork = x.LastDayWork.ToString("MM/dd/yyyy"),
                    Period = x.Period,
                    AlternativeEmployee = x.AlternativeEmployeeName,
                    WorkflowStatus = x.WorkflowStatusNameAR ?? x.WorkflowStatusNameEN,
                    Notes = x.Notes,
                }).ToList();

                if (!result.Any())
                {
                    result.Add(new EmployeeVacationExportModel());

                }


                var dtExport = DalHelper.ConvertToDataTable(result, "Employee Vacation");


                url = GetExportUrl(dtExport, "Employee Vacation");


                return new ActionsResponseModel
                {
                    IsSuccess = true,
                    URL = url,
                    Message = "File Exported successfully"
                };

            }
            catch (Exception ex)
            {
                return new ActionsResponseModel
                {
                    IsSuccess = false,
                    Status = 0,
                    URL = "",
                    Message = ex.InnerException?.Message ?? ex.Message,
                };
            }

        }

        public List<EmployeeVacationDto> GetVacationsByEmployeeId(int employeeId, SearchFilterModel SearchModel)
        {

            var vacationTypes = LookupsDbContext.VacationTypes.ToList();
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
            if (SearchModel.CurrentPage > 0 && SearchModel.PageSize > 0)
            {
                int skip = (SearchModel.CurrentPage - 1) * SearchModel.PageSize;
                query = query.Skip(skip).Take(SearchModel.PageSize);
            }

            var results = query.ToList();
            results.ForEach(x =>
            {
                x.TotalCount = totalCount;
                var vType = vacationTypes.FirstOrDefault(y => y.VacationTypeId == x.VacationTypeId);
                if (vType != null)
                {
                    x.VacationType = vType.NameAR ?? vType.NameEN;
                }
            });
            return results;
        }

        public List<EmployeeVacationDto> GetVacationRequestsByType(int VacationTypeId, SearchFilterModel SearchModel)
        {
            var FilterList = SearchModel?.FilterList?.Select(f => new FilterList_TableType { ItemKey = string.Empty, CategoryName = f.CategoryName, ItemValue = f.ItemFlag }).ToList();
            SqlParameter[] param = new SqlParameter[4];

            param[0] = new SqlParameter("@VacationTypeId", VacationTypeId);
            param[1] = new SqlParameter("@CurrentPage", SearchModel.CurrentPage);
            param[2] = new SqlParameter("@PageSize", SearchModel.PageSize);
            param[3] = new SqlParameter("@FilterList", SqlDbType.Structured);
            param[3].Value = FilterList.ToDataTable();

            var result = SQLHelper.SQLQuery<EmployeeVacationDto>("[HR].[SP_GetVacationRequestsByType]", null, param);
            return result;
        }

        public ActionsResponseModel AddNewEmployeeVacation(int EmployeeId, EmployeeVacationDto model)
        {
            try
            {
                var vacation = new Vacation
                {
                    EmployeeId = EmployeeId,
                    VacationTypeId = model.VacationTypeId,
                    RequestDate = DateTime.Now,
                    FromDate = model.FromDate,
                    ToDate = model.ToDate,
                    LastDayWork = model.LastDayWork,
                    Period = (model.ToDate - model.FromDate).Days,
                    Notes = model.Notes,
                    IsAlternativeAvailable = model.IsAlternativeAvailable,
                    AlternativeEmployeeId = model.IsAlternativeAvailable == true ? model.AlternativeEmployeeId : null,
                    WorkflowStatusId = (int)WorkflowStatus.Pending,
                    CreatedDate = DateTime.Now,
                    CreatedBy = model.CreatedBy
                };
                Context.Vacations.Add(vacation);
                var result = Context.SaveChanges();

                return new ActionsResponseModel { Message = "Vacation Applied Successfly !" };
            }
            catch (Exception ex)
            {
                return new ActionsResponseModel
                {
                    IsSuccess = false,
                    Message = ex.InnerException?.Message ?? ex.Message
                };
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
                    return new ActionsResponseModel { IsSuccess = false, Message = "Vacation not found" }; ;
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
                    vacation.WorkflowStatusId = ApproveStatus ? (int)WorkflowStatus.Approved : (int)WorkflowStatus.Rejected; ;
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

        public ActionsResponseModel ApproveEmployeeVacations(bool isApproved, List<int> vacationIds)
        {
            try
            {
                if (vacationIds == null || !vacationIds.Any())
                {
                    return new ActionsResponseModel { IsSuccess = false, Message = "No vacation IDs provided." };
                }

                var deducts = Context.Vacations.Where(i => vacationIds.Contains(i.VacationId)).ToList();

                if (!deducts.Any())
                {
                    return new ActionsResponseModel { IsSuccess = false, Message = "No vacation deducts found." };
                }

                int newStatus = isApproved ? (int)WorkflowStatus.Approved : (int)WorkflowStatus.Rejected;

                foreach (var deduct in deducts)
                {
                    deduct.WorkflowStatusId = newStatus;
                }

                Context.SaveChanges();

                return new ActionsResponseModel
                {
                    IsSuccess = true,
                    Message = isApproved ? "Vacations approved successfully!" : "Vacations rejected successfully!"
                };
            }
            catch (Exception ex)
            {
                return new ActionsResponseModel
                {
                    IsSuccess = false,
                    Message = ex.InnerException?.Message ?? ex.Message
                };
            }
        }

        public List<EmployeeVacationDto> GetVacationsToBeExceuted()
        {
            SqlParameter[] param = new SqlParameter[0];
            var result = SQLHelper.SQLQuery<EmployeeVacationDto>("[HR].[SP_GetVacationsToBeExceuted]", null, param);

            return result;
        }

        public ActionsResponseModel EditEmployeesWorkStatus(string UserId, List<int> EmployeeIds)
        {
            try
            {
                var emps = Context.Employees.Where(item => EmployeeIds.Contains(item.EmployeeId)).ToList();

                if (!emps.Any())
                    return new ActionsResponseModel { IsSuccess = false, Message = "لا يوجد موظفين !" };

                foreach (var employee in emps)
                {
                    employee.StatusId = 2;
                    employee.ModifiedDate = DateTime.Now;
                    employee.ModifiedBy = UserId;
                }
                Context.SaveChanges();
                return new ActionsResponseModel { Message = "تم تعديل حالة الموظف بنجاح" };
            }
            catch (Exception ex)
            {
                return new ActionsResponseModel
                {
                    IsSuccess = false,
                    Message = ex.Message
                };
            }
        }
        private string GetExportUrl(DataTable DT, string Name)
        {
            DT.TableName = Name;

            ExportTemplateBase exportTemplateBase = new ExportTemplateBase
            {
                Name = Name,
                Username = "",
                TemplateName = Name,
                ReportName = Name,
                CustomerName = "",
                ExcelStyle = ExcelExportStyle.reportStyle,
                SheetName = "Data",
            };
            return _exportService.Export(exportTemplateBase, DT);
        }


    }
}
