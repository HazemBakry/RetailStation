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

    public class FinancialCustodyController : ControllerBase
    {
        private readonly IFinancialCustodyService _financialCustodyService;

        public FinancialCustodyController(IFinancialCustodyService financialCustodyService)
        {
            _financialCustodyService = financialCustodyService;
        }

        [HttpPost]
        [Route("GetAllEmployeeFinancialCustodyData")]
        public IActionResult GetAllEmployeeFinancialCustodyData(SearchFilterModel Model)
        {
            var data = _financialCustodyService.GetAllEmployeeFinancialCustodyData(Model);
            var result = new PagedResponseModel<EmployeeFinancialCustodyModel>
            {
                Results = data,
                TotalCount = data.FirstOrDefault()?.TotalCount ?? 0,
                PageSize = Model.PageSize,
                CurrentPage = Model.CurrentPage

            };
            return Ok(result);
        }

        [HttpPost]
        [Route("GetFinancialCustodyByEmployeeId")]
        public IActionResult GetFinancialCustodyByEmployeeId(int EmployeeId,SearchFilterModel Model)
        {
            var data= _financialCustodyService.GetFinancialCustodyByEmployeeId(EmployeeId,Model);
            var result = new PagedResponseModel<EmployeeFinancialCustodyModel>
            {
                Results = data,
                TotalCount = data.FirstOrDefault()?.TotalCount ?? 0,
                PageSize=Model.PageSize,
                CurrentPage=Model.CurrentPage

            };
            return Ok(result);
        }
        [HttpGet]
        [Route("GetFinancialCustodyById")]
        public IActionResult GetFinancialCustodyById(int EmployeeFinancialCustodyId)
        {
            var data = _financialCustodyService.GetFinancialCustodyById(EmployeeFinancialCustodyId);
            return Ok(data);
        }
        
        [HttpPost]
        [Route("AddNewEmployeeFinancialCustody")]
        public IActionResult AddNewEmployeeFinancialCustody(int EmployeeId, EmployeeFinancialCustodyModel model)
        {
            var result = _financialCustodyService.AddNewEmployeeFinancialCustody(EmployeeId,model);
            return Ok(result);
        }

        [HttpPost]
        [Route("EditEmployeeFinancialCustody")]
        public IActionResult EditFinancialCustody(int EmployeeId,EmployeeFinancialCustodyModel model)
        {
            var result = _financialCustodyService.EditFinancialCustody(EmployeeId,model);

            return Ok(result);
        }

        [HttpGet]
        [Route("DeleteFinancialCustody")]
        public IActionResult DeleteFinancialCustody(int EmployeeFinancialCustodyId)
        {
            var result= _financialCustodyService.DeleteFinancialCustody(EmployeeFinancialCustodyId);
            return Ok(result);
        }


        [HttpPost]
        [Route("ApproveEmployeeFinancialCustody")]
        public IActionResult ApproveEmployeeFinancialCustody(bool IsApproved, List<int> RowsId)
        {
            var result = _financialCustodyService.ApproveEmployeeFinancialCustody(IsApproved, RowsId);
            return Ok(result);
        }

        

        

    }
}
