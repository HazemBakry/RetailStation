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
    public class SickLeaveController : ControllerBase
    {
        private readonly ISickLeaveService _sickLeaveService;

        public SickLeaveController(ISickLeaveService sickLeaveService)
        {
            _sickLeaveService = sickLeaveService;
        }

        [HttpGet]
        [Route("GetSickLeaveData")]
        public DataTable GetSickLeaveData()
        {
            return _sickLeaveService.GetSickLeaveData();
        }

        [HttpPost]
        [Route("AddNewSickLeave")]
        public bool AddNewSickLeave(SickLeave model)
        {
            return _sickLeaveService.AddNewSickLeave(model);
        }

        [HttpPost]
        [Route("EditSickLeave")]
        public bool EditSickLeave(SickLeave model)
        {
            return _sickLeaveService.EditSickLeave(model);
        }

        [HttpGet]
        [Route("DeleteSickLeave")]
        public bool DeleteSickLeave(int SickLeaveId)
        {
            return _sickLeaveService.DeleteSickLeave(SickLeaveId);
        }
    }
}
