using MasterErp.Entities.Common;
using MasterErp.Entities.Models;
using MasterErp.Interface.HR;
using MasterErp.Service.Common;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Service.HR
{
    public class EmployeesService : IEmployeesService
    {
        private readonly DBContext Context;

        public EmployeesService(DBContext dbContext)
        {
            Context = dbContext;
        }

        public List<EmployeesModel> GetAllEmployees()
        {
            var results = Context.Employee.Select(i => new EmployeesModel { EmployeeId = i.EmployeeId, EmployeeName = i.FirstNameEN + " " + i.LastNameEN }).ToList();
            return results;
        }

        public List<IqamaIssuePlace> GetIqamaIssuePlaceData()
        {
            var results = Context.IqamaIssuePlace.ToList();
            return results;
        }

        public List<PassportIssuePlace> GetPassportIssuePlaceData()
        {
            var results = Context.PassportIssuePlace.ToList();
            return results;
        }

        public List<Sponsor> GetSponsorData()
        {
            var results = Context.Sponsor.ToList();
            return results;
        }

        public List<IqamaJob> GetIqamaJobData()
        {
            var results = Context.IqamaJob.ToList();
            return results;
        }

        public List<Nationality> GetNationalityData()
        {
            var results = Context.Nationality.ToList();
            return results;
        }

        public List<Job> GetJobData()
        {
            var results = Context.Job.ToList();
            return results;
        }

        public List<Branch> GetBranchData()
        {
            var results = Context.Branch.ToList();
            return results;
        }

        public List<Bank> GetBankData()
        {
            var results = Context.Bank.ToList();
            return results;
        }

        public DataTable GetAllEmployeeSalary()
        {
            var results = (from emp in Context.Employee.ToList()
                           join salary in Context.EmployeeSalary.ToList() on emp.EmployeeId equals salary.EmployeeSalaryId
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
                var Emp = Context.EmployeeSalary.FirstOrDefault(i => i.EmployeeSalaryId == model.EmployeeSalaryId);
                if (Emp != null)
                {
                    Emp.BasicSalary = model.BasicSalary;
                    Emp.ExtraSalary = model.ExtraSalary;
                    Emp.Transport = model.Transport;
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

                Context.Employee.Add(Employee);
                Context.SaveChanges();

                var NewEmp = Context.Employee.FirstOrDefault(i => i.EmployeeId == Employee.EmployeeId);
                if (NewEmp == null)
                    return false;

                var EmployeeContract = new EmployeeContract();
                EmployeeContract.EmployeeID = Employee.EmployeeId;
                EmployeeContract.NoYears = model.EmployeeContract.NoYears;
                EmployeeContract.VacationEvery = model.EmployeeContract.VacationEvery;
                EmployeeContract.VacationDays = model.EmployeeContract.VacationDays;

                Context.EmployeeContract.Add(EmployeeContract);
                Context.SaveChanges();

                var EmployeeSalary = new EmployeeSalary();
                EmployeeSalary.BasicSalary = model.EmployeeSalary.BasicSalary;
                EmployeeSalary.ExtraSalary = model.EmployeeSalary.ExtraSalary;
                EmployeeSalary.Transport = model.EmployeeSalary.Transport;
                EmployeeSalary.Home = model.EmployeeSalary.Home;
                EmployeeSalary.Mopile = model.EmployeeSalary.Mopile;
                EmployeeSalary.WorkNature = model.EmployeeSalary.WorkNature;
                EmployeeSalary.Food = model.EmployeeSalary.Food;
                EmployeeSalary.Other = model.EmployeeSalary.Other;
                EmployeeSalary.TotalSalary = model.EmployeeSalary.TotalSalary;

                Context.EmployeeSalary.Add(EmployeeSalary);
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
