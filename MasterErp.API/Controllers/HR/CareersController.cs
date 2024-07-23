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
    public class CareersController : ControllerBase
    {
        private readonly ICareersService _careersService;
        public CareersController(ICareersService careersService)
        {
            _careersService = careersService;
        }

        [HttpGet]
        [Route("GetAllEmployeeCareers")]
        public IActionResult GetAllEmployeeCareer(SearchFilterModel SearchModel)
        {
            var data = _careersService.GetAllEmployeeCareers(SearchModel);
            var result = new PagedResponseModel<EmployeeCareerDto>
            {
                Results = data,
                TotalCount = data.FirstOrDefault()?.TotalCount ?? 0,
                PageSize = SearchModel.PageSize,
                CurrentPage = SearchModel.CurrentPage

            };
            return Ok(result);
        }

        [HttpPost]
        [Route("GetCareersByEmployeeId")]
        public IActionResult GetCareerByEmployeeId(int EmployeeId, SearchFilterModel SearchModel)
        {
            var data = _careersService.GetCareersByEmployeeId(EmployeeId, SearchModel);
            var result = new PagedResponseModel<EmployeeCareerDto>
            {
                Results = data,
                TotalCount = data.FirstOrDefault()?.TotalCount ?? 0,
                PageSize = SearchModel.PageSize,
                CurrentPage = SearchModel.CurrentPage

            };
            return Ok(result);
        }
        [HttpPost]
        [Route("AddNewEmployeeCareer")]
        public IActionResult AddNewEmployeeCareer(int EmployeeId, EmployeeCareerDto model)
        {
            var result = _careersService.AddNewEmployeeCareer(EmployeeId, model);
            return Ok(result);
        }

        [HttpPost]
        [Route("EditEmployeeCareer")]
        public IActionResult EditEmployeeCareer(int EmployeeId, EmployeeCareerDto model)
        {
            var result = _careersService.EditEmployeeCareer(EmployeeId, model);

            return Ok(result);
        }

        [HttpGet]
        [Route("DeleteEmployeeCareer")]
        public IActionResult DeleteEmployeeCareer(int CareerId)
        {
            var result = _careersService.DeleteEmployeeCareer(CareerId);
            return Ok(result);
        }



        [HttpGet]
        [Route("GetWorkStatusSelector")]
        public IActionResult GetWorkStatusSelector()
        {
            var result = _careersService.GetWorkStatusSelector();
            return Ok(result);
        }
        

        [HttpGet]
        [Route("GetJobsSelector")]
        public IActionResult GetJobsSelector()
        {
            var result = _careersService.GetJobsSelector();
            return Ok(result);
        }

    }
}
