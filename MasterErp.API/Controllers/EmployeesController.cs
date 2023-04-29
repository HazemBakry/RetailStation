using MasterErp.Entities.Models;
using MasterErp.Interface.HR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MasterErp.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmployeesController : ControllerBase
    {
        private readonly IEmployeesService _employeesService;

        public EmployeesController(IEmployeesService employeesService)
        {
            _employeesService = employeesService;
        }

        [HttpGet]
        [Route("GetIqamaIssuePlaceData")]
        public List<IqamaIssuePlace> GetIqamaIssuePlaceData()
        {
            return _employeesService.GetIqamaIssuePlaceData();
        }

        [HttpGet]
        [Route("GetPassportIssuePlaceData")]
        public List<PassportIssuePlace> GetPassportIssuePlaceData()
        {
            return _employeesService.GetPassportIssuePlaceData();
        }

        [HttpGet]
        [Route("GetSponsorData")]
        public List<Sponsor> GetSponsorData()
        {
            return _employeesService.GetSponsorData();
        }

        [HttpGet]
        [Route("GetIqamaJobData")]
        public List<IqamaJob> GetIqamaJobData()
        {
            return _employeesService.GetIqamaJobData();
        }

        [HttpGet]
        [Route("GetNationalityData")]
        public List<Nationality> GetNationalityData()
        {
            return _employeesService.GetNationalityData();
        }

        [HttpGet]
        [Route("GetJobData")]
        public List<Job> GetJobData()
        {
            return _employeesService.GetJobData();
        }

        [HttpGet]
        [Route("GetBranchData")]
        public List<Branch> GetBranchData()
        {
            return _employeesService.GetBranchData();
        }

        [HttpGet]
        [Route("GetBankData")]
        public List<Bank> GetBankData()
        {
            return _employeesService.GetBankData();
        }
    }
}
