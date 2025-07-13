using MasterErp.Entities.Common;
using MasterErp.Entities.Common.SQLTabeType;
using MasterErp.Entities.DTOs.HR;
using MasterErp.Entities.Models;
using MasterErp.Entities.Models.Finance;
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
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;

namespace MasterErp.Service.HR
{
    public class HRService : IHRService
    {
        private readonly DBContext Context;
        private readonly ISQLHelper SQLHelper;
        private readonly LookupsDbContext LookupsContext;

        public HRService(DBContext context, ISQLHelper sqlHelper, LookupsDbContext lookupsContext)
        {
            Context = context;
            SQLHelper = sqlHelper;
            LookupsContext = lookupsContext;
        }


        #region Sponsers
        public List<SponsorModel> GetSponsorsData(SearchFilterModel searchModel, int? SponsorId = null)
        {
            var sponsorTypes = LookupsContext.SponsorTypes.ToList();


            var query = from sponsor in Context.Sponsors
                            //join period in Context.FinancialPeriods on receiptLedger.FinancialPeriodId equals period.FinancialPeriodId
                        select new SponsorModel
                        {
                            SponsorId = sponsor.SponsorId,
                            Code = sponsor.Code,
                            NameAR = sponsor.NameAR,
                            NameEN = sponsor.NameEN,
                            Notes = sponsor.Notes,
                            CreatedBy = sponsor.CreatedBy,
                            CreatedDate = sponsor.CreatedDate,
                            ModifiedBy = sponsor.ModifiedBy,
                            ModifiedDate = sponsor.ModifiedDate,
                            SponsorTypeId = sponsor.SponsorTypeId,
                            IsActive = sponsor.IsActive,
                            Phone1 = sponsor.Phone1,
                            Phone2 = sponsor.Phone2,
                            Address = sponsor.Address,
                            FileName = sponsor.FileName,
                            SponsorSSN = sponsor.SponsorSSN,
                            ParentId = sponsor.ParentId,

                            Saudi_Count = sponsor.Saudi_Count,
                            Saudi_Amount = sponsor.Saudi_Amount,

                        };

            int totalCount = query.Count();
            if (searchModel.CurrentPage > 0 && searchModel.PageSize > 0)
            {
                int skip = (searchModel.CurrentPage - 1) * searchModel.PageSize;
                query = query.Skip(skip).Take(searchModel.PageSize);
            }

            var pagedResults = query.ToList();
            //pagedResults.ForEach(x => x.TotalCount = totalCount);

            var results = pagedResults.Select(x =>
            {
                var sponsorType = sponsorTypes.FirstOrDefault(p => p.SponsorTypeId == x.SponsorTypeId);

                x.TotalCount = totalCount;
                x.SponsorTypeNameAR = sponsorType?.NameAR;
                x.SponsorTypeNameEN = sponsorType?.NameEN;

                return x;
            }).ToList();

            return results;
        }
        public SponsorModel GetSponsorById(int SponsorId)
        {
            return GetSponsorsData(new SearchFilterModel { PageSize = 25, CurrentPage = 1 }, SponsorId)?.FirstOrDefault();

        }



        public ActionsResponseModel CreateNewSponsor(SponsorModel Model)
        {
            try
            {
                var entity = Context.Sponsors.FirstOrDefault(i => i.NameEN == Model.NameEN || i.NameAR == Model.NameAR);
                if (entity != null)
                {
                    return new ActionsResponseModel
                    {
                        IsSuccess = false,
                        Message = "هذا الاسم موجود"
                    };
                }


                Sponsor tbl = new Sponsor();

                tbl.CreatedDate = DateTime.Now;
                tbl.CreatedBy = Model.CreatedBy;
                tbl.Code = Model.Code;
                tbl.IsActive = Model.IsActive;
                tbl.NameAR = Model.NameAR;
                tbl.NameEN = Model.NameEN;
                tbl.Notes = Model.Notes;
                tbl.SponsorSSN = Model.SponsorSSN;
                tbl.SponsorTypeId = Model.SponsorTypeId;
                tbl.Phone1 = Model.Phone1;
                tbl.Phone2 = Model.Phone2;
                tbl.ParentId = Model.ParentId;
                tbl.SponsorTypeId = Model.SponsorTypeId;
                tbl.Address = Model.Address;
                tbl.FileName = Model.FileName;
                tbl.Saudi_Count = Model.Saudi_Count;
                tbl.Saudi_Amount = Model.Saudi_Amount;


                Context.Sponsors.Add(tbl);
                Context.SaveChanges();


                return new ActionsResponseModel
                {
                    Message = "تم الحفظ  بنجاح"
                };
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

        public ActionsResponseModel EditSponsor(int SponsorId, SponsorModel Model)
        {

            try
            {
                var entity = Context.Sponsors.FirstOrDefault(i => i.SponsorId == SponsorId);
                if (entity != null)
                {

                    entity.ModifiedDate = DateTime.Now;
                    entity.ModifiedBy = Model.ModifiedBy;

                    entity.Code = Model.Code;
                    entity.IsActive = Model.IsActive;
                    entity.NameAR = Model.NameAR;
                    entity.NameEN = Model.NameEN;
                    entity.Notes = Model.Notes;
                    entity.SponsorSSN = Model.SponsorSSN;
                    entity.SponsorTypeId = Model.SponsorTypeId;
                    entity.Phone1 = Model.Phone1;
                    entity.Phone2 = Model.Phone2;
                    entity.ParentId = Model.ParentId;
                    entity.SponsorTypeId = Model.SponsorTypeId;
                    entity.Address = Model.Address;
                    entity.FileName = Model.FileName;
                    entity.Saudi_Count = Model.Saudi_Count;
                    entity.Saudi_Amount = Model.Saudi_Amount;

                    Context.SaveChanges();


                    return new ActionsResponseModel { Message = "Sponsor Updated Successfully !" };
                }
                else
                    return new ActionsResponseModel { IsSuccess = false, Message = "Sponsor not found" };
            }
            catch (Exception ex)
            {
                return new ActionsResponseModel { IsSuccess = false, Message = ex.InnerException?.Message ?? ex.Message };
            }

        }


        public ActionsResponseModel DeleteSponsor(int SponsorId)
        {

            try
            {
                var entity = Context.Sponsors.FirstOrDefault(i => i.SponsorId == SponsorId);
                if (entity != null)
                {
                    Context.Remove(entity);
                    Context.SaveChanges();
                    return new ActionsResponseModel { Message = "Sponsor deleted Successfully !" };
                }
                else
                    return new ActionsResponseModel { IsSuccess = false, Message = "Sponsor not found" }; ;
            }
            catch (Exception ex)
            {
                return new ActionsResponseModel { IsSuccess = false, Message = ex.InnerException?.Message ?? ex.Message };
            }

        }
        #endregion

        #region Departments
        public List<DepartmentModel> GetDepartmentsData(SearchFilterModel searchModel, int? DepartmentId = null)
        {
            //var Types = LookupsContext.tTypes.ToList();

            var query = from dep in Context.Departments
                        join emp in Context.Employees on dep.ManagerId equals emp.EmployeeId
                        select new DepartmentModel
                        {
                            DepartmentId = dep.DepartmentId,
                            Code = dep.Code,
                            NameAR = dep.NameAR,
                            NameEN = dep.NameEN,
                            Description = dep.Description,
                            CreatedBy = dep.CreatedBy,
                            CreatedDate = dep.CreatedDate,
                            ModifiedBy = dep.ModifiedBy,
                            ModifiedDate = dep.ModifiedDate,

                            Location = dep.Location,
                            IsSystem = dep.IsSystem,
                            ManagerId = dep.ManagerId,
                            BranchId = dep.BranchId,


                            ManagerNameEN = emp.FullNameEN,
                            ManagerNameAR = emp.FullNameAR,
                        };

            int totalCount = query.Count();
            if (searchModel.CurrentPage > 0 && searchModel.PageSize > 0)
            {
                int skip = (searchModel.CurrentPage - 1) * searchModel.PageSize;
                query = query.Skip(skip).Take(searchModel.PageSize);
            }

            var pagedResults = query.ToList();
            pagedResults.ForEach(x => x.TotalCount = totalCount);

            //var results = pagedResults.Select(x =>
            //{
            //    var depType = depTypes.FirstOrDefault(p => p.depType == x.depType);

            //    x.TotalCount = totalCount;
            //    x.depType = paymentType?.depType;
            //    x.depType = paymentType?.NameAR;
            //}).ToList();

            return pagedResults;
        }
        public DepartmentModel GetDepartmentById(int DepartmentId)
        {
            return GetDepartmentsData(new SearchFilterModel { PageSize = 25, CurrentPage = 1 }, DepartmentId)?.FirstOrDefault();

        }



        public ActionsResponseModel CreateNewDepartment(DepartmentModel Model)
        {
            try
            {
                var entity = Context.Departments.FirstOrDefault(i => i.NameEN == Model.NameEN || i.NameAR == Model.NameAR);
                if (entity != null)
                {
                    return new ActionsResponseModel
                    {
                        IsSuccess = false,
                        Message = "هذا الاسم موجود"
                    };
                }


                Department tbl = new Department();

                tbl.CreatedDate = DateTime.Now;
                tbl.CreatedBy = Model.CreatedBy;
                tbl.Code = Model.Code;
                tbl.IsSystem = Model.IsSystem;
                tbl.BranchId = Model.BranchId;
                tbl.NameAR = Model.NameAR;
                tbl.NameEN = Model.NameEN;
                tbl.Description = Model.Description;
                tbl.ManagerId = Model.ManagerId;
                tbl.Location = Model.Location;


                Context.Departments.Add(tbl);
                Context.SaveChanges();


                return new ActionsResponseModel
                {
                    Message = "تم الحفظ  بنجاح"
                };
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

        public ActionsResponseModel EditDepartment(int DepartmentId, DepartmentModel Model)
        {

            try
            {
                var entity = Context.Departments.FirstOrDefault(i => i.DepartmentId == DepartmentId);
                if (entity != null)
                {

                    entity.ModifiedDate = DateTime.Now;
                    entity.ModifiedBy = Model.ModifiedBy;

                    entity.Code = Model.Code;
                    entity.IsSystem = Model.IsSystem;
                    entity.BranchId = Model.BranchId;
                    entity.NameAR = Model.NameAR;
                    entity.NameEN = Model.NameEN;
                    entity.Description = Model.Description;
                    entity.ManagerId = Model.ManagerId;
                    entity.Location = Model.Location;

                    Context.SaveChanges();


                    return new ActionsResponseModel { Message = "Department Updated Successfully !" };
                }
                else
                    return new ActionsResponseModel { IsSuccess = false, Message = "Department not found" };
            }
            catch (Exception ex)
            {
                return new ActionsResponseModel { IsSuccess = false, Message = ex.InnerException?.Message ?? ex.Message };
            }

        }


        public ActionsResponseModel DeleteDepartment(int DepartmentId)
        {

            try
            {
                var entity = Context.Departments.FirstOrDefault(i => i.DepartmentId == DepartmentId);
                if (entity != null)
                {
                    Context.Remove(entity);
                    Context.SaveChanges();
                    return new ActionsResponseModel { Message = "Department deleted Successfully !" };
                }
                else
                    return new ActionsResponseModel { IsSuccess = false, Message = "Department not found" }; ;
            }
            catch (Exception ex)
            {
                return new ActionsResponseModel { IsSuccess = false, Message = ex.InnerException?.Message ?? ex.Message };
            }

        }
        #endregion

        #region Jobs

        public List<Job> GetJobsData(SearchFilterModel searchModel)
        {
            var jobs = Context.Jobs.ToList();

            int totalCount = jobs.Count();
            if (searchModel.CurrentPage > 0 && searchModel.PageSize > 0)
            {
                int skip = (searchModel.CurrentPage - 1) * searchModel.PageSize;
                jobs = jobs.Skip(skip).Take(searchModel.PageSize).ToList();
            }

            var pagedResults = jobs.ToList();
            pagedResults.ForEach(x => x.TotalCount = totalCount);
            return pagedResults;
        }

        public ActionsResponseModel CreateNewJob(Job Model)
        {
            try
            {
                var entity = Context.Jobs.FirstOrDefault(i => i.NameEN == Model.NameEN || i.NameAR == Model.NameAR);
                if (entity != null)
                {
                    return new ActionsResponseModel
                    {
                        IsSuccess = false,
                        Message = "هذا الاسم موجود"
                    };
                }

                Job tbl = new Job();

                tbl.Code = Model.Code;
                tbl.IsActive = Model.IsActive;
                tbl.NameAR = Model.NameAR;
                tbl.NameEN = Model.NameEN;
                tbl.Notes = Model.Notes;
                tbl.CreatedDate = DateTime.Now;
                tbl.CreatedBy = Model.CreatedBy;

                Context.Jobs.Add(tbl);
                Context.SaveChanges();

                return new ActionsResponseModel
                {
                    Message = "تم الحفظ  بنجاح"
                };
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

        public ActionsResponseModel EditJob(int JobId, Job Model)
        {
            try
            {
                var entity = Context.Jobs.FirstOrDefault(i => i.JobId == JobId);
                if (entity != null)
                {
                    entity.Code = Model.Code;
                    entity.IsActive = Model.IsActive;
                    entity.NameAR = Model.NameAR;
                    entity.NameEN = Model.NameEN;
                    entity.Notes = Model.Notes;
                    entity.ModifiedDate = DateTime.Now;
                    entity.ModifiedBy = Model.ModifiedBy;

                    Context.SaveChanges();

                    return new ActionsResponseModel { Message = "تم تعديل البيانات بنجاح !" };
                }
                else
                    return new ActionsResponseModel { IsSuccess = false, Message = "هذا الاسم غير موجود" };
            }
            catch (Exception ex)
            {
                return new ActionsResponseModel { IsSuccess = false, Message = ex.InnerException?.Message ?? ex.Message };
            }

        }


        public ActionsResponseModel DeleteJob(int JobId)
        {

            try
            {
                var entity = Context.Jobs.FirstOrDefault(i => i.JobId == JobId);
                if (entity != null)
                {
                    Context.Remove(entity);
                    Context.SaveChanges();
                    return new ActionsResponseModel { Message = "تم الحذف بنجاح !" };
                }
                else
                    return new ActionsResponseModel { IsSuccess = false, Message = "هذا الاسم غير موجود" }; ;
            }
            catch (Exception ex)
            {
                return new ActionsResponseModel { IsSuccess = false, Message = ex.InnerException?.Message ?? ex.Message };
            }
        }

        #endregion

    }
}
