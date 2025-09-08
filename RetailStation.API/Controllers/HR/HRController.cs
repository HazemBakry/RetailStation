using ICU4N.Util;
using RetailStation.Entities.Common;
using RetailStation.Entities.DTOs.HR;
using RetailStation.Entities.Models.HR;
using RetailStation.Interface.HR;
using RetailStation.Service.HR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;

namespace RetailStation.API.Controllers.HR
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

        #region Regions

        [HttpPost]
        [Route("GetRegionsData")]
        public IActionResult GetRegionsData(SearchFilterModel model)
        {
            var data = _hrService.GetRegionsData(model);
            var result = new PagedResponseModel<Region>
            {
                Results = data,
                TotalCount = data.FirstOrDefault()?.TotalCount ?? 0,
                PageSize = model.PageSize,
                CurrentPage = model.CurrentPage
            };
            return Ok(result);
        }

        [HttpPost]
        [Route("CreateNewRegion")]
        public IActionResult CreateNewRegion(Region Model)
        {
            string UserId = User.Claims.FirstOrDefault(c => c.Type == "UserId")?.Value;
            //Model.CreatedBy = UserId;
            var results = _hrService.CreateNewRegion(Model);
            return Ok(results);
        }

        [HttpPost]
        [Route("EditRegion")]
        public IActionResult EditRegion(int RegionId, Region Model)
        {
            string UserId = User.Claims.FirstOrDefault(c => c.Type == "UserId")?.Value;
            //Model.ModifiedBy = UserId;
            var results = _hrService.EditRegion(RegionId, Model);
            return Ok(results);
        }

        [HttpGet]
        [Route("DeleteRegion")]
        public IActionResult DeleteRegion(int RegionId)
        {
            var results = _hrService.DeleteRegion(RegionId);
            return Ok(results);
        }

        #endregion


        #region EmployeeStatus
        [HttpPost]
        [Route("GetEmployeeStatusData")]
        public IActionResult GetEmployeeStatusData(SearchFilterModel model)
        {
            var data = _hrService.GetEmployeeStatusData(model);
            var result = new PagedResponseModel<EmployeeStatusModel>
            {
                Results = data,
                TotalCount = data.FirstOrDefault()?.TotalCount ?? 0,
                PageSize = model.PageSize,
                CurrentPage = model.CurrentPage
            };
            return Ok(result);
        }
        [HttpGet]
        [Route("GetEmployeeStatusById")]
        public IActionResult GetEmployeeStatusById(int EmployeeStatusId)
        {
            var result = _hrService.GetEmployeeStatusById(EmployeeStatusId);

            return Ok(result);
        }

        [HttpPost]
        [Route("CreateNewEmployeeStatus")]
        public IActionResult CreateNewEmployeeStatus(EmployeeStatusModel Model)
        {
            string UserId = User.Claims.FirstOrDefault(c => c.Type == "UserId")?.Value;
            Model.CreatedBy = UserId;
            var results = _hrService.CreateNewEmployeeStatus(Model);
            return Ok(results);
        }
        [HttpPost]
        [Route("EditEmployeeStatus")]
        public IActionResult EditEmployeeStatus(int EmployeeStatusId, EmployeeStatusModel Model)
        {
            string UserId = User.Claims.FirstOrDefault(c => c.Type == "UserId")?.Value;
            Model.ModifiedBy = UserId;
            var results = _hrService.EditEmployeeStatus(EmployeeStatusId, Model);
            return Ok(results);
        }
        [HttpGet]
        [Route("DeleteEmployeeStatus")]
        public IActionResult DeleteEmployeeStatus(int EmployeeStatusId)
        {
            var results = _hrService.DeleteEmployeeStatus(EmployeeStatusId);
            return Ok(results);
        }

        #endregion

        #region EmployeeShifts


        [HttpPost]
        [Route("GetEmployeeWeeklyShifts_Data")]
        public IActionResult GetEmployeeWeeklyShifts_Data(DateTime FromDate, DateTime ToDate, SearchFilterModel SearchModel)
        {
            var data = _hrService.GetEmployeeWeeklyShifts_Data(FromDate, ToDate, SearchModel);
            var result = new PagedResponseModel<EmployeeWeeklyShiftModel>
            {
                Results = data,
                TotalCount = data.FirstOrDefault()?.TotalCount ?? 0,
                PageSize = SearchModel.PageSize,
                CurrentPage = SearchModel.CurrentPage

            };
            return Ok(result);
        }
        [HttpPost]
        [Route("SaveEmployeeShifts")]
        public IActionResult SaveEmployeeShifts(List<EmployeeWeeklyShiftModel> employeeModels)
        { 
            var result = _hrService.SaveEmployeeShifts(employeeModels);
            return Ok(result);
        }
        [HttpGet]
        [Route("DeleteEmployeeShift")]
        public IActionResult DeleteEmployeeShift(int EmployeeWeeklyShiftId)
        {
            var result = _hrService.DeleteEmployeeShift(EmployeeWeeklyShiftId);
            return Ok(result);
        }
        #endregion

    }
}
