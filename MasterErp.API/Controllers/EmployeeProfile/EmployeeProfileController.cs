using MasterErp.Entities.Common;
using MasterErp.Entities.DTOs.HR;
using MasterErp.Entities.Models.HR;
using MasterErp.Interface.EmployeeProfile;
using MasterErp.Interface.HR;
using MasterErp.Service.HR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Linq;
using System.Security.Claims;

namespace MasterErp.API.Controllers.EmployeeProfile
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class EmployeeProfileController : ControllerBase
    {
        private IEmployeeProfileService _employeeProfileService;
        private IVacationService _vacationService;
        private ILoansService _loansService;
        public EmployeeProfileController(IEmployeeProfileService employeeProfileService, IVacationService vacationService, ILoansService loansService)
        {
            _employeeProfileService = employeeProfileService;
            _vacationService = vacationService;
            _loansService = loansService;
        }


        #region Vacations

        [HttpPost]
        [Route("GetVacations")]
        public IActionResult GetVacations(SearchFilterModel Model)
        {   
            int.TryParse(User.Claims.FirstOrDefault(c => c.Type == "EmployeeId")?.Value, out int EmployeeId);
            if (EmployeeId == 0)
                return BadRequest("can't find employeeId");

            var data = _vacationService.GetVacationsByEmployeeId(EmployeeId, Model);
            var result = new PagedResponseModel<EmployeeVacationDto>
            {
                Results = data,
                TotalCount = data.FirstOrDefault()?.TotalCount ?? 0,
                PageSize = Model.PageSize,
                CurrentPage = Model.CurrentPage

            };
            return Ok(result);
        }
        [HttpPost]
        [Route("GetTeamWorkVacations")]
        public IActionResult GetTeamWorkVacations(SearchFilterModel Model)
        {
            int.TryParse(User.Claims.FirstOrDefault(c => c.Type == "EmployeeId")?.Value, out int EmployeeId);
            if (EmployeeId == 0)
                return BadRequest("can't find employeeId");

            var data = _vacationService.GetAllEmployeeVacations(Model, null, EmployeeId); ;
            var result = new PagedResponseModel<EmployeeVacationDto>
            {
                Results = data,
                TotalCount = data.FirstOrDefault()?.TotalCount ?? 0,
                PageSize = Model.PageSize,
                CurrentPage = Model.CurrentPage

            };
            return Ok(result);
        }
        [HttpPost]
        [Route("AddNewVacation")]
        public IActionResult AddNewVacation(EmployeeVacationDto model)
        {
            int.TryParse(User.Claims.FirstOrDefault(c => c.Type == "EmployeeId")?.Value, out int EmployeeId);
            if (EmployeeId == 0)
                return BadRequest("can't find employeeId");

            var result = _vacationService.AddNewEmployeeVacation(EmployeeId, model);
            return Ok(result);
        }

        [HttpPost]
        [Route("EditVacation")]
        public IActionResult EditVacation(EmployeeVacationDto model)
        {
            int.TryParse(User.Claims.FirstOrDefault(c => c.Type == "EmployeeId")?.Value, out int EmployeeId);
            if (EmployeeId == 0)
                return BadRequest("can't find employeeId");

            var result = _vacationService.EditVacation(EmployeeId, model);

            return Ok(result);
        }

        [HttpGet]
        [Route("DeleteVacation")]
        public IActionResult DeleteVacation(int VacationId)
        {
            int.TryParse(User.Claims.FirstOrDefault(c => c.Type == "EmployeeId")?.Value, out int EmployeeId);
            if (EmployeeId == 0)
                return BadRequest("can't find employeeId");

            var result = _vacationService.DeleteVacation(VacationId);
            return Ok(result);
        }

        [HttpGet]
        [Route("ApproveVacation")]
        public IActionResult ApproveVacation(int VacationId, int EmployeeId, bool ApproveStatus)
        {
            //int.TryParse(User.Claims.FirstOrDefault(c => c.Type == "EmployeeId")?.Value, out int EmployeeId);
            //if (EmployeeId == 0)
            //    return BadRequest("can't find employeeId");

            var result = _vacationService.ApproveEmployeeVacation(VacationId, EmployeeId, ApproveStatus);
            return Ok(result);
        }
        #endregion



        #region Loans

        [HttpPost]
        [Route("GetLoans")]
        public IActionResult GetLoans(SearchFilterModel Model)
        {
            int.TryParse(User.Claims.FirstOrDefault(c => c.Type == "EmployeeId")?.Value, out int EmployeeId);
            if (EmployeeId == 0)
                return BadRequest("can't find employeeId");

            var data = _loansService.GetLoansByEmployeeId(EmployeeId, Model);
            var result = new PagedResponseModel<EmployeeLoanDto>
            {
                Results = data,
                TotalCount = data.FirstOrDefault()?.TotalCount ?? 0,
                PageSize = Model.PageSize,
                CurrentPage = Model.CurrentPage

            };
            return Ok(result);
        }
        [HttpPost]
        [Route("GetTeamWorkLoans")]
        public IActionResult GetTeamWorkLoans(SearchFilterModel Model)
        {
            int.TryParse(User.Claims.FirstOrDefault(c => c.Type == "EmployeeId")?.Value, out int EmployeeId);
            if (EmployeeId == 0)
                return BadRequest("can't find employeeId");

            var data = _loansService.GetAllEmployeeLoans(Model,null, EmployeeId); ;
            var result = new PagedResponseModel<EmployeeLoanDto>
            {
                Results = data,
                TotalCount = data.FirstOrDefault()?.TotalCount ?? 0,
                PageSize = Model.PageSize,
                CurrentPage = Model.CurrentPage

            };
            return Ok(result);
        }
        [HttpPost]
        [Route("AddNewLoan")]
        public IActionResult AddNewLoan(EmployeeLoanDto model)
        {
            int.TryParse(User.Claims.FirstOrDefault(c => c.Type == "EmployeeId")?.Value, out int EmployeeId);
            if (EmployeeId == 0)
                return BadRequest("can't find employeeId");

            var result = _loansService.AddNewEmployeeLoan(EmployeeId, model);
            return Ok(result);
        }

        [HttpPost]
        [Route("EditLoan")]
        public IActionResult EditLoan(EmployeeLoanDto model)
        {
            int.TryParse(User.Claims.FirstOrDefault(c => c.Type == "EmployeeId")?.Value, out int EmployeeId);
            if (EmployeeId == 0)
                return BadRequest("can't find employeeId");

            var result = _loansService.EditEmployeeLoan(EmployeeId, model);

            return Ok(result);
        }

        [HttpGet]
        [Route("DeleteLoan")]
        public IActionResult DeleteLoan(int LoanId)
        {
            int.TryParse(User.Claims.FirstOrDefault(c => c.Type == "EmployeeId")?.Value, out int EmployeeId);
            if (EmployeeId == 0)
                return BadRequest("can't find employeeId");

            var result = _loansService.DeleteEmployeeLoan(LoanId);
            return Ok(result);
        }

        [HttpGet]
        [Route("ApproveLoan")]
        public IActionResult ApproveLoan(int LoanId,int EmployeeId,bool ApproveStatus)
        {
            //int.TryParse(User.Claims.FirstOrDefault(c => c.Type == "EmployeeId")?.Value, out int EmployeeId);
            //if (EmployeeId == 0)
            //    return BadRequest("can't find employeeId");

            var result = _loansService.ApproveEmployeeLoan(LoanId,EmployeeId, ApproveStatus);
            return Ok(result);
        }
        #endregion
    }
}
