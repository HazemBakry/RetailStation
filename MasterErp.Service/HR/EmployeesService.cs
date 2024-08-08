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

namespace MasterErp.Service.HR
{
    public class EmployeeService : IEmployeeService
    {
        private readonly DBContext Context;
        private readonly ISQLHelper SQLHelper;
        private readonly IConfiguration Configuration;
        private readonly ISharedService SharedService;

        private readonly string ConnectionString;

        public EmployeeService(DBContext Context, ISQLHelper SQLHelper, IConfiguration Configuration, ISharedService SharedService)
        {
            this.Context = Context;
            this.SQLHelper = SQLHelper;
            this.Configuration = Configuration;
            this.SharedService = SharedService;
            ConnectionString = Configuration.GetConnectionString("DBConnection");
        }

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

        public List<EmployeesSummary> GetEmployeesSummary()
        {
            SqlParameter[] Params = new SqlParameter[0];

            var result = SQLHelper.SQLQuery<EmployeesSummary>("[HR].[SP_GetEmployeesSummary]", ConnectionString, Params);
            return result;
        }

        public List<SelectorDataModel> GetActiveEmployeesSelector()
        {
            SqlParameter[] Params = new SqlParameter[0];
            
            var result = SQLHelper.SQLQuery<SelectorDataModel>("[HR].[SP_GetActiveEmployees]", ConnectionString, Params);
            return result;
        }

        public List<IqamaIssuePlace> GetIqamaIssuePlaces()
        {
            var results = Context.IqamaIssuePlaces.ToList();
            return results;
        }

        public List<PassportIssuePlace> GetPassportIssuePlaces()
        {
            var results = Context.PassportIssuePlaces.ToList();
            return results;
        }

        public List<Sponsor> GetSponsorData()
        {
            var results = Context.Sponsors.ToList();
            return results;
        }

        public List<IqamaJob> GetIqamaJobData()
        {
            var results = Context.IqamaJobs.ToList();
            return results;
        }

        public List<Nationality> GetNationalityData()
        {
            var results = Context.Nationalities.ToList();
            return results;
        }

        public List<EmployeeRequest> GetEmployeeRequests_Data(SearchFilterModel model)
        {
            DataTable dt = SharedService.MapFilterModelToDataTable(model?.FilterModel?.FilterItems);

            SqlParameter[] Params = new SqlParameter[4];
            Params[0] = new SqlParameter("@CurrentPage", model.CurrentPage);
            Params[1] = new SqlParameter("@PageSize", model.PageSize);
            Params[2] = new SqlParameter("@SearchText", model.SearchText);
            Params[3] = new SqlParameter("@FilterList", SqlDbType.Structured);
            Params[3].Value = dt;

            var result = SQLHelper.SQLQuery<EmployeeRequest>("[HR].[SP_GetEmployeesRequests_Data]", ConnectionString, Params);
            return result;
        }

        public List<Job> GetJobData()
        {
            var results = Context.Jobs.ToList();
            return results;
        }

        public List<Branch> GetBranchData()
        {
            var results = Context.Branches.ToList();
            return results;
        }

        public List<Bank> GetBankData()
        {
            var results = Context.Banks.ToList();
            return results;
        }

        public DataTable GetAllEmployeeSalary()
        {
            var results = (from emp in Context.Employees.ToList()
                           join salary in Context.EmployeeSalaries.ToList() on emp.EmployeeId equals salary.EmployeeSalaryId
                           select new
                           {
                               salary,
                               EmployeeName = emp.FirstNameEN + " " + emp.LastNameEN
                           }).ToList().ToDataTable();
            return results;
        }

        public bool EditEmployeeSalary(EmployeeSalary model)
        {
            try
            {
                var Emp = Context.EmployeeSalaries.FirstOrDefault(i => i.EmployeeSalaryId == model.EmployeeSalaryId);
                if (Emp != null)
                {
                    Emp.BasicSalary = model.BasicSalary;
                    Emp.ExtraSalary = model.ExtraSalary;
                    Emp.Transportation = model.Transportation;
                    Emp.Home = model.Home;
                    Emp.Mopile = model.Mopile;
                    Emp.WorkNature = model.WorkNature;
                    Emp.Food = model.Food;
                    Emp.Other = model.Other;
                    Emp.TotalSalary = model.TotalSalary;

                    Context.SaveChanges();
                    return true;
                }
                else
                    return false;
            }
            catch (Exception ex)
            {
                return false;
            }
        }

        public bool AddNewEmployee(SaveEmployeeModel model)
        {
            try
            {
                var Employee = new Employee();
                Employee.JobId = model.Employee.JobId;
                Employee.IqamaJobId = model.Employee.IqamaJobId;
                Employee.BranchId = model.Employee.BranchId;
                Employee.FullNameAR = model.Employee.FirstNameAR + " " + model.Employee.FatherNameAR + " " + model.Employee.GrandNameAR + " " + model.Employee.LastNameAR;
                Employee.FullNameEN = model.Employee.FirstNameEN + " " + model.Employee.FatherNameEN + " " + model.Employee.GrandNameEN + " " + model.Employee.LastNameEN;
                Employee.BankAccount = model.Employee.BankAccount;
                Employee.BankId = model.Employee.BankId;
                Employee.NationalityId = model.Employee.NationalityId;
                Employee.BirthDate = model.Employee.BirthDate;
                Employee.BirthPlace = model.Employee.BirthPlace;
                Employee.SponsorId = model.Employee.SponsorId;
                Employee.IqamaIssuePlaceId = model.Employee.IqamaIssuePlaceId;
                Employee.IqamaExpireDate = model.Employee.IqamaExpireDate;
                Employee.IqamaIssueDate = model.Employee.IqamaIssueDate;
                Employee.VisaNumber = model.Employee.VisaNumber;
                Employee.VisaIssueDate = model.Employee.VisaIssueDate;
                Employee.PassportNumber = model.Employee.PassportNumber;
                Employee.PassportExpireDate = model.Employee.PassportExpireDate;
                Employee.PassportIssuanceDate = model.Employee.PassportIssuanceDate;
                Employee.PassportIssunacePlace = model.Employee.PassportIssunacePlace;
                Employee.DrivingLicenseNumber = model.Employee.DrivingLicenseNumber;
                Employee.DrivingLicenseIssue = model.Employee.DrivingLicenseIssue;
                Employee.DrivingLicenseExpire = model.Employee.DrivingLicenseExpire;
                Employee.JoinDate = model.Employee.JoinDate;
                Employee.LastJoinDate = model.Employee.LastJoinDate;
                Employee.Religion = model.Employee.Religion;
                Employee.BorderEntryNumber = model.Employee.BorderEntryNumber;
                Employee.BorderEntryDate = model.Employee.BorderEntryDate;
                Employee.ArrivalPort = model.Employee.ArrivalPort;
                Employee.Address = model.Employee.Address;
                Employee.IsGossi = model.Employee.IsGossi;
                Employee.InsertDate = DateTime.Now;

                Context.Employees.Add(Employee);
                Context.SaveChanges();

                var NewEmp = Context.Employees.FirstOrDefault(i => i.EmployeeId == Employee.EmployeeId);
                if (NewEmp == null)
                    return false;

                var EmployeeContract = new EmployeeContract();
                EmployeeContract.EmployeeID = Employee.EmployeeId;
                EmployeeContract.NoYears = model.EmployeeContract.NoYears;
                EmployeeContract.VacationEvery = model.EmployeeContract.VacationEvery;
                EmployeeContract.VacationDays = model.EmployeeContract.VacationDays;

                Context.EmployeeContracts.Add(EmployeeContract);
                Context.SaveChanges();

                var EmployeeSalary = new EmployeeSalary();
                EmployeeSalary.BasicSalary = model.EmployeeSalary.BasicSalary;
                EmployeeSalary.ExtraSalary = model.EmployeeSalary.ExtraSalary;
                EmployeeSalary.Transportation = model.EmployeeSalary.Transportation;
                EmployeeSalary.Home = model.EmployeeSalary.Home;
                EmployeeSalary.Mopile = model.EmployeeSalary.Mopile;
                EmployeeSalary.WorkNature = model.EmployeeSalary.WorkNature;
                EmployeeSalary.Food = model.EmployeeSalary.Food;
                EmployeeSalary.Other = model.EmployeeSalary.Other;
                EmployeeSalary.TotalSalary = model.EmployeeSalary.TotalSalary;

                Context.EmployeeSalaries.Add(EmployeeSalary);
                Context.SaveChanges();

                return true;
            }
            catch (Exception ex)
            {
                return false;
            }
        }
    }
}
