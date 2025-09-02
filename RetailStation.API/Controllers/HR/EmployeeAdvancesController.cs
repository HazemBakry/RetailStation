using RetailStation.Entities.Common;
using RetailStation.Entities.DTOs.HR;
using RetailStation.Entities.Models.HR;
using RetailStation.Interface.HR;
using RetailStation.Service.HR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;

namespace RetailStation.API.Controllers.HR
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]

    public class EmployeeAdvancesController : ControllerBase
    {
        private readonly IEmployeeAdvancesService _advancesService;
        public EmployeeAdvancesController(IEmployeeAdvancesService advancesService)
        {
            _advancesService = advancesService;
        }



        [HttpPost]
        [Route("GetAllEmployeeAdvancesData")]
        public IActionResult GetAllEmployeeAdvancesData(SearchFilterModel SearchModel)
        {
            var data = _advancesService.GetEmployeeAdvancesData(SearchModel);
            var result = new PagedResponseModel<EmployeeAdvanceModel>
            {
                Results = data,
                TotalCount = data.FirstOrDefault()?.TotalCount ?? 0,
                PageSize = SearchModel.PageSize,
                CurrentPage = SearchModel.CurrentPage

            };
            return Ok(result);
        }
        

        [HttpPost]
        [Route("GetAdvancePaymentsData")]
        public IActionResult GetAdvancePaymentsData(int EmployeeId,int? EmployeeAdvanceId, SearchFilterModel SearchModel)
        {
            var data = _advancesService.GetAdvancePaymentsData(SearchModel, EmployeeId, EmployeeAdvanceId);
            var result = new PagedResponseModel<AdvancePaymentModel>
            {
                Results = data,
                TotalCount = data.FirstOrDefault()?.TotalCount ?? 0,
                PageSize = SearchModel.PageSize,
                CurrentPage = SearchModel.CurrentPage

            };
            return Ok(result);
        }

        [HttpGet]
        [Route("GetAdvanceById")]
        public IActionResult GetAdvanceById(int EmployeeAdvanceId)
        {
            var data = _advancesService.GetAdvanceById(EmployeeAdvanceId);
            return Ok(data);
        }
        [HttpPost]
        [Route("GetAdvancesByEmployeeId")]
        public IActionResult GetAdvancesByEmployeeId(int EmployeeId, SearchFilterModel SearchModel)
        {
            var data = _advancesService.GetAdvancesByEmployeeId(EmployeeId, SearchModel);
            var result = new PagedResponseModel<EmployeeAdvanceModel>
            {
                Results = data,
                TotalCount = data.FirstOrDefault()?.TotalCount ?? 0,
                PageSize = SearchModel.PageSize,
                CurrentPage = SearchModel.CurrentPage

            };
            return Ok(result);
        }
        [HttpPost]
        [Route("AddNewEmployeeAdvance")]
        public IActionResult AddNewEmployeeAdvance(int EmployeeId, EmployeeAdvanceModel model)
        {
            var result = _advancesService.AddNewEmployeeAdvance(EmployeeId, model);
            return Ok(result);
        }

        [HttpPost]
        [Route("EditEmployeeAdvance")]
        public IActionResult EditEmployeeAdvance(int EmployeeId, EmployeeAdvanceModel model)
        {
            var result = _advancesService.EditEmployeeAdvance(EmployeeId, model);

            return Ok(result);
        }

        [HttpGet]
        [Route("ApproveEmployeeAdvance")]
        public IActionResult ApproveEmployeeAdvance(int EmployeeAdvanceId, bool IsApproved)
        {
            var result = _advancesService.ApproveEmployeeAdvance(EmployeeAdvanceId, IsApproved);
            return Ok(result);
        }
        [HttpGet]
        [Route("PostponeAdvancesInstallment")]
        public IActionResult PostponeAdvancesInstallment(int EmployeeId, int AdvancePaymentId, bool IsPostpone = true)
        {
            var result = _advancesService.PostponeAdvancesInstallment(EmployeeId, AdvancePaymentId, IsPostpone);
            return Ok(result);
        }
        [HttpGet]
        [Route("DeleteEmployeeAdvance")]
        public IActionResult DeleteEmployeeAdvance(int EmployeeAdvanceId)
        {
            var result = _advancesService.DeleteEmployeeAdvance(EmployeeAdvanceId);
            return Ok(result);
        }

        [HttpGet]
        [Route("GetAdvanceTypesSelector")]
        public IActionResult GetAdvanceTypesSelector()
        {
            var result = _advancesService.GetAdvanceTypesSelector();
            return Ok(result);
        }

        [HttpPost]
        [Route("ApproveEmployeeAdvances")]
        public IActionResult ApproveEmployeeAdvances(bool IsApproved, List<int> RowsId)
        {
            var result = _advancesService.ApproveEmployeeAdvances(IsApproved, RowsId);
            return Ok(result);
        }

    }
}
