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
        public DataTable GetVacationData()
        {
            return _vacationService.GetVacationData();
        }

        [HttpPost]
        [Route("AddNewVacation")]
        public bool AddNewVacation(Vacation model)
        {
            return _vacationService.AddNewVacation(model);
        }

        [HttpPost]
        [Route("EditVacation")]
        public bool EditVacation(Vacation model)
        {
            return _vacationService.EditVacation(model);
        }

        [HttpGet]
        [Route("DeleteVacation")]
        public bool DeleteVacation(int VacationId)
        {
            return _vacationService.DeleteVacation(VacationId);
        }
    }
}
