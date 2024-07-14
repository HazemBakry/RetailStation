using MasterErp.Entities.Common;
using MasterErp.Entities.DTOs.HR;
using MasterErp.Entities.Models;
using MasterErp.Interface.HR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;

namespace MasterErp.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmployeeController : ControllerBase
    {
        private readonly IEmployeeService _employeeService;

        public EmployeeController(IEmployeeService employeeService)
        {
            _employeeService = employeeService;
        }

        [HttpGet]
        [Route("GetAllEmployees")]
        public ActionResult<PagedResponseModel<EmployeeBasicInfo>> GetAllEmployees(SearchFilterModel model)
        {
            var result =  _employeeService.GetAllEmployees(model);
            var Response = new PagedResponseModel<EmployeeBasicInfo>
            {
                CurrentPage = model.CurrentPage,
                PageSize = model.PageSize,
                Results = result,
                TotalCount = result.Count > 0 ? result.FirstOrDefault().TotalCount : 0
            };

            return Ok(Response);
        }

        [HttpGet]
        [Route("GetIqamaIssuePlaces")]
        public List<IqamaIssuePlace> GetIqamaIssuePlaces()
        {
            return _employeeService.GetIqamaIssuePlaces();
        }

        [HttpGet]
        [Route("GetPassportIssuePlaces")]
        public List<PassportIssuePlace> GetPassportIssuePlaces()
        {
            return _employeeService.GetPassportIssuePlaces();
        }

        [HttpGet]
        [Route("GetSponsorData")]
        public List<Sponsor> GetSponsorData()
        {
            return _employeeService.GetSponsorData();
        }

        [HttpGet]
        [Route("GetIqamaJobData")]
        public List<IqamaJob> GetIqamaJobData()
        {
            return _employeeService.GetIqamaJobData();
        }

        [HttpGet]
        [Route("GetNationalityData")]
        public List<Nationality> GetNationalityData()
        {
            return _employeeService.GetNationalityData();
        }

        [HttpGet]
        [Route("GetJobData")]
        public List<Job> GetJobData()
        {
            return _employeeService.GetJobData();
        }

        [HttpGet]
        [Route("GetBranchData")]
        public List<Branch> GetBranchData()
        {
            return _employeeService.GetBranchData();
        }

        [HttpGet]
        [Route("GetBankData")]
        public List<Bank> GetBankData()
        {
            return _employeeService.GetBankData();
        }

        [HttpGet]
        [Route("GetAllEmployeeSalary")]
        public DataTable GetAllEmployeeSalary()
        {
            return _employeeService.GetAllEmployeeSalary();
        }

        [HttpPost]
        [Route("EditEmployeeSalary")]
        public bool EditEmployeeSalary(EmployeeSalary model)
        {
            return _employeeService.EditEmployeeSalary(model);
        }

        [HttpPost]
        [Route("AddNewEmployee")]
        public bool AddNewEmployee(SaveEmployeeModel model)
        {
            return _employeeService.AddNewEmployee(model);
        }
    }
}
