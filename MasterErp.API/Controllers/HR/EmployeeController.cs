using MasterErp.Entities.Common;
using MasterErp.Entities.DTOs.HR;
using MasterErp.Entities.Models.HR;
using MasterErp.Interface.HR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MasterErp.API.Controllers.HR
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
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
        public async Task<IActionResult> CreateNewEmployee([FromForm] EmployeeDto model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var result = await _employeeService.CreateNewEmployee(model);
            return Ok(result);
        }

        [HttpPost]
        [Route("EditEmployee")]
        public async Task<IActionResult> EditEmployee(int EmployeeId, [FromForm] EmployeeDto model)
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
        }        [HttpPost]
        [Route("SaveEmployeeContractDetailsData")]
        public async Task<IActionResult> SaveEmployeeContractDetailsData(int EmployeeId, int ContractId, EmployeeContractDetailsDto model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var result = await _employeeService.SaveEmployeeContractDetailsData(EmployeeId,ContractId, model);
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
        [Route("SaveEmployeeAttachments")]
        public async Task<IActionResult> SaveEmployeeAttachments(int EmployeeId, [FromForm] EmployeeAttachmentDto model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var result = await _employeeService.SaveEmployeeAttachments(EmployeeId, model);
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
        [HttpGet("GetEmployeeAttachmentsById")]
        public IActionResult GetEmployeeAttachmentsById(int EmployeeId)
        {

            var employee = _employeeService.GetEmployeeAttachmentsById(EmployeeId);
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
        [Route("GetEmployeesSummary_Data")]
        public ActionResult<PagedResponseModel<EmployeeBasicInfo>> GetEmployeesSummary_Data(SearchFilterModel model)
        {
            var result = _employeeService.GetEmployeesSummary_Data(model);
            var Response = new PagedResponseModel<EmployeeBasicInfo>
            {
                CurrentPage = model.CurrentPage,
                PageSize = model.PageSize,
                Results = result,
                TotalCount = result.Count > 0 ? result.FirstOrDefault().TotalCount : 0
            };

            return Ok(Response);
        }

        [HttpPost]
        [Route("GetEmployeesSummary_Filters")]
        public IActionResult GetEmployeesSummary_Filters(SearchFilterModel model)
        {
            var results = _employeeService.GetEmployeesSummary_Filters(model);
            return Ok(results);
        }

        [HttpPost]
        [Route("ExportEmployeesSummaryData")]
        public ActionsResponseModel ExportEmployeesSummaryData(SearchFilterModel model)
        {
            var result = _employeeService.ExportEmployeesSummaryData(model);
            return result;
        }

        [HttpGet]
        [Route("GetEmployeeContractDetails")]
        public IActionResult GetEmployeeContract(int EmployeeId)
        {
            var result= _employeeService.GetEmployeeContractDetails(EmployeeId);
            return Ok(result);
        }

        [HttpPost]
        [Route("GetEmployeesSalaryByBranch")]
        public List<EmployeeSalaryDto> GetEmployeesSalaryByBranch(List<int> BranchId, DateTime ExecutionDate)
        {
            return _employeeService.GetEmployeesSalaryByBranch(BranchId, ExecutionDate);
        }

        //[HttpPost]
        //[Route("EditEmployeeSalary")]
        //public bool EditEmployeeSalary(EmployeeSalary model)
        //{
        //    return _employeeService.EditEmployeeSalary(model);
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



        //[HttpPost]
        //[Route("AddNewEmployee")]
        //public bool AddNewEmployee(SaveEmployeeModel model)
        //{
        //    return _employeeService.AddNewEmployee(model);
        //}
    }
}
