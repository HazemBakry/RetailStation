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
    public class OverTimeController : ControllerBase
    {
        private readonly IOverTimeService _overTimeService;

        public OverTimeController(IOverTimeService overTimeService)
        {
            _overTimeService = overTimeService;
        }

        [HttpGet]
        [Route("GetOverTimeData")]
        public DataTable GetOverTimeData()
        {
            return _overTimeService.GetOverTimeData();
        }

        [HttpPost]
        [Route("AddNewOverTime")]
        public bool AddNewOverTime(OverTime model)
        {
            return _overTimeService.AddNewOverTime(model);
        }

        [HttpPost]
        [Route("EditOverTime")]
        public bool EditOverTime(OverTime model)
        {
            return _overTimeService.EditOverTime(model);
        }

        [HttpGet]
        [Route("DeleteOverTime")]
        public bool DeleteOverTime(int OverTimeId)
        {
            return _overTimeService.DeleteOverTime(OverTimeId);
        }
    }
}
