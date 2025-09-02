using MasterErp.Entities.Common;
using MasterErp.Entities.DTOs.HR;
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

    public class PenaltyController : ControllerBase
    {
        private readonly IPenaltyService _penaltyService;

        public PenaltyController(IPenaltyService penaltyService)
        {
            _penaltyService = penaltyService;
        }

    
        [HttpGet]
        [Route("GetAllEmployeePenaltiesData")]
        public List<EmployeePenaltyDto> GetAllEmployeePenaltiesData(SearchFilterModel model)
        {
            return _penaltyService.GetAllEmployeePenaltiesData(model);
        }

        [HttpPost]
        [Route("GetPenaltiesByEmployeeId")]
        public IActionResult GetPenaltiesByEmployeeId(int EmployeeId, SearchFilterModel Model)
        {
            var data = _penaltyService.GetPenaltiesByEmployeeId(EmployeeId, Model);
            var result = new PagedResponseModel<EmployeePenaltyDto>
            {
                Results = data,
                TotalCount = data.FirstOrDefault()?.TotalCount ?? 0,
                PageSize = Model.PageSize,
                CurrentPage = Model.CurrentPage

            };
            return Ok(result);
        }
        [HttpPost]
        [Route("AddNewEmployeePenalty")]
        public IActionResult AddNewEmployeePenalty(int EmployeeId, EmployeePenaltyDto model)
        {
            var result = _penaltyService.AddNewEmployeePenalty(EmployeeId, model);
            return Ok(result);
        }

        [HttpPost]
        [Route("EditEmployeePenalty")]
        public IActionResult EditEmployeePenalty(int EmployeeId, EmployeePenaltyDto model)
        {
            var result = _penaltyService.EditEmployeePenalty(EmployeeId, model);

            return Ok(result);
        }

        [HttpGet]
        [Route("GetPenaltyTypesSelector")]
        public IActionResult GetPenaltyTypesSelector()
        {
            var result = _penaltyService.GetPenaltyTypesSelector();
            return Ok(result);
        }
        [HttpGet]
        [Route("DeleteEmployeePenalty")]
        public IActionResult DeleteEmployeePenalty(int PenaltyId)
        {
            var result = _penaltyService.DeleteEmployeePenalty(PenaltyId);
            return Ok(result);
        }

        [HttpPost]
        [Route("ApproveEmployeePenalties")]
        public IActionResult ApproveEmployeePenalties(bool IsApproved, List<int> RowsId)
        {
            var result = _penaltyService.ApproveEmployeePenalties(IsApproved, RowsId);
            return Ok(result);
        }
    }
}
