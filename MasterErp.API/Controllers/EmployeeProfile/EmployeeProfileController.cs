using MasterErp.Entities.Common;
using MasterErp.Entities.DTOs.HR;
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
        public EmployeeProfileController(IEmployeeProfileService employeeProfileService, IVacationService vacationService)
        {
            _employeeProfileService = employeeProfileService;
            _vacationService = vacationService;
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

        #endregion
    }
}
