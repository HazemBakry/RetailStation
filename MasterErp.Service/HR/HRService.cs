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
using Microsoft.EntityFrameworkCore;
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
        private readonly ISharedFilterService sharedFilterService;
        private readonly LookupsDbContext LookupsContext;

        public HRService(DBContext context, ISQLHelper sqlHelper, LookupsDbContext lookupsContext, ISharedFilterService sharedFilterService)
        {
            Context = context;
            SQLHelper = sqlHelper;
            LookupsContext = lookupsContext;
            this.sharedFilterService = sharedFilterService;
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

                tbl.IsActive = Model.IsActive;
                tbl.NameAR = Model.NameAR;
                tbl.NameEN = Model.NameEN;
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
                    entity.IsActive = Model.IsActive;
                    entity.NameAR = Model.NameAR;
                    entity.NameEN = Model.NameEN;
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

        #region Regions

        public List<Region> GetRegionsData(SearchFilterModel searchModel)
        {
            var regions = Context.Regions.ToList();

            int totalCount = regions.Count();
            if (searchModel.CurrentPage > 0 && searchModel.PageSize > 0)
            {
                int skip = (searchModel.CurrentPage - 1) * searchModel.PageSize;
                regions = regions.Skip(skip).Take(searchModel.PageSize).ToList();
            }

            var pagedResults = regions.ToList();
            pagedResults.ForEach(x => x.TotalCount = totalCount);
            return pagedResults;
        }

        public ActionsResponseModel CreateNewRegion(Region Model)
        {
            try
            {
                var entity = Context.Regions.FirstOrDefault(i => i.NameEN == Model.NameEN || i.NameAR == Model.NameAR);
                if (entity != null)
                {
                    return new ActionsResponseModel
                    {
                        IsSuccess = false,
                        Message = "هذا الاسم موجود"
                    };
                }

                Region tbl = new Region
                {
                    IsActive = Model.IsActive,
                    NameAR = Model.NameAR,
                    NameEN = Model.NameEN,
                    BranchId = 1,
                    CreatedDate = DateTime.Now,
                    CreatedBy = Model.CreatedBy,
                    CityId = 1,
                    CountryId = 1,
                    Code = "001",
                    DeliveryValue = 7
                };
                Context.Regions.Add(tbl);
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

        public ActionsResponseModel EditRegion(int RegionId, Region Model)
        {
            try
            {
                var entity = Context.Regions.FirstOrDefault(i => i.RegionId == RegionId);
                if (entity != null)
                {
                    entity.IsActive = Model.IsActive;
                    entity.NameAR = Model.NameAR;
                    entity.NameEN = Model.NameEN;
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

        public ActionsResponseModel DeleteRegion(int RegionId)
        {
            try
            {
                var entity = Context.Regions.FirstOrDefault(i => i.RegionId == RegionId);
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

        #region EmployeeStatus
        public List<EmployeeStatusModel> GetEmployeeStatusData(SearchFilterModel searchModel, int? EmployeeStatusId = null)
        {


            var query = from status in Context.EmployeeStatus
                        where EmployeeStatusId == null || status.EmployeeStatusId == EmployeeStatusId
                        select new EmployeeStatusModel
                        {
                            EmployeeStatusId = status.EmployeeStatusId,
                            StatusNameAR = status.StatusNameAR,
                            StatusNameEN = status.StatusNameEN,
                            Notes = status.Notes,
                            IsActive = status.IsActive,
                            CreatedBy = status.CreatedBy,
                            CreatedDate = status.CreatedDate,
                            ModifiedBy = status.ModifiedBy,
                            ModifiedDate = status.ModifiedDate
                           

                        };

            int totalCount = query.Count();
            if (searchModel.CurrentPage > 0 && searchModel.PageSize > 0)
            {
                int skip = (searchModel.CurrentPage - 1) * searchModel.PageSize;
                query = query.Skip(skip).Take(searchModel.PageSize);
            }

            var pagedResults = query.ToList();
            pagedResults.ForEach(x => x.TotalCount = totalCount);

            return pagedResults;
        }
        public EmployeeStatusModel GetEmployeeStatusById(int EmployeeStatusId)
        {
            return GetEmployeeStatusData(new SearchFilterModel { PageSize = 25, CurrentPage = 1 }, EmployeeStatusId)?.FirstOrDefault();

        }



        public ActionsResponseModel CreateNewEmployeeStatus(EmployeeStatusModel Model)
        {
            try
            {
                var entity = Context.EmployeeStatus.FirstOrDefault(i => i.StatusNameEN == Model.StatusNameEN || i.StatusNameAR == Model.StatusNameAR);
                if (entity != null)
                {
                    return new ActionsResponseModel
                    {
                        IsSuccess = false,
                        Message = "هذا الاسم موجود"
                    };
                }


                EmployeeStatus tbl = new EmployeeStatus();

                tbl.CreatedDate = DateTime.Now;
                tbl.CreatedBy = Model.CreatedBy;
                tbl.IsActive = Model.IsActive;
                tbl.StatusNameAR = Model.StatusNameAR;
                tbl.StatusNameEN = Model.StatusNameEN;
                tbl.Notes = Model.Notes;


                Context.EmployeeStatus.Add(tbl);
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

        public ActionsResponseModel EditEmployeeStatus(int EmployeeStatusId, EmployeeStatusModel Model)
        {

            try
            {
                var entity = Context.EmployeeStatus.FirstOrDefault(i => i.EmployeeStatusId == EmployeeStatusId);
                if (entity != null)
                {

                    entity.ModifiedDate = DateTime.Now;
                    entity.ModifiedBy = Model.ModifiedBy;

                    entity.IsActive = Model.IsActive;
                    entity.StatusNameAR = Model.StatusNameAR;
                    entity.StatusNameEN = Model.StatusNameEN;
                    entity.Notes = Model.Notes;
                    Context.SaveChanges();


                    return new ActionsResponseModel { Message = "Updated Successfully !" };
                }
                else
                    return new ActionsResponseModel { IsSuccess = false, Message = "not found" };
            }
            catch (Exception ex)
            {
                return new ActionsResponseModel { IsSuccess = false, Message = ex.InnerException?.Message ?? ex.Message };
            }

        }


        public ActionsResponseModel DeleteEmployeeStatus(int EmployeeStatusId)
        {

            try
            {
                var entity = Context.EmployeeStatus.FirstOrDefault(i => i.EmployeeStatusId == EmployeeStatusId);
                if (entity != null)
                {
                    Context.Remove(entity);
                    Context.SaveChanges();
                    return new ActionsResponseModel { Message = "deleted Successfully !" };
                }
                else
                    return new ActionsResponseModel { IsSuccess = false, Message = "not found" }; ;
            }
            catch (Exception ex)
            {
                return new ActionsResponseModel { IsSuccess = false, Message = ex.InnerException?.Message ?? ex.Message };
            }

        }
        #endregion


        #region EmployeeShifts
        public List<EmployeeWeeklyShiftModel> GetEmployeeWeeklyShifts_Data(DateTime FromDate, DateTime ToDate, SearchFilterModel SearchModel)
        {
            SqlParameter[] param = new SqlParameter[5];
            param[0] = new SqlParameter("@FromDate", FromDate);
            param[1] = new SqlParameter("@ToDate", ToDate);
            param[2] = new SqlParameter("@CurrentPage", SearchModel.CurrentPage);
            param[3] = new SqlParameter("@PageSize", SearchModel.PageSize);
            param[4] = new SqlParameter("@FilterList", SqlDbType.Structured);
            param[4].Value = sharedFilterService.MapFilterModelToDataTable(SearchModel?.FilterList);


            var result = SQLHelper.SQLQuery<EmployeeWeeklyShiftFlatModel>("[HR].[SP_GetEmployeeWeeklyShifts_Data]", null, param);
            
            // 2. Group shifts by EmployeeId
            var employees = result
                .GroupBy(s => s.EmployeeId)
                .Select(g => new EmployeeWeeklyShiftModel
                {
                    EmployeeId = g.Key,
                    EmployeeCode = g.First().EmployeeCode,
                    EmployeeNameEN = g.First().EmployeeNameEN,
                    EmployeeNameAR = g.First().EmployeeNameAR,
                    BranchId = g.First().BranchId,
                    BranchNameEN = g.First().BranchNameEN,
                    BranchNameAR = g.First().BranchNameAR,
                    TotalCount = g.First().TotalCount
                })
                .ToList();

            // 3. Generate all dates in the requested range
            var allDates = Enumerable
                .Range(0, (int)(ToDate - FromDate).TotalDays + 1)
                .Select(offset => FromDate.AddDays(offset))
                .ToList();

            // 4. For each employee, ensure they have a shift record for every date
            foreach (var employee in employees)
            {
                // Get existing shifts for this employee
                var existingShifts = result
                    .Where(s => s.EmployeeId == employee.EmployeeId)
                    .Select(s => new ShiftModel
                    {
                        EmployeeWeeklyShiftId = s.EmployeeWeeklyShiftId,
                        EmployeeId = s.EmployeeId,
                        ShiftDate = s.ShiftDate,
                        ShiftOneFrom = s.ShiftOneFrom,
                        ShiftOneTo = s.ShiftOneTo,
                        ShiftTwoFrom = s.ShiftTwoFrom,
                        ShiftTwoTo = s.ShiftTwoTo,
                        ShiftType = s.ShiftType,
                        IsDayOff = s.IsDayOff,
                        IsWeekend = s.IsWeekend,
                        Notes = s.Notes
                    })
                    .ToList();

                // Fill missing dates with default shifts
                foreach (var date in allDates)
                {
                    // Check if a shift already exists for this date
                    var existingShift = existingShifts.FirstOrDefault(s => s.ShiftDate.Date == date.Date);

                    if (existingShift == null)
                    {
                        // Add a default (empty) shift for the missing date
                        employee.WeekShifts.Add(new ShiftModel
                        {
                            EmployeeId = employee.EmployeeId,
                            ShiftDate = date,
                            IsDayOff = false,
                            IsWeekend = false,
                            Notes = ""
                        });
                    }
                    else
                    {
                        // Keep the existing shift
                        employee.WeekShifts.Add(existingShift);
                    }
                }

                // Sort shifts by date (optional)
                employee.WeekShifts = employee.WeekShifts
                    .OrderBy(s => s.ShiftDate)
                    .ToList();
            }

            return employees;
        }
        public ActionsResponseModel SaveEmployeeShifts(List<EmployeeWeeklyShiftModel> employeeModels)
        {
            if (employeeModels == null || !employeeModels.Any())
            {
                return new ActionsResponseModel { IsSuccess = false, Message = "No employee shift data provided." };
            }

            var results = new List<ActionsResponseModel>();
            var totalSavedChanges = 0;

            using (var transaction = Context.Database.BeginTransaction())
            {
                try
                {
                    foreach (var employeeModel in employeeModels)
                    {
                        if (employeeModel.WeekShifts == null || !employeeModel.WeekShifts.Any())
                        {
                            results.Add(new ActionsResponseModel
                            {
                                IsSuccess = false,
                                Message = $"No shifts provided for employee {employeeModel.EmployeeId}. Skipping."
                            });
                            continue;
                        }

                        foreach (var shiftModel in employeeModel.WeekShifts)
                        {
                            // Validate shift data
                            if (shiftModel.EmployeeId <= 0)
                            {
                                results.Add(new ActionsResponseModel
                                {
                                    IsSuccess = false,
                                    Message = $"Invalid Employee ID for shift on {shiftModel.ShiftDate.ToShortDateString()}. Skipping."
                                });
                                continue;
                            }

                            if (shiftModel.ShiftOneFrom.HasValue && shiftModel.ShiftOneTo.HasValue &&
                                shiftModel.ShiftOneTo <= shiftModel.ShiftOneFrom)
                            {
                                results.Add(new ActionsResponseModel
                                {
                                    IsSuccess = false,
                                    Message = $"Shift One 'To' time must be after 'From' time for Employee {shiftModel.EmployeeId} on {shiftModel.ShiftDate.ToShortDateString()}. Skipping."
                                });
                                continue;
                            }

                            if (shiftModel.ShiftTwoFrom.HasValue && shiftModel.ShiftTwoTo.HasValue &&
                                shiftModel.ShiftTwoTo <= shiftModel.ShiftTwoFrom)
                            {
                                results.Add(new ActionsResponseModel
                                {
                                    IsSuccess = false,
                                    Message = $"Shift Two 'To' time must be after 'From' time for Employee {shiftModel.EmployeeId} on {shiftModel.ShiftDate.ToShortDateString()}. Skipping."
                                });
                                continue;
                            }

                            EmployeeWeeklyShift entity;

                            if (shiftModel.EmployeeWeeklyShiftId.HasValue && shiftModel.EmployeeWeeklyShiftId.Value > 0)
                            {
                                // Update existing shift
                                entity = Context.EmployeeWeeklyShifts.Find(shiftModel.EmployeeWeeklyShiftId.Value);

                                if (entity == null)
                                {
                                    results.Add(new ActionsResponseModel
                                    {
                                        IsSuccess = false,
                                        Message = $"Shift with ID {shiftModel.EmployeeWeeklyShiftId.Value} not found for update. Skipping."
                                    });
                                    continue;
                                }

                                // Check for overlapping shifts (excluding current one)
                                var existingShift = Context.EmployeeWeeklyShifts
                                    .AsNoTracking()
                                    .Where(s => s.EmployeeId == shiftModel.EmployeeId &&
                                                s.ShiftDate == shiftModel.ShiftDate.Date &&
                                                s.EmployeeWeeklyShiftId != shiftModel.EmployeeWeeklyShiftId.Value)
                                    .FirstOrDefault();

                                if (existingShift != null)
                                {
                                    results.Add(new ActionsResponseModel
                                    {
                                        IsSuccess = false,
                                        Message = $"Shift already exists for Employee {shiftModel.EmployeeId} on {shiftModel.ShiftDate.ToShortDateString()}. Skipping update."
                                    });
                                    continue;
                                }

                                // Update entity
                                entity.ShiftDate = shiftModel.ShiftDate.Date;
                                entity.ShiftOneFrom = shiftModel.ShiftOneFrom;
                                entity.ShiftOneTo = shiftModel.ShiftOneTo;
                                entity.ShiftTwoFrom = shiftModel.ShiftTwoFrom;
                                entity.ShiftTwoTo = shiftModel.ShiftTwoTo;
                                entity.ShiftType = shiftModel.ShiftType;
                                entity.IsDayOff = shiftModel.IsDayOff;
                                entity.IsWeekend = shiftModel.IsWeekend;
                                entity.Notes = shiftModel.Notes;
                                entity.ModifiedBy = shiftModel.ModifiedBy;
                                entity.ModifiedDate = DateTime.Now;
                            }
                            else
                            {
                                // Create new shift
                                entity = new EmployeeWeeklyShift
                                {
                                    EmployeeId = shiftModel.EmployeeId,
                                    ShiftDate = shiftModel.ShiftDate.Date,
                                    ShiftOneFrom = shiftModel.ShiftOneFrom,
                                    ShiftOneTo = shiftModel.ShiftOneTo,
                                    ShiftTwoFrom = shiftModel.ShiftTwoFrom,
                                    ShiftTwoTo = shiftModel.ShiftTwoTo,
                                    ShiftType = shiftModel.ShiftType,
                                    IsDayOff = shiftModel.IsDayOff,
                                    IsWeekend = shiftModel.IsWeekend,
                                    Notes = shiftModel.Notes,
                                    CreatedBy = shiftModel.CreatedBy,
                                    CreatedDate = DateTime.Now
                                };

                                // Check for existing shift
                                var existingShift = Context.EmployeeWeeklyShifts
                                    .AsNoTracking()
                                    .Where(s => s.EmployeeId == shiftModel.EmployeeId &&
                                                s.ShiftDate == shiftModel.ShiftDate.Date)
                                    .FirstOrDefault();

                                if (existingShift != null)
                                {
                                    results.Add(new ActionsResponseModel
                                    {
                                        IsSuccess = false,
                                        Message = $"Shift already exists for Employee {shiftModel.EmployeeId} on {shiftModel.ShiftDate.ToShortDateString()}. Skipping creation."
                                    });
                                    continue;
                                }

                                Context.EmployeeWeeklyShifts.Add(entity);
                            }

                            results.Add(new ActionsResponseModel
                            {
                                IsSuccess = true,
                                Message = $"Shift for Employee {shiftModel.EmployeeId} on {shiftModel.ShiftDate.ToShortDateString()} processed."
                            });
                        }
                    }

                    totalSavedChanges = Context.SaveChanges();
                    transaction.Commit();

                    return new ActionsResponseModel
                    {
                        IsSuccess = results.All(r => r.IsSuccess),
                        Message = results.All(r => r.IsSuccess)
                            ? $"Successfully saved {totalSavedChanges} shifts."
                            : $"Completed with some errors. Saved {totalSavedChanges} shifts. See details for individual results."
                    };
                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    return new ActionsResponseModel
                    {
                        IsSuccess = false,
                        Message = $"Error saving shifts: {ex.Message}"
                    };
                }
            }
        }
        public EmployeeWeeklyShift GetEmployeeShiftById(int shiftId)
        {
            return Context.EmployeeWeeklyShifts.Find(shiftId);
        }

        public ActionsResponseModel DeleteEmployeeShift(int EmployeeWeeklyShiftId)
        {
            var shiftToDelete = Context.EmployeeWeeklyShifts.Find(EmployeeWeeklyShiftId);
            if (shiftToDelete == null)
            {
                return new ActionsResponseModel { IsSuccess = false, Message = "Shift not found." };
            }

            Context.EmployeeWeeklyShifts.Remove(shiftToDelete);
            try
            {
                var isDeleted = Context.SaveChanges() > 0;
                return new ActionsResponseModel
                {
                    IsSuccess = isDeleted,
                    Message = isDeleted ? "Shift deleted successfully." : "Failed to delete shift."
                };
            }
            catch (Exception ex)
            {
                // Log the exception
                return new ActionsResponseModel
                {
                    IsSuccess = false,
                    Message = $"An unexpected error occurred: {ex.Message}."
                };
            }
        }
        #endregion

    }
}
