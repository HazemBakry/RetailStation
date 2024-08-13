using MasterErp.Entities.Common;
using MasterErp.Entities.DTOs.HR;
using MasterErp.Entities.Models;
using MasterErp.Entities.Models.HR.Employee;
using MasterErp.Interface.HR;
using MasterErp.Service.HR;
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



        #region Employee Creation

        [HttpPost]
        [Route("CreateNewEmployee")]
        public async Task<IActionResult> CreateNewEmployee(EmployeeDto model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var result = await _employeeService.CreateNewEmployee(model);
            return Ok(result);
        }

        [HttpPost]
        [Route("EditEmployee")]
        public async Task<IActionResult> EditEmployee(int EmployeeId, EmployeeDto model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var result = await _employeeService.EditEmployee(EmployeeId, model);
            return Ok(result);
        }

        [HttpPost]
        [Route("SaveEmployeeContractData")]
        public async Task<IActionResult> SaveEmployeeContractData(int EmployeeId, EmployeeContractDto model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var result = await _employeeService.SaveEmployeeContractData(EmployeeId, model);
            return Ok(result);
        }
        [HttpPost]
        [Route("SaveEmployeeVerificationData")]
        public async Task<IActionResult> SaveEmployeeVerificationData(int EmployeeId, EmployeeVerificationDto model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            var result = await _employeeService.SaveEmployeeVerificationData(EmployeeId, model);
            return Ok(result);
        }
        [HttpPost]
        [Route("SaveEmployeeExtraData")]
        public async Task<IActionResult> SaveEmployeeExtraData(int EmployeeId, EmployeeExtraDataDto model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var result = await _employeeService.SaveEmployeeExtraData(EmployeeId, model);
            return Ok(result);
        }

        #endregion

        #region GetEmployee
        [HttpGet("GetEmployeeBasicInfoById")]
        public IActionResult GetEmployeeBasicInfoById(int EmployeeId)
        {
            try
            {
                var employee = _employeeService.GetEmployeeBasicInfoById(EmployeeId);
                return Ok(employee);

            }
            catch (Exception ex)
            {
                NotFound();
                throw;
            }

            

        }
        [HttpGet("GetEmployeeContractInfoById")]
        public IActionResult GetEmployeeContractInfoById(int EmployeeId)
        {

            var employee = _employeeService.GetEmployeeContractInfoById(EmployeeId);
            return Ok(employee);

        }
        [HttpGet("GetEmployeeVerificationInfoById")]
        public IActionResult GetEmployeeVerificationInfoById(int EmployeeId)
        {

            var employee = _employeeService.GetEmployeeVerificationInfoById(EmployeeId);
            return Ok(employee);

        }
        [HttpGet("GetEmployeeExtraInfoById")]
        public IActionResult GetEmployeeExtraInfoById(int EmployeeId)
        {

            var employee = _employeeService.GetEmployeeExtraInfoById(EmployeeId);
            return Ok(employee);

        }
        #endregion


        [HttpGet]
        [Route("GetActiveEmployeesSelector")]
        public ActionResult<List<SelectorDataModel>> GetActiveEmployeesSelector()
        {
            var result = _employeeService.GetActiveEmployeesSelector();
            return Ok(result);
        }

        [HttpPost]
        [Route("GetAllEmployees")]
        public ActionResult<PagedResponseModel<EmployeeBasicInfo>> GetAllEmployees(SearchFilterModel model)
        {
            var result = _employeeService.GetAllEmployees(model);
            var Response = new PagedResponseModel<EmployeeBasicInfo>
            {
                CurrentPage = model.CurrentPage,
                PageSize = model.PageSize,
                Results = result,
                TotalCount = result.Count > 0 ? result.FirstOrDefault().TotalCount : 0
            };

            return Ok(Response);
        }

        //[HttpGet]
        //[Route("GetEmployeesSummary")]
        //public List<EmployeesSummary> GetEmployeesSummary()
        //{
        //    return _employeeService.GetEmployeesSummary();
        //}

        //[HttpPost]
        //[Route("GetEmployeesFilter")]
        //public ActionResult<PagedResponseModel<EmployeeBasicInfo>> GetEmployeesFilter(SearchFilterModel model)
        //{
        //    var result = _employeeService.GetAllEmployees(model);
        //    var Response = new PagedResponseModel<EmployeeBasicInfo>
        //    {
        //        CurrentPage = model.CurrentPage,
        //        PageSize = model.PageSize,
        //        Results = result,
        //        TotalCount = result.Count > 0 ? result.FirstOrDefault().TotalCount : 0
        //    };

        //    return Ok(Response);
        //}

        //[HttpPost]
        //[Route("GetEmployeeRequests_Data")]
        //public ActionResult<PagedResponseModel<EmployeeRequest>> GetEmployeeRequests_Data(SearchFilterModel model)
        //{
        //    var result = _employeeService.GetEmployeeRequests_Data(model);
        //    var Response = new PagedResponseModel<EmployeeRequest>
        //    {
        //        CurrentPage = model.CurrentPage,
        //        PageSize = model.PageSize,
        //        Results = result,
        //        TotalCount = result.Count > 0 ? result.FirstOrDefault().TotalCount : 0
        //    };

        //    return Ok(Response);
        //}

        //[HttpGet]
        //[Route("GetIqamaIssuePlaces")]
        //public List<IqamaIssuePlace> GetIqamaIssuePlaces()
        //{
        //    return _employeeService.GetIqamaIssuePlaces();
        //}

        //[HttpGet]
        //[Route("GetPassportIssuePlaces")]
        //public List<PassportIssuePlace> GetPassportIssuePlaces()
        //{
        //    return _employeeService.GetPassportIssuePlaces();
        //}

        //[HttpGet]
        //[Route("GetSponsorData")]
        //public List<Sponsor> GetSponsorData()
        //{
        //    return _employeeService.GetSponsorData();
        //}

        //[HttpGet]
        //[Route("GetIqamaJobData")]
        //public List<IqamaJob> GetIqamaJobData()
        //{
        //    return _employeeService.GetIqamaJobData();
        //}

        //[HttpGet]
        //[Route("GetNationalityData")]
        //public List<Nationality> GetNationalityData()
        //{
        //    return _employeeService.GetNationalityData();
        //}

        //[HttpGet]
        //[Route("GetJobData")]
        //public List<Job> GetJobData()
        //{
        //    return _employeeService.GetJobData();
        //}

        //[HttpGet]
        //[Route("GetBranchData")]
        //public List<Branch> GetBranchData()
        //{
        //    return _employeeService.GetBranchData();
        //}

        //[HttpGet]
        //[Route("GetBankData")]
        //public List<Bank> GetBankData()
        //{
        //    return _employeeService.GetBankData();
        //}

        //[HttpGet]
        //[Route("GetAllEmployeeSalary")]
        //public DataTable GetAllEmployeeSalary()
        //{
        //    return _employeeService.GetAllEmployeeSalary();
        //}

        ////[HttpPost]
        ////[Route("EditEmployeeSalary")]
        ////public bool EditEmployeeSalary(EmployeeSalary model)
        ////{
        ////    return _employeeService.EditEmployeeSalary(model);
        ////}

        //[HttpPost]
        //[Route("AddNewEmployee")]
        //public bool AddNewEmployee(SaveEmployeeModel model)
        //{
        //    return _employeeService.AddNewEmployee(model);
        //}
    }
}
