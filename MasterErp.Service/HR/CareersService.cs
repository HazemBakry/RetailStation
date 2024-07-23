using MasterErp.Entities.Common;
using MasterErp.Entities.DTOs.HR;
using MasterErp.Entities.Models;
using MasterErp.Entities.Models.HR;
using MasterErp.Interface.HR;
using Microsoft.CodeAnalysis.Operations;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Service.HR
{
    public class CareersService : ICareersService
    {
        private readonly DBContext Context;

        public CareersService(DBContext context)
        {
            Context = context;
        }


        public List<EmployeeCareerDto> GetAllEmployeeCareers(SearchFilterModel SearchModel)
        {
            var query = from career in Context.Careers
                        join emp in Context.Employees on career.EmployeeId equals emp.EmployeeId
                        join job in Context.Jobs on career.JobId equals job.JobId
                        join branch in Context.Branches on career.BranchId equals branch.BranchId
                        join workStatus in Context.WorkStatus on career.WorkStatusId equals workStatus.WorkStatusId
                        select new EmployeeCareerDto
                        {
                            EmployeeId = career.EmployeeId,
                            EmployeeName = emp.FullNameEN,
                            CareerId = career.CareerId,
                            JobId = career.JobId,
                            JobName = job.NameEN,
                            BranchId = career.BranchId,
                            BranchName = branch.NameEN,
                            WorkStatusId = career.WorkStatusId,
                            WorkStatusName = workStatus.NameEN,
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

            var query = from career in Context.Careers
                        join emp in Context.Employees on career.EmployeeId equals emp.EmployeeId
                        join job in Context.Jobs on career.JobId equals job.JobId
                        join branch in Context.Branches on career.BranchId equals branch.BranchId
                        join workStatus in Context.WorkStatus on career.WorkStatusId equals workStatus.WorkStatusId
                        where career.EmployeeId == EmployeeId
                        select new EmployeeCareerDto
                        {
                            EmployeeId = career.EmployeeId,
                            EmployeeName = emp.FullNameEN,
                            CareerId = career.CareerId,
                            JobId = career.JobId,
                            JobName = job.NameEN,
                            BranchId = career.BranchId,
                            BranchName = branch.NameEN,
                            WorkStatusId = career.WorkStatusId,
                            WorkStatusName = workStatus.NameEN,
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

        public ActionsResponseModel AddNewEmployeeCareer(int EmployeeId, EmployeeCareerDto model)
        {

            try
            {
                var career = new Career();

                career.EmployeeId = model.EmployeeId;
                career.ExecutionDate = model.ExecutionDate;
                career.JobId = model.JobId;
                career.BranchId = model.BranchId;
                career.WorkStatusId = model.WorkStatusId;
                career.Notes = model.Notes;
                career.CreatedBy = model.CreatedBy;
                career.CreatedDate = DateTime.Now;


                Context.Careers.Add(career);
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
                var career = Context.Careers.FirstOrDefault(i => i.CareerId == model.CareerId);
                if (career != null)
                {

                    career.EmployeeId = model.EmployeeId;
                    career.ExecutionDate = model.ExecutionDate;
                    career.JobId = model.JobId;
                    career.BranchId = model.BranchId;
                    career.WorkStatusId = model.WorkStatusId;
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


        public ActionsResponseModel DeleteEmployeeCareer(int CareerId)
        {

            try
            {
                var career = Context.Careers.FirstOrDefault(i => i.CareerId == CareerId);
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
                Id = b.JobId,
                Name = b.NameEN,
            }).ToList();
            return results;
        }
    }
}
