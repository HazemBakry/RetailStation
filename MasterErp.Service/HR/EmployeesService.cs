using MasterErp.Entities.Common;
using MasterErp.Entities.DTOs.HR;
using MasterErp.Entities.Models;
using MasterErp.Interface.Common;
using MasterErp.Interface.HR;
using MasterErp.Interface.Shared;
using MasterErp.Service.Common;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MasterErp.Entities.Models.HR;
using MasterErp.Entities.Models.HR.Employee;
using Microsoft.AspNetCore.Http;
using System.IO;
using System.Data.Entity;
using MasterErp.Entities.DTOs.Auth;
using Microsoft.AspNetCore.Identity;
using MasterErp.Entities.DTOs.Shared;

namespace MasterErp.Service.HR
{
    public class EmployeeService : IEmployeeService
    {
        private readonly DBContext Context;
        private readonly ISQLHelper SQLHelper;
        private readonly IConfiguration Configuration;
        private readonly ISharedService SharedService;
        public readonly string EmployeesFolderName;
        private readonly string ConnectionString;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public EmployeeService(DBContext Context, ISQLHelper SQLHelper, IConfiguration Configuration, ISharedService SharedService, IHttpContextAccessor httpContextAccessor)
        {
            this.Context = Context;
            this.SQLHelper = SQLHelper;
            this.Configuration = Configuration;
            this.SharedService = SharedService;
            ConnectionString = Configuration.GetConnectionString("DBConnection");
            EmployeesFolderName = "Employees";
            _httpContextAccessor = httpContextAccessor;
        }

        #region EmployeeCreation

        public async Task<ActionsResponseModel> CreateNewEmployee(EmployeeDto model)
        {
            try
            {
                var employee = new Employee();

                int? lastEmpCode = Context.Employees.OrderBy(e => e.EmployeeId).LastOrDefault()?.Code;
                employee.Code= lastEmpCode+1??1;
                employee.ManagerId=model.ManagerId;
                employee.IqamaNumber = model.IqamaNumber;
                employee.JobId = model.JobId;
                employee.IqamaJobId = model.IqamaJobId;
                employee.BranchId = model.BranchId;
                employee.StatusId = model.StatusId;

                employee.FirstNameAR=model.FirstNameAR;
                employee.FatherNameAR = model.FatherNameAR;
                employee.GrandNameAR = model.GrandNameAR;
                employee.LastNameAR = model.LastNameAR;
                employee.FullNameAR =string.Concat(new List<string> { model.FirstNameAR," ",model.FatherNameAR," ", model.GrandNameAR," ", model.LastNameAR });


                employee.FirstNameEN = model.FirstNameEN;
                employee.FatherNameEN = model.FatherNameEN;
                employee.GrandNameEN = model.GrandNameEN;
                employee.LastNameEN = model.LastNameEN;
                employee.FullNameEN = string.Concat(new List<string> { model.FirstNameEN, " ", model.FatherNameEN, " ", model.GrandNameEN, " ", model.LastNameEN }); ;

                employee.BankId = model.BankId;
                employee.BankAccountNumber = model.BankAccountNumber;
                employee.BirthDate = model.BirthDate;
                employee.BirthPlace = model.BirthPlace;
                employee.NationalityId = model.NationalityId;
                employee.SponsorId = model.SponsorId;
                employee.IqamaIssuePlaceId = model.IqamaIssuePlaceId;
                employee.IqamaIssueDate = model.IqamaIssueDate;
                employee.IqamaExpireDate = model.IqamaExpireDate;

                employee.IqamaExpireDateHijri = model.IqamaExpireDateHijri;
                employee.IqamaIssueDateHijri = model.IqamaIssueDateHijri;
                employee.IqamaJobDescription = model.IqamaJobDescription;
                employee.Religion = model.Religion;
                employee.Address = model.Address;

                employee.DrivingLicenseNumber = model.DrivingLicenseNumber;
                employee.DrivingLicenseIssueDateHijri = model.DrivingLicenseIssueDateHijri;
                employee.DrivingLicenseIssueDate = model.DrivingLicenseIssueDate;
                employee.DrivingLicenseExpireDateHijri = model.DrivingLicenseExpireDateHijri;
                employee.DrivingLicenseExpireDate = model.DrivingLicenseExpireDate;
                employee.VehicleId = model.VehicleId;

                employee.CreatedBy = model.CreatedBy;
                employee.CreatedDate = DateTime.Now;

                if (model.Image != null)
                {
                    if (IsFileExtensionSupported(model.ImageFile.FileName))
                        return new ActionsResponseModel { Message = "invalid image extention", IsSuccess = false };

                    employee.Image = await UploadEmployeeImage(model.ImageFile);
                }

                Context.Employees.Add(employee);
                var result = Context.SaveChanges();


                return new ActionsResponseModel { Message = "Employee Added Successfly !" , Id=employee.EmployeeId };
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
                    employee.ManagerId = model.ManagerId;
                    employee.IqamaNumber = model.IqamaNumber;
                    employee.JobId = model.JobId;
                    employee.IqamaJobId = model.IqamaJobId;
                    employee.BranchId = model.BranchId;
                    employee.StatusId = model.StatusId;

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

                    employee.BankId = model.BankId;
                    employee.BankAccountNumber = model.BankAccountNumber;
                    employee.BirthDate = model.BirthDate;
                    employee.BirthPlace = model.BirthPlace;
                    employee.NationalityId = model.NationalityId;
                    employee.SponsorId = model.SponsorId;
                    employee.IqamaIssuePlaceId = model.IqamaIssuePlaceId;
                    employee.IqamaIssueDate = model.IqamaIssueDate;
                    employee.IqamaExpireDate = model.IqamaExpireDate;

                    employee.IqamaExpireDateHijri = model.IqamaExpireDateHijri;
                    employee.IqamaIssueDateHijri = model.IqamaIssueDateHijri;
                    employee.IqamaJobDescription = model.IqamaJobDescription;
                    employee.Religion = model.Religion;
                    employee.Address = model.Address;

                    employee.DrivingLicenseNumber = model.DrivingLicenseNumber;
                    employee.DrivingLicenseIssueDateHijri = model.DrivingLicenseIssueDateHijri;
                    employee.DrivingLicenseIssueDate = model.DrivingLicenseIssueDate;
                    employee.DrivingLicenseExpireDateHijri = model.DrivingLicenseExpireDateHijri;
                    employee.DrivingLicenseExpireDate = model.DrivingLicenseExpireDate;
                    employee.VehicleId = model.VehicleId;


                    employee.ModifiedBy = model.ModifiedBy;
                    employee.ModifiedDate = DateTime.Now;


                    if (model.Image != null)
                    {
                        if (IsFileExtensionSupported(model.ImageFile.FileName))
                            return new ActionsResponseModel { Message = "invalid image extention", IsSuccess = false };

                        employee.Image = await UploadEmployeeImage(model.ImageFile);
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

        public async Task<ActionsResponseModel> SaveEmployeeContractData(int EmployeeId, EmployeeContractDto model)
        {

            try
            {
                var employeeContract = Context.EmployeeContracts.FirstOrDefault(i => i.EmployeeId == EmployeeId);
                //Edit
                if (employeeContract != null)
                {
                    employeeContract.JoinDate = model.JoinDate;
                    employeeContract.LastJoinDate = model.JoinDate.AddYears(model.ContractPeriodYears);
                    employeeContract.ContractPeriodYears = model.ContractPeriodYears;
                    employeeContract.VacationPeriodDays = model.VacationPeriodDays;
                    employeeContract.VacationDate = model.VacationDate;
                    employeeContract.IsGossi = model.IsGossi;


                    employeeContract.BasicSalary = model.BasicSalary;
                    employeeContract.ExtraSalary = model.ExtraSalary;
                    employeeContract.Transportation = model.Transportation;
                    employeeContract.HousingAllowance = model.HousingAllowance;
                    employeeContract.MobileAllowance = model.MobileAllowance;
                    employeeContract.WorkNature = model.WorkNature;
                    employeeContract.MealAllowance = model.MealAllowance;
                    employeeContract.Other = model.Other ?? 0;
                    employeeContract.TotalSalary = model.CalcTotalSalary();


                    employeeContract.ModifiedBy = model.ModifiedBy;
                    employeeContract.ModifiedDate = DateTime.Now;


                    Context.SaveChanges();


                    return new ActionsResponseModel { Message = "Employee Contract Updated Successfly !" };
                }
                //Add
                else
                {
                    employeeContract=new EmployeeContract();

                    employeeContract.EmployeeId =EmployeeId;
                    employeeContract.JoinDate = model.JoinDate;
                    employeeContract.LastJoinDate = model.JoinDate.AddYears(model.ContractPeriodYears);
                    employeeContract.ContractPeriodYears = model.ContractPeriodYears;
                    employeeContract.VacationPeriodDays = model.VacationPeriodDays;
                    employeeContract.VacationDate = model.VacationDate;
                    employeeContract.IsGossi = model.IsGossi;


                    employeeContract.BasicSalary = model.BasicSalary;
                    employeeContract.ExtraSalary = model.ExtraSalary;
                    employeeContract.Transportation = model.Transportation;
                    employeeContract.HousingAllowance = model.HousingAllowance;
                    employeeContract.MobileAllowance = model.MobileAllowance;
                    employeeContract.WorkNature = model.WorkNature;
                    employeeContract.MealAllowance = model.MealAllowance;
                    employeeContract.Other = model.Other ??0;
                    employeeContract.TotalSalary = model.CalcTotalSalary();


                    employeeContract.CreatedBy = model.CreatedBy;
                    employeeContract.CreatedDate = DateTime.Now;

                    Context.EmployeeContracts.Add(employeeContract);

                    Context.SaveChanges();


                    return new ActionsResponseModel { Message = "Employee Contract Created Successfly !" };

                }
            }
            catch (Exception ex)
            {
                return new ActionsResponseModel { IsSuccess = false, Message = ex.InnerException?.Message ?? ex.Message };
            }


        }

        public async Task<ActionsResponseModel> SaveEmployeeVerificationData(int EmployeeId, EmployeeVerificationDto model)
        {
            try
            {
                var employeeVerification =  Context.EmployeeVerifications.FirstOrDefault(i => i.EmployeeId == EmployeeId);
                //Edit
                if (employeeVerification != null)
                {
                    employeeVerification.BorderEntryNumber = model.BorderEntryNumber;
                    employeeVerification.PassportNumber = model.PassportNumber;
                    employeeVerification.BorderEntryDate = model.BorderEntryDate;
                    employeeVerification.ArrivalPort = model.ArrivalPort;
                    employeeVerification.VisaNumber = model.VisaNumber;
                    employeeVerification.VisaIssueDate = model.VisaIssueDate;
                    employeeVerification.PassportExpireDate = model.PassportExpireDate;
                    employeeVerification.PassportIssuanceDate = model.PassportIssuanceDate;
                    employeeVerification.PassportIssuancePlace = model.PassportIssuancePlace;
                    

                    employeeVerification.ModifiedBy = model.ModifiedBy;
                    employeeVerification.ModifiedDate = DateTime.Now;


                    Context.SaveChanges();


                    return new ActionsResponseModel { Message = "Employee Verification Updated Successfly !" };
                }
                //Add
                else
                {
                    employeeVerification = new EmployeeVerification();

                    employeeVerification.EmployeeId =EmployeeId;
                    employeeVerification.BorderEntryNumber = model.BorderEntryNumber;
                    employeeVerification.PassportNumber = model.PassportNumber;
                    employeeVerification.BorderEntryDate = model.BorderEntryDate;
                    employeeVerification.ArrivalPort = model.ArrivalPort;
                    employeeVerification.VisaNumber = model.VisaNumber;
                    employeeVerification.VisaIssueDate = model.VisaIssueDate;
                    employeeVerification.PassportExpireDate = model.PassportExpireDate;
                    employeeVerification.PassportIssuanceDate = model.PassportIssuanceDate;
                    employeeVerification.PassportIssuancePlace = model.PassportIssuancePlace;




                    employeeVerification.CreatedBy = model.CreatedBy;
                    employeeVerification.CreatedDate = DateTime.Now;

                    Context.EmployeeVerifications.Add(employeeVerification);

                    Context.SaveChanges();


                    return new ActionsResponseModel { Message = "Employee Verification Created Successfly !" };

                }
            }
            catch (Exception ex)
            {
                return new ActionsResponseModel { IsSuccess = false, Message = ex.InnerException?.Message ?? ex.Message };
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

                // Define allowed file types and max size (in bytes)
                var allowedExtensions = new List<string> { ".jpg", ".jpeg", ".png", ".pdf", ".docx" };
                long maxFileSize = 5 * 1024 * 1024; // 5 MB

                foreach (var file in model.Files)
                {
                    var extension = Path.GetExtension(file.FileName).ToLower();

                    if (!allowedExtensions.Contains(extension))
                    {
                        return new ActionsResponseModel { IsSuccess = false, Message = $"File type not allowed: {file.FileName}" };
                    }

                    if (file.Length > maxFileSize)
                    {
                        return new ActionsResponseModel { IsSuccess = false, Message = $"File size exceeded: {file.FileName}" };
                    }

                    // Sanitize File Name
                    var sanitizedFileName = Path.GetFileNameWithoutExtension(file.FileName);
                    sanitizedFileName = string.Concat(sanitizedFileName.Split(Path.GetInvalidFileNameChars()));
                    var safeFileName = $"{sanitizedFileName}_{Guid.NewGuid()}{extension}";

                    string employeeDirectory = GetEmployeetDirectoryName(employeeId);
                    // File Path 
                    var filePath = Path.Combine(employeeDirectory, safeFileName);

                    // Create directory if it doesn't exist
                    var directory = Path.GetDirectoryName(filePath);
                    if (!Directory.Exists(directory))
                    {
                        Directory.CreateDirectory(directory);
                    }

                    // Save the file
                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await file.CopyToAsync(stream);
                    }

                    //  save file info in the database
                    var employeeAttachment = new EmployeeAttachment
                    {
                        EmployeeId = employeeId,
                        FileName = safeFileName,
                        FilePath = filePath,
                        FileExtension= extension,
                        FileSize = file.Length,
                        FileType = extension,
                        CreatedBy=model.CreatedBy,
                        CreatedDate = model.CreatedDate
                    };

                    Context.EmployeeAttachments.Add(employeeAttachment);
                }

                // Save changes to the database
                await Context.SaveChangesAsync();

                return new ActionsResponseModel { IsSuccess = true, Message = "Employee attachments uploaded successfully." };
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

            //var employee = await Context.Employees.FirstOrDefaultAsync(e => e.EmployeeId == employeeId);

            //if (employee is not null)
            //{

            //    return new EmployeeDto
            //    {

            //        EmployeeId = employee.EmployeeId,
            //        Code = employee.Code,
            //        ManagerId = employee.ManagerId,
            //        IqamaNumber = employee.IqamaNumber,
            //        JobId = employee.JobId,
            //        IqamaJobId = employee.IqamaJobId,
            //        BranchId = employee.BranchId,
            //        StatusId = employee.StatusId,

            //        FirstNameAR = employee.FirstNameAR,
            //        FatherNameAR = employee.FatherNameAR,
            //        GrandNameAR = employee.GrandNameAR,
            //        LastNameAR = employee.LastNameAR,
            //        FullNameAR = employee.FullNameAR,


            //        FirstNameEN = employee.FirstNameEN,
            //        FatherNameEN = employee.FatherNameEN,
            //        GrandNameEN = employee.GrandNameEN,
            //        LastNameEN = employee.LastNameEN,
            //        FullNameEN = employee.FullNameEN,

            //        BankId = employee.BankId,
            //        BankAccountNumber = employee.BankAccountNumber,
            //        BirthDate = employee.BirthDate,
            //        BirthPlace = employee.BirthPlace,
            //        NationalityId = employee.NationalityId,
            //        SponsorId = employee.SponsorId,
            //        IqamaIssuePlaceId = employee.IqamaIssuePlaceId,
            //        IqamaIssueDate = employee.IqamaIssueDate,
            //        IqamaExpireDate = employee.IqamaExpireDate,

            //        IqamaExpireDateHijri = employee.IqamaExpireDateHijri,
            //        IqamaIssueDateHijri = employee.IqamaIssueDateHijri,
            //        IqamaJobDescription = employee.IqamaJobDescription,
            //        Religion = employee.Religion,
            //        Address = employee.Address,


            //        CreatedBy = employee.CreatedBy,
            //        CreatedDate = employee.CreatedDate,
            //        ModifiedBy = employee.ModifiedBy,
            //        ModifiedDate = employee.ModifiedDate,
            //        Image = GetImagePath(employee.Image)

            //    };
            //}

            //return null;

            var employee =Context.Employees
                        .Where(e => e.EmployeeId == employeeId)
                        .Select(e => new EmployeeDto
                        {
                            EmployeeId = e.EmployeeId,
                            Code = e.Code,
                            ManagerId = e.ManagerId,
                            IqamaNumber = e.IqamaNumber,
                            JobId = e.JobId,
                            IqamaJobId = e.IqamaJobId,
                            BranchId = e.BranchId,
                            StatusId = e.StatusId,
                            FirstNameAR = e.FirstNameAR,
                            FatherNameAR = e.FatherNameAR,
                            GrandNameAR = e.GrandNameAR,
                            LastNameAR = e.LastNameAR,
                            FullNameAR = e.FullNameAR,
                            FirstNameEN = e.FirstNameEN,
                            FatherNameEN = e.FatherNameEN,
                            GrandNameEN = e.GrandNameEN,
                            LastNameEN = e.LastNameEN,
                            FullNameEN = e.FullNameEN,
                            BankId = e.BankId,
                            BankAccountNumber = e.BankAccountNumber,
                            BirthDate = e.BirthDate,
                            BirthPlace = e.BirthPlace,
                            NationalityId = e.NationalityId,
                            SponsorId = e.SponsorId,
                            IqamaIssuePlaceId = e.IqamaIssuePlaceId,
                            IqamaIssueDate = e.IqamaIssueDate,
                            IqamaExpireDate = e.IqamaExpireDate,
                            IqamaExpireDateHijri = e.IqamaExpireDateHijri,
                            IqamaIssueDateHijri = e.IqamaIssueDateHijri,
                            IqamaJobDescription = e.IqamaJobDescription,
                            Religion = e.Religion,
                            Address = e.Address,
                            DrivingLicenseNumber =e.DrivingLicenseNumber,
                            DrivingLicenseIssueDateHijri =e.DrivingLicenseIssueDateHijri,
                            DrivingLicenseIssueDate =e.DrivingLicenseIssueDate,
                            DrivingLicenseExpireDateHijri =e.DrivingLicenseExpireDateHijri,
                            DrivingLicenseExpireDate =e.DrivingLicenseExpireDate,
                            VehicleId =e.VehicleId,
                            CreatedBy = e.CreatedBy,
                            CreatedDate = e.CreatedDate,
                            ModifiedBy = e.ModifiedBy,
                            ModifiedDate = e.ModifiedDate,
                            //Image = GetImagePath(e.Image)
                        })
                        .FirstOrDefault();

            return employee;

        }

        public EmployeeContractDto GetEmployeeContractInfoById(int employeeId)
        {

            var employee = Context.EmployeeContracts.FirstOrDefault(e => e.EmployeeId == employeeId);

            if (employee is not null)
            {

                return new EmployeeContractDto
                {

                    EmployeeId = employee.EmployeeId,
                    JoinDate = employee.JoinDate,
                    LastJoinDate = employee.LastJoinDate,
                    ContractPeriodYears = employee.ContractPeriodYears,
                    VacationPeriodDays = employee.VacationPeriodDays,
                    VacationDate = employee.VacationDate,
                    IsGossi = employee.IsGossi,


                    BasicSalary = employee.BasicSalary,
                    ExtraSalary = employee.ExtraSalary,
                    Transportation = employee.Transportation,
                    HousingAllowance = employee.HousingAllowance,
                    MobileAllowance = employee.MobileAllowance,
                    WorkNature = employee.WorkNature,
                    MealAllowance = employee.MealAllowance,
                    Other = employee.Other,
                    TotalSalary = employee.TotalSalary,

                    CreatedBy = employee.CreatedBy,
                    CreatedDate = employee.CreatedDate,
                    ModifiedBy = employee.ModifiedBy,
                    ModifiedDate = employee.ModifiedDate,

                };
            }

            return null;

        }
        public EmployeeVerificationDto GetEmployeeVerificationInfoById(int employeeId)
        {

            var employee =  Context.EmployeeVerifications.FirstOrDefault(e => e.EmployeeId == employeeId);

            if (employee is not null)
            {

                return new EmployeeVerificationDto
                {

                    EmployeeId = employee.EmployeeId,
                    EmployeeVerificationId = employee.EmployeeVerificationId,

                    BorderEntryNumber = employee.BorderEntryNumber,
                    PassportNumber = employee.PassportNumber,
                    BorderEntryDate = employee.BorderEntryDate,
                    ArrivalPort = employee.ArrivalPort,
                    VisaNumber = employee.VisaNumber,
                    VisaIssueDate = employee.VisaIssueDate,
                    PassportExpireDate = employee.PassportExpireDate,
                    PassportIssuanceDate = employee.PassportIssuanceDate,
                    PassportIssuancePlace = employee.PassportIssuancePlace,

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
                    FileUrl = GetImagePath(x.FilePath)
                }).ToList()

            }).FirstOrDefault();

        }

        public string GetEmployeetDirectoryName(int employeeId)
        {
            string directory =string.Empty;
            var employeeCode = Context.Employees.FirstOrDefault(e => e.EmployeeId == employeeId);
            if (employeeCode != null)
                directory = Path.Combine(EmployeesFolderName, employeeCode.Code.ToString());
            return directory;
        }
        #endregion

        public List<EmployeeBasicInfo> GetAllEmployees(SearchFilterModel model, int? ManagerId = null)
        {
            DataTable dt = SharedService.MapFilterModelToDataTable(model?.FilterModel?.FilterItems);

            SqlParameter[] Params = new SqlParameter[5];
            Params[0] = new SqlParameter("@ManagerId", ManagerId);
            Params[1] = new SqlParameter("@CurrentPage", model.CurrentPage);
            Params[2] = new SqlParameter("@PageSize", model.PageSize);
            Params[3] = new SqlParameter("@SearchText", model.SearchText);
            Params[4] = new SqlParameter("@FilterList", SqlDbType.Structured);
            Params[4].Value = dt;


            var result = SQLHelper.SQLQuery<EmployeeBasicInfo>("[HR].[SP_GetAllEmployeeData]", ConnectionString, Params);
            return result;
        }

        //public List<EmployeesSummary> GetEmployeesSummary()
        //{
        //    SqlParameter[] Params = new SqlParameter[0];

        //    var result = SQLHelper.SQLQuery<EmployeesSummary>("[HR].[SP_GetEmployeesSummary]", ConnectionString, Params);
        //    return result;
        //}

        public List<SelectorDataModel> GetActiveEmployeesSelector()
        {
            SqlParameter[] Params = new SqlParameter[0];

            var result = SQLHelper.SQLQuery<SelectorDataModel>("[HR].[SP_GetActiveEmployees]", ConnectionString, Params);
            return result;
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


        private bool IsFileExtensionSupported(string fileName)
        {
            var SupportedFileExtentions = new[] { "png", "jpg" };
            var fileExtension = Path.GetExtension(fileName);
            return SupportedFileExtentions.Contains(fileExtension, StringComparer.OrdinalIgnoreCase);
        }

        private async Task<string> UploadEmployeeImage(IFormFile Image)
        {
            string imagePath = string.Empty;
            try
            {
                var uniqueFileName = Guid.NewGuid().ToString() + "_" + Image.FileName;
                imagePath = Path.Combine(EmployeesFolderName, uniqueFileName);
                string filePath = Path.Combine("wwwroot", imagePath);
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await Image.CopyToAsync(stream);
                }
            }
            catch (Exception)
            {

                throw;
            }

            return imagePath;
        }
        private string GetImagePath(string FileName)
        {
            string URL = string.Empty;
            if (!string.IsNullOrEmpty(FileName))
            {
                var request = _httpContextAccessor.HttpContext.Request;
                URL = string.Format("{0}://{1}//{2}", request.Scheme, request.Host, FileName);
            }

            return URL;
        }
    }
}
