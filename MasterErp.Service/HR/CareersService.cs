using MasterErp.Entities.Common;
using MasterErp.Entities.Common.SQLTabeType;
using MasterErp.Entities.DTOs.HR;
using MasterErp.Entities.Models;
using MasterErp.Entities.Models.HR;
using MasterErp.Interface.Common;
using MasterErp.Interface.HR;
using MasterErp.Service.Common;
using Microsoft.CodeAnalysis.Operations;
using Microsoft.Data.SqlClient;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Service.HR
{
    public class CareersService : ICareersService
    {
        private readonly DBContext Context;
        private readonly ISQLHelper SQLHelper;

        public CareersService(DBContext context, ISQLHelper sqlHelper)
        {
            Context = context;
            SQLHelper = sqlHelper;
        }

        public List<EmployeeCareerDto> GetAllEmployeeCareers(SearchFilterModel SearchModel)
        {
            var query = from career in Context.EmployeeCareers
                        join emp in Context.Employees on career.EmployeeId equals emp.EmployeeId
                        join job in Context.Jobs on career.JobId equals job.JobId
                        join branch in Context.Branches on career.BranchId equals branch.BranchId
                        join workStatus in Context.WorkStatus on career.WorkStatusId equals workStatus.WorkStatusId
                        select new EmployeeCareerDto
                        {
                            EmployeeId = career.EmployeeId,
                            EmployeeName = emp.FullNameAR,
                            EmployeeCareerId = career.EmployeeCareerId,
                            JobId = career.JobId,
                            JobName = job.NameEN,
                            BranchId = career.BranchId,
                            BranchName = branch.NameEN,
                            WorkFlowStatusId = career.WorkStatusId,
                            WorkFlowStatusNameEN = workStatus.NameEN,
                            WorkFlowStatusNameAR = workStatus.NameAR,
                            ExecutionDate = career.ExecutionDate,
                            Notes = career.Notes,
                            CreatedBy = career.CreatedBy,
                            CreatedDate = career.CreatedDate,
                            ModifiedBy = career.ModifiedBy,
                            ModifiedDate = career.ModifiedDate,
                        };
            int totalCount = query.Count();
            if (SearchModel.CurrentPage > 0 && SearchModel.PageSize > 0)
            {
                int skip = (SearchModel.CurrentPage - 1) * SearchModel.PageSize;
                query = query.Skip(skip).Take(SearchModel.PageSize);
            }

            var results = query.ToList();
            results.ForEach(x => x.TotalCount = totalCount);
            return results;
        }

        public List<EmployeeCareerDto> GetCareersByEmployeeId(int EmployeeId, SearchFilterModel SearchModel)
        {

            //var FilterList = SearchModel?.FilterList?.Select(f => new FilterList_TableType { ItemKey = string.Empty, CategoryName = f.CategoryName, ItemValue = f.ItemFlag }).ToList();
            SqlParameter[] param = new SqlParameter[3];

            param[0] = new SqlParameter("@EmployeeId", EmployeeId);
            param[1] = new SqlParameter("@CurrentPage", SearchModel.CurrentPage);
            param[2] = new SqlParameter("@PageSize", SearchModel.PageSize);
            //param[3] = new SqlParameter("@FilterList", SqlDbType.Structured);
            //param[3].Value = FilterList.ToDataTable();

            var result = SQLHelper.SQLQuery<EmployeeCareerDto>("[HR].[SP_GetCareersByEmployeeId]", null, param);
            return result;

            //var query = from career in Context.EmployeeCareers
            //            join emp in Context.Employees on career.EmployeeId equals emp.EmployeeId
            //            join job in Context.Jobs on career.JobId equals job.JobId
            //            join branch in Context.Branches on career.BranchId equals branch.BranchId
            //            join workStatus in Context.WorkStatus on career.WorkStatusId equals workStatus.WorkStatusId
            //            where career.EmployeeId == EmployeeId
            //            select new EmployeeCareerDto
            //            {
            //                EmployeeId = career.EmployeeId,
            //                EmployeeName = emp.FullNameAR,
            //                EmployeeCareerId = career.EmployeeCareerId,
            //                JobId = career.JobId,
            //                JobName = job.NameEN,
            //                BranchId = career.BranchId,
            //                BranchName = branch.NameEN,
            //                WorkStatusId = career.WorkStatusId,
            //                WorkStatusName = workStatus.NameEN,
            //                ExecutionDate = career.ExecutionDate,
            //                Notes = career.Notes,
            //                CreatedBy = career.CreatedBy,
            //                CreatedDate = career.CreatedDate,
            //                ModifiedBy = career.ModifiedBy,
            //                ModifiedDate = career.ModifiedDate,
            //            };


            //int totalCount = query.Count();
            //if (SearchModel.CurrentPage > 0 && SearchModel.PageSize > 0)
            //{
            //    int skip = (SearchModel.CurrentPage - 1) * SearchModel.PageSize;
            //    query = query.Skip(skip).Take(SearchModel.PageSize);
            //}

            //var results = query.ToList();
            //results.ForEach(x => x.TotalCount = totalCount);
            //return results;
        }

        public ActionsResponseModel AddNewEmployeeCareer(int EmployeeId, EmployeeCareerDto model)
        {

            try
            {
                var career = new EmployeeCareer();

                career.EmployeeId = model.EmployeeId;
                career.ExecutionDate = model.ExecutionDate;
                career.JobId = model.JobId;
                career.BranchId = model.BranchId;
                career.WorkStatusId = (int)model.WorkFlowStatusId;
                career.Notes = model.Notes;
                career.CreatedBy = model.CreatedBy;
                career.CreatedDate = DateTime.Now;


                Context.EmployeeCareers.Add(career);
                var result = Context.SaveChanges();


                return new ActionsResponseModel { Message = "Career Added Successfly !" };
            }
            catch (Exception ex)
            {
                return new ActionsResponseModel { IsSuccess = false, Message = ex.InnerException?.Message ?? ex.Message };
            }

        }

        public ActionsResponseModel EditEmployeeCareer(int EmployeeId, EmployeeCareerDto model)
        {

            try
            {
                var career = Context.EmployeeCareers.FirstOrDefault(i => i.EmployeeCareerId == model.EmployeeCareerId);
                if (career != null)
                {

                    career.EmployeeId = model.EmployeeId;
                    career.ExecutionDate = model.ExecutionDate;
                    career.JobId = model.JobId;
                    career.BranchId = model.BranchId;
                    career.WorkStatusId = (int)model.WorkFlowStatusId;
                    career.Notes = model.Notes;
                    career.ModifiedBy = model.ModifiedBy;
                    career.ModifiedDate = DateTime.Now;

                    Context.SaveChanges();


                    return new ActionsResponseModel { Message = "Career Updated Successfly !" };
                }
                else
                    return new ActionsResponseModel { IsSuccess = false, Message = "Career not found" };
            }
            catch (Exception ex)
            {
                return new ActionsResponseModel { IsSuccess = false, Message = ex.InnerException?.Message ?? ex.Message };
            }

        }


        public ActionsResponseModel DeleteEmployeeCareer(int EmployeeCareerId)
        {

            try
            {
                var career = Context.EmployeeCareers.FirstOrDefault(i => i.EmployeeCareerId == EmployeeCareerId);
                if (career != null)
                {
                    Context.Remove(career);
                    Context.SaveChanges();
                    return new ActionsResponseModel { Message = "Career deleted successfly !" };
                }
                else
                    return new ActionsResponseModel { IsSuccess = false, Message = "Career not found" }; ;
            }
            catch (Exception ex)
            {
                return new ActionsResponseModel { IsSuccess = false, Message = ex.InnerException?.Message ?? ex.Message };
            }

        }

        public List<SelectorDataModel> GetWorkStatusSelector()
        {
            var results = Context.WorkStatus.Select(b => new SelectorDataModel
            {
                Id = b.WorkStatusId,
                Name = b.NameEN,
            }).ToList();
            return results;
        }
        public List<SelectorDataModel> GetJobsSelector()
        {
            var results = Context.Jobs.Select(b => new SelectorDataModel
            {
                Id = (int)b.JobId,
                Name = b.NameAR,
            }).ToList();
            return results;
        }
    }
}
