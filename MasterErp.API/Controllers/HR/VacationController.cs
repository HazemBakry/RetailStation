using MasterErp.Entities.Common;
using MasterErp.Entities.DTOs.Auth;
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

namespace MasterErp.API.Controllers.HR
{
    [Route("api/[controller]")]
    [ApiController]
    public class VacationController : ControllerBase
    {
        private readonly IVacationService _vacationService;

        public VacationController(IVacationService vacationService)
        {
            _vacationService = vacationService;
        }

        [HttpGet]
        [Route("GetVacationData")]
        public List<EmployeeVacationDto> GetVacationData(SearchFilterModel model)
        {
            return _vacationService.GetEmployeeVacations(model);
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
        [Route("GetVacationTypesSelector")]
        public IActionResult GetVacationTypesSelector()
        {
            var result= _vacationService.GetVacationTypesSelector();
            return Ok(result);
        }
        [HttpGet]
        [Route("DeleteVacation")]
        public IActionResult DeleteVacation(int VacationId)
        {
            var result= _vacationService.DeleteVacation(VacationId);
            return Ok(result);
        }
        


        
    }
}
