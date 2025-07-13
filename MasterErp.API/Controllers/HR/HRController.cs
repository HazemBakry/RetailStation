using MasterErp.Entities.Common;
using MasterErp.Entities.DTOs.HR;
using MasterErp.Entities.Models.HR;
using MasterErp.Interface.HR;
using MasterErp.Service.HR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Linq;

namespace MasterErp.API.Controllers.HR
{
    [Route("api/[controller]")]
    [ApiController]
    public class HRController : ControllerBase
    {
        private readonly IHRService _hrService;
        public HRController(IHRService hrService)
        {
            _hrService = hrService;
        }


        #region Sponsers
        [HttpPost]
        [Route("GetSponsorsData")]
        public IActionResult GetSponsorsData(SearchFilterModel model)
        {
            var data = _hrService.GetSponsorsData(model);
            var result = new PagedResponseModel<SponsorModel>
            {
                Results = data,
                TotalCount = data.FirstOrDefault()?.TotalCount ?? 0,
                PageSize = model.PageSize,
                CurrentPage = model.CurrentPage
            };
            return Ok(result);
        }
        [HttpGet]
        [Route("GetSponsorById")]
        public IActionResult GetSponsorById(int SponsorId)
        {
            var result = _hrService.GetSponsorById(SponsorId);

            return Ok(result);
        }

        [HttpPost]
        [Route("CreateNewSponsor")]
        public IActionResult CreateNewSponsor(SponsorModel Model)
        {
            string UserId = User.Claims.FirstOrDefault(c => c.Type == "UserId")?.Value;
            Model.CreatedBy = UserId;
            var results = _hrService.CreateNewSponsor(Model);
            return Ok(results);
        }
        [HttpPost]
        [Route("EditSponsor")]
        public IActionResult EditSponsor(int SponsorId, SponsorModel Model)
        {
            string UserId = User.Claims.FirstOrDefault(c => c.Type == "UserId")?.Value;
            Model.ModifiedBy = UserId;
            var results = _hrService.EditSponsor(SponsorId, Model);
            return Ok(results);
        }
        [HttpGet]
        [Route("DeleteSponsor")]
        public IActionResult DeleteSponsor(int SponsorId)
        {
            var results = _hrService.DeleteSponsor(SponsorId);
            return Ok(results);
        }

        #endregion

        #region Departments
        [HttpPost]
        [Route("GetDepartmentsData")]
        public IActionResult GetDepartmentsData(SearchFilterModel model)
        {
            var data = _hrService.GetDepartmentsData(model);
            var result = new PagedResponseModel<DepartmentModel>
            {
                Results = data,
                TotalCount = data.FirstOrDefault()?.TotalCount ?? 0,
                PageSize = model.PageSize,
                CurrentPage = model.CurrentPage
            };
            return Ok(result);
        }
        [HttpGet]
        [Route("GetDepartmentById")]
        public IActionResult GetDepartmentById(int DepartmentId)
        {
            var result = _hrService.GetDepartmentById(DepartmentId);

            return Ok(result);
        }

        [HttpPost]
        [Route("CreateNewDepartment")]
        public IActionResult CreateNewDepartment(DepartmentModel Model)
        {
            string UserId = User.Claims.FirstOrDefault(c => c.Type == "UserId")?.Value;
            Model.CreatedBy = UserId;
            var results = _hrService.CreateNewDepartment(Model);
            return Ok(results);
        }
        [HttpPost]
        [Route("EditDepartment")]
        public IActionResult EditDepartment(int DepartmentId, DepartmentModel Model)
        {
            string UserId = User.Claims.FirstOrDefault(c => c.Type == "UserId")?.Value;
            Model.ModifiedBy = UserId;
            var results = _hrService.EditDepartment(DepartmentId, Model);
            return Ok(results);
        }
        [HttpGet]
        [Route("DeleteDepartment")]
        public IActionResult DeleteDepartment(int DepartmentId)
        {
            var results = _hrService.DeleteDepartment(DepartmentId);
            return Ok(results);
        }
        #endregion

        #region Jobs

        [HttpPost]
        [Route("GetJobsData")]
        public IActionResult GetJobsData(SearchFilterModel model)
        {
            var data = _hrService.GetJobsData(model);
            var result = new PagedResponseModel<Job>
            {
                Results = data,
                TotalCount = data.FirstOrDefault()?.TotalCount ?? 0,
                PageSize = model.PageSize,
                CurrentPage = model.CurrentPage
            };
            return Ok(result);
        }

        [HttpPost]
        [Route("CreateNewJob")]
        public IActionResult CreateNewJob(Job Model)
        {
            string UserId = User.Claims.FirstOrDefault(c => c.Type == "UserId")?.Value;
            Model.CreatedBy = UserId;
            var results = _hrService.CreateNewJob(Model);
            return Ok(results);
        }

        [HttpPost]
        [Route("EditJob")]
        public IActionResult EditJob(int JobId, Job Model)
        {
            string UserId = User.Claims.FirstOrDefault(c => c.Type == "UserId")?.Value;
            Model.ModifiedBy = UserId;
            var results = _hrService.EditJob(JobId, Model);
            return Ok(results);
        }

        [HttpGet]
        [Route("DeleteJob")]
        public IActionResult DeleteJob(int JobId)
        {
            var results = _hrService.DeleteJob(JobId);
            return Ok(results);
        }

        #endregion


    }
}
