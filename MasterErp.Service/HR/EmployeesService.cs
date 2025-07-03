using MasterErp.Entities.Common;
using MasterErp.Entities.DTOs.HR;
using MasterErp.Entities.Models;
using MasterErp.Interface.Common;
using MasterErp.Interface.HR;
using MasterErp.Service.Common;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using MasterErp.Entities.Models.HR;
using Microsoft.AspNetCore.Http;
using System.IO;
using MasterErp.Entities.DTOs.Shared;
using MasterErp.Entities.Common.SQLTabeType;
using MasterErp.Entities.Common.Enums;
using MasterErp.Entities.Common.Export;

namespace MasterErp.Service.HR
{
    public class EmployeeService : IEmployeeService
    {
        private readonly DBContext Context;
        private readonly ISQLHelper SQLHelper;
        private readonly IConfiguration Configuration;
        private readonly ISharedFilterService SharedFilterService;
        private readonly IFileService FileService;
        public readonly string EmployeesFolderName;
        private readonly IExportService _exportService;
        private string ConnectionString;

        public EmployeeService(DBContext Context, ISQLHelper SQLHelper,
            IConfiguration Configuration, ISharedFilterService SharedFilterService,
            IFileService FileService, IExportService exportService)
        {
            this.Context = Context;
            this.SQLHelper = SQLHelper;
            this.Configuration = Configuration;
            this.SharedFilterService = SharedFilterService;
            this.FileService = FileService;
            EmployeesFolderName = "Employees";
            _exportService = exportService;
            ConnectionString = Configuration.GetConnectionString("DBConnection");
        }

        #region EmployeeCreation

        public async Task<ActionsResponseModel> CreateNewEmployee(EmployeeDto model)
        {
            try
            {
                var employee = new Employee();

                int? lastEmpCode = Context.Employees.OrderBy(e => e.EmployeeId).LastOrDefault()?.Code;
                employee.Code = lastEmpCode + 1 ?? 1;
                employee.FirstNameAR = model.FirstNameAR;
                employee.FatherNameAR = model.FatherNameAR;
                employee.GrandNameAR = model.GrandNameAR;
                employee.LastNameAR = model.LastNameAR;
                employee.FullNameAR = string.Concat(new List<string> { model.FirstNameAR, " ", model.FatherNameAR, " ", model.GrandNameAR, " ", model.LastNameAR });


                employee.FirstNameEN = model.FirstNameEN;
                employee.FatherNameEN = model.FatherNameEN;
                employee.GrandNameEN = model.GrandNameEN;
                employee.LastNameEN = model.LastNameEN;
                employee.FullNameEN = string.Concat(new List<string> { model.FirstNameEN, " ", model.FatherNameEN, " ", model.GrandNameEN, " ", model.LastNameEN }); ;


                employee.ManagerId = model.ManagerId;
                employee.DepartmentId = model.DepartmentId;
                employee.JobId = model.JobId;
                employee.VisaJobId = model.VisaJobId;
                employee.BranchId = model.BranchId;
                employee.StatusId = 1; // model.StatusId;


                employee.BirthDate = model.BirthDate;
                employee.BirthPlace = model.BirthPlace;
                employee.NationalityId = model.NationalityId;
                employee.SponsorId = model.SponsorId;

                employee.ReligionId = (int)model.ReligionId;
                employee.Address = model.Address;

                employee.BorderEntryNumber = model.BorderEntryNumber;
                employee.PassportNumber = model.PassportNumber;
                employee.ArrivalPort = model.ArrivalPort;
                employee.VisaNumber = model.VisaNumber;
                employee.VisaIssueDate = model.VisaIssueDate;
                employee.PassportExpireDate = model.PassportExpireDate;

                employee.Phone = model.Phone;
                employee.Email = model.Email;
                employee.SocialStatusId = model.SocialStatusId;

                employee.CreatedBy = model.CreatedBy;
                employee.CreatedDate = DateTime.Now;


                Context.Employees.Add(employee);
                var result = Context.SaveChanges();

                if (model.ImageFile != null)
                {
                    string employeeDirectory = GetEmployeetDirectoryName(employee.EmployeeId);
                    var uploadResponse = await FileService.UploadFileAsync(model.ImageFile, employeeDirectory, FileType.Image);
                    if (uploadResponse.IsUploaded)
                    {
                        employee.Image = uploadResponse.FilePath;
                        Context.SaveChanges();
                    }
                }

                return new ActionsResponseModel { Message = "Employee Added Successfly !", Id = employee.EmployeeId };
            }
            catch (Exception ex)
            {
                return new ActionsResponseModel { IsSuccess = false, Message = ex.InnerException?.Message ?? ex.Message };
            }
        }

        public async Task<ActionsResponseModel> EditEmployee(int EmployeeId, EmployeeDto model)
        {
            try
            {
                var employee = Context.Employees.FirstOrDefault(i => i.EmployeeId == EmployeeId);
                if (employee != null)
                {
                    employee.FirstNameAR = model.FirstNameAR;
                    employee.FatherNameAR = model.FatherNameAR;
                    employee.GrandNameAR = model.GrandNameAR;
                    employee.LastNameAR = model.LastNameAR;
                    employee.FullNameAR = string.Concat(new List<string> { model.FirstNameAR, " ", model.FatherNameAR, " ", model.GrandNameAR, " ", model.LastNameAR });


                    employee.FirstNameEN = model.FirstNameEN;
                    employee.FatherNameEN = model.FatherNameEN;
                    employee.GrandNameEN = model.GrandNameEN;
                    employee.LastNameEN = model.LastNameEN;
                    employee.FullNameEN = string.Concat(new List<string> { model.FirstNameEN, " ", model.FatherNameEN, " ", model.GrandNameEN, " ", model.LastNameEN }); ;


                    employee.DepartmentId = model.DepartmentId;
                    employee.ManagerId = model.ManagerId;
                    employee.JobId = model.JobId;
                    employee.VisaJobId = model.VisaJobId;
                    employee.BranchId = model.BranchId;
                    employee.StatusId = model.StatusId;


                    employee.BirthDate = model.BirthDate;
                    employee.BirthPlace = model.BirthPlace;
                    employee.NationalityId = model.NationalityId;
                    employee.SponsorId = model.SponsorId;

                    employee.ReligionId = (int)model.ReligionId;
                    employee.Address = model.Address;

                    employee.BorderEntryNumber = model.BorderEntryNumber;
                    employee.PassportNumber = model.PassportNumber;
                    employee.ArrivalPort = model.ArrivalPort;
                    employee.VisaNumber = model.VisaNumber;
                    employee.VisaIssueDate = model.VisaIssueDate;
                    employee.PassportExpireDate = model.PassportExpireDate;
                    employee.Address = model.Address;
                    employee.Phone = model.Phone;
                    employee.Email = model.Email;
                    employee.SocialStatusId = model.SocialStatusId;



                    employee.ModifiedBy = model.ModifiedBy;
                    employee.ModifiedDate = DateTime.Now;


                    if (model.ImageFile != null)
                    {
                        string employeeDirectory = GetEmployeetDirectoryName(employee.EmployeeId);
                        var uploadResponse = await FileService.UploadFileAsync(model.ImageFile, employeeDirectory, FileType.Image);
                        if (uploadResponse.IsUploaded)
                        {
                            employee.Image = uploadResponse.FilePath;
                        }


                    }
                    Context.SaveChanges();


                    return new ActionsResponseModel { Message = "Employee Updated Successfly !" };
                }
                else
                    return new ActionsResponseModel { IsSuccess = false, Message = "Employee not found" };
            }
            catch (Exception ex)
            {
                return new ActionsResponseModel { IsSuccess = false, Message = ex.InnerException?.Message ?? ex.Message };
            }

        }

        public Task<ActionsResponseModel> SaveEmployeeContractData(int EmployeeId, EmployeeContractDto model)
        {
            try
            {
                var employeeContract = Context.Contracts.FirstOrDefault(i => i.EmployeeId == EmployeeId);

                if (employeeContract != null)
                {
                    employeeContract.StartDate = model.StartDate;
                    employeeContract.EndDate = model.StartDate.AddYears(model.ContractPeriodYears);
                    employeeContract.ContractPeriodYears = model.ContractPeriodYears;
                    employeeContract.VacationPeriodDays = model.VacationPeriodDays;
                    employeeContract.VacationEvery = model.VacationEvery;
                    employeeContract.VacationDays = model.VacationDays;
                    employeeContract.IsGossi = model.IsGossi;
                    employeeContract.ModifiedBy = model.ModifiedBy;
                    employeeContract.ModifiedDate = DateTime.Now;

                    //var salary = Context.ContractDetails.FirstOrDefault(s => s.ContractId == employeeContract.ContractId);
                    //bool IsNew = false;

                    //salary.ContractId = employeeContract.ContractId;
                    //salary.EmployeeId = employeeContract.EmployeeId;
                    //salary.BasicSalary = model.BasicSalary;
                    //salary.ExtraSalary = model.ExtraSalary;
                    //salary.Transportation = model.Transportation;
                    //salary.HousingAllowance = model.HousingAllowance;
                    //salary.MobileAllowance = model.MobileAllowance;
                    //salary.WorkNature = model.WorkNature;
                    //salary.MealAllowance = model.MealAllowance;
                    //salary.Other = model.Other ?? 0;
                    //salary.GrossSalary = model.CalcTotalSalary();
                    //salary.TotalSalary = model.CalcTotalSalary();

                    //if (IsNew)
                    //    Context.ContractDetails.Add(salary);

                    Context.SaveChanges();

                    return Task.FromResult(new ActionsResponseModel { Message = "Employee Contract Updated Successfly !" });
                }
                else
                {
                    employeeContract = new Contract();

                    employeeContract.EmployeeId = EmployeeId;
                    employeeContract.StartDate = model.StartDate;
                    employeeContract.EndDate = model.StartDate.AddYears(model.ContractPeriodYears);
                    employeeContract.ContractPeriodYears = model.ContractPeriodYears;
                    employeeContract.VacationPeriodDays = model.VacationPeriodDays;
                    employeeContract.VacationEvery = model.VacationEvery;
                    employeeContract.VacationDays = model.VacationDays;
                    employeeContract.IsGossi = model.IsGossi;
                    employeeContract.CreatedBy = model.CreatedBy;
                    employeeContract.CreatedDate = DateTime.Now;

                    Context.Contracts.Add(employeeContract);
                    Context.SaveChanges();

                    //var salary = new ContractDetail();

                    //salary.ContractId = employeeContract.ContractId;
                    //salary.EmployeeId = employeeContract.EmployeeId;
                    //salary.BasicSalary = model.BasicSalary;
                    //salary.ExtraSalary = model.ExtraSalary;
                    //salary.Transportation = model.Transportation;
                    //salary.HousingAllowance = model.HousingAllowance;
                    //salary.MobileAllowance = model.MobileAllowance;
                    //salary.WorkNature = model.WorkNature;
                    //salary.MealAllowance = model.MealAllowance;
                    //salary.Other = model.Other ?? 0;
                    //salary.GrossSalary = model.CalcTotalSalary();
                    //salary.TotalSalary = model.CalcTotalSalary();

                    //Context.ContractDetails.Add(salary);
                    //Context.SaveChanges();

                    return Task.FromResult(new ActionsResponseModel { Message = "Employee Contract Created Successfly !" });
                }
            }
            catch (Exception ex)
            {
                return Task.FromResult(new ActionsResponseModel { IsSuccess = false, Message = ex.InnerException?.Message ?? ex.Message });
            }
        }
        public Task<ActionsResponseModel> SaveEmployeeContractDetailsData(int EmployeeId,int ContractId , EmployeeContractDetailsDto model)
        {
            try
            {
                var employeeContract = Context.Contracts.FirstOrDefault(i => i.EmployeeId == EmployeeId && i.ContractId == ContractId);
                if (employeeContract == null)
                    return Task.FromResult(new ActionsResponseModel { IsSuccess = false, Message = "Employee Contract not found." });
                var salary = Context.ContractDetails.FirstOrDefault(i => i.EmployeeId == EmployeeId && i.ContractId == ContractId && i.ContractDetailId == model.ContractDetailId);

                if (salary != null)
                {
                    bool IsNew = false;

                    salary.ContractId = employeeContract.ContractId;
                    salary.EmployeeId = employeeContract.EmployeeId;
                    salary.BasicSalary = model.BasicSalary;
                    salary.ExtraSalary = model.ExtraSalary;
                    salary.Transportation = model.Transportation;
                    salary.HousingAllowance = model.HousingAllowance;
                    salary.MobileAllowance = model.MobileAllowance;
                    salary.WorkNature = model.WorkNature;
                    salary.MealAllowance = model.MealAllowance;
                    salary.Other = model.Other ?? 0;
                    salary.GrossSalary = model.CalcTotalSalary();
                    salary.TotalSalary = model.CalcTotalSalary();

                    if (IsNew)
                        Context.ContractDetails.Add(salary);

                    Context.SaveChanges();

                    return Task.FromResult(new ActionsResponseModel { Message = "Contract Details Updated Successfly !" });
                }
                else
                {
                    salary = new ContractDetail();

                    salary.ContractId = employeeContract.ContractId;
                    salary.EmployeeId = employeeContract.EmployeeId;
                    salary.BasicSalary = model.BasicSalary;
                    salary.ExtraSalary = model.ExtraSalary;
                    salary.Transportation = model.Transportation;
                    salary.HousingAllowance = model.HousingAllowance;
                    salary.MobileAllowance = model.MobileAllowance;
                    salary.WorkNature = model.WorkNature;
                    salary.MealAllowance = model.MealAllowance;
                    salary.Other = model.Other ?? 0;
                    salary.GrossSalary = model.CalcTotalSalary();
                    salary.TotalSalary = model.CalcTotalSalary();

                    Context.ContractDetails.Add(salary);
                    Context.SaveChanges();

                    return Task.FromResult(new ActionsResponseModel { Message = "Contract Details Created Successfly !" });
                }
            }
            catch (Exception ex)
            {
                return Task.FromResult(new ActionsResponseModel { IsSuccess = false, Message = ex.InnerException?.Message ?? ex.Message });
            }
        }

        public Task<ActionsResponseModel> SaveEmployeeVerificationData(int EmployeeId, EmployeeVerificationDto model)
        {
            try
            {
                var employeeVerification = Context.EmployeeVerifications.FirstOrDefault(i => i.EmployeeId == EmployeeId);
                //Edit
                if (employeeVerification != null)
                {
                    employeeVerification.BankId = model.BankId;
                    employeeVerification.BankAccountNumber = model.BankAccountNumber;
                    employeeVerification.IqamaNumber = model.IqamaNumber;
                    employeeVerification.IqamaIssuePlaceId = model.IqamaIssuePlaceId;
                    employeeVerification.IqamaIssueDate = model.IqamaIssueDate;
                    employeeVerification.IqamaExpireDate = model.IqamaExpireDate;

                    employeeVerification.DrivingLicenseNumber = model.DrivingLicenseNumber;
                    employeeVerification.DrivingLicenseIssueDate = model.DrivingLicenseIssueDate;
                    employeeVerification.DrivingLicenseExpireDate = model.DrivingLicenseExpireDate;
                    employeeVerification.VehicleId = model.VehicleId;
                    employeeVerification.VehicleNumber = model.VehicleNumber;
                    employeeVerification.VehicleCode = model.VehicleCode;

                    employeeVerification.ModifiedBy = model.ModifiedBy;
                    employeeVerification.ModifiedDate = DateTime.Now;

                    Context.SaveChanges();

                    return Task.FromResult(new ActionsResponseModel { Message = "Employee Verification Updated Successfly !" });
                }
                //Add
                else
                {
                    employeeVerification = new EmployeeVerification();

                    employeeVerification.EmployeeId = EmployeeId;
                    employeeVerification.BankId = model.BankId;
                    employeeVerification.BankAccountNumber = model.BankAccountNumber;

                    employeeVerification.IqamaNumber = model.IqamaNumber;
                    employeeVerification.IqamaIssuePlaceId = model.IqamaIssuePlaceId;
                    employeeVerification.IqamaIssueDate = model.IqamaIssueDate;
                    employeeVerification.IqamaExpireDate = model.IqamaExpireDate;

                    employeeVerification.DrivingLicenseNumber = model.DrivingLicenseNumber;
                    employeeVerification.DrivingLicenseIssueDate = model.DrivingLicenseIssueDate;
                    employeeVerification.DrivingLicenseExpireDate = model.DrivingLicenseExpireDate;
                    employeeVerification.VehicleId = model.VehicleId;
                    employeeVerification.VehicleNumber = model.VehicleNumber;
                    employeeVerification.VehicleCode = model.VehicleCode;

                    employeeVerification.CreatedBy = model.CreatedBy;
                    employeeVerification.CreatedDate = DateTime.Now;

                    Context.EmployeeVerifications.Add(employeeVerification);

                    Context.SaveChanges();

                    return Task.FromResult(new ActionsResponseModel { Message = "Employee Verification Created Successfly !" });
                }
            }
            catch (Exception ex)
            {
                return Task.FromResult(new ActionsResponseModel { IsSuccess = false, Message = ex.InnerException?.Message ?? ex.Message });
            }
        }

        public async Task<ActionsResponseModel> SaveEmployeeAttachments(int employeeId, EmployeeAttachmentDto model)
        {
            try
            {
                // Validate Employee Existence
                var employeeExists = Context.Employees.Any(e => e.EmployeeId == employeeId);
                if (!employeeExists)
                {
                    return new ActionsResponseModel { IsSuccess = false, Message = "Invalid Employee." };
                }

                // Validate Files
                if (model.Files == null || !model.Files.Any())
                {
                    return new ActionsResponseModel { IsSuccess = false, Message = "No files uploaded." };
                }
                string employeeDirectory = GetEmployeetDirectoryName(employeeId);
                var uploadResponse = await FileService.UploadMultipleFilesAsync(model.Files, employeeDirectory, FileType.Attachment);

                var employeeAttachments = new List<EmployeeAttachment>();

                foreach (var file in uploadResponse)
                {
                    if (file.IsUploaded)
                    {
                        employeeAttachments.Add(new EmployeeAttachment
                        {
                            EmployeeId = employeeId,
                            FileName = file.FileName,
                            FilePath = file.FilePath,
                            FileExtension = file.Extention,
                            FileSize = file.FileSize,
                            FileType = FileType.Attachment.ToString(),
                            CreatedBy = model.CreatedBy,
                            CreatedDate = model.CreatedDate
                        });
                    }
                    else
                    {
                        return new ActionsResponseModel { IsSuccess = false, Message = $"{file.FileName} >> {file.Message}" };
                    }
                }

                Context.EmployeeAttachments.AddRange(employeeAttachments);

                // Save changes to the database
                await Context.SaveChangesAsync();

                return new ActionsResponseModel { IsSuccess = true, Message = "Employee attachments uploaded successfully." };
            }
            catch (Exception ex)
            {
                return new ActionsResponseModel { IsSuccess = false, Message = ex.InnerException?.Message ?? ex.Message };
            }
        }
        
        public async Task<ActionsResponseModel> ChangeEmployeeStatus(int employeeId, int StatusId)
        {
            try
            {
                // Validate Employee Existence
                var employee = Context.Employees.FirstOrDefault(e => e.EmployeeId == employeeId);
                if (employee == null)
                {
                    return new ActionsResponseModel { IsSuccess = false, Message = "Invalid Employee." };
                }
                employee.StatusId = StatusId;

                // Save changes to the database
                await Context.SaveChangesAsync();

                return new ActionsResponseModel { IsSuccess = true, Message = "Employee status changed successfully." };
            }
            catch (Exception ex)
            {
                return new ActionsResponseModel { IsSuccess = false, Message = ex.InnerException?.Message ?? ex.Message };
            }
        }

        #endregion

        #region GetEmployee
        public EmployeeDto GetEmployeeBasicInfoById(int employeeId)
        {
            var employee = Context.Employees.FirstOrDefault(e => e.EmployeeId == employeeId);

            if (employee is not null)
            {

               
                 int? ContractId = Context.Contracts.Where(x => x.EmployeeId == employeeId)?.OrderByDescending(x => x.StartDate).FirstOrDefault()?.ContractId;
                return new EmployeeDto
                {

                    EmployeeId = employee.EmployeeId,
                    ContractId = ContractId,
                    Code = employee.Code,
                    ManagerId = employee.ManagerId,
                    JobId = employee.JobId,
                    DepartmentId = employee.DepartmentId,
                    BranchId = employee.BranchId,
                    StatusId = employee.StatusId,
                    FirstNameAR = employee.FirstNameAR,
                    FatherNameAR = employee.FatherNameAR,
                    GrandNameAR = employee.GrandNameAR,
                    LastNameAR = employee.LastNameAR,
                    FullNameAR = employee.FullNameAR,
                    FirstNameEN = employee.FirstNameEN,
                    FatherNameEN = employee.FatherNameEN,
                    GrandNameEN = employee.GrandNameEN,
                    LastNameEN = employee.LastNameEN,
                    FullNameEN = employee.FullNameEN,
                    BirthDate = employee.BirthDate,
                    BirthPlace = employee.BirthPlace,
                    NationalityId = employee.NationalityId,
                    SponsorId = employee.SponsorId,
                    VisaJobId = employee.VisaJobId,
                    Phone = employee.Phone,
                    Email = employee.Email,
                    SocialStatusId = employee.SocialStatusId,


                    //Religion = employee.ReligionId,
                    ReligionId = employee.ReligionId,
                    Address = employee.Address,

                    BorderEntryNumber = employee.BorderEntryNumber,
                    PassportNumber = employee.PassportNumber,
                    ArrivalPort = employee.ArrivalPort,
                    VisaNumber = employee.VisaNumber,
                    VisaIssueDate = employee.VisaIssueDate,
                    PassportExpireDate = employee.PassportExpireDate,

                    CreatedBy = employee.CreatedBy,
                    CreatedDate = employee.CreatedDate,
                    ModifiedBy = employee.ModifiedBy,
                    ModifiedDate = employee.ModifiedDate,
                    Image = FileService.GetFileDownloadUrl(employee.Image)
                };
            }

            return null;
        }

        public EmployeeContractDto GetEmployeeContractInfoById(int employeeId)
        {
            SqlParameter[] Params = new SqlParameter[1];
            Params[0] = new SqlParameter("@EmployeeId", employeeId);

            var result = SQLHelper.SQLQuery<EmployeeContractDto>("[HR].[SP_GetEmployeeContractInfoById]", null, Params);
            return result?.FirstOrDefault();
        }

        public EmployeeVerificationDto GetEmployeeVerificationInfoById(int employeeId)
        {

            var employee = Context.EmployeeVerifications.FirstOrDefault(e => e.EmployeeId == employeeId);

            if (employee is not null)
            {

                return new EmployeeVerificationDto
                {

                    EmployeeId = employee.EmployeeId,
                    EmployeeVerificationId = employee.EmployeeVerificationId,
                    IqamaNumber = employee.IqamaNumber,
                    BankId = employee.BankId,
                    BankAccountNumber = employee.BankAccountNumber,
                    IqamaIssuePlaceId = employee.IqamaIssuePlaceId,
                    IqamaIssueDate = employee.IqamaIssueDate,
                    IqamaExpireDate = employee.IqamaExpireDate,
                    DrivingLicenseNumber = employee.DrivingLicenseNumber,
                    DrivingLicenseIssueDate = employee.DrivingLicenseIssueDate,
                    DrivingLicenseExpireDate = employee.DrivingLicenseExpireDate,
                    VehicleId = employee.VehicleId,
                    VehicleNumber = employee.VehicleNumber,
                    VehicleCode = employee.VehicleCode,


                    CreatedBy = employee.CreatedBy,
                    CreatedDate = employee.CreatedDate,
                    ModifiedBy = employee.ModifiedBy,
                    ModifiedDate = employee.ModifiedDate,

                };
            }

            return null;
        }

        public EmployeeAttachmentDto GetEmployeeAttachmentsById(int employeeId)
        {
            var employeeAttachemts = Context.EmployeeAttachments.Where(e => e.EmployeeId == employeeId).ToList();

            return employeeAttachemts.GroupBy(a => a.EmployeeId).Select(e => new EmployeeAttachmentDto
            {
                EmployeeId = e.Key,
                Attachments = e.Select(x => new AttachmentModel
                {
                    AttachmentId = x.EmployeeAttachmentId,
                    FileName = x.FileName,
                    FilePath = x.FilePath,
                    FileSize = x.FileSize,
                    FileUrl = FileService.GetFileDownloadUrl(x.FilePath)
                }).ToList()

            }).FirstOrDefault();
        }

        public string GetEmployeetDirectoryName(int employeeId)
        {
            string directory = string.Empty;
            var employeeCode = Context.Employees.FirstOrDefault(e => e.EmployeeId == employeeId);
            if (employeeCode != null)
                directory = Path.Combine(EmployeesFolderName, employeeCode.Code.ToString());
            return directory;
        }

        #endregion

        public List<EmployeeBasicInfo> GetEmployeesSummary_Data(SearchFilterModel model)
        {
            DataTable dt = SharedFilterService.MapFilterModelToDataTable(model.FilterList);

            SqlParameter[] Params = new SqlParameter[3];
            //Params[0] = new SqlParameter("@ManagerId", ManagerId);
            //Params[3] = new SqlParameter("@SearchText", model.SearchText);
            Params[0] = new SqlParameter("@CurrentPage", model.CurrentPage);
            Params[1] = new SqlParameter("@PageSize", model.PageSize);
            Params[2] = new SqlParameter("@FilterList", SqlDbType.Structured);
            Params[2].Value = dt;

            var result = SQLHelper.SQLQuery<EmployeeBasicInfo>("[HR].[SP_GetEmployeesSummary_Data]", null, Params);
            return result;
        }

        public List<FilterModel> GetEmployeesSummary_Filters(SearchFilterModel model)
        {
            DataTable dt = SharedFilterService.MapFilterModelToDataTable(model.FilterList);

            SqlParameter[] Params = new SqlParameter[1];
            Params[0] = new SqlParameter("@FilterList", SqlDbType.Structured);
            Params[0].Value = dt;

            DataTable result = SQLHelper.ExecuteDataTable("[HR].[SP_GetEmployeesSummary_Filters]", Params, null);
            var GroupFilters = SharedFilterService.GroupedFilter(result);
            return GroupFilters;
        }

        public List<StatisticsCardSummary> GetEmployeesSummary()
        {
            SqlParameter[] Params = new SqlParameter[0];

            var result = SQLHelper.SQLQuery<StatisticsCardSummary>("[HR].[SP_GetEmployeesSummary]", null, Params);
            return result;
        }

        public List<SelectorDataModel> GetActiveEmployeesSelector()
        {
            SqlParameter[] Params = new SqlParameter[0];

            var result = SQLHelper.SQLQuery<SelectorDataModel>("[HR].[SP_GetActiveEmployees]", null, Params);
            return result;
        }

        public ContractDetail GetEmployeeContractDetails(int EmployeeId)
        {
            var contract = Context.ContractDetails.Where(x => x.EmployeeId == EmployeeId).FirstOrDefault();
            return contract ?? new ContractDetail();
        }

        public List<EmployeeSalaryDto> GetEmployeesSalaryByBranch(List<int> BranchId, DateTime ExecutionDate)
        {
            SqlParameter[] Params = new SqlParameter[2];
            Params[0] = new SqlParameter("@ExecutionDate", ExecutionDate);
            Params[1] = new SqlParameter("@BranchList", SqlDbType.Structured);
            Params[1].Value = BranchId.Select(x => new LstInt_TableType { ID = x }).ToList().ToDataTable(); ;

            var result = SQLHelper.SQLQuery<EmployeeSalaryDto>("[HR].[SP_GetEmployeesSalaryByBranch]", null, Params);
            return result;
        }

        public ActionsResponseModel ExportEmployeesSummaryData(SearchFilterModel model)
        {
            string url = string.Empty;
            try
            {
                model.PageSize = 50000;
                DataTable dt = SharedFilterService.MapFilterModelToDataTable(model.FilterList);
                SqlParameter[] Params = new SqlParameter[3];
                Params[0] = new SqlParameter("@CurrentPage", model.CurrentPage);
                Params[1] = new SqlParameter("@PageSize", model.PageSize);
                Params[2] = new SqlParameter("@FilterList", SqlDbType.Structured);
                Params[2].Value = dt;

                var dtExport = SQLHelper.ExecuteDataTable("[HR].[SP_ExportEmployeesSummaryData]", Params, ConnectionString);

                url = GetExportUrl(dtExport, "Employee Data");

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
                    Message = "Server error",
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

        //public List<IqamaIssuePlace> GetIqamaIssuePlaces()
        //{
        //    var results = Context.IqamaIssuePlaces.ToList();
        //    return results;
        //}

        //public List<PassportIssuePlace> GetPassportIssuePlaces()
        //{
        //    var results = Context.PassportIssuePlaces.ToList();
        //    return results;
        //}

        //public List<Sponsor> GetSponsorData()
        //{
        //    var results = Context.Sponsors.ToList();
        //    return results;
        //}

        //public List<IqamaJob> GetIqamaJobData()
        //{
        //    var results = Context.IqamaJobs.ToList();
        //    return results;
        //}

        //public List<Nationality> GetNationalityData()
        //{
        //    var results = Context.Nationalities.ToList();
        //    return results;
        //}

        //public List<EmployeeRequest> GetEmployeeRequests_Data(SearchFilterModel model)
        //{
        //    DataTable dt = SharedService.MapFilterModelToDataTable(model?.FilterModel?.FilterItems);

        //    SqlParameter[] Params = new SqlParameter[4];
        //    Params[0] = new SqlParameter("@CurrentPage", model.CurrentPage);
        //    Params[1] = new SqlParameter("@PageSize", model.PageSize);
        //    Params[2] = new SqlParameter("@SearchText", model.SearchText);
        //    Params[3] = new SqlParameter("@FilterList", SqlDbType.Structured);
        //    Params[3].Value = dt;

        //    var result = SQLHelper.SQLQuery<EmployeeRequest>("[HR].[SP_GetEmployeesRequests_Data]", ConnectionString, Params);
        //    return result;
        //}

        //public List<Job> GetJobData()
        //{
        //    var results = Context.Jobs.ToList();
        //    return results;
        //}

        //public List<Branch> GetBranchData()
        //{
        //    var results = Context.Branches.ToList();
        //    return results;
        //}

        //public List<Bank> GetBankData()
        //{
        //    var results = Context.Banks.ToList();
        //    return results;
        //}

        //public DataTable GetAllEmployeeSalary()
        //{
        //    var results = (from emp in Context.Employees.ToList()
        //                   join salary in Context.EmployeeSalaries.ToList() on emp.EmployeeId equals salary.EmployeeSalaryId
        //                   select new
        //                   {
        //                       salary,
        //                       EmployeeName = emp.FirstNameEN + " " + emp.LastNameEN
        //                   }).ToList().ToDataTable();
        //    return results;
        //}

        ////public bool EditEmployeeSalary(EmployeeSalary model)
        ////{
        ////    try
        ////    {
        ////        var Emp = Context.EmployeeSalaries.FirstOrDefault(i => i.EmployeeSalaryId == model.EmployeeSalaryId);
        ////        if (Emp != null)
        ////        {
        ////            Emp.BasicSalary = model.BasicSalary;
        ////            Emp.ExtraSalary = model.ExtraSalary;
        ////            Emp.Transportation = model.Transportation;
        ////            Emp.Home = model.Home;
        ////            Emp.Mopile = model.Mopile;
        ////            Emp.WorkNature = model.WorkNature;
        ////            Emp.Food = model.Food;
        ////            Emp.Other = model.Other;
        ////            Emp.TotalSalary = model.TotalSalary;

        ////            Context.SaveChanges();
        ////            return true;
        ////        }
        ////        else
        ////            return false;
        ////    }
        ////    catch (Exception ex)
        ////    {
        ////        return false;
        ////    }
        ////}

        //public bool AddNewEmployee(SaveEmployeeModel model)
        //{
        //    try
        //    {
        //        var Employee = new Employee();
        //        Employee.JobId = model.Employee.JobId;
        //        Employee.IqamaJobId = model.Employee.IqamaJobId;
        //        Employee.BranchId = model.Employee.BranchId;
        //        Employee.FullNameAR = model.Employee.FirstNameAR + " " + model.Employee.FatherNameAR + " " + model.Employee.GrandNameAR + " " + model.Employee.LastNameAR;
        //        Employee.FullNameEN = model.Employee.FirstNameEN + " " + model.Employee.FatherNameEN + " " + model.Employee.GrandNameEN + " " + model.Employee.LastNameEN;
        //        Employee.BankAccount = model.Employee.BankAccount;
        //        Employee.BankId = model.Employee.BankId;
        //        Employee.NationalityId = model.Employee.NationalityId;
        //        Employee.BirthDate = model.Employee.BirthDate;
        //        Employee.BirthPlace = model.Employee.BirthPlace;
        //        Employee.SponsorId = model.Employee.SponsorId;
        //        Employee.IqamaIssuePlaceId = model.Employee.IqamaIssuePlaceId;
        //        Employee.IqamaExpireDate = model.Employee.IqamaExpireDate;
        //        Employee.IqamaIssueDate = model.Employee.IqamaIssueDate;
        //        Employee.VisaNumber = model.Employee.VisaNumber;
        //        Employee.VisaIssueDate = model.Employee.VisaIssueDate;
        //        Employee.PassportNumber = model.Employee.PassportNumber;
        //        Employee.PassportExpireDate = model.Employee.PassportExpireDate;
        //        Employee.PassportIssuanceDate = model.Employee.PassportIssuanceDate;
        //        Employee.PassportIssunacePlace = model.Employee.PassportIssunacePlace;
        //        Employee.DrivingLicenseNumber = model.Employee.DrivingLicenseNumber;
        //        Employee.DrivingLicenseIssue = model.Employee.DrivingLicenseIssue;
        //        Employee.DrivingLicenseExpire = model.Employee.DrivingLicenseExpire;
        //        Employee.JoinDate = model.Employee.JoinDate;
        //        Employee.LastJoinDate = model.Employee.LastJoinDate;
        //        Employee.Religion = model.Employee.Religion;
        //        Employee.BorderEntryNumber = model.Employee.BorderEntryNumber;
        //        Employee.BorderEntryDate = model.Employee.BorderEntryDate;
        //        Employee.ArrivalPort = model.Employee.ArrivalPort;
        //        Employee.Address = model.Employee.Address;
        //        Employee.IsGossi = model.Employee.IsGossi;
        //        Employee.InsertDate = DateTime.Now;

        //        Context.Employees.Add(Employee);
        //        Context.SaveChanges();

        //        var NewEmp = Context.Employees.FirstOrDefault(i => i.EmployeeId == Employee.EmployeeId);
        //        if (NewEmp == null)
        //            return false;

        //        var EmployeeContract = new EmployeeContract();
        //        EmployeeContract.EmployeeID = Employee.EmployeeId;
        //        EmployeeContract.NoYears = model.EmployeeContract.NoYears;
        //        EmployeeContract.VacationEvery = model.EmployeeContract.VacationEvery;
        //        EmployeeContract.VacationDays = model.EmployeeContract.VacationDays;

        //        Context.EmployeeContracts.Add(EmployeeContract);
        //        Context.SaveChanges();

        //        var EmployeeSalary = new EmployeeSalary();
        //        EmployeeSalary.BasicSalary = model.EmployeeSalary.BasicSalary;
        //        EmployeeSalary.ExtraSalary = model.EmployeeSalary.ExtraSalary;
        //        EmployeeSalary.Transportation = model.EmployeeSalary.Transportation;
        //        EmployeeSalary.Home = model.EmployeeSalary.Home;
        //        EmployeeSalary.Mopile = model.EmployeeSalary.Mopile;
        //        EmployeeSalary.WorkNature = model.EmployeeSalary.WorkNature;
        //        EmployeeSalary.Food = model.EmployeeSalary.Food;
        //        EmployeeSalary.Other = model.EmployeeSalary.Other;
        //        EmployeeSalary.TotalSalary = model.EmployeeSalary.TotalSalary;

        //        Context.EmployeeSalaries.Add(EmployeeSalary);
        //        Context.SaveChanges();

        //        return true;
        //    }
        //    catch (Exception ex)
        //    {
        //        return false;
        //    }
        //}

    }
}
