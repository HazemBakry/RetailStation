using MasterErp.Entities.Common;
using MasterErp.Entities.DTOs.HR;
using MasterErp.Interface.HR;
using MasterErp.Service.HR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Linq;

namespace MasterErp.API.Controllers.HR
{
    [Route("api/[controller]")]
    [ApiController]
    public class LoansController : ControllerBase
    {
        private readonly ILoansService _loansService;
        public LoansController(ILoansService loansService)
        {
            _loansService = loansService;
        }



        [HttpPost]
        [Route("GetAllEmployeeLoansData")]
        public IActionResult GetAllEmployeeLoansData(SearchFilterModel SearchModel)
        {
            var data = _loansService.GetEmployeeLoansData(SearchModel);
            var result = new PagedResponseModel<EmployeeLoanDto>
            {
                Results = data,
                TotalCount = data.FirstOrDefault()?.TotalCount ?? 0,
                PageSize = SearchModel.PageSize,
                CurrentPage = SearchModel.CurrentPage

            };
            return Ok(result);
        }

        [HttpPost]
        [Route("GetLoansByEmployeeId")]
        public IActionResult GetLoansByEmployeeId(int EmployeeId, SearchFilterModel SearchModel)
        {
            var data = _loansService.GetLoansByEmployeeId(EmployeeId, SearchModel);
            var result = new PagedResponseModel<EmployeeLoanDto>
            {
                Results = data,
                TotalCount = data.FirstOrDefault()?.TotalCount ?? 0,
                PageSize = SearchModel.PageSize,
                CurrentPage = SearchModel.CurrentPage

            };
            return Ok(result);
        }
        [HttpPost]
        [Route("AddNewEmployeeLoan")]
        public IActionResult AddNewEmployeeLoan(int EmployeeId, EmployeeLoanDto model)
        {
            var result = _loansService.AddNewEmployeeLoan(EmployeeId, model);
            return Ok(result);
        }

        [HttpPost]
        [Route("EditEmployeeLoan")]
        public IActionResult EditEmployeeLoan(int EmployeeId, EmployeeLoanDto model)
        {
            var result = _loansService.EditEmployeeLoan(EmployeeId, model);

            return Ok(result);
        }

        [HttpGet]
        [Route("DeleteEmployeeLoan")]
        public IActionResult DeleteEmployeeLoan(int LoanId)
        {
            var result = _loansService.DeleteEmployeeLoan(LoanId);
            return Ok(result);
        }


        [HttpGet]
        [Route("GetLoanTypesSelector")]
        public IActionResult GetLoanTypesSelector()
        {
            var result = _loansService.GetLoanTypesSelector();
            return Ok(result);
        }


    }
}
