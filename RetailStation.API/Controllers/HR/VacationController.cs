using RetailStation.Entities.Common;
using RetailStation.Entities.DTOs.Auth;
using RetailStation.Entities.DTOs.HR;
using RetailStation.Entities.Models;
using RetailStation.Entities.Models.HR;
using RetailStation.Interface.HR;
using RetailStation.Service.HR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;

namespace RetailStation.API.Controllers.HR
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]

    public class VacationController : ControllerBase
    {
        private readonly IVacationService _vacationService;

        public VacationController(IVacationService vacationService)
        {
            _vacationService = vacationService;
        }

        [HttpPost]
        [Route("GetAllEmployeeVacationsData")]
        public IActionResult GetAllEmployeeVacationsData(SearchFilterModel Model)
        {
            var data = _vacationService.GetAllEmployeeVacationsData(Model);
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
        [Route("GetEmployeeVacation_Export")]
        public IActionResult GetEmployeeVacation_Export(SearchFilterModel model)
        {
            var result = _vacationService.GetEmployeeVacation_Export(model);

            return Ok(result);
        }

        [HttpPost]
        [Route("GetVacationsByEmployeeId")]
        public IActionResult GetVacationsByEmployeeId(int EmployeeId,SearchFilterModel Model)
        {
            var data= _vacationService.GetVacationsByEmployeeId(EmployeeId,Model);
            var result = new PagedResponseModel<EmployeeVacationDto>
            {
                Results = data,
                TotalCount = data.FirstOrDefault()?.TotalCount ?? 0,
                PageSize=Model.PageSize,
                CurrentPage=Model.CurrentPage

            };
            return Ok(result);
        }

        [HttpPost]
        [Route("GetVacationRequestsByType")]
        public IActionResult GetVacationRequestsByType(int VacationTypeId, SearchFilterModel Model)
        {
            var data = _vacationService.GetVacationRequestsByType(VacationTypeId, Model);
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
        [Route("AddNewEmployeeVacation")]
        public IActionResult AddNewEmployeeVacation(int EmployeeId, EmployeeVacationDto model)
        {
            var result = _vacationService.AddNewEmployeeVacation(EmployeeId,model);
            return Ok(result);
        }

        [HttpPost]
        [Route("EditEmployeeVacation")]
        public IActionResult EditVacation(int EmployeeId,EmployeeVacationDto model)
        {
            var result = _vacationService.EditVacation(EmployeeId,model);

            return Ok(result);
        }

        [HttpGet]
        [Route("DeleteVacation")]
        public IActionResult DeleteVacation(int VacationId)
        {
            var result= _vacationService.DeleteVacation(VacationId);
            return Ok(result);
        }


        [HttpPost]
        [Route("ApproveEmployeeVacations")]
        public IActionResult ApproveEmployeeVacations(bool IsApproved, List<int> RowsId)
        {
            var result = _vacationService.ApproveEmployeeVacations(IsApproved, RowsId);
            return Ok(result);
        }

        [HttpGet]
        [Route("GetVacationsToBeExceuted")]
        public IActionResult GetVacationsToBeExceuted()
        {
            var data = _vacationService.GetVacationsToBeExceuted();
            var result = new PagedResponseModel<EmployeeVacationDto>
            {
                Results = data,
                TotalCount = data.FirstOrDefault()?.TotalCount ?? 0,
                PageSize = 1,
                CurrentPage = 9999
            };
            return Ok(result);
        }

        [HttpPost]
        [Route("EditEmployeesWorkStatus")]
        public IActionResult EditEmployeesWorkStatus(List<int> EmployeeIds)
        {
            string UserId = User.Claims.FirstOrDefault(c => c.Type == "UserId")?.Value;

            return Ok(_vacationService.EditEmployeesWorkStatus(UserId, EmployeeIds));
        }

        

    }
}
