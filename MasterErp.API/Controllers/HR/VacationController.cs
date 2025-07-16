using MasterErp.Entities.Common;
using MasterErp.Entities.DTOs.Auth;
using MasterErp.Entities.DTOs.HR;
using MasterErp.Entities.Models;
using MasterErp.Entities.Models.HR;
using MasterErp.Interface.HR;
using MasterErp.Service.HR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;

namespace MasterErp.API.Controllers.HR
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

    }
}
